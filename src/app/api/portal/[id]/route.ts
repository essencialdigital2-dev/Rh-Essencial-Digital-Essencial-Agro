import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Rota publica (o cliente abre sem estar logado no admin). So expoe nome,
// tipo e modulos liberados — nunca cnpj, observacoes ou qualquer dado interno.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await sb().from('eco_clientes').select('nome, tipo, modulos_liberados').eq('id', id).maybeSingle()
  if (error || !data) return NextResponse.json({ encontrado: false }, { status: 404 })
  return NextResponse.json({ encontrado: true, ...data })
}
