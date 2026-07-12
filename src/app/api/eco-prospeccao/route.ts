import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const CANAL_ESTILO: Record<string, string> = {
  instagram: 'Mensagem de Instagram Direct: curta (no máximo 4 frases), tom leve e humano, pode usar 1 emoji, termina com uma pergunta que gera resposta fácil (sim/não ou curiosidade).',
  whatsapp: 'Mensagem de WhatsApp: curta, direta, tom próximo e consultivo, sem parecer robô ou copy de vendas agressiva, termina com uma pergunta simples.',
  email: 'E-mail de prospecção: com assunto e corpo, tom profissional mas caloroso, estrutura de 3 parágrafos curtos, call-to-action claro no final.',
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { ok } = rateLimit(ip, 20, 60_000)
  if (!ok) return NextResponse.json({ error: 'Muitas requisições. Aguarde 1 minuto.' }, { status: 429 })

  try {
    const { canal, publico, contexto } = await req.json()
    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'Chave da IA não configurada.' }, { status: 500 })
    const estilo = CANAL_ESTILO[canal] || CANAL_ESTILO.whatsapp

    const systemPrompt = `Você é a assistente de prospecção da Essencial Digital Human Tech, um ecossistema de tecnologia com IA adaptativa para educação (Essencial Estudo, Teens), gestão de pessoas (Sense AI, NexoPerform) e agronegócio (Agro Tech). Escreva uma mensagem de prospecção para um lead em potencial. ${estilo} Não invente números ou promessas que não foram dadas no contexto. Não use travessões (—). Responda em português brasileiro, apenas com o texto final da mensagem, sem explicações antes ou depois.`

    const userPrompt = `Público-alvo: ${publico || 'não especificado'}\nContexto/observações da Alana: ${contexto || 'nenhum contexto adicional'}`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 500 }
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
