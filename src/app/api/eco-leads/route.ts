import { NextRequest, NextResponse } from 'next/server'
import { ecoAutorizado } from '@/lib/ecoAuth'
import { PRODUTOS, sbEcoLeads, pesquisarAlvo, gerarAbordagem, gerarLeadsAutomaticos } from '@/lib/eco-leads-core'

export const maxDuration = 300

// GET: lista de leads (todo o ecossistema, sem IA, carregamento rapido)
export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  try {
    const db = sbEcoLeads()
    const { data: leads } = await db.from('edu_leads_maquina').select('*').order('criado_em', { ascending: false }).limit(200)
    return NextResponse.json({ leads: leads || [] })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

// POST: gera abordagem personalizada + score preditivo de conversao via IA, e salva o lead
// Modo manual: { alvo, produto, contato } | Modo automatico: { produto, auto: true, quantidade? }
export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  try {
    const body = await req.json()
    const { produto } = body
    if (!produto || !PRODUTOS[produto]) {
      return NextResponse.json({ error: 'produto obrigatorio' }, { status: 400 })
    }
    const p = PRODUTOS[produto]
    const db = sbEcoLeads()

    if (body.auto) {
      const quantidade = Math.min(body.quantidade || 5, 10)
      const gerados = await gerarLeadsAutomaticos(produto, quantidade)
      if (!gerados.length) return NextResponse.json({ error: 'IA nao encontrou alvos reais agora. Tente de novo em instantes.' }, { status: 500 })
      return NextResponse.json({ ok: true, total: gerados.length, leads: gerados })
    }

    const { alvo, contato } = body
    if (!alvo) return NextResponse.json({ error: 'alvo obrigatorio' }, { status: 400 })

    const pesquisa = await pesquisarAlvo(alvo)
    const abordagem = await gerarAbordagem(p, alvo, contato, pesquisa)

    const { data: lead, error } = await db.from('edu_leads_maquina').insert({
      produto,
      nome: contato || alvo,
      instituicao: alvo,
      email: abordagem?.contatos_publicos?.email || null,
      telefone: abordagem?.contatos_publicos?.telefone || null,
      origem: 'ecossistema',
      score: abordagem?.score_preditivo ?? null,
      temperatura: abordagem?.temperatura ?? null,
      abordagem_ia: { ...abordagem, pesquisa },
      analise_ia: { resumo: abordagem?.justificativa_score || `Prospeccao: ${alvo}`, pesquisa_web: !!pesquisa },
      status: 'novo',
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, lead_id: lead.id, abordagem, pesquisa_encontrada: !!pesquisa })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
