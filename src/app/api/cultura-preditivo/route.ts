import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { empresa_id } = await req.json()
  if (!empresa_id) return NextResponse.json({ error: 'empresa_id obrigatório' }, { status: 400 })

  const { data: empresa } = await sb.from('empresas').select('nome, valores_cultura').eq('id', empresa_id).single()
  if (!empresa) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })

  const { data: pulsos } = await sb
    .from('pulsos_cultura')
    .select('valor_nome, nota, origem_app, criado_em')
    .eq('empresa_id', empresa_id)
    .order('criado_em', { ascending: true })
    .limit(200)

  if (!pulsos || pulsos.length < 3) {
    return NextResponse.json({ texto: 'Ainda não há pulsos suficientes para uma análise preditiva (mínimo 3).' })
  }

  const porValor: Record<string, number[]> = {}
  for (const p of pulsos) {
    if (!porValor[p.valor_nome]) porValor[p.valor_nome] = []
    porValor[p.valor_nome].push(p.nota)
  }
  const resumo = Object.entries(porValor)
    .map(([valor, notas]) => {
      const media = (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1)
      const recentes = notas.slice(-5)
      const mediaRecente = (recentes.reduce((a, b) => a + b, 0) / recentes.length).toFixed(1)
      return `${valor}: média geral ${media}/5 (${notas.length} pulsos), média das 5 mais recentes: ${mediaRecente}/5`
    })
    .join('\n')

  const prompt = `Você é especialista em cultura organizacional e People Analytics preditivo.

EMPRESA: ${empresa.nome}
VALORES DECLARADOS: ${(empresa.valores_cultura || []).map((v: { nome: string }) => v.nome).join(', ') || 'não definidos'}

PULSOS DE ADERÊNCIA AOS VALORES (escala 1-5, coletados dos colaboradores):
${resumo}

Total de ${pulsos.length} pulsos coletados.

Analise a TENDÊNCIA por valor (não só a média geral) e responda em 4 seções curtas:

1. 📊 SAÚDE CULTURAL ATUAL (visão geral, quais valores estão fortes e quais fracos)
2. 📉 VALOR EM RISCO (se algum valor está com tendência de queda nos pulsos recentes vs. a média geral, aponte qual e o que isso costuma significar)
3. 🎯 AÇÃO RECOMENDADA (1-2 ações concretas de liderança para essa empresa agora)
4. 🔮 PREVISÃO (se a tendência atual continuar, o que é provável acontecer em 1-2 meses — turnover, engajamento, clima)

Tom: direto, estratégico, para um C-level ou RH sênior. Máximo 280 palavras. Sem markdown com asteriscos.`

  const key = process.env.GEMINI_API_KEY
  if (!key) return NextResponse.json({ texto: 'Serviço de IA indisponível. Configure a chave GEMINI_API_KEY.' })

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
      }),
    })
    const data = await geminiRes.json()
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível gerar a análise.'
    return NextResponse.json({ texto })
  } catch (e) {
    console.error('[cultura-preditivo]', e)
    return NextResponse.json({ texto: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
