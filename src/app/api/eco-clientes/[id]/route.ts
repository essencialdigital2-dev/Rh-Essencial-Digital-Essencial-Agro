import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const updates: Record<string, unknown> = { atualizado_em: new Date().toISOString() }
  for (const campo of ['nome', 'tipo', 'cnpj', 'cidade', 'estado', 'modulos_liberados', 'observacoes', 'edu_escola_id', 'sense_empresa_id', 'teens_instituicao_id', 'agro_empresa_id']) {
    if (campo in body) updates[campo] = body[campo]
  }

  const { data, error } = await sb().from('eco_clientes').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, cliente: data })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { id } = await params
  const { error } = await sb().from('eco_clientes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
