import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { ok } = rateLimit(ip, 20, 60_000)
  if (!ok) return NextResponse.json({ error: 'Muitas requisições. Aguarde 1 minuto.' }, { status: 429 })

  try {
    const { prompt, modulo } = await req.json()
    const key = process.env.GEMINI_API_KEY
    if (!key) return NextResponse.json({ error: 'Chave da IA não configurada.' }, { status: 500 })

    const sistemas: Record<string, string> = {
      devolutiva: `Você é um especialista em psicologia organizacional no agronegócio. Analise os dados de diagnóstico de uma equipe rural e gere uma devolutiva com: 1) Análise dos pontos críticos, 2) Pontos fortes, 3) Plano de ação com 5 ações práticas prioritárias, 4) Recomendação de prazo. Seja direto, prático e empático com a realidade do campo. Responda em português brasileiro.`,
      nr31: `Você é um especialista em segurança do trabalho rural e NR-31 (Norma Regulamentadora do Trabalho na Agricultura). Analise o checklist de conformidade fornecido e gere: 1) Diagnóstico de risco, 2) Itens mais críticos para correção imediata, 3) Plano de ação com prioridades, 4) Estimativa de prazo para regularização. Responda em português brasileiro, de forma técnica mas acessível.`,
      esg: `Você é um consultor de ESG especializado em agronegócio. Analise os indicadores fornecidos e gere: 1) Score ESG geral com justificativa, 2) Principais gaps, 3) Recomendações para melhoria, 4) Impacto no acesso a crédito rural e certificações. Responda em português brasileiro.`,
      sazonalidade: `Você é um especialista em gestão de equipes rurais e sazonalidade agrícola. Com base nos dados fornecidos (safra, equipe, disponibilidade), gere: 1) Análise do ciclo atual, 2) Previsão de necessidade de equipe por período, 3) Recomendações de contratação/realocação, 4) Alertas de risco de turnover. Responda em português brasileiro.`,
      saude_mental: `Você é um psicólogo organizacional especializado em saúde mental no campo. Analise os dados fornecidos e gere: 1) Diagnóstico de risco psicossocial rural, 2) Fatores de risco específicos identificados, 3) Intervenções recomendadas, 4) Recursos e encaminhamentos. Considere fatores únicos do campo: isolamento, dívida rural, sazonalidade, acidente de trabalho. Responda em português brasileiro.`,
      clima: `Você é um especialista em bem-estar de equipes rurais e gestão climática. Analise os dados fornecidos e gere: 1) Impacto do clima atual na equipe, 2) Riscos à saúde e segurança, 3) Adaptações recomendadas para o período, 4) Protocolo de emergência para eventos extremos. Responda em português brasileiro.`,
      carbono: `Você é um especialista em crédito de carbono e ESG para agronegócio. Com base nos dados fornecidos, gere: 1) Estimativa de potencial de créditos de carbono, 2) Práticas que geram mais créditos, 3) Certificadoras recomendadas para o perfil da fazenda, 4) Próximos passos para monetização. Responda em português brasileiro.`,
    }

    const systemPrompt = sistemas[modulo] || sistemas.devolutiva

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
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
