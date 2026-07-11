import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const g = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Busque na web e liste 2 escolas privadas reais no Brasil. Retorne APENAS um JSON array de strings, ex: ["Nome 1","Nome 2"]' }] }],
          tools: [{ google_search: {} }],
        }),
      }
    )
    const status = g.status
    const gd = await g.json()
    return NextResponse.json({ status, resposta: gd })
  } catch (e: unknown) {
    return NextResponse.json({ erro: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
