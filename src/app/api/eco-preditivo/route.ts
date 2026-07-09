import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

export const dynamic = 'force-dynamic'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const APPS_PREDITIVOS = [
  { key: 'edu', nome: 'Essencial Edu', url: 'https://essencial-edu.vercel.app/api/predicao-resumo' },
  { key: 'estudo', nome: 'Essencial Estudo', url: 'https://essencialestudo.com.br/api/predicao-resumo' },
  { key: 'agro', nome: 'Essencial Agro Tech', url: 'https://agrotech.rhessencialdigital.com.br/api/predicao-resumo' },
]

async function buscarResumo(app: typeof APPS_PREDITIVOS[0]) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(app.url, {
      headers: { 'x-eco-internal-key': process.env.ECO_INTERNAL_KEY || '' },
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timeout)
    if (!res.ok) return { app: app.key, nome: app.nome, ok: false }
    const data = await res.json()
    return { ...data, nome: app.nome, ok: true }
  } catch {
    return { app: app.key, nome: app.nome, ok: false }
  }
}

async function resumoSenseAI() {
  const db = sb()
  const [{ data: ishoRecente }, { data: esgRecente }, { data: riscosCriticos }] = await Promise.all([
    db.from('isho_semanal').select('score, empresa_id').order('semana', { ascending: false }).limit(200),
    db.from('esg_social_historico').select('score_esg_social, empresa_id').order('semana', { ascending: false }).limit(200),
    db.from('scores_risco_individual').select('id').eq('nivel', 'critico'),
  ])

  // Pega so o registro mais recente por empresa
  const ishoPorEmpresa = new Map<string, number>()
  for (const r of ishoRecente || []) if (!ishoPorEmpresa.has(r.empresa_id)) ishoPorEmpresa.set(r.empresa_id, r.score)
  const esgPorEmpresa = new Map<string, number>()
  for (const r of esgRecente || []) if (!esgPorEmpresa.has(r.empresa_id)) esgPorEmpresa.set(r.empresa_id, r.score_esg_social)

  const ishoValores = Array.from(ishoPorEmpresa.values())
  const esgValores = Array.from(esgPorEmpresa.values())

  return {
    app: 'sense',
    nome: 'Essencial Sense AI',
    ok: true,
    isho_medio: ishoValores.length ? Math.round(ishoValores.reduce((s, v) => s + v, 0) / ishoValores.length) : null,
    esg_social_medio: esgValores.length ? Math.round(esgValores.reduce((s, v) => s + v, 0) / esgValores.length) : null,
    empresas_com_esg: esgValores.length,
    colaboradores_risco_critico: riscosCriticos?.length || 0,
  }
}

export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })

  const [edu, estudo, agro, sense] = await Promise.all([
    buscarResumo(APPS_PREDITIVOS[0]),
    buscarResumo(APPS_PREDITIVOS[1]),
    buscarResumo(APPS_PREDITIVOS[2]),
    resumoSenseAI(),
  ])

  return NextResponse.json({ ok: true, apps: { edu, estudo, agro, sense } })
}

export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })

  const { apps } = await req.json()
  const { edu, estudo, agro, sense } = apps || {}

  const resumo = `
ESSENCIAL EDU (previsao de risco de alunos): ${edu?.ok ? `taxa de acerto ${edu.taxa_acerto ?? 'ainda sem historico suficiente'}%, ${edu.previsoes_pendentes} previsoes aguardando verificacao, ${edu.alertas_criticos_abertos} alertas criticos abertos` : 'indisponivel no momento'}

ESSENCIAL ESTUDO (score de aprovacao): ${estudo?.ok ? `${estudo.taxa_engajamento_recomendacoes ?? 'sem dado suficiente'}% dos alunos seguem as recomendacoes da IA, ${estudo.alunos_tendencia_caindo} alunos com tendencia de queda no score` : 'indisponivel no momento'}

ESSENCIAL AGRO TECH (previsao de risco rural): ${agro?.ok ? `taxa de acerto ${agro.taxa_acerto ?? 'ainda sem historico suficiente'}%, ${agro.previsoes_pendentes} previsoes aguardando verificacao, ${agro.alertas_criticos_abertos} alertas criticos de risco alto abertos` : 'indisponivel no momento'}

ESSENCIAL SENSE AI (saude organizacional e ESG social): ISHO medio ${sense?.isho_medio ?? 'sem dado'}/100, ESG Social medio ${sense?.esg_social_medio ?? 'sem dado'}/100 (${sense?.empresas_com_esg || 0} empresas com score calculado), ${sense?.colaboradores_risco_critico || 0} colaboradores em risco critico de burnout/saida`

  const prompt = `Voce e a assessora executiva da fundadora da Essencial Digital. Gere uma leitura unica do Radar Preditivo Consolidado, cruzando os 4 produtos que tem inteligencia preditiva (Edu, Estudo, Agro Tech, Sense AI). Sem travessoes, acentuacao correta, direto ao ponto.

${resumo}

Retorne APENAS JSON valido:
{
  "leitura_geral": "sintese em 2-3 frases do que esses 4 produtos revelam juntos sobre a saude preditiva do ecossistema",
  "prioridade_do_dia": "a UNICA coisa mais importante pra fundadora olhar hoje, entre os 4 produtos",
  "destaques": ["ate 3 pontos positivos entre os produtos"],
  "alertas": ["ate 3 pontos que precisam atencao — vazio se nada"]
}`

  try {
    const g = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    )
    const gd = await g.json()
    const raw = gd.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const analise = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    return NextResponse.json({ ok: true, analise })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
