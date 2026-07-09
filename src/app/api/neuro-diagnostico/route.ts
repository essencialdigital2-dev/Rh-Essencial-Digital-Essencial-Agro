import { NextRequest, NextResponse } from 'next/server'
import type { ConstelacaoEmocional } from '@/lib/sense-neuro'

interface Body {
  constelacao: ConstelacaoEmocional
  checkIns: string[]
  respostas: Record<number, string>
}

export async function POST(req: NextRequest) {
  try {
    const { constelacao, checkIns, respostas }: Body = await req.json()

    const respostasTexto = checkIns
      .map((q, i) => `P: ${q}\nR: ${respostas[i] || 'Não respondido'}`)
      .join('\n\n')

    const prompt = `Você é a Sense AI, especialista em neurociência comportamental, psicologia organizacional e saúde emocional no trabalho.

O colaborador tem o seguinte perfil:
- Constelação: ${constelacao.nome}
- Perfil Neurodivergente: ${constelacao.perfil}
- DISC Dominante: ${constelacao.disc}
- Estado Polivagal Dominante: ${constelacao.polivagal.estadoDominante}
- Janela Neurológica Ótima: ${constelacao.janelaNeuro.melhorHorario}

Check-in adaptado desta semana:
${respostasTexto}

Com base no perfil neurodivergente-DISC e nas respostas do check-in, gere um DIAGNÓSTICO EMOCIONAL PERSONALIZADO com:

1. **Estado Emocional Atual** - o que as respostas revelam sobre o momento do colaborador
2. **Conexão com o Perfil** - como o estado atual se relaciona com a neurociência e o DISC identificados
3. **Sinal de Atenção** - se há algum indicador de burnout, sobrecarga ou desconexão (ou ausência deles)
4. **3 Estratégias Práticas para Esta Semana** - adaptadas especificamente para ${constelacao.perfil} + DISC ${constelacao.disc}
5. **Mensagem de Acolhimento** - 2–3 frases de reconhecimento e pertencimento

Use linguagem empática, sem jargão excessivo. Seja específico ao perfil - não genérico.
Formato: use os títulos em negrito (**Título**) e bullet points onde adequado.
Tamanho: entre 300 e 500 palavras.`

    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ diagnostico: 'Serviço de IA indisponível. Configure a chave GEMINI_API_KEY.' }, { status: 200 })

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    }

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!geminiRes.ok) {
      // fallback Groq
      const groqKey = process.env.GROQ_API_KEY
      if (!groqKey) return NextResponse.json({ diagnostico: 'Serviço temporariamente indisponível.' })

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024, temperature: 0.7
        })
      })
      const groqData = await groqRes.json()
      const diagnostico = groqData.choices?.[0]?.message?.content || 'Não foi possível gerar o diagnóstico.'
      return NextResponse.json({ diagnostico })
    }

    const data = await geminiRes.json()
    const diagnostico = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível gerar o diagnóstico.'
    return NextResponse.json({ diagnostico })

  } catch (e) {
    console.error('[neuro-diagnostico]', e)
    return NextResponse.json({ diagnostico: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
