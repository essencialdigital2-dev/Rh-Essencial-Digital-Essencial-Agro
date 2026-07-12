import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const APPS_MONITORADOS = [
  { key: 'edu', nome: 'Essencial Edu', url: 'https://essencial-edu.vercel.app' },
  { key: 'nexo', nome: 'NexoPerform', url: 'https://nexoperform.vercel.app' },
  { key: 'agro', nome: 'Essencial Agro Tech', url: 'https://agrotech.rhessencialdigital.com.br' },
  { key: 'sense', nome: 'Sense AI / RH Essencial', url: 'https://rhessencialdigital.com.br' },
  { key: 'estudo', nome: 'Essencial Estudo', url: 'https://essencialestudo.com.br/estudo' },
  { key: 'med', nome: 'Essencial Med', url: 'https://essencialestudo.com.br/med' },
  { key: 'juridico', nome: 'Essencial Jurídico', url: 'https://essencialestudo.com.br/juridico' },
  { key: 'teens', nome: 'Essencial Teens', url: 'https://essencialestudo.com.br/teens' },
]

const APPS_PREDITIVOS = [
  { key: 'estudo', nome: 'Essencial Estudo', url: 'https://essencialestudo.com.br/api/predicao-resumo' },
  { key: 'agro', nome: 'Essencial Agro Tech', url: 'https://agrotech.rhessencialdigital.com.br/api/predicao-resumo' },
  { key: 'nexo', nome: 'NexoPerform', url: 'https://nexoperform.vercel.app/api/predicao-resumo' },
]

async function buscarResumoPreditivo(app: typeof APPS_PREDITIVOS[0]) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(app.url, { headers: { 'x-eco-internal-key': process.env.ECO_INTERNAL_KEY || '' }, signal: controller.signal, cache: 'no-store' })
    clearTimeout(timeout)
    if (!res.ok) return { nome: app.nome, ok: false }
    const data = await res.json()
    return { ...data, nome: app.nome, ok: true }
  } catch {
    return { nome: app.nome, ok: false }
  }
}

