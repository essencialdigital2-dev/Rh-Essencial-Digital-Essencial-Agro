import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verifica se a empresa tem o modulo 'sense' liberado no registro central
// (eco_clientes vive no mesmo projeto, entao a checagem e direta). Se a
// empresa ainda nao estiver vinculada la, libera por padrao (fail-open).
export async function POST(req: NextRequest) {
  const { empresa_id } = await req.json()
  if (!empresa_id) return NextResponse.json({ bloqueado: false })

  try {
    const { data } = await sb().from('eco_clientes').select('modulos_liberados').eq('sense_empresa_id', empresa_id).maybeSingle()
    if (!data) return NextResponse.json({ bloqueado: false })
    const bloqueado = !data.modulos_liberados?.includes('sense')
    return NextResponse.json({ bloqueado, modulos_liberados: data.modulos_liberados })
  } catch {
    return NextResponse.json({ bloqueado: false })
  }
}
