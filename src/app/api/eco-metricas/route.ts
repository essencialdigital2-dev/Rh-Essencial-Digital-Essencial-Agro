import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { data, error } = await sb().from('eco_metricas_mensais').select('*').order('mes', { ascending: false }).limit(12)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, meses: data || [] })
}

export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { mes, investimento_marketing, mrr, clientes_ativos, novos_clientes, clientes_perdidos } = await req.json()
  if (!mes) return NextResponse.json({ error: 'mes obrigatorio' }, { status: 400 })

  const { data, error } = await sb().from('eco_metricas_mensais').upsert({
    mes,
    investimento_marketing: investimento_marketing || 0,
    mrr: mrr || 0,
    clientes_ativos: clientes_ativos || 0,
    novos_clientes: novos_clientes || 0,
    clientes_perdidos: clientes_perdidos || 0,
    atualizado_em: new Date().toISOString(),
  }, { onConflict: 'mes' }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, registro: data })
}
