import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function calcularISHO(empresaId: string) {
  const client = sb()
  const dias30 = new Date(); dias30.setDate(dias30.getDate() - 30)

  const [{ data: checkins }, { data: totalColabs }] = await Promise.all([
    client.from('health_checkins')
      .select('colaborador_id, humor, energia, foco, stresse, criado_em')
      .eq('empresa_id', empresaId)
      .gte('criado_em', dias30.toISOString()),
    client.from('profiles')
      .select('id')
      .eq('empresa_id', empresaId)
      .eq('tipo', 'colaborador'),
  ])

  if (!checkins?.length) return { ok: false, msg: 'Sem dados suficientes' }

  const totalColabsCount = (totalColabs as any)?.length || 1
  const colabsAtivos = new Set(checkins.map((c: any) => c.colaborador_id)).size
  const engajamento = Math.round(colabsAtivos / totalColabsCount * 100)

  const media = (campo: string) => {
    const vals = checkins.map((c: any) => c[campo]).filter((v: any) => v != null)
    if (!vals.length) return 3
    return vals.reduce((s: number, v: number) => s + v, 0) / vals.length
  }

  const mediaHumor   = media('humor')
  const mediaEnergia = media('energia')
  const mediaFoco    = media('foco')
  const mediaStresse = media('stresse')

  const scoreBase = Math.round(
    (mediaHumor   / 5) * 25 +
    (mediaEnergia / 5) * 20 +
    (mediaFoco    / 5) * 20 +
    ((5 - mediaStresse) / 5) * 20 +
    (engajamento / 100) * 15
  )
  const score = Math.max(0, Math.min(100, scoreBase))
  const nivel = score >= 75 ? 'saudavel' : score >= 55 ? 'atenção' : 'critico'

  const semanaAnterior = new Date(); semanaAnterior.setDate(semanaAnterior.getDate() - 7)
  const { data: anterior } = await client
    .from('isho_semanal')
    .select('score')
    .eq('empresa_id', empresaId)
    .lte('semana', semanaAnterior.toISOString().split('T')[0])
    .order('semana', { ascending: false })
    .limit(1)
    .single()

  const scoreAnterior = (anterior as any)?.score || score
  const tendencia = score > scoreAnterior + 2 ? 'subindo' : score < scoreAnterior - 2 ? 'caindo' : 'estavel'

  const diagnostico = await gerarDiagnostico({ score, nivel, tendencia, engajamento, mediaHumor, mediaEnergia, mediaFoco, mediaStresse, colabsAtivos, totalColabsCount })

  const semana = new Date().toISOString().split('T')[0]

  await client.from('isho_semanal').upsert({
    empresa_id: empresaId,
    semana,
    score,
    nivel,
    tendencia,
    engajamento,
    metricas: { mediaHumor, mediaEnergia, mediaFoco, mediaStresse, colabsAtivos, totalColabsCount },
    diagnostico,
    calculado_em: new Date().toISOString(),
  }, { onConflict: 'empresa_id,semana' })

  return { ok: true, score, nivel, tendencia, engajamento, diagnostico }
}

async function gerarDiagnostico(p: {
  score: number; nivel: string; tendencia: string; engajamento: number
  mediaHumor: number; mediaEnergia: number; mediaFoco: number; mediaStresse: number
  colabsAtivos: number; totalColabsCount: number
}): Promise<string> {
  const prompt = `Você é um especialista em saúde organizacional. Gere um diagnóstico executivo em 2 frases sobre a saúde da equipe esta semana.
Dados: ISHO ${p.score}/100 | Nível: ${p.nivel} | Tendência: ${p.tendencia}
Humor: ${p.mediaHumor.toFixed(1)}/5 | Energia: ${p.mediaEnergia.toFixed(1)}/5 | Foco: ${p.mediaFoco.toFixed(1)}/5 | Estresse: ${p.mediaStresse.toFixed(1)}/5
Engajamento: ${p.engajamento}% (${p.colabsAtivos}/${p.totalColabsCount} colaboradores fizeram check-in)
Responda apenas o diagnóstico, sem título, sem markdown.`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: 120, temperature: 0.6 }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || fallback(p.nivel)
  } catch {
    return fallback(p.nivel)
  }
}

function fallback(nivel: string): string {
  if (nivel === 'critico') return 'A equipe apresenta sinais críticos de esgotamento. Intervenção imediata é necessária para evitar saídas e queda de produtividade.'
  if (nivel === 'atenção') return 'A saúde organizacional está em zona de atenção. Monitorar de perto e agir proativamente com as pessoas em risco.'
  return 'A equipe apresenta boa saúde emocional e engajamento consistente. Manter as práticas atuais e reconhecer o desempenho coletivo.'
}
