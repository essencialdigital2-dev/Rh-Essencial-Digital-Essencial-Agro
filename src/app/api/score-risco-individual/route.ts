import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calcularRiscoIndividual } from '@/lib/calcularRisco'
import { empresaPertenceAoUsuario } from '@/lib/verificarEmpresa'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const empresaId = searchParams.get('empresa_id')
  if (!empresaId) return NextResponse.json({ error: 'empresa_id obrigatório' }, { status: 400 })
  if (!(await empresaPertenceAoUsuario(empresaId))) return NextResponse.json({ error: 'nao autorizado' }, { status: 403 })

  const { data: scores } = await sb()
    .from('scores_risco_individual')
    .select('colaborador_id, risco_burnout, risco_saida, nivel, recomendacao, comportamento_sob_pressao, calculado_em, profiles(nome, cargo, setor)')
    .eq('empresa_id', empresaId)
    .order('risco_burnout', { ascending: false })

  return NextResponse.json({ ok: true, scores: scores || [] })
}

export async function POST(req: Request) {
  const { colaborador_id, empresa_id } = await req.json()
  if (!colaborador_id || !empresa_id) {
    return NextResponse.json({ error: 'colaborador_id e empresa_id obrigatórios' }, { status: 400 })
  }
  if (!(await empresaPertenceAoUsuario(empresa_id))) return NextResponse.json({ error: 'nao autorizado' }, { status: 403 })
  const resultado = await calcularRiscoIndividual(colaborador_id, empresa_id)
  return NextResponse.json(resultado)
}
