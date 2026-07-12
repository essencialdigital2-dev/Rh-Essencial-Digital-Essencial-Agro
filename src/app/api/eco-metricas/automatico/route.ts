import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function calcular(clientes: any[]) {
  const hoje = new Date()
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

  const ativosPagantes = clientes.filter(c => c.status !== 'cancelado' && !c.trial && Number(c.valor_mensal) > 0)
  const mrr = ativosPagantes.reduce((s, c) => s + Number(c.valor_mensal || 0), 0)
  const clientesAtivos = clientes.filter(c => c.status !== 'cancelado').length
  const trials = clientes.filter(c => c.trial && c.status !== 'cancelado').length
  const novosClientes = clientes.filter(c => new Date(c.criado_em) >= inicioMes).length
  const clientesPerdidos = clientes.filter(c => c.status === 'cancelado' && c.cancelado_em && new Date(c.cancelado_em) >= inicioMes).length

  return { mrr, clientes_ativos: clientesAtivos, clientes_pagantes: ativosPagantes.length, trials, novos_clientes: novosClientes, clientes_perdidos: clientesPerdidos }
}

// NRR real: compara a receita ATUAL da mesma base de clientes que existia
// no snapshot do mes anterior (expansao, contracao e churn refletidos —
// clientes cancelados entram com valor_mensal = 0). Sem pelo menos 1
// snapshot anterior (grava-se no dia 1 de cada mes via cron), retorna null.
async function calcularNRR(clientesAtuais: any[]) {
  const hoje = new Date()
  const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
  const mesAnteriorStr = `${mesAnterior.getFullYear()}-${String(mesAnterior.getMonth() + 1).padStart(2, '0')}-01`

  const { data: snapshot } = await sb().from('eco_mrr_snapshot').select('cliente_id, valor_mensal').eq('mes', mesAnteriorStr)
  if (!snapshot || snapshot.length === 0) return null

  const mapaAtual = new Map(clientesAtuais.map(c => [c.id, c]))
  let receitaInicio = 0
  let receitaAtual = 0
  for (const s of snapshot) {
    receitaInicio += Number(s.valor_mensal || 0)
    const clienteAtual = mapaAtual.get(s.cliente_id)
    const cancelado = !clienteAtual || clienteAtual.status === 'cancelado'
    receitaAtual += cancelado ? 0 : Number(clienteAtual.valor_mensal || 0)
  }
  if (receitaInicio === 0) return null
  return { nrr: Number(((receitaAtual / receitaInicio) * 100).toFixed(1)), receita_inicio: receitaInicio, receita_atual: receitaAtual, clientes_na_base: snapshot.length, mes_base: mesAnteriorStr }
}

export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })

  const { data: clientes, error } = await sb().from('eco_clientes').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const atual = calcular(clientes || [])
  const nrr = await calcularNRR(clientes || [])

  const { data: historico } = await sb().from('eco_metricas_mensais').select('*').order('mes', { ascending: false }).limit(3)

  let narrativa = ''
  try {
    const prompt = `Voce e um analista financeiro pra uma startup de tecnologia (5 produtos: educacao, empresas e agro). Dados atuais calculados automaticamente:
- MRR atual: R$ ${atual.mrr}
- Clientes pagantes: ${atual.clientes_pagantes}
- Clientes ativos (incluindo trial): ${atual.clientes_ativos}
- Trials em andamento: ${atual.trials}
- Novos clientes este mes: ${atual.novos_clientes}
- Clientes perdidos este mes: ${atual.clientes_perdidos}
- NRR (Net Revenue Retention): ${nrr ? nrr.nrr + '% (base de ' + nrr.clientes_na_base + ' clientes desde ' + nrr.mes_base + ')' : 'ainda sem dado suficiente (precisa de pelo menos 1 mes de historico)'}

Historico dos ultimos meses (registrado manualmente antes): ${JSON.stringify(historico || [])}

Escreva uma leitura curta (3-4 frases) do momento financeiro atual, direto e sem jargao, destacando o que mais merece atencao agora.`

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    )
    const d = await r.json()
    narrativa = d.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  } catch {}

  return NextResponse.json({ ok: true, ...atual, nrr, narrativa })
}
