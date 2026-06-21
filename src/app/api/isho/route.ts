import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calcularISHO } from '@/lib/calcularISHO'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const empresaId = searchParams.get('empresa_id')
  if (!empresaId) return NextResponse.json({ error: 'empresa_id obrigatório' }, { status: 400 })

  const { data } = await sb()
    .from('isho_semanal')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('semana', { ascending: false })
    .limit(8)

  return NextResponse.json({ ok: true, historico: data || [] })
}

export async function POST(req: Request) {
  const { empresa_id } = await req.json()
  if (!empresa_id) return NextResponse.json({ error: 'empresa_id obrigatório' }, { status: 400 })
  const resultado = await calcularISHO(empresa_id)
  return NextResponse.json(resultado)
}
