import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'
import { gerarSenhaTemp, provisionarModulos } from '@/lib/provisionamento'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { data, error } = await sb().from('eco_clientes').select('*').order('criado_em', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, clientes: data || [] })
}

export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })
  const { nome, tipo, cnpj, cidade, estado, modulos_liberados, trial, trial_dias, email } = await req.json()
  if (!nome || !tipo) return NextResponse.json({ error: 'nome e tipo obrigatorios' }, { status: 400 })
  if (!['instituicao', 'empresa'].includes(tipo)) return NextResponse.json({ error: 'tipo invalido' }, { status: 400 })

  const trialFim = trial ? new Date(Date.now() + (trial_dias || 7) * 86400000).toISOString() : null
  const modulos: string[] = modulos_liberados || []

  // Mesma senha em todos os produtos que ja suportam criacao automatica —
  // Edu (precisa de escola ja cadastrada), NexoPerform e Agro Tech ainda
  // nao tem essa automacao e continuam exigindo cadastro manual.
  let senhaTemp: string | null = null
  if (trial && email) {
    const senha = gerarSenhaTemp()
    const algumProvisionado = await provisionarModulos(nome, email, senha, modulos)
    if (algumProvisionado) senhaTemp = senha
  }

  const { data, error } = await sb().from('eco_clientes').insert({
    nome, tipo, cnpj: cnpj || null, cidade: cidade || null, estado: estado || null,
    modulos_liberados: modulos,
    trial: !!trial, trial_fim: trialFim,
    email: email || null, senha_temporaria: senhaTemp,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, cliente: data })
}
