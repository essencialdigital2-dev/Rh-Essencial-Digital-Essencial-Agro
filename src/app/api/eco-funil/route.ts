import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ORDEM_FUNIL = ['novo', 'contatado', 'reuniao', 'proposta', 'ganhou', 'perdeu']

// Funil real de vendas, calculado a partir dos leads que ja existem
// (edu_leads_maquina, compartilhado entre Edu e o ecossistema).
export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })

  const { data: leads } = await sb().from('edu_leads_maquina').select('produto, status, criado_em, atualizado_em')
  const todos = leads || []

  const porEtapa: Record<string, number> = {}
  for (const s of ORDEM_FUNIL) porEtapa[s] = todos.filter(l => l.status === s).length

  const totalValidos = todos.length
  const ganhos = porEtapa['ganhou'] || 0
  const perdidos = porEtapa['perdeu'] || 0
  const emAndamento = totalValidos - ganhos - perdidos
  const taxaConversaoGeral = totalValidos > 0 ? Math.round((ganhos / totalValidos) * 100) : 0

  const produtos = Array.from(new Set(todos.map(l => l.produto)))
  const porProduto = produtos.map(produto => {
    const doProduto = todos.filter(l => l.produto === produto)
    const g = doProduto.filter(l => l.status === 'ganhou').length
    return {
      produto,
      total: doProduto.length,
      ganhos: g,
      perdidos: doProduto.filter(l => l.status === 'perdeu').length,
      taxa_conversao: doProduto.length ? Math.round((g / doProduto.length) * 100) : 0,
    }
  }).sort((a, b) => b.total - a.total)

  return NextResponse.json({
    ok: true,
    funil: { por_etapa: porEtapa, total: totalValidos, ganhos, perdidos, em_andamento: emAndamento, taxa_conversao_geral: taxaConversaoGeral },
    por_produto: porProduto,
  })
}
