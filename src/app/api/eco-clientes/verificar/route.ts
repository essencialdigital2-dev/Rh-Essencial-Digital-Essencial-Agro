import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CAMPOS_PERMITIDOS = ['id', 'cnpj', 'edu_escola_id', 'sense_empresa_id', 'teens_instituicao_id', 'agro_empresa_id']

// Chamado pelos outros apps (Edu, Estudo, Sense AI, Agro Tech) pra saber
// quais modulos um cliente (instituicao ou empresa) tem liberado. Cada app
// identifica o cliente pelo ID que ele mesmo guarda (edu_escola_id,
// sense_empresa_id, teens_instituicao_id, agro_empresa_id) ou por cnpj/id
// direto. Protegido pela chave compartilhada entre apps.
export async function GET(req: NextRequest) {
  const key = req.headers.get('x-eco-internal-key')
  if (!key || key !== process.env.ECO_INTERNAL_KEY) {
    return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const campo = CAMPOS_PERMITIDOS.find(c => searchParams.get(c))
  if (!campo) return NextResponse.json({ error: 'nenhum campo de busca valido informado' }, { status: 400 })

  const { data, error } = await sb().from('eco_clientes').select('id, nome, tipo, modulos_liberados').eq(campo, searchParams.get(campo)!).maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ encontrado: false, modulos_liberados: [] })

  return NextResponse.json({ encontrado: true, ...data })
}
