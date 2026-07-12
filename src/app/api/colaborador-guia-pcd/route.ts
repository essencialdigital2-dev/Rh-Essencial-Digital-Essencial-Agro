import { NextRequest, NextResponse } from 'next/server'
import type { PcdInfo } from '@/lib/sense-neuro'

interface Body {
  nome: string
  cargo?: string
  setor?: string
  observacoes?: string
  pcdInfo: PcdInfo
}

export async function POST(req: NextRequest) {
  try {
    const { nome, cargo, setor, observacoes, pcdInfo }: Body = await req.json()

    const prompt = `Você é especialista em RH e inclusão de PCDs no ambiente corporativo.

COLABORADOR: ${nome}
CARGO: ${cargo || 'não informado'}
SETOR: ${setor || 'não informado'}
CONDIÇÃO: ${pcdInfo.label} — ${pcdInfo.desc}
OBSERVAÇÕES DO GESTOR: ${observacoes || 'nenhuma'}

Gere um GUIA PRÁTICO DE ACOMODAÇÕES em 4 seções curtas, específico para o cargo/setor informado:

1. 🎯 ONDE ${nome.split(' ')[0].toUpperCase()} PODE BRILHAR (pontos fortes aplicados a esse cargo específico)
2. 🛠️ ACOMODAÇÕES PRÁTICAS PARA ESSE CARGO (adaptações concretas, não genéricas)
3. 💬 COMO O GESTOR DEVE COMUNICAR (regras práticas do dia a dia)
4. ⚠️ SINAIS DE ALERTA A OBSERVAR (o que indicaria que a acomodação não está funcionando)

Tom: direto, prático, sem jargão. Máximo 300 palavras.`

    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ texto: 'Serviço de IA indisponível. Configure a chave GEMINI_API_KEY.' }, { status: 200 })

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
      }),
    })

    if (!geminiRes.ok) {
      const groqKey = process.env.GROQ_API_KEY
      if (!groqKey) return NextResponse.json({ texto: 'Serviço temporariamente indisponível.' })
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 700, temperature: 0.7,
        }),
      })
      const groqData = await groqRes.json()
      return NextResponse.json({ texto: groqData.choices?.[0]?.message?.content || 'Não foi possível gerar o guia.' })
    }

    const data = await geminiRes.json()
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível gerar o guia.'
    return NextResponse.json({ texto })
  } catch (e) {
    console.error('[colaborador-guia-pcd]', e)
    return NextResponse.json({ texto: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
