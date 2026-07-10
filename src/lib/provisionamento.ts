import { createClient } from '@supabase/supabase-js'

export function gerarSenhaTemp() {
  return 'Sense@' + Math.random().toString(36).slice(2, 8)
}

export async function provisionarAcessoSense(nome: string, email: string, senha: string) {
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

export async function provisionarAcessoEstudo(nome: string, email: string, senha: string) {
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

export async function provisionarAcessoEdu(nome: string, email: string, senha: string) {
  try {
    const res = await fetch('https://essencial-edu.vercel.app/api/eco-provisionar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-eco-internal-key': process.env.ECO_INTERNAL_KEY || '' },
      body: JSON.stringify({ nome, email, senha }),
    })
    const json = await res.json()
    return !!json.ok
  } catch {
    return false
  }
}

export const MODULOS_AUTOCADASTRO = ['sense', 'estudo', 'teens', 'edu']

export async function provisionarModulos(nome: string, email: string, senha: string, modulos: string[]) {
  let algumProvisionado = false
  if (modulos.includes('sense')) {
    algumProvisionado = (await provisionarAcessoSense(nome, email, senha)) || algumProvisionado
  }
  if (modulos.includes('estudo') || modulos.includes('teens')) {
    algumProvisionado = (await provisionarAcessoEstudo(nome, email, senha)) || algumProvisionado
  }
  if (modulos.includes('edu')) {
    algumProvisionado = (await provisionarAcessoEdu(nome, email, senha)) || algumProvisionado
  }
  return algumProvisionado
}
