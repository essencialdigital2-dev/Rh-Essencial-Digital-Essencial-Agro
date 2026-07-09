import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { texto } = await req.json()
  if (!texto) return NextResponse.json({ error: 'texto obrigatorio' }, { status: 400 })

  const prompt = `Reescreva o texto abaixo em portugues simplificado, adequado para leitores surdos que usam Libras como primeira lingua (frases curtas, ordem direta sujeito-verbo-objeto, sem girias, sem metaforas, vocabulario simples). Mantenha todas as informacoes importantes. Responda apenas o texto reescrito, sem comentarios, sem markdown.

TEXTO ORIGINAL:
${texto.slice(0, 6000)}`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    )
    const data = await res.json()
    const textoSimplificado = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!textoSimplificado) return NextResponse.json({ error: 'IA sem resposta' }, { status: 502 })
    return NextResponse.json({ texto: textoSimplificado })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'erro interno' }, { status: 500 })
  }
}
