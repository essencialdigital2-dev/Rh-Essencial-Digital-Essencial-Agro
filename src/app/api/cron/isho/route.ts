import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calcularISHO } from '@/lib/calcularISHO'

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

  const { data: empresas } = await sb.from('empresas').select('id')
  if (!empresas?.length) return NextResponse.json({ ok: true, processadas: 0 })

  let processadas = 0
  let erros = 0

  for (const empresa of empresas) {
    try {
      await calcularISHO(empresa.id)
      processadas++
      await new Promise(r => setTimeout(r, 300))
    } catch { erros++ }
  }

  return NextResponse.json({ ok: true, processadas, erros, semana: new Date().toISOString().split('T')[0] })
}
