import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rate-limit'

const TOM_POR_DISC: Record<string, string> = {
  D: 'Essa pessoa tem perfil DISC predominante Dominância — seja direto e objetivo, va reto ao ponto, evite rodeios e detalhes desnecessarios, foque em resultado e acao.',
  I: 'Essa pessoa tem perfil DISC predominante Influência — seja mais caloroso e conversacional, reconheça o lado humano da questão, pode usar um tom mais entusiasta.',
  S: 'Essa pessoa tem perfil DISC predominante Estabilidade — seja acolhedor e paciente, evite pressa ou urgência artificial, de seguranca e previsibilidade nas respostas.',
  C: 'Essa pessoa tem perfil DISC predominante Conformidade — seja preciso e estruturado, traga dados e justificativas quando possivel, evite generalizacoes vagas.',
}

const SYSTEM_PROMPT = (nome: string, discPerfil: string) => `Você é a Sense AI, especialista em:
- Gestão de Pessoas e RH estratégico
- Psicologia Organizacional e Comportamental
- CLT, legislação trabalhista brasileira e NR-1
- Saúde mental no trabalho, burnout e bem-estar
- DISC, feedback, liderança e desenvolvimento humano

${nome ? `Voce esta falando com ${nome}.` : ''}
${discPerfil && TOM_POR_DISC[discPerfil] ? TOM_POR_DISC[discPerfil] : ''}

Responda sempre em português brasileiro, de forma clara, empática e prática.
Seja objetivo - respostas entre 100 e 300 palavras.
Use bullet points quando listar itens.
Não invente dados ou estatísticas - quando incerto, diga "recomendo verificar com um especialista".`

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { ok } = rateLimit(ip, 20, 60_000)
  if (!ok) return NextResponse.json({ error: 'Muitas requisições. Aguarde 1 minuto.' }, { status: 429 })

  try {
    const { message, history, userId } = await req.json()
    const key = process.env.GEMINI_API_KEY
    if (!key) {
      return NextResponse.json({ error: 'Chave da IA não configurada.' }, { status: 500 })
    }

    let nome = ''
    let discPerfil = ''
    if (userId) {
      try {
        const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
        const [{ data: usuario }, { data: disc }] = await Promise.all([
          admin.from('sense_usuarios').select('nome').eq('id', userId).maybeSingle(),
          admin.from('sense_disc').select('perfil_predominante').eq('usuario_id', userId).limit(1).maybeSingle(),
        ])
        if (usuario?.nome) nome = usuario.nome.split(' ')[0]
        if (disc?.perfil_predominante) discPerfil = disc.perfil_predominante
      } catch {}
    }

    const contents = [
      ...(history || []),
      { role: 'user', parts: [{ text: message }] }
    ]

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT(nome, discPerfil) }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
        })
      }
    )

    const json = await res.json()

    if (!res.ok) {
      const msg = json?.error?.message || 'Chave invalida ou limite atingido.'
      return NextResponse.json({ error: msg }, { status: 502 })
    }

    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      const reason = json?.candidates?.[0]?.finishReason || 'desconhecido'
      return NextResponse.json({ error: `Resposta bloqueada (${reason}). Tente reformular a pergunta.` }, { status: 502 })
    }

    const clean = text.replace(/—/g, '-').replace(/–/g, '-')
    return NextResponse.json({ text: clean, role: 'model' })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro interno.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
