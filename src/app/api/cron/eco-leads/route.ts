import { NextRequest, NextResponse } from 'next/server'
import { PRODUTOS, gerarLeadsAutomaticos } from '@/lib/eco-leads-core'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

// Prospeccao diaria automatica da Central Administradora: roda 1 produto
// por dia (rotacionando ao longo da semana), sem precisar clicar em
// "Buscar automaticamente" manualmente.
const ORDEM_PRODUTOS = Object.keys(PRODUTOS)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  }

  const diaDoAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const produto = ORDEM_PRODUTOS[diaDoAno % ORDEM_PRODUTOS.length]

  try {
    const gerados = await gerarLeadsAutomaticos(produto, 3)
    return NextResponse.json({ ok: true, produto, total: gerados.length })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
