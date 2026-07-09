import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { ok } = rateLimit(ip, 10, 60_000)
  if (!ok) return NextResponse.json({ error: 'Muitas requisições. Aguarde 1 minuto.' }, { status: 429 })

  try {
    const { dados } = await req.json()
    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'Chave da IA não configurada.' }, { status: 500 })

    const systemPrompt = `Você é uma IA especialista em gestão de pessoas e psicologia organizacional.
Analise os dados da equipe fornecidos e gere um diagnóstico executivo com:
1) Um resumo da saúde humana da equipe (2-3 frases)
2) Até 3 pontos de atenção prioritários
3) Até 3 recomendações práticas e imediatas para o gestor
4) Uma frase de encerramento motivacional

Seja direto, empático e prático. Use linguagem acessível para gestores.
Responda em português brasileiro. Não use travessões. Máximo 350 palavras.`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: JSON.stringify(dados) }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 600 }
        })
      }
    )

    const json = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'IA não retornou resposta.' }, { status: 502 })

    return NextResponse.json({ text: text.replace(/—/g, '-').replace(/–/g, '-') })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro interno.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
