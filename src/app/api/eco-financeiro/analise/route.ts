import { NextResponse } from 'next/server'
import { ecoAutorizado } from '@/lib/ecoAuth'

export async function POST(req: Request) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  try {
    const { sense_rh, outros_produtos, totais } = await req.json()

    const resumoOutros = (outros_produtos || []).map((p: any) =>
      `${p.produto} (${new Date(p.mes).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}): receita R$${p.receita}, despesas R$${p.despesas}${p.observacao ? ' — ' + p.observacao : ''}`
    ).join('\n') || 'nenhum registro manual ainda'

    const prompt = `Voce e consultora financeira da fundadora da Essencial Digital, um ecossistema de 8 produtos B2B/B2C de educacao e RH com IA. Sem travessoes, acentuacao correta, direta e honesta — inclusive sobre limitacoes dos dados.

DADOS AUTOMATICOS (Sense AI / RH Essencial, via Stripe):
Receita paga: R$ ${sense_rh?.receita_paga ?? 0}
Pendente: R$ ${sense_rh?.pendente ?? 0}

DADOS MANUAIS DOS OUTROS PRODUTOS (lancados a mao, podem estar incompletos):
${resumoOutros}

TOTAIS CONSOLIDADOS:
Receita total: R$ ${totais?.receita_total ?? 0}
Despesas totais: R$ ${totais?.despesas_total ?? 0}

Retorne APENAS JSON valido:
{
  "diagnostico": "leitura honesta da situacao financeira consolidada em 2-3 frases, mencionando explicitamente que apenas Sense AI/RH tem dados automaticos e o resto depende de lancamento manual",
  "produto_destaque": "qual produto esta performando melhor financeiramente, ou null se dados insuficientes",
  "risco_principal": "o maior risco ou lacuna identificada (ex: falta de dados de X produtos, dependencia de um so produto)",
  "recomendacao": "proxima acao concreta — provavelmente integrar Stripe nos outros produtos ou manter lancamento manual em dia"
}`

    const g = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    )
    const gd = await g.json()
    const raw = gd.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const analise = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    return NextResponse.json({ analise })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
