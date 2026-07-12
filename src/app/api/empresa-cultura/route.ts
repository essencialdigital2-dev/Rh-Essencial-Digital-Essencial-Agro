import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const empresaId = req.nextUrl.searchParams.get('empresa_id')
  if (!empresaId) return NextResponse.json({ error: 'empresa_id obrigatório' }, { status: 400 })

  const { data, error } = await sb.from('empresas').select('id, nome, token_cultura, valores_cultura').eq('id', empresaId).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, empresa: data })
}

export async function PATCH(req: NextRequest) {
  const { empresa_id, valores_cultura } = await req.json()
  if (!empresa_id || !Array.isArray(valores_cultura)) {
    return NextResponse.json({ error: 'empresa_id e valores_cultura (array) obrigatórios' }, { status: 400 })
  }
  const { data, error } = await sb.from('empresas').update({ valores_cultura }).eq('id', empresa_id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, empresa: data })
}
