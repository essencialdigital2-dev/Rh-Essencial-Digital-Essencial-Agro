import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ESG Social: nada de questionario manual. O score sai sozinho dos dados que
// a empresa ja gera usando o Sense AI (ISHO + risco individual), atualizado
// toda semana. E o que diferencia de qualquer ferramenta de ESG do mercado:
// aqui o "S" de Social e medido de verdade, nao autodeclarado.
export async function calcularESGSocial(empresaId: string) {
  const client = sb()

  const [{ data: ishoHistorico }, { data: riscos }, { data: colaboradores }] = await Promise.all([
    client.from('isho_semanal').select('score, semana').eq('empresa_id', empresaId).order('semana', { ascending: false }).limit(8),
    client.from('scores_risco_individual').select('risco_burnout, risco_saida, nivel').eq('empresa_id', empresaId).order('semana', { ascending: false }).limit(200),
    client.from('profiles').select('id').eq('empresa_id', empresaId).eq('tipo', 'colaborador'),
  ])

  if (!ishoHistorico?.length) return { ok: false, msg: 'Sem dados de ISHO suficientes ainda' }

  const scoreIshoAtual = ishoHistorico[0].score
  const totalColabs = colaboradores?.length || 0

  // Pilar 1: Bem-estar e saude mental (direto do ISHO)
  const pilarBemEstar = scoreIshoAtual

  // Pilar 2: Retencao de talentos (inverso do risco de saida)
  const comRiscoAlto = (riscos || []).filter(r => r.nivel === 'critico').length
  const pctRiscoAlto = totalColabs > 0 ? Math.round((comRiscoAlto / totalColabs) * 100) : 0
  const pilarRetencao = riscos?.length ? Math.max(0, 100 - pctRiscoAlto * 2) : null

  // Pilar 3: Seguranca psicologica (proxy: distribuicao de risco de burnout)
  const mediaBurnout = riscos?.length
    ? riscos.reduce((s, r) => s + (r.risco_burnout || 0), 0) / riscos.length
    : null
  const pilarSegurancaPsi = mediaBurnout !== null ? Math.max(0, Math.round(100 - mediaBurnout)) : null

  // Pilar 4: Diversidade e inclusao — ainda nao coletado nesta plataforma
  const pilarDiversidade = null

  const pilaresDisponiveis = [
    { nome: 'bem_estar_saude_mental', valor: pilarBemEstar, peso: 0.4 },
    { nome: 'retencao_talentos', valor: pilarRetencao, peso: 0.35 },
    { nome: 'seguranca_psicologica', valor: pilarSegurancaPsi, peso: 0.25 },
  ].filter(p => p.valor !== null) as { nome: string; valor: number; peso: number }[]

  const pesoTotal = pilaresDisponiveis.reduce((s, p) => s + p.peso, 0)
  const scoreEsgSocial = pesoTotal > 0
    ? Math.round(pilaresDisponiveis.reduce((s, p) => s + p.valor * p.peso, 0) / pesoTotal)
    : scoreIshoAtual

  const semanaAnterior = ishoHistorico[1]?.score ?? scoreEsgSocial
  const tendencia = scoreEsgSocial > semanaAnterior + 2 ? 'subindo' : scoreEsgSocial < semanaAnterior - 2 ? 'caindo' : 'estavel'

  const selosElegiveis: string[] = []
  if (scoreEsgSocial >= 75) selosElegiveis.push('Empresa com boa governanca de pessoas (ISHO/Sense AI)')
  if (pilarRetencao !== null && pilarRetencao >= 80) selosElegiveis.push('Baixo indice de risco de rotatividade')

  const { texto: resumo, recomendacao } = await gerarLeituraESG({
    scoreEsgSocial, tendencia, pilarBemEstar, pilarRetencao, pilarSegurancaPsi,
    totalColabs, comRiscoAlto,
  })

  const semana = new Date().toISOString().split('T')[0]
  await client.from('esg_social_historico').upsert({
    empresa_id: empresaId,
    semana,
    score_esg_social: scoreEsgSocial,
    pilares: { bem_estar_saude_mental: pilarBemEstar, retencao_talentos: pilarRetencao, seguranca_psicologica: pilarSegurancaPsi, diversidade_inclusao: pilarDiversidade },
    selos_elegiveis: selosElegiveis,
    recomendacao,
    resumo_executivo: resumo,
  }, { onConflict: 'empresa_id,semana' })

  return {
    ok: true,
    score_esg_social: scoreEsgSocial,
    tendencia,
    pilares: { bem_estar_saude_mental: pilarBemEstar, retencao_talentos: pilarRetencao, seguranca_psicologica: pilarSegurancaPsi, diversidade_inclusao: pilarDiversidade },
    selos_elegiveis: selosElegiveis,
    resumo_executivo: resumo,
    recomendacao,
  }
}

async function gerarLeituraESG(p: {
  scoreEsgSocial: number; tendencia: string
  pilarBemEstar: number; pilarRetencao: number | null; pilarSegurancaPsi: number | null
  totalColabs: number; comRiscoAlto: number
}): Promise<{ texto: string; recomendacao: string }> {
  const prompt = `Voce e consultor de ESG (pilar Social) especialista em gestao de pessoas no Brasil. Gere uma leitura executiva sobre o score ESG Social desta empresa, calculado automaticamente a partir dos dados reais de bem-estar e retencao coletados pela plataforma (nao e um questionario autodeclarado).

Score ESG Social: ${p.scoreEsgSocial}/100 (tendencia: ${p.tendencia})
Pilar bem-estar e saude mental: ${p.pilarBemEstar}/100
Pilar retencao de talentos: ${p.pilarRetencao ?? 'sem dado suficiente'}/100
Pilar seguranca psicologica: ${p.pilarSegurancaPsi ?? 'sem dado suficiente'}/100
Colaboradores: ${p.totalColabs} | Em risco critico de saida: ${p.comRiscoAlto}

Explique em linguagem de negocio (nao tecnica) o que esse score significa para: acesso a credito, exigencias de clientes/fornecedores grandes que pedem comprovacao ESG-S, e reputacao. Sem travessoes, acentuacao correta.

Retorne APENAS JSON:
{
  "resumo_executivo": "2-3 frases sobre o que este score representa para o negocio",
  "recomendacao": "1 acao concreta para melhorar o score esta semana"
}`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    )
    const data = await res.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const json = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    return { texto: json.resumo_executivo, recomendacao: json.recomendacao }
  } catch {
    return {
      texto: `Score ESG Social de ${p.scoreEsgSocial}/100, calculado a partir de dados reais de bem-estar e retencao da equipe.`,
      recomendacao: 'Continue registrando check-ins de bem-estar para manter o score atualizado e preciso.',
    }
  }
}
