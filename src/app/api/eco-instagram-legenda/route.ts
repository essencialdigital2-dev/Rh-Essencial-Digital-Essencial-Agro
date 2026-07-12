import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { ok } = rateLimit(ip, 20, 60_000)
  if (!ok) return NextResponse.json({ error: 'Muitas requisições. Aguarde 1 minuto.' }, { status: 429 })

  try {
    const { tema, objetivo } = await req.json()
    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'Chave da IA não configurada.' }, { status: 500 })

    const systemPrompt = `Você é a social media da Essencial Digital Human Tech, um ecossistema de tecnologia com IA adaptativa para educação (Essencial Estudo, Teens), gestão de pessoas (Sense AI, NexoPerform) e agronegócio (Agro Tech). Escreva uma legenda de post de Instagram sobre o tema informado. Estrutura: 1) gancho forte na primeira linha, 2) corpo curto com valor real (sem enrolação), 3) chamada para ação no final, 4) lista de 6 a 10 hashtags relevantes em português ao final, separadas por espaço. Não use travessões (—). Responda só com a legenda final, sem explicações antes ou depois.`

    const userPrompt = `Tema do post: ${tema || 'não especificado'}\nObjetivo: ${objetivo || 'engajamento e atrair leads'}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 500 }
        })
      }
    )

    const json = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'IA não retornou resposta.' }, { status: 502 })

    return NextResponse.json({ text: text.replace(/—/g, '-').replace(/–/g, '-').trim() })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro interno.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
