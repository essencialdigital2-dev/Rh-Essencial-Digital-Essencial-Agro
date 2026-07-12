import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { ok } = rateLimit(ip, 10, 60_000)
  if (!ok) return NextResponse.json({ error: 'Muitas requisições. Aguarde 1 minuto.' }, { status: 429 })

  try {
    const { prompt, imagemBase64, imagemMimeType } = await req.json()
    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'Chave da IA não configurada.' }, { status: 500 })
    if (!prompt) return NextResponse.json({ error: 'Descreva o que você quer gerar ou mudar na imagem.' }, { status: 400 })

    const parts: Array<Record<string, unknown>> = [{ text: prompt }]
    if (imagemBase64 && imagemMimeType) {
      parts.unshift({ inline_data: { mime_type: imagemMimeType, data: imagemBase64 } })
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
        })
      }
    )

    const json = await res.json()
    const respParts = json?.candidates?.[0]?.content?.parts || []
    const imagePart = respParts.find((p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data)

    if (!imagePart) {
      const errMsg = json?.error?.message || json?.candidates?.[0]?.finishReason || 'IA não retornou uma imagem.'
      return NextResponse.json({ error: errMsg }, { status: 502 })
    }

    return NextResponse.json({
      imagemBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro interno.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
