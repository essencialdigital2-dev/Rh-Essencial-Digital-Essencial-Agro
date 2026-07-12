import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { gerarSenhaTemp, provisionarModulos } from '@/lib/provisionamento'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Pacotes disponíveis pro formulário público de trial. Mesmo conteúdo de
// PACOTES em /ecossistema/clientes — mantidos sincronizados manualmente.
const PACOTES: Record<string, { modulos: string[]; tipo: 'instituicao' | 'empresa' }> = {
  educacional: { modulos: ['estudo', 'teens', 'sense', 'nexo'], tipo: 'instituicao' },
  agro: { modulos: ['agro', 'sense', 'nexo'], tipo: 'empresa' },
  agro_solo: { modulos: ['agro'], tipo: 'empresa' },
}

// Rota PÚBLICA (sem ecoAutorizado) — usada pelo formulário /quero-conhecer
// que qualquer lead pode preencher sozinho, sem precisar da Alana cadastrar
// manualmente no painel admin.
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { ok } = rateLimit(ip, 10, 3600_000)
  if (!ok) return NextResponse.json({ error: 'Muitas solicitações. Tente novamente mais tarde.' }, { status: 429 })

  const { nome, email, pacote, contato } = await req.json()
  if (!nome || !email || !pacote) return NextResponse.json({ error: 'nome, email e pacote são obrigatórios' }, { status: 400 })
  const p = PACOTES[pacote]
  if (!p) return NextResponse.json({ error: 'pacote inválido' }, { status: 400 })

  const trialFim = new Date(Date.now() + 7 * 86400000).toISOString()

  let senhaTemp: string | null = null
  let nexoCodigo: string | null = null
  const senha = gerarSenhaTemp()
  const resultado = await provisionarModulos(nome, email, senha, p.modulos)
  if (resultado.algumProvisionado) senhaTemp = senha
  nexoCodigo = resultado.nexoCodigo

  const { data, error } = await sb().from('eco_clientes').insert({
    nome, tipo: p.tipo,
    modulos_liberados: p.modulos,
    trial: true, trial_fim: trialFim,
    email, senha_temporaria: senhaTemp, nexo_codigo: nexoCodigo,
    observacoes: contato ? `Contato informado no formulário público: ${contato}` : 'Criado via formulário público de trial',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, portalId: data.id })
}
