import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Roda todo dia 1 do mes (ver vercel.json). Grava o valor_mensal atual de
// cada cliente ativo, criando a base histórica que permite calcular NRR de
// verdade (comparando a mesma base de clientes entre dois meses).
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  }

  const hoje = new Date()
  const mes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`

  const { data: clientes, error } = await sb().from('eco_clientes').select('id, valor_mensal, status').neq('status', 'cancelado')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const linhas = (clientes || []).map(c => ({ cliente_id: c.id, valor_mensal: Number(c.valor_mensal || 0), mes }))
  if (linhas.length === 0) return NextResponse.json({ ok: true, gravados: 0 })

  const { error: upsertError } = await sb().from('eco_mrr_snapshot').upsert(linhas, { onConflict: 'cliente_id,mes' })
  if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 })

  return NextResponse.json({ ok: true, gravados: linhas.length, mes })
}
