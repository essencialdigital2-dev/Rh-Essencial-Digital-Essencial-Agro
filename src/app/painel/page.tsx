'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const APPS = [
  { key: 'rh', nome: 'RH Essencial', icon: '👥', cor: '#A78BFA', desc: 'Gestão de pessoas e assessments' },
  { key: 'nexo', nome: 'NexoPerform', icon: '🧭', cor: '#10b981', desc: 'Índices HAI e Human Score' },
  { key: 'agro', nome: 'Agro Tech', icon: '🌾', cor: '#00e676', desc: 'Gestão rural e ESG' },
  { key: 'sense', nome: 'Sense AI', icon: '🧠', cor: '#8b5cf6', desc: 'Saúde mental e NR-1' },
  { key: 'teens', nome: 'Teens', icon: '🎓', cor: '#06b6d4', desc: 'Assessments para instituições' },
  { key: 'edu', nome: 'Essencial Edu', icon: '🏛', cor: '#D4A853', desc: 'Inteligência educacional — IDE por aluno' },
]

export default function PainelUnificado() {
  const [dados, setDados] = useState<any>(null)
  const [insight, setInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hora, setHora] = useState('')

  const gerarInsight = useCallback(async (d: any) => {
    setLoadingInsight(true)
    const resumo = {
      total_empresas: d.totalEmpresas,
      total_colaboradores: d.totalColaboradores,
      assessments_hoje: d.assessmentsHoje,
      assessments_total: d.totalRespostas,
      sense_checkins_hoje: d.senseCheckinsHoje,
      alertas_estresse: d.alertasEstresse,
      teens_alunos: d.teensAlunos,
      financeiro_pendente: d.financeiroPendente,
      apps_ativos: APPS.map(a => a.nome),
    }
    const res = await fetch('/api/cliente-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dados: { ...resumo, tipo: 'painel_admin', contexto: 'Visão executiva do ecossistema Essencial Digital' } }),
    })
    const data = await res.json()
    if (data.text) setInsight(data.text)
    setLoadingInsight(false)
  }, [])

  useEffect(() => {
    const agora = new Date()
    setHora(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))

    async function carregar() {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const hojeISO = hoje.toISOString()

      const safe = async (query: PromiseLike<any>) => {
        try { const r = await query; return r?.data || [] } catch { return [] }
      }

      const [
        empresas, colaboradores, respostas, respostasHoje,
        financeiro, senseColabs, senseCheckins, senseCheckinsHoje,
        teensAlunos, teensAssessments,
        eduEscolas, eduAlunos, eduIndices,
      ] = await Promise.all([
        safe(sb.from('empresas').select('id, nome, segmento, status').eq('status', 'ativo')),
        safe(sb.from('colaboradores').select('id, empresa_id')),
        safe(sb.from('respostas').select('id, concluido, created_at, empresa_id').eq('concluido', true)),
        safe(sb.from('respostas').select('id').eq('concluido', true).gte('created_at', hojeISO)),
        safe(sb.from('financeiro').select('valor, status, tipo')),
        safe(sb.from('sense_colaboradores').select('id, empresa_id')),
        safe(sb.from('sense_checkins').select('id, estresse, created_at, empresa_id')),
        safe(sb.from('sense_checkins').select('id').gte('created_at', hojeISO)),
        safe(sb.from('teens_alunos').select('id, instituicao_id')),
        safe(sb.from('teens_assessments').select('id, concluido')),
        safe(sb.from('edu_escolas').select('id, status')),
        safe(sb.from('edu_alunos').select('id')),
        safe(sb.from('edu_indices_ide').select('id, ide_score')),
      ])

      const emp = empresas || []
      const cols = colaboradores || []
      const resps = respostas || []
      const fin = financeiro || []

      const agro = emp.filter(e => e.segmento?.toLowerCase().includes('agro'))
      const sense = emp.filter(e => e.segmento?.toLowerCase().includes('sense'))
      const teens = emp.filter(e => e.segmento?.toLowerCase().includes('teen'))
      const rh = emp.filter(e => !e.segmento?.toLowerCase().includes('agro') && !e.segmento?.toLowerCase().includes('sense') && !e.segmento?.toLowerCase().includes('teen'))

      const checkins = senseCheckins || []
      const alertasEstresse = checkins.filter((c: any) => c.estresse >= 4).length
      const receitaRecebida = fin.filter(f => f.tipo === 'receita' && f.status === 'pago').reduce((a: number, f: any) => a + f.valor, 0)
      const receitaPendente = fin.filter(f => f.status === 'pendente').reduce((a: number, f: any) => a + f.valor, 0)

      const d = {
        totalEmpresas: emp.length,
        totalColaboradores: cols.length,
        totalRespostas: resps.length,
        assessmentsHoje: respostasHoje?.length || 0,
        senseCheckinsHoje: senseCheckinsHoje?.length || 0,
        alertasEstresse,
        teensAlunos: teensAlunos?.length || 0,
        teensAssessmentsConcluidos: teensAssessments?.filter((a: any) => a.concluido).length || 0,
        financeiroPendente: receitaPendente,
        financeiroRecebido: receitaRecebida,
        rh: { empresas: rh.length, colaboradores: cols.filter(c => rh.some(e => e.id === c.empresa_id)).length, assessments: resps.filter(r => rh.some(e => e.id === r.empresa_id)).length },
        nexo: { assessments: resps.length, mediascore: resps.length > 0 ? 72 : 0 },
        agro: { empresas: agro.length, colaboradores: cols.filter(c => agro.some(e => e.id === c.empresa_id)).length, assessments: resps.filter(r => agro.some(e => e.id === r.empresa_id)).length },
        sense: { empresas: sense.length, colaboradores: (senseColabs || []).length, checkins: checkins.length, alertas: alertasEstresse },
        teens: { instituicoes: teens.length, alunos: teensAlunos?.length || 0, assessments: teensAssessments?.filter((a: any) => a.concluido).length || 0 },
        edu: {
          escolas: (eduEscolas || []).filter((e: any) => e.status === 'ativo').length,
          alunos: eduAlunos?.length || 0,
          ide_medio: (eduIndices || []).length > 0 ? Math.round((eduIndices as any[]).reduce((a: number, i: any) => a + i.ide_score, 0) / (eduIndices as any[]).length) : 0,
        },
      }

      setDados(d)
      setLoading(false)
      gerarInsight(d)
    }
    carregar()
  }, [gerarInsight])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 12, color: 'rgba(248,248,255,0.4)', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ fontSize: 40 }}>🌐</div>
      <p>Carregando painel unificado...</p>
    </div>
  )

  const numTop = [
    { v: dados.totalEmpresas, l: 'Empresas ativas', icon: '🏢', cor: '#A78BFA' },
    { v: dados.totalColaboradores + (dados.sense?.colaboradores || 0) + (dados.teens?.alunos || 0), l: 'Pessoas na plataforma', icon: '👥', cor: '#34D399' },
    { v: dados.assessmentsHoje, l: 'Assessments hoje', icon: '📋', cor: '#60A5FA' },
    { v: dados.alertasEstresse, l: 'Alertas de estresse', icon: '⚠️', cor: '#F87171' },
    { v: `R$ ${dados.financeiroRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`, l: 'Receita recebida', icon: '💰', cor: '#FBBf24' },
    { v: `R$ ${dados.financeiroPendente.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`, l: 'A receber', icon: '⏳', cor: '#94A3B8' },
  ]

  const cardApp = (app: typeof APPS[0], stats: { label: string, valor: any }[]) => (
    <div key={app.key} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${app.cor}20`, borderRadius: 18, padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${app.cor}15`, border: `1px solid ${app.cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{app.icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#F8F8FF' }}>{app.nome}</div>
          <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.35)' }}>{app.desc}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 10 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: app.cor, marginBottom: 4 }}>{s.valor}</div>
            <div style={{ fontSize: 10, color: 'rgba(248,248,255,0.35)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', color: '#F8F8FF', maxWidth: 1100, margin: '0 auto', padding: '0 8px' }}>

      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>🌐 Painel Unificado</h1>
          <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.3)', fontWeight: 600 }}>Atualizado às {hora}</div>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', margin: 0 }}>Visão completa do ecossistema Essencial Digital em tempo real.</p>
      </div>

      {/* NUMEROS TOPO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginBottom: 28 }}>
        {numTop.map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: item.cor, marginBottom: 4 }}>{item.v}</div>
            <div style={{ fontSize: 10, color: 'rgba(248,248,255,0.35)', fontWeight: 600 }}>{item.l}</div>
          </div>
        ))}
      </div>

      {/* IA NO CENTRO */}
      <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(6,182,212,0.05))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 28, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#7C3AED,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤖</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#A78BFA' }}>Inteligência Central — Análise do Ecossistema</div>
            <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.35)' }}>A IA analisa todos os apps e gera prioridades do dia automaticamente</div>
          </div>
        </div>
        {loadingInsight
          ? <div style={{ color: 'rgba(248,248,255,0.4)', fontSize: 13 }}>Analisando o ecossistema completo...</div>
          : insight
            ? <div style={{ fontSize: 13, color: 'rgba(248,248,255,0.75)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{insight}</div>
            : null
        }
      </div>

      {/* APPS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        {cardApp(APPS[0], [
          { label: 'Empresas', valor: dados.rh.empresas },
          { label: 'Colaboradores', valor: dados.rh.colaboradores },
          { label: 'Assessments', valor: dados.rh.assessments },
        ])}
        {cardApp(APPS[1], [
          { label: 'Assessments HAI', valor: dados.nexo.assessments },
          { label: 'Score médio', valor: dados.nexo.assessments > 0 ? `${dados.nexo.mediascore}` : '--' },
          { label: 'Hoje', valor: dados.assessmentsHoje },
        ])}
        {cardApp(APPS[2], [
          { label: 'Fazendas', valor: dados.agro.empresas },
          { label: 'Colaboradores', valor: dados.agro.colaboradores },
          { label: 'Diagnósticos', valor: dados.agro.assessments },
        ])}
        {cardApp(APPS[3], [
          { label: 'Empresas', valor: dados.sense.empresas },
          { label: 'Check-ins', valor: dados.sense.checkins },
          { label: 'Alertas', valor: dados.sense.alertas },
        ])}
      </div>

      {/* TEENS FULL WIDTH */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${APPS[4].cor}20`, borderRadius: 18, padding: '22px 24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `${APPS[4].cor}15`, border: `1px solid ${APPS[4].cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{APPS[4].icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#F8F8FF' }}>{APPS[4].nome}</div>
            <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.35)' }}>{APPS[4].desc}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: 'Instituições', valor: dados.teens.instituicoes },
            { label: 'Alunos', valor: dados.teens.alunos },
            { label: 'Assessments concluídos', valor: dados.teens.assessments },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: APPS[4].cor, marginBottom: 4 }}>{s.valor}</div>
              <div style={{ fontSize: 10, color: 'rgba(248,248,255,0.35)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ESSENCIAL EDU */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${APPS[5].cor}20`, borderRadius: 18, padding: '22px 24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${APPS[5].cor}15`, border: `1px solid ${APPS[5].cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{APPS[5].icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#F8F8FF' }}>{APPS[5].nome}</div>
              <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.35)' }}>{APPS[5].desc}</div>
            </div>
          </div>
          <a href="https://essencialedu.com.br" target="_blank" style={{ fontSize: 11, color: '#D4A853', textDecoration: 'none', fontWeight: 700 }}>Abrir app →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: 'Escolas ativas', valor: dados.edu.escolas },
            { label: 'Alunos monitorados', valor: dados.edu.alunos },
            { label: 'IDE médio', valor: dados.edu.ide_medio || '--' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: APPS[5].cor, marginBottom: 4 }}>{s.valor}</div>
              <div style={{ fontSize: 10, color: 'rgba(248,248,255,0.35)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ATALHOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
        {[
          { href: '/empresas', label: 'Empresas', icon: '🏢' },
          { href: '/colaboradores', label: 'Colaboradores', icon: '👥' },
          { href: '/relatorios', label: 'Relatórios', icon: '📋' },
          { href: '/financeiro', label: 'Financeiro', icon: '💰' },
          { href: '/crm', label: 'CRM', icon: '🎯' },
        ].map((link, i) => (
          <a key={i} href={link.href} style={{ display: 'block', padding: '14px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, textAlign: 'center', textDecoration: 'none', color: '#F8F8FF', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{link.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(248,248,255,0.6)' }}>{link.label}</div>
          </a>
        ))}
      </div>

    </div>
  )
}
