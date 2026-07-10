import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

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

function gerarSenhaTemp() {
  return 'Sense@' + Math.random().toString(36).slice(2, 8)
}

async function provisionarAcessoSense(nome: string, email: string, senha: string) {
  const admin = createClient(
    'https://feivfptwfbcftyhaypov.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: userData, error: userErr } = await admin.auth.admin.createUser({
    email, password: senha, email_confirm: true,
    user_metadata: { nome, empresa: nome, perfil: 'admin' },
  })
  if (userErr || !userData?.user) return false

  const { data: empresa, error: empresaErr } = await admin.from('sense_empresas').insert({
    nome_empresa: nome, usuario_id: userData.user.id, plano: 'trial', ativo: true,
  }).select().single()
  if (empresaErr || !empresa) return false

  await admin.from('sense_usuarios').upsert({
    id: userData.user.id, empresa_id: empresa.id, nome, email, perfil: 'admin',
  })

  try {
    await fetch('https://rhessencialdigital.com.br/api/email', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'convite_colaborador', to: email, nome, dados: { empresa: nome, senha } }),
    })
  } catch {}

  return true
}

async function provisionarAcessoEstudo(nome: string, email: string, senha: string) {
  try {
    const res = await fetch('https://essencialestudo.com.br/api/auth/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, password: senha }),
    })
    const json = await res.json()
    return !!json.ok
  } catch {
    return false
  }
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
  let algumProvisionado = false
  if (trial && email) {
    const senha = gerarSenhaTemp()
    if (modulos.includes('sense')) {
      algumProvisionado = (await provisionarAcessoSense(nome, email, senha)) || algumProvisionado
    }
    if (modulos.includes('estudo') || modulos.includes('teens')) {
      algumProvisionado = (await provisionarAcessoEstudo(nome, email, senha)) || algumProvisionado
    }
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
