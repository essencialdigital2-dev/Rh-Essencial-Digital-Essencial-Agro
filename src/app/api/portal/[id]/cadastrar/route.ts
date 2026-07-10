import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { provisionarModulos, MODULOS_AUTOCADASTRO } from '@/lib/provisionamento'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { email, senha } = await req.json()
  if (!email || !senha || senha.length < 6) {
    return NextResponse.json({ error: 'e-mail e senha (min. 6 caracteres) sao obrigatorios' }, { status: 400 })
  }

  const { data: cliente, error } = await sb().from('eco_clientes').select('*').eq('id', id).maybeSingle()
  if (error || !cliente) return NextResponse.json({ error: 'link nao encontrado' }, { status: 404 })
  if (cliente.senha_temporaria) return NextResponse.json({ error: 'acesso ja foi criado para este link' }, { status: 400 })

  const modulos: string[] = cliente.modulos_liberados || []
  const suportados = modulos.filter((m: string) => MODULOS_AUTOCADASTRO.includes(m))
  if (suportados.length === 0) {
    return NextResponse.json({ error: 'nenhum produto deste pacote suporta auto-cadastro ainda' }, { status: 400 })
  }

  const ok = await provisionarModulos(cliente.nome, email, senha, suportados)
  if (!ok) return NextResponse.json({ error: 'nao foi possivel criar o acesso. tente outro e-mail.' }, { status: 500 })

  await sb().from('eco_clientes').update({ email, senha_temporaria: senha }).eq('id', id)

  return NextResponse.json({ ok: true, modulos: suportados })
}
