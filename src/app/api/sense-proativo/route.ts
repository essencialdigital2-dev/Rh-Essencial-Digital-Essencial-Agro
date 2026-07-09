import { NextResponse } from 'next/server'

function extrairJSON(text: string): any {
  let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')
  if (start !== -1 && end !== -1) clean = clean.slice(start, end + 1)
  return JSON.parse(clean)
}

// Esta API nao acessa banco de dados. Recebe os dados que o navegador
// ja buscou (com a sessao real do usuario logado) e apenas roda a
// analise preditiva de IA sobre eles. Nenhuma credencial nova necessaria.
export async function POST(req: Request) {
  try {
    const { nomeEmpresa, ishoHistorico, checkins } = await req.json()

    if (!Array.isArray(ishoHistorico) && !Array.isArray(checkins)) {
      return NextResponse.json({ error: 'dados insuficientes' }, { status: 400 })
    }

    const ishoAtual = ishoHistorico?.length ? ishoHistorico[ishoHistorico.length - 1] : null
    const ishoAnterior = ishoHistorico?.length > 1 ? ishoHistorico[ishoHistorico.length - 2] : null
    const tendenciaIsho = ishoAtual != null && ishoAnterior != null ? ishoAtual - ishoAnterior : null

    const mediaCheckin = (campo: string) => {
      const vals = (checkins || []).map((c: any) => c[campo]).filter((v: any) => v != null)
      return vals.length ? Math.round((vals.reduce((s: number, v: number) => s + v, 0) / vals.length) * 10) / 10 : null
    }
    const humor = mediaCheckin('humor')
    const energia = mediaCheckin('energia')
    const estresse = mediaCheckin('estresse')

    const prompt = `Voce e o motor de conformidade preventiva NR-1 da Essencial Digital. Analise os dados de saude psicossocial desta empresa e gere uma avaliacao preditiva. Sem travessoes, acentuacao correta, tom profissional e humano, nunca alarmista sem necessidade.

EMPRESA: ${nomeEmpresa || 'Empresa'}
HISTORICO ISHO (Indice de Saude Humana Organizacional, ultimas semanas): ${JSON.stringify(ishoHistorico || [])}
ISHO ATUAL: ${ishoAtual ?? 'sem dados'}
TENDENCIA: ${tendenciaIsho != null ? (tendenciaIsho >= 0 ? '+' : '') + tendenciaIsho + ' pontos' : 'sem historico suficiente'}
MEDIA DE CHECK-INS RECENTES (escala 0-10): humor ${humor ?? 'sem dados'}, energia ${energia ?? 'sem dados'}, estresse ${estresse ?? 'sem dados'}
TOTAL DE CHECK-INS ANALISADOS: ${(checkins || []).length}

A NR-1 exige que empresas identifiquem e controlem riscos psicossociais no ambiente de trabalho. Gere uma avaliacao preditiva util para o RH.

Retorne APENAS JSON valido:
{
  "nivel_risco": "baixo" | "medio" | "alto",
  "score_risco": 0 a 100,
  "diagnostico": "leitura honesta da situacao atual em 2 a 3 frases",
  "fatores_identificados": ["fator de risco 1 com base nos dados", "fator 2"],
  "previsao_30_dias": "o que tende a acontecer se nada mudar",
  "acoes_preventivas": ["acao pratica e especifica 1", "acao 2", "acao 3"],
  "conformidade_nr1": "uma frase sobre a situacao da empresa frente a exigencia legal da NR-1"
}`

    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'Chave da IA nao configurada' }, { status: 500 })

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    )
    const geminiData = await geminiRes.json()
    const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    if (!raw) return NextResponse.json({ error: 'IA nao retornou resposta valida' }, { status: 503 })

    const analise = extrairJSON(raw)
    return NextResponse.json({ analise })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
