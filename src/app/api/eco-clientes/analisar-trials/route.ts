import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ecoAutorizado } from '@/lib/ecoAuth'

export const dynamic = 'force-dynamic'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// A IA olha todos os trials ativos (dias restantes + ultimo acesso) e
// sinaliza quais estao em risco de nao converter, pra fundadora saber
// onde focar a atencao antes do trial expirar.
export async function POST(req: NextRequest) {
  if (!ecoAutorizado(req)) return NextResponse.json({ error: 'nao autorizado' }, { status: 401 })

  const { data: trials, error } = await sb()
    .from('eco_clientes')
    .select('nome, tipo, modulos_liberados, trial_fim, ultimo_acesso')
    .eq('trial', true)
    .order('trial_fim', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!trials || trials.length === 0) {
    return NextResponse.json({ ok: true, sem_trials: true })
  }

  const agora = Date.now()
  const contexto = trials.map(t => {
    const diasRestantes = t.trial_fim ? Math.ceil((new Date(t.trial_fim).getTime() - agora) / 86400000) : null
    const horasSemAcesso = t.ultimo_acesso ? Math.round((agora - new Date(t.ultimo_acesso).getTime()) / 3600000) : null
    return `${t.nome} (${t.tipo}): ${diasRestantes !== null ? (diasRestantes > 0 ? `${diasRestantes} dias restantes` : 'trial expirado') : 'sem prazo'}, ${
      t.ultimo_acesso ? `ultimo acesso ha ${horasSemAcesso}h` : 'NUNCA acessou'
    }, modulos: ${(t.modulos_liberados || []).join(', ')}`
  }).join('\n')

  const prompt = `Voce e a assessora comercial da fundadora da Essencial Digital. Sem travessoes, acentuacao correta.

Aqui estao os trials de demonstracao ativos no momento:
${contexto}

Gere uma leitura curta e acionavel sobre o engajamento desses trials. Retorne APENAS JSON valido:
{
  "resumo": "sintese em 2-3 frases do panorama geral dos trials",
  "risco_alto": ["nomes das instituicoes/empresas que estao com trial acabando E nunca acessaram ou faz muito tempo que nao acessam, pede atencao urgente"],
  "indo_bem": ["nomes das que acessaram recentemente, sinal de engajamento real"],
  "acao_sugerida": "a UNICA acao mais importante pra fundadora fazer hoje em relacao aos trials"
}`

  try {
    const g = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    )
    const gd = await g.json()
    const raw = gd.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const analise = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
    return NextResponse.json({ ok: true, analise })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
