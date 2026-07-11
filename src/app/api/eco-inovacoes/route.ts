import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: backlog de inovacoes autorizadas
export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { data, error } = await sb().from('eco_inovacoes').select('*').order('criado_em', { ascending: false }).limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inovacoes: data || [] })
}

// POST: autoriza uma oportunidade detectada pelo radar
export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { produto, titulo, descricao, esforco } = await req.json()
  if (!produto || !titulo) return NextResponse.json({ error: 'produto e titulo obrigatorios' }, { status: 400 })
  const { data, error } = await sb().from('eco_inovacoes').insert({
    produto, titulo, descricao: descricao || null, esforco: esforco || null, status: 'aprovada',
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, inovacao: data })
}

// PATCH: muda status (implementada / descartada)
export async function PATCH(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { id, status } = await req.json()
  if (!id || !['aprovada', 'implementada', 'descartada'].includes(status)) {
    return NextResponse.json({ error: 'id e status validos obrigatorios' }, { status: 400 })
  }
  const { error } = await sb().from('eco_inovacoes').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
