import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calcularRiscoIndividual } from '@/lib/calcularRisco'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const dias14 = new Date(); dias14.setDate(dias14.getDate() - 14)
  const { data: colaboradores } = await sb
    .from('health_checkins')
    .select('colaborador_id, empresa_id')
    .gte('criado_em', dias14.toISOString())

  if (!colaboradores?.length) return NextResponse.json({ ok: true, processados: 0 })

  const únicos = new Map<string, string>()
  for (const c of colaboradores) {
    if (!únicos.has(c.colaborador_id)) únicos.set(c.colaborador_id, c.empresa_id)
  }

  let processados = 0
  let erros = 0

  for (const [colaboradorId, empresaId] of Array.from(únicos.entries())) {
    try {
      await calcularRiscoIndividual(colaboradorId, empresaId)
      processados++
      await new Promise(r => setTimeout(r, 200))
    } catch { erros++ }
  }

  return NextResponse.json({ ok: true, processados, erros, semana: new Date().toISOString().split('T')[0] })
}
