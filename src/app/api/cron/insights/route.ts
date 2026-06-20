import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Groq from 'groq-sdk'

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY! })

// Chamado toda segunda-feira as 7h via cron do Vercel (vercel.json)
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const sb = getSupabase()

  // Busca todos os tenants ativos
  const { data: empresas, error: errEmpresas } = await sb
    .from('empresas')
    .select('id, nome, setor, porte')
    .eq('status', 'ativo')

  if (errEmpresas || !empresas?.length) {
    return NextResponse.json({ ok: false, msg: 'Nenhuma empresa ativa' })
  }

  const resultados: { empresa_id: string; status: string; insights?: number }[] = []

  for (const empresa of empresas) {
    try {
      // Busca historico ISHO das ultimas 8 semanas
      const { data: ishoRows } = await sb
        .from('isho_semanal')
        .select('semana, score, engajamento, relacionamentos, bem_estar, produtividade, crescimento, proposito')
        .eq('empresa_id', empresa.id)
        .order('semana', { ascending: false })
        .limit(8)

      if (!ishoRows?.length) {
        resultados.push({ empresa_id: empresa.id, status: 'sem_dados' })
        continue
      }

      const ishoAtual = ishoRows[0].score
      const ishoAnterior = ishoRows[1]?.score ?? ishoAtual
      const delta = ishoAtual - ishoAnterior
      const historico = ishoRows.map(r => r.score).reverse()

      // Busca alertas de colaboradores (check-ins com score baixo)
      const { data: alertas } = await sb
        .from('health_checkins')
        .select('colaborador_id, humor, energia, foco, stresse')
        .eq('empresa_id', empresa.id)
        .gte('criado_em', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
        .lte('humor', 2)

      // Busca benchmark do setor (media de empresas do mesmo setor)
      const { data: benchmark } = await sb
        .from('isho_semanal')
        .select('score, empresas!inner(setor)')
        .eq('empresas.setor', empresa.setor ?? 'geral')
        .order('semana', { ascending: false })
        .limit(50)

      const mediaBenchmark = benchmark?.length
        ? Math.round(benchmark.reduce((s, r) => s + r.score, 0) / benchmark.length)
        : 61

      // Gera insights via IA
      const prompt = buildInsightPrompt({
        empresa: empresa.nome,
        setor: empresa.setor,
        porte: empresa.porte,
        ishoAtual,
        ishoAnterior,
        delta,
        historico,
        colaboradoresEmAlerta: alertas?.length ?? 0,
        mediaBenchmark
      })

      const groq = getGroq()
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })

      const raw = completion.choices[0]?.message?.content ?? ''
      let insights: InsightGerado[] = []
      try {
        const match = raw.match(/\[[\s\S]*\]/)
        if (match) insights = JSON.parse(match[0])
      } catch {
        insights = buildInsightsFallback({ ishoAtual, delta, colaboradoresEmAlerta: alertas?.length ?? 0, mediaBenchmark })
      }

      // Salva insights no banco
      const { error: errInsert } = await sb
        .from('insights_semanais')
        .upsert({
          empresa_id: empresa.id,
          semana: new Date().toISOString().split('T')[0],
          isho_atual: ishoAtual,
          isho_anterior: ishoAnterior,
          delta,
          insights: insights,
          gerado_em: new Date().toISOString()
        }, { onConflict: 'empresa_id,semana' })

      if (errInsert) throw new Error(errInsert.message)

      // Envia push notification para gestores da empresa
      const { data: gestores } = await sb
        .from('profiles')
        .select('push_subscription')
        .eq('empresa_id', empresa.id)
        .in('role', ['admin', 'gestor'])
        .not('push_subscription', 'is', null)

      if (gestores?.length) {
        const pushPromises = gestores.map(g => {
          if (!g.push_subscription) return null
          return enviarPushInsight(g.push_subscription, {
            ishoAtual,
            delta,
            empresa: empresa.nome
          })
        }).filter(Boolean)
        await Promise.allSettled(pushPromises as Promise<void>[])
      }

      resultados.push({ empresa_id: empresa.id, status: 'ok', insights: insights.length })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'erro_desconhecido'
      resultados.push({ empresa_id: empresa.id, status: 'erro: ' + msg })
    }
  }

  return NextResponse.json({
    ok: true,
    processadas: resultados.length,
    semana: new Date().toISOString().split('T')[0],
    resultados
  })
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface InsightGerado {
  tipo: 'alerta' | 'tendencia' | 'oportunidade' | 'predicao' | 'benchmark'
  prioridade: number
  titulo: string
  contexto: string
  destaque: string
  acao: string
}

interface InsightParams {
  empresa: string
  setor: string | null
  porte: string | null
  ishoAtual: number
  ishoAnterior: number
  delta: number
  historico: number[]
  colaboradoresEmAlerta: number
  mediaBenchmark: number
}

// ─── Prompt ──────────────────────────────────────────────────────────────────

