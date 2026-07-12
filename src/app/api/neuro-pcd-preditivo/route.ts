import { NextRequest, NextResponse } from 'next/server'
import type { PcdInfo } from '@/lib/sense-neuro'

interface HistoricoItem {
  data: string
  energia: number
  fadiga: number
  barreira: string
}

interface Body {
  pcdInfo: PcdInfo
  historico: HistoricoItem[]
}

export async function POST(req: NextRequest) {
  try {
    const { pcdInfo, historico }: Body = await req.json()

    const resumoHistorico = historico
      .map(h => `${new Date(h.data).toLocaleDateString('pt-BR')}: energia ${h.energia}/5, fadiga ${h.fadiga}/5, barreira relatada: "${h.barreira || 'nenhuma'}"`)
      .join('\n')

    const prompt = `Você é a Sense AI, especialista em saúde ocupacional preditiva e inclusão de PCDs no trabalho.

COLABORADOR COM: ${pcdInfo.label} — ${pcdInfo.desc}

HISTÓRICO DE CHECK-INS (mais recentes por último):
${resumoHistorico}

Analise a TENDÊNCIA (não só o valor mais recente) e responda em 4 partes curtas:

1. 📈 TENDÊNCIA IDENTIFICADA (piorando, estável ou melhorando — cite os números)
2. ⚠️ RISCO PREDITIVO ESPECÍFICO (o que esse padrão significa para esse perfil de deficiência especificamente)
3. 🎯 AÇÃO RECOMENDADA AGORA (1-2 ações concretas e imediatas para o gestor/RH)
4. 🔮 JANELA DE ATENÇÃO (se nada mudar, estimativa qualitativa de quando isso pode virar um problema sério)

Tom: direto, prático, sem alarmismo desnecessário mas honesto sobre risco real. Máximo 250 palavras.`

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
      return NextResponse.json({ texto: groqData.choices?.[0]?.message?.content || 'Não foi possível gerar a análise.' })
    }

    const data = await geminiRes.json()
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível gerar a análise.'
    return NextResponse.json({ texto })
  } catch (e) {
    console.error('[neuro-pcd-preditivo]', e)
    return NextResponse.json({ texto: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
