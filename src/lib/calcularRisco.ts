import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function calcularRiscoIndividual(colaboradorId: string, empresaId: string) {
  const client = sb()
  const dias30 = new Date(); dias30.setDate(dias30.getDate() - 30)
  const dias30Str = dias30.toISOString()

  const [{ data: checkins }, { data: profile }, { data: ishoEmpresa }, { data: disc }] = await Promise.all([
    client.from('health_checkins')
      .select('humor, energia, foco, stresse, criado_em')
      .eq('colaborador_id', colaboradorId)
      .eq('empresa_id', empresaId)
      .gte('criado_em', dias30Str)
      .order('criado_em', { ascending: true }),
    client.from('profiles')
      .select('nome, cargo, setor')
      .eq('id', colaboradorId)
      .single(),
    client.from('isho_semanal')
      .select('score')
      .eq('empresa_id', empresaId)
      .order('semana', { ascending: false })
      .limit(1)
      .single(),
    client.from('disc_resultados')
      .select('perfil_principal')
      .eq('user_id', colaboradorId)
      .order('data', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (!checkins?.length) return { ok: false, msg: 'Sem check-ins suficientes' }

  const mediaHumor   = media(checkins, 'humor')
  const mediaEnergia = media(checkins, 'energia')
  const mediaFoco    = media(checkins, 'foco')
  const mediaStresse = media(checkins, 'stresse')
  const frequencia   = checkins.length

  const meio = Math.floor(checkins.length / 2)
  const tendenciaHumor = media(checkins.slice(meio), 'humor') - media(checkins.slice(0, meio), 'humor')

  const riscoBurnout = Math.min(100, Math.round(
    (5 - mediaHumor)   * 12 +
    (5 - mediaEnergia) * 10 +
    (5 - mediaFoco)    *  8 +
    mediaStresse       * 10 +
    (frequencia < 8    ? 15 : 0) +
    (tendenciaHumor < -0.5 ? 15 : 0)
  ))

  const riscoSaida = Math.min(100, Math.round(
    riscoBurnout * 0.6 +
    (mediaStresse   > 3.5 ? 20 : 0) +
    (tendenciaHumor < -1  ? 20 : 0) +
    (frequencia     < 4   ? 15 : 0)
  ))

  const nivel = riscoBurnout >= 70 ? 'critico' : riscoBurnout >= 45 ? 'atenção' : 'saudavel'
  const perfilDisc = (disc as any)?.perfil_principal || null

  const { recomendacao, comportamentoSobPressao } = await gerarRecomendacao({
    nome: (profile as any)?.nome || 'Colaborador',
    cargo: (profile as any)?.cargo,
    mediaHumor, mediaEnergia, mediaFoco, mediaStresse,
    tendenciaHumor, frequencia, riscoBurnout, riscoSaida, nivel,
    ishoEmpresa: (ishoEmpresa as any)?.score || 60,
    perfilDisc,
  })

  const semana = new Date().toISOString().split('T')[0]

  await client.from('scores_risco_individual').upsert({
    colaborador_id: colaboradorId,
    empresa_id: empresaId,
    semana,
    risco_burnout: riscoBurnout,
    risco_saida: riscoSaida,
    nivel,
    recomendacao,
    comportamento_sob_pressao: comportamentoSobPressao,
    metricas: { mediaHumor, mediaEnergia, mediaFoco, mediaStresse, frequencia, tendenciaHumor },
    calculado_em: new Date().toISOString(),
  }, { onConflict: 'colaborador_id,semana' })

  return { ok: true, risco_burnout: riscoBurnout, risco_saida: riscoSaida, nivel, recomendacao, comportamento_sob_pressao: comportamentoSobPressao }
}

async function gerarRecomendacao(p: {
  nome: string; cargo: string | null; mediaHumor: number; mediaEnergia: number
  mediaFoco: number; mediaStresse: number; tendenciaHumor: number; frequencia: number
  riscoBurnout: number; riscoSaida: number; nivel: string; ishoEmpresa: number
  perfilDisc: string | null
}): Promise<{ recomendacao: string; comportamentoSobPressao: string }> {
  const prompt = `Você é um consultor de saúde organizacional e psicologia comportamental (DISC). Analise este colaborador e responda em JSON.
Dados: Nome: ${p.nome} | Cargo: ${p.cargo || 'não informado'} | Perfil DISC: ${p.perfilDisc || 'não avaliado ainda'} | Humor: ${p.mediaHumor}/5 | Energia: ${p.mediaEnergia}/5 | Foco: ${p.mediaFoco}/5 | Estresse: ${p.mediaStresse}/5
Tendência humor: ${p.tendenciaHumor > 0 ? 'melhorando' : p.tendenciaHumor < -0.5 ? 'piorando' : 'estável'} | Check-ins: ${p.frequencia} | Risco burnout: ${p.riscoBurnout}% | Risco saída: ${p.riscoSaida}% | Nível: ${p.nivel}

Retorne APENAS JSON válido, sem markdown:
{
  "recomendacao": "UMA recomendação concreta (máx 2 frases) para o gestor agir ESTA SEMANA sobre este colaborador",
  "comportamento_sob_pressao": "2-3 frases explicando como essa pessoa tende a agir e decidir sob pressão, cruzando o perfil DISC (se disponível) com o nível atual de estresse/energia real. Se nao tiver DISC, baseie-se so nos dados de estresse/energia e diga que a leitura fica mais precisa com o DISC completo."
}`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: 300, temperature: 0.6 }),
    })
    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim() || ''
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      const json = JSON.parse(match[0])
      if (json.recomendacao && json.comportamento_sob_pressao) {
        return { recomendacao: json.recomendacao, comportamentoSobPressao: json.comportamento_sob_pressao }
      }
    }
    throw new Error('resposta invalida')
  } catch {
    return { recomendacao: recomendacaoFallback(p.nivel), comportamentoSobPressao: comportamentoFallback(p.nivel) }
  }
}

function recomendacaoFallback(nivel: string): string {
  if (nivel === 'critico') return 'Agende uma conversa individual privada esta semana. Sinais indicam esgotamento próximo.'
  if (nivel === 'atenção') return 'Verifique a carga de trabalho desta pessoa e ofereça suporte proativo.'
  return 'Colaborador com boa saúde emocional. Reconheça publicamente o desempenho para manter o engajamento.'
}

function comportamentoFallback(nivel: string): string {
  if (nivel === 'critico') return 'Sob pressão atual, tende a reagir de forma menos ponderada e pode adiar decisões importantes. Complete o DISC para uma leitura mais precisa.'
  if (nivel === 'atenção') return 'Ainda mantém o julgamento sob pressão, mas o desgaste pode comprometer a qualidade das decisões em breve. Complete o DISC para uma leitura mais precisa.'
  return 'Tende a lidar bem com pressão no momento atual. Complete o DISC para uma leitura mais precisa de como decide sob estresse.'
}

function media(arr: any[], campo: string): number {
  if (!arr?.length) return 3
  const vals = arr.map((r: any) => r[campo]).filter((v: any) => v != null)
  if (!vals.length) return 3
  return Math.round(vals.reduce((s: number, v: number) => s + v, 0) / vals.length * 10) / 10
}
