import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'token obrigatório' }, { status: 400 })

  const { data, error } = await sb.from('empresas').select('id, nome, valores_cultura').eq('token_cultura', token).single()
  if (error || !data) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })
  return NextResponse.json({ ok: true, empresa: data })
}

interface PulsoBody {
  token: string
  origem_app?: string
  colaborador_nome?: string
  respostas: { valor_nome: string; nota: number }[]
}

export async function POST(req: NextRequest) {
  const { token, origem_app, colaborador_nome, respostas }: PulsoBody = await req.json()
  if (!token || !Array.isArray(respostas) || respostas.length === 0) {
    return NextResponse.json({ error: 'token e respostas obrigatórios' }, { status: 400 })
  }

  const { data: empresa } = await sb.from('empresas').select('id').eq('token_cultura', token).single()
  if (!empresa) return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })

  const linhas = respostas.map(r => ({
    empresa_id: empresa.id,
    valor_nome: r.valor_nome,
    nota: r.nota,
    colaborador_nome: colaborador_nome || null,
    origem_app: origem_app || 'hub',
  }))

  const { error } = await sb.from('pulsos_cultura').insert(linhas)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
