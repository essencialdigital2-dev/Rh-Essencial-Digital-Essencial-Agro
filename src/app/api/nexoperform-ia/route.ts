import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `Você é o NexoPerform HAI, especialista em assessment comportamental e desenvolvimento humano organizacional baseado no Método Essencial HAI (Human Adaptive Intelligence). Sua missão é transformar dados de avaliação em insights acionáveis que ajudem gestores a reconhecer, adaptar e desenvolver cada pessoa. Responda sempre em português brasileiro, de forma direta, estratégica e sem jargão excessivo. Sem travessões.`

export async function POST(req: NextRequest) {
  try {
    const { modulo, prompt } = await req.json()
    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'Chave da IA não configurada.' }, { status: 500 })

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: 'user', parts: [{ text: `[Módulo: ${modulo}]\n${prompt}` }] }],
          generationConfig: { temperature: 0.75, maxOutputTokens: 700 }
        })
      }
    )

    const json = await res.json()
    if (!res.ok) return NextResponse.json({ error: json?.error?.message || 'Erro na IA.' }, { status: 502 })

    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'Sem resposta da IA.' }, { status: 502 })

    return NextResponse.json({ resultado: text.replace(/—/g, '-').replace(/–/g, '-') })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erro interno.' }, { status: 500 })
  }
}
