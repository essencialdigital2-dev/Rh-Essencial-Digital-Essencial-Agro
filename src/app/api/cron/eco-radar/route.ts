import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { gerarRadarProduto, PRODUTOS_RADAR } from '@/lib/eco-radar'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Chamado automaticamente pelo Vercel Cron (ver vercel.json).
// Gera o radar de todos os produtos do ecossistema, sozinho, uma vez por semana.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const db = sb()
  const resultados: Record<string, string> = {}

  for (const produto of Object.keys(PRODUTOS_RADAR)) {
    try {
      const { radar, pesquisaWeb } = await gerarRadarProduto(produto)
      await db.from('eco_radar_historico').insert({ produto, radar, pesquisa_web: pesquisaWeb, origem: 'cron' })
      resultados[produto] = 'ok'
    } catch (err: unknown) {
      resultados[produto] = err instanceof Error ? err.message : String(err)
    }
  }

  return NextResponse.json({ ok: true, resultados })
}