async function checarApp(app: typeof APPS_MONITORADOS[0]) {
  const inicio = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(app.url, { method: 'GET', redirect: 'follow', signal: controller.signal, cache: 'no-store' })
    clearTimeout(timeout)
    return { nome: app.nome, ok: res.status >= 200 && res.status < 400, status: res.status, latencia_ms: Date.now() - inicio }
  } catch (e: unknown) {
    return { nome: app.nome, ok: false, status: 0, latencia_ms: Date.now() - inicio, erro: e instanceof Error ? e.message : String(e) }
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const db = sb()

  // 1. Saude dos apps
  const statusApps = await Promise.all(APPS_MONITORADOS.map(checarApp))
  const comFalha = statusApps.filter(a => !a.ok)

  // 2. Leads quentes aguardando follow-up
  const { data: leads } = await db.from('edu_leads_maquina')
    .select('nome, instituicao, produto, status, temperatura, score, criado_em')
    .order('criado_em', { ascending: false }).limit(50)
  const leadsQuentes = (leads || []).filter(l => l.temperatura === 'quente' && !['ganhou', 'perdeu'].includes(l.status))

  // 3. Radares de inovacao mais recentes (ultimos 7 dias)
  const seteDiasAtras = new Date(Date.now() - 7 * 86400000).toISOString()
  const { data: radares } = await db.from('eco_radar_historico')
    .select('produto, radar, criado_em').gte('criado_em', seteDiasAtras).order('criado_em', { ascending: false })

  // 4. Alertas criticos de alunos no Essencial Edu (mesmo projeto Supabase)
  const { data: alertasEdu } = await db.from('edu_alertas')
    .select('tipo, severidade, desfecho, criado_em')
    .eq('severidade', 'alta')
    .is('desfecho', null)
    .order('criado_em', { ascending: false })
    .limit(20)
  const alertasCriticosEdu = alertasEdu || []

  // 5. Resumo preditivo do Estudo, Agro Tech e NexoPerform (Edu ja vem dos alertas acima; Sense AI e local)
  const [predEstudo, predAgro, predNexo] = await Promise.all([
    buscarResumoPreditivo(APPS_PREDITIVOS[0]),
    buscarResumoPreditivo(APPS_PREDITIVOS[1]),
    buscarResumoPreditivo(APPS_PREDITIVOS[2]),
  ])

  // 6. Queda de resultados: MRR atual vs NRR real (mesma logica de eco-metricas/automatico)
  const { data: clientes } = await db.from('eco_clientes').select('id, valor_mensal, status, criado_em, cancelado_em')
  const ativosPagantes = (clientes || []).filter(c => c.status !== 'cancelado' && Number(c.valor_mensal) > 0)
  const mrrAtual = ativosPagantes.reduce((s, c) => s + Number(c.valor_mensal || 0), 0)
  const hoje = new Date()
  const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
  const mesAnteriorStr = `${mesAnterior.getFullYear()}-${String(mesAnterior.getMonth() + 1).padStart(2, '0')}-01`
  const { data: snapshotAnterior } = await db.from('eco_mrr_snapshot').select('cliente_id, valor_mensal').eq('mes', mesAnteriorStr)
  let nrrAtual: number | null = null
  if (snapshotAnterior && snapshotAnterior.length > 0) {
    const mapaClientes = new Map((clientes || []).map(c => [c.id, c]))
    let receitaInicio = 0, receitaAtualBase = 0
    for (const s of snapshotAnterior) {
      receitaInicio += Number(s.valor_mensal || 0)
      const c = mapaClientes.get(s.cliente_id)
      receitaAtualBase += (!c || c.status === 'cancelado') ? 0 : Number(c.valor_mensal || 0)
    }
    if (receitaInicio > 0) nrrAtual = Math.round((receitaAtualBase / receitaInicio) * 1000) / 10
  }

  // 7. Queda de cultura organizacional: media das notas mais recentes dos pulsos vs media geral, por empresa
  const { data: pulsos } = await db.from('pulsos_cultura').select('empresa_id, nota, criado_em').order('criado_em', { ascending: true }).limit(500)
  let culturaResumo = 'nenhum pulso de cultura coletado ainda'
  if (pulsos && pulsos.length >= 5) {
    const mediaGeral = pulsos.reduce((s, p) => s + p.nota, 0) / pulsos.length
    const recentes = pulsos.slice(-15)
    const mediaRecente = recentes.reduce((s, p) => s + p.nota, 0) / recentes.length
    const variacao = Math.round((mediaRecente - mediaGeral) * 10) / 10
    culturaResumo = `media geral ${mediaGeral.toFixed(1)}/5, media dos pulsos recentes ${mediaRecente.toFixed(1)}/5 (variacao ${variacao >= 0 ? '+' : ''}${variacao}) — ${pulsos.length} pulsos no total`
  }
  const { data: esgRecente } = await db.from('esg_social_historico').select('score_esg_social').order('semana', { ascending: false }).limit(50)
  const esgMedio = esgRecente?.length ? Math.round(esgRecente.reduce((s, r) => s + r.score_esg_social, 0) / esgRecente.length) : null

  // 6. IA junta tudo num briefing unico
  const resumoStatus = statusApps.map(a => `${a.nome}: ${a.ok ? 'OK' : 'FALHA'} (${a.status}, ${a.latencia_ms}ms)`).join('\n')
  const resumoLeads = leadsQuentes.slice(0, 10).map(l => `${l.instituicao || l.nome} (${l.produto}) — score ${l.score ?? '?'}`).join('\n') || 'nenhum lead quente no momento'
  const resumoRadares = (radares || []).slice(0, 5).map((r: any) => `${r.produto}: ${r.radar?.aposta_do_conselheiro || r.radar?.resumo_mercado || ''}`).join('\n') || 'nenhum radar novo nos ultimos 7 dias'
  const resumoAlertasEdu = alertasCriticosEdu.length
    ? `${alertasCriticosEdu.length} alertas criticos de alunos sem desfecho no Essencial Edu (tipos: ${Array.from(new Set(alertasCriticosEdu.map(a => a.tipo))).join(', ')})`
    : 'nenhum alerta critico pendente de alunos no Essencial Edu'
  const resumoPreditivo = `Essencial Estudo: ${predEstudo.ok ? `${predEstudo.taxa_engajamento_recomendacoes ?? 'sem dado'}% engajamento com recomendacoes da IA, ${predEstudo.alunos_tendencia_caindo} alunos em queda` : 'indisponivel'}\nEssencial Agro Tech: ${predAgro.ok ? `taxa de acerto do modelo ${predAgro.taxa_acerto ?? 'sem historico'}%, ${predAgro.alertas_criticos_abertos} alertas criticos abertos` : 'indisponivel'}\nEssencial Sense AI: ESG Social medio ${esgMedio ?? 'sem dado'}/100\nNexoPerform: ${predNexo.ok ? `${predNexo.assessments_semana_atual} assessments essa semana vs ${predNexo.assessments_semana_anterior} semana passada (variacao ${predNexo.variacao_percentual !== null ? predNexo.variacao_percentual + '%' : 'sem dado'}), ${predNexo.empresas_pagantes} empresas pagantes` : 'indisponivel'}`

  const resumoResultados = `MRR atual: R$ ${mrrAtual.toLocaleString('pt-BR')} (${ativosPagantes.length} clientes pagantes). NRR: ${nrrAtual !== null ? nrrAtual + '%' : 'sem dado suficiente ainda (precisa de 1 mes de historico)'}`

  const prompt = `Voce e a assessora executiva da fundadora da Essencial Digital. Gere o briefing diario do ecossistema completo (8 produtos). Sem travessoes, acentuacao correta, direto ao ponto, tom de quem cuida de tudo pra ela nao precisar se preocupar.

SAUDE DOS APPS (erros e indisponibilidade):
${resumoStatus}

LEADS QUENTES (top 10):
${resumoLeads}

RADARES DE INOVACAO RECENTES (ultimos 7 dias):
${resumoRadares}

ALERTAS CRITICOS DE ALUNOS (Essencial Edu):
${resumoAlertasEdu}

RADAR PREDITIVO CONSOLIDADO (Estudo, Agro Tech, Sense AI, NexoPerform):
${resumoPreditivo}

QUEDA DE RESULTADOS (receita real):
${resumoResultados}

QUEDA DE CULTURA ORGANIZACIONAL (pulsos dos colaboradores das empresas clientes):
${culturaResumo}

Retorne APENAS JSON valido:
{
  "manchete": "resumo do dia em 1 frase",
  "saude_geral": "ok" | "atencao" | "critico",
  "prioridade_do_dia": "a UNICA coisa mais importante pra fundadora fazer hoje",
  "destaques": ["ate 3 pontos positivos ou oportunidades"],
  "alertas": ["ate 3 pontos que precisam de atencao — vazio se nada"],
  "mensagem_final": "1 frase de fechamento, tom acolhedor"
}`

  const g = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
  )
  const gd = await g.json()
  const raw = gd.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  let briefing
  try {
    briefing = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim())
  } catch {
    return NextResponse.json({ error: 'falha ao gerar briefing', raw }, { status: 500 })
  }

  await db.from('eco_briefing_historico').insert({ briefing, alertas_criticos_edu: alertasCriticosEdu.length })

  // 5. Envia por e-mail
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const corSaude = briefing.saude_geral === 'critico' ? '#F87171' : briefing.saude_geral === 'atencao' ? '#F0C36D' : '#34D399'
    await resend.emails.send({
      from: 'Ecossistema Essencial <noreply@essencialestudo.com.br>',
      to: 'essencialdigital2@gmail.com',
      subject: `🌐 Briefing do Ecossistema — ${briefing.manchete}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#08080f;color:#f8f8ff;padding:32px;border-radius:16px;">
        <div style="font-size:11px;color:${corSaude};font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Saude geral: ${briefing.saude_geral}</div>
        <h2 style="margin:0 0 16px;">${briefing.manchete}</h2>
        <p style="color:rgba(248,248,255,.7);font-size:14px;line-height:1.6;"><b>Prioridade de hoje:</b> ${briefing.prioridade_do_dia}</p>
        ${briefing.destaques?.length ? `<p style="color:#34D399;font-size:13px;"><b>Destaques:</b><br>${briefing.destaques.join('<br>')}</p>` : ''}
        ${briefing.alertas?.length ? `<p style="color:#F87171;font-size:13px;"><b>Alertas:</b><br>${briefing.alertas.join('<br>')}</p>` : ''}
        <p style="color:rgba(248,248,255,.5);font-size:13px;font-style:italic;">${briefing.mensagem_final}</p>
        <a href="https://rhessencialdigital.com.br/ecossistema" style="display:block;text-align:center;background:linear-gradient(135deg,#7C3AED,#06b6d4);color:#fff;text-decoration:none;padding:12px;border-radius:10px;margin-top:20px;font-weight:700;">Ver Ecossistema completo →</a>
      </div>`,
    })
  } catch { /* email é conveniencia, nao bloqueia o cron */ }

  return NextResponse.json({ ok: true, briefing, apps_com_falha: comFalha.length, leads_quentes: leadsQuentes.length, alertas_criticos_edu: alertasCriticosEdu.length })
}

