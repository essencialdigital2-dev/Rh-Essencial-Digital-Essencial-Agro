import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { token, senha } = await req.json()
  if (!token || !senha) return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  if (senha.length < 6) return NextResponse.json({ error: 'Senha mínima de 6 caracteres.' }, { status: 400 })

  const { data: empresa, error } = await sb
    .from('empresas')
    .select('id, nome, token_expira')
    .eq('token_acesso', token)
    .single()

  if (error || !empresa) return NextResponse.json({ error: 'Link inválido ou expirado.' }, { status: 400 })

  if (new Date(empresa.token_expira) < new Date()) {
    return NextResponse.json({ error: 'Link expirado. Solicite um novo acesso.' }, { status: 400 })
  }

  await sb.from('empresas').update({
    senha_cliente: senha,
    token_acesso: null,
    token_expira: null,
  }).eq('id', empresa.id)

  return NextResponse.json({ ok: true, empresa_id: empresa.id, nome: empresa.nome })
}
