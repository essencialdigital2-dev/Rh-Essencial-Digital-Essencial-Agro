import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET: dados financeiros consolidados (automatico do Sense/RH + manual dos outros produtos)
export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const db = sb()
  const [{ data: fin }, { data: manual }] = await Promise.all([
    db.from('financeiro').select('valor, status, tipo'),
    db.from('eco_financeiro_manual').select('*').order('mes', { ascending: false }).limit(100),
  ])

  const f = fin || []
  const receitaAutomatica = f.filter(x => x.tipo === 'receita' && x.status === 'pago').reduce((a, x) => a + x.valor, 0)
  const pendenteAutomatica = f.filter(x => x.status === 'pendente').reduce((a, x) => a + x.valor, 0)

  const receitaManual = (manual || []).reduce((a, x) => a + Number(x.receita), 0)
  const despesasManual = (manual || []).reduce((a, x) => a + Number(x.despesas), 0)

  return NextResponse.json({
    sense_rh: { receita_paga: receitaAutomatica, pendente: pendenteAutomatica },
    outros_produtos: manual || [],
    totais: {
      receita_total: receitaAutomatica + receitaManual,
      despesas_total: despesasManual,
    },
  })
}

// POST: registra entrada manual de faturamento de um produto/mes
export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  try {
    const { produto, mes, receita, despesas, observacao } = await req.json()
    if (!produto || !mes) return NextResponse.json({ error: 'produto e mes obrigatorios' }, { status: 400 })

    const db = sb()
    const { error } = await db.from('eco_financeiro_manual')
      .upsert({ produto, mes, receita: receita || 0, despesas: despesas || 0, observacao: observacao || null }, { onConflict: 'produto,mes' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
