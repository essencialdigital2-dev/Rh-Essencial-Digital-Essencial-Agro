import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { email, senha } = await req.json()
  if (!email || !senha) return NextResponse.json({ error: 'Email e senha obrigatórios.' }, { status: 400 })

  const { data: empresa, error } = await sb
    .from('empresas')
    .select('id, nome, email, status')
    .eq('email', email.toLowerCase().trim())
    .eq('senha_cliente', senha)
    .eq('status', 'ativo')
    .single()

  if (error || !empresa) return NextResponse.json({ error: 'Credenciais inválidas ou empresa inativa.' }, { status: 401 })

  const res = NextResponse.json({ ok: true, empresa })
  res.cookies.set('cliente_id', empresa.id, { httpOnly: true, path: '/', maxAge: 60 * 60 * 8 })
  res.cookies.set('cliente_nome', empresa.nome, { path: '/', maxAge: 60 * 60 * 8 })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('cliente_id')
  res.cookies.delete('cliente_nome')
  return res
}
