import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { gerarRadarProduto, PRODUTOS_RADAR } from '@/lib/eco-radar'
import { ecoAutorizado } from '@/lib/ecoAuth'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET: ultimo radar salvo por produto (sem area = todos)
export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const produto = req.nextUrl.searchParams.get('produto')
  const db = sb()

  if (produto) {
    const { data, error } = await db.from('eco_radar_historico')
      .select('*').eq('produto', produto).order('criado_em', { ascending: false }).limit(1).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ultimo: data || null })
  }

  const produtos = Object.keys(PRODUTOS_RADAR)
  const resultados = await Promise.all(produtos.map(async p => {
    const { data } = await db.from('eco_radar_historico')
      .select('*').eq('produto', p).order('criado_em', { ascending: false }).limit(1).maybeSingle()
    return [p, data || null] as const
  }))
  return NextResponse.json({ ultimos: Object.fromEntries(resultados) })
}

// POST: gera radar novo para um produto
export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  try {
    const { produto } = await req.json()
    if (!PRODUTOS_RADAR[produto]) return NextResponse.json({ error: 'produto invalido' }, { status: 400 })

    const { radar, pesquisaWeb, nomeProduto } = await gerarRadarProduto(produto)

    const db = sb()
    await db.from('eco_radar_historico').insert({ produto, radar, pesquisa_web: pesquisaWeb, origem: 'manual' })

    return NextResponse.json({ radar, pesquisa_web: pesquisaWeb, produto: nomeProduto })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
