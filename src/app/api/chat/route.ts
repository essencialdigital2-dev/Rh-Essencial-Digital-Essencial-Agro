import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Você é o Assistente Sense AI, especialista em:
- Gestão de Pessoas e RH estratégico
- Psicologia Organizacional e Comportamental
- CLT, legislação trabalhista brasileira e NR-1
- Saúde mental no trabalho, burnout e bem-estar
- DISC, feedback, liderança e desenvolvimento humano

Responda sempre em português brasileiro, de forma clara, empática e prática.
Seja objetivo — respostas entre 100 e 300 palavras.
Use bullet points quando listar itens.
Não invente dados ou estatísticas — quando incerto, diga "recomendo verificar com um especialista".`

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()
    const key = process.env.GEMINI_API_KEY
    if (!key) {
      return NextResponse.json({ error: 'Chave da IA não configurada.' }, { status: 500 })
    }

    const contents = [
      ...(history || []),
      { role: 'user', parts: [{ text: message }] }
    ]

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
        })
      }
    )

    const json = await res.json()
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'Sem resposta da IA.' }, { status: 502 })

    return NextResponse.json({ text, role: 'model' })
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
