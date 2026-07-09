import { NextRequest, NextResponse } from 'next/server'
import { ecoAutorizado } from '@/lib/ecoAuth'

const APPS_MONITORADOS = [
  { key: 'edu', nome: 'Essencial Edu', url: 'https://essencial-edu.vercel.app' },
  { key: 'nexo', nome: 'NexoPerform', url: 'https://nexoperform.vercel.app' },
  { key: 'agro', nome: 'Essencial Agro Tech', url: 'https://agrotech.rhessencialdigital.com.br' },
  { key: 'sense', nome: 'Sense AI / RH Essencial', url: 'https://rhessencialdigital.com.br' },
  { key: 'estudo', nome: 'Essencial Estudo', url: 'https://essencialestudo.com.br/estudo' },
  { key: 'med', nome: 'Essencial Med', url: 'https://essencialestudo.com.br/med' },
  { key: 'juridico', nome: 'Essencial Jurídico', url: 'https://essencialestudo.com.br/juridico' },
  { key: 'teens', nome: 'Essencial Teens', url: 'https://essencialestudo.com.br/teens' },
]

async function checarApp(app: typeof APPS_MONITORADOS[0]) {
  const inicio = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(app.url, { method: 'GET', redirect: 'follow', signal: controller.signal, cache: 'no-store' })
    clearTimeout(timeout)
    const latencia = Date.now() - inicio
    return {
      ...app,
      status: res.status,
      ok: res.status >= 200 && res.status < 400,
      latencia_ms: latencia,
      erro: null,
    }
  } catch (e: unknown) {
    return {
      ...app,
      status: 0,
      ok: false,
      latencia_ms: Date.now() - inicio,
      erro: e instanceof Error ? e.message : String(e),
    }
  }
}

// GET: checa a saude de todos os apps do ecossistema em tempo real
export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const resultados = await Promise.all(APPS_MONITORADOS.map(checarApp))
  return NextResponse.json({ apps: resultados, verificado_em: new Date().toISOString() })
}

// POST: pede pra IA analisar os resultados e priorizar
export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  try {
    const { apps } = await req.json()
    const resumo = (apps || []).map((a: any) =>
      `${a.nome}: ${a.ok ? 'OK' : 'FALHA'} (status ${a.status}, ${a.latencia_ms}ms)${a.erro ? ' — erro: ' + a.erro : ''}`
    ).join('\n')

    const prompt = `Voce e SRE (site reliability engineer) da Essencial Digital. Analise o status de saude dos apps do ecossistema abaixo e gere um diagnostico priorizado. Sem travessoes, acentuacao correta.

STATUS ATUAL:
${resumo}

Retorne APENAS JSON valido:
{
  "situacao_geral": "resumo do estado geral do ecossistema em 1-2 frases",
  "criticos": ["app com problema real, priorizado por gravidade — vazio se tudo ok"],
  "atencao": ["app com sinal de alerta (lento, mas no ar) — vazio se nenhum"],
  "recomendacao": "proxima acao concreta a tomar, ou confirmacao de que esta tudo bem"
}`

    const g = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    )
    const gd = await g.json()
    const raw = gd.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const analise = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    return NextResponse.json({ analise })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