function buildInsightPrompt(p: InsightParams): string {
  const tendencia = p.historico.length >= 3
    ? p.historico.slice(-3).every((v, i, a) => i === 0 || v >= a[i-1]) ? 'crescimento consecutivo'
    : p.historico.slice(-3).every((v, i, a) => i === 0 || v <= a[i-1]) ? 'queda consecutiva'
    : 'oscilacao'
    : 'sem dados suficientes'

  return `Voce e um sistema de inteligência organizacional especializado em saude humana e performance.

Dados da empresa "${p.empresa}" (setor: ${p.setor ?? 'nao informado'}, porte: ${p.porte ?? 'nao informado'}):
- ISHO atual: ${p.ishoAtual}/100
- ISHO semana anterior: ${p.ishoAnterior}/100
- Variacao: ${p.delta > 0 ? '+' : ''}${p.delta} pontos
- Historico 8 semanas: ${p.historico.join(', ')}
- Tendencia recente: ${tendencia}
- Colaboradores com check-in critico (humor <= 2) nas ultimas 2 semanas: ${p.colaboradoresEmAlerta}
- ISHO medio do setor: ${p.mediaBenchmark}
- Posicao vs benchmark: ${p.ishoAtual > p.mediaBenchmark ? '+' : ''}${p.ishoAtual - p.mediaBenchmark} pts

Gere um array JSON com exatamente 5 insights estrategicos. Cada insight deve ser profundo, especifico e acionavel — nada generico.

Formato obrigatorio (retorne APENAS o array JSON, sem markdown):
[
  {
    "tipo": "alerta|tendencia|oportunidade|predicao|benchmark",
    "prioridade": 1,
    "titulo": "titulo conciso e impactante",
    "contexto": "analise profunda em 2-3 frases com dados especificos",
    "destaque": "dado chave em formato: valor · contexto · impacto",
    "acao": "acao concreta, especifica, com prazo implicito"
  }
]

Regras:
- Prioridade 1 = mais urgente
- Sempre inclua pelo menos 1 alerta, 1 tendencia, 1 oportunidade, 1 predicao
- Baseie as predicoes nos padroes do historico
- As acoes devem ser para esta semana ou esta quinzena
- Escreva em portugues brasileiro formal, sem travessoes (use dois-pontos)`
}

// ─── Fallback se IA falhar ────────────────────────────────────────────────────

function buildInsightsFallback(p: {
  ishoAtual: number
  delta: number
  colaboradoresEmAlerta: number
  mediaBenchmark: number
}): InsightGerado[] {
  const insights: InsightGerado[] = []

  if (p.colaboradoresEmAlerta > 0) {
    insights.push({
      tipo: 'alerta',
      prioridade: 1,
      titulo: `${p.colaboradoresEmAlerta} colaboradores com sinal de alerta emocional`,
      contexto: `Nos ultimos 14 dias, ${p.colaboradoresEmAlerta} colaboradores registraram check-ins com humor critico (nivel 1-2). Este padrao indica risco de queda de performance e possivel burnout.`,
      destaque: `${p.colaboradoresEmAlerta} alertas · Humor critico · Janela: 14 dias`,
      acao: 'Identifique os setores com maior concentracao de alertas e agende conversa com os lideres diretos esta semana.'
    })
  }

  insights.push({
    tipo: 'tendencia',
    prioridade: 2,
    titulo: p.delta >= 0 ? 'ISHO em trajetoria positiva' : 'ISHO em queda: atencao necessaria',
    contexto: `O Indice de Saude Humana Organizacional ${p.delta >= 0 ? 'subiu' : 'caiu'} ${Math.abs(p.delta)} pontos em relacao a semana anterior, chegando a ${p.ishoAtual}/100.`,
    destaque: `ISHO ${p.ishoAtual} · ${p.delta >= 0 ? '+' : ''}${p.delta} pts · vs semana anterior`,
    acao: p.delta >= 0 ? 'Identifique o que gerou a melhora e replique nas areas de menor indice.' : 'Mapeie os setores com maior queda e tome acao preventiva antes da proxima semana.'
  })

  insights.push({
    tipo: 'benchmark',
    prioridade: 3,
    titulo: `Empresa ${p.ishoAtual > p.mediaBenchmark ? 'acima' : 'abaixo'} da media do setor`,
    contexto: `O ISHO medio de empresas do mesmo setor e porte e ${p.mediaBenchmark}. Sua empresa esta em ${p.ishoAtual}, uma diferenca de ${Math.abs(p.ishoAtual - p.mediaBenchmark)} pontos.`,
    destaque: `ISHO ${p.ishoAtual} vs. ${p.mediaBenchmark} media setorial · ${p.ishoAtual > p.mediaBenchmark ? 'Acima' : 'Abaixo'} do mercado`,
    acao: p.ishoAtual > p.mediaBenchmark ? 'Use esse dado na atracao de talentos e no employer branding.' : 'Revise os pilares com menor pontuacao e priorize acoes de curto prazo.'
  })

  return insights
}

// ─── Push Notification ───────────────────────────────────────────────────────

async function enviarPushInsight(
  subscription: object,
  dados: { ishoAtual: number; delta: number; empresa: string }
): Promise<void> {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY
  if (!vapidPublic || !vapidPrivate) return

  const payload = JSON.stringify({
    title: 'Briefing semanal disponivel',
    body: `ISHO ${dados.ishoAtual}/100 ${dados.delta >= 0 ? '(+' + dados.delta + ' pts)' : '(' + dados.delta + ' pts)'}. Seus insights desta semana estao prontos.`,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    url: '/dashboard?panel=insights'
  })

  // Usa web-push dinamicamente para nao quebrar builds sem a lib instalada
  try {
    const webpush = await import('web-push')
    webpush.default.setVapidDetails(
      'mailto:essencialdigital2@gmail.com',
      vapidPublic,
      vapidPrivate
    )
    await webpush.default.sendNotification(subscription as Parameters<typeof webpush.default.sendNotification>[0], payload)
  } catch {
    // silencia — push e opcional, nao deve derrubar o cron
  }
}
