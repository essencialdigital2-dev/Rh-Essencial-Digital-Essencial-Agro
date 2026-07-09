'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const INDICES = [
  { sigla: 'DISC HAI', nome: 'Perfil Comportamental', cor: '#10b981', icone: '🎯', peso: 25 },
  { sigla: 'IHAL™', nome: 'Liderança Adaptativa', cor: '#0ea5e9', icone: '🧭', peso: 25 },
  { sigla: 'INT HAI', nome: 'Inteligência Adaptativa', cor: '#f59e0b', icone: '💡', peso: 20 },
  { sigla: 'BEM HAI', nome: 'Bem-Estar Relacional', cor: '#a78bfa', icone: '💚', peso: 30 },
  { sigla: 'FIT HAI', nome: 'Fit Cultural', cor: '#f97316', icone: '🌐', peso: 0 },
]

const MODULOS_AGRO = [
  { icon: '🛡️', titulo: 'NR-31', desc: 'Conformidade com norma do trabalho rural', cor: '#dc2626' },
  { icon: '📈', titulo: 'ESG', desc: 'Indicadores sociais e ambientais', cor: '#14532d' },
  { icon: '💊', titulo: 'Saúde Mental', desc: 'Risco psicossocial da equipe', cor: '#6d28d9' },
  { icon: '🔁', titulo: 'Sazonalidade', desc: 'Planejamento por ciclo da safra', cor: '#854d0e' },
]

const MODULOS_SENSE = [
  { icon: '💜', titulo: 'Check-in Emocional', desc: 'Humor, energia e estresse da equipe em tempo real', cor: '#8b5cf6' },
  { icon: '🧠', titulo: 'Diagnóstico NR-1', desc: 'Riscos psicossociais identificados e conformidade legal', cor: '#6d28d9' },
  { icon: '🔥', titulo: 'Risco de Burnout', desc: 'Colaboradores em zona de alerta identificados pela IA', cor: '#ec4899' },
  { icon: '📊', titulo: 'Relatório de Saúde Mental', desc: 'Visão consolidada do bem-estar da equipe', cor: '#06b6d4' },
]

function getClassificacao(s: number) {
  if (s >= 85) return { label: 'Referência', cor: '#10b981' }
  if (s >= 70) return { label: 'Destaque', cor: '#34d399' }
  if (s >= 55) return { label: 'Em Desenvolvimento', cor: '#f59e0b' }
  if (s >= 40) return { label: 'Atenção', cor: '#fb923c' }
  return { label: 'Risco', cor: '#ef4444' }
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return ''
  return document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='))?.split('=')[1] || ''
}

type Aba = 'dashboard' | 'equipe' | 'indices' | 'agro' | 'sense' | 'teens'

const VAZIO_COL = { nome: '', cargo: '', setor: '', email: '' }

export default function ClientePortal() {
  const router = useRouter()
  const [empresaId, setEmpresaId] = useState('')
  const [empresaNome, setEmpresaNome] = useState('')
  const [empresaSegmento, setEmpresaSegmento] = useState('')
  const [colaboradores, setColaboradores] = useState<any[]>([])
  const [respostas, setRespostas] = useState<any[]>([])
  const [senseColabs, setSenseColabs] = useState<any[]>([])
  const [senseCheckins, setSenseCheckins] = useState<any[]>([])
  const [teensAlunos, setTeensAlunos] = useState<any[]>([])
  const [teensAssessments, setTeensAssessments] = useState<any[]>([])
  const [insight, setInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<Aba>('dashboard')

  // Self-service: adicionar colaborador
  const [showFormCol, setShowFormCol] = useState(false)
  const [formCol, setFormCol] = useState(VAZIO_COL)
  const [salvandoCol, setSalvandoCol] = useState(false)
  const [reenvios, setReenvios] = useState<Record<string, 'enviando' | 'ok'>>({})

  // Onboarding primeira vez
  const [onboarding, setOnboarding] = useState(false)

  const gerarInsight = useCallback(async (cols: any[], resps: any[], segmento: string, sColabs: any[], tAlunos: any[]) => {
    setLoadingInsight(true)
    const isSense = segmento?.toLowerCase().includes('sense')
    const isTeens = segmento?.toLowerCase().includes('teen')
    const dados = isSense
      ? { tipo: 'Sense AI', total_colaboradores: sColabs.length, checkins_realizados: resps.length, segmento }
      : isTeens
        ? { tipo: 'Teens', total_alunos: tAlunos.length, assessments_concluidos: resps.length, segmento }
        : { tipo: 'RH', total_colaboradores: cols.length, assessments_concluidos: resps.filter(r => r.concluido).length, assessments_pendentes: cols.length - new Set(resps.filter(r => r.concluido).map((r: any) => r.colaborador_id)).size, segmento, cargos: Array.from(new Set(cols.map((c: any) => c.cargo).filter(Boolean))) }
    const res = await fetch('/api/cliente-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dados }),
    })
    const data = await res.json()
    if (data.text) setInsight(data.text)
    setLoadingInsight(false)
  }, [])

  useEffect(() => {
    const id = getCookie('cliente_id')
    const nome = decodeURIComponent(getCookie('cliente_nome'))
    if (!id) { router.push('/cliente/login'); return }
    setEmpresaId(id)
    setEmpresaNome(nome)

    // Onboarding: exibe na primeira vez
    const key = `onboarding_cliente_${id}`
    if (!localStorage.getItem(key)) {
      setOnboarding(true)
      localStorage.setItem(key, '1')
    }

    async function carregar() {
      const { data: emp } = await sb.from('empresas').select('segmento').eq('id', id).single()
      const seg = emp?.segmento || ''
      setEmpresaSegmento(seg)

      const isSense = seg?.toLowerCase().includes('sense')
      const isTeens = seg?.toLowerCase().includes('teen')

      if (isSense) {
        const [{ data: cols }, { data: checkins }] = await Promise.all([
          sb.from('sense_colaboradores').select('*').eq('empresa_id', id).order('nome'),
          sb.from('sense_checkins').select('*').eq('empresa_id', id).order('created_at', { ascending: false }),
        ])
        setSenseColabs(cols || [])
        setSenseCheckins(checkins || [])
        setLoading(false)
        gerarInsight([], [], seg, cols || [], [])
      } else if (isTeens) {
        const [{ data: alunos }, { data: assessments }] = await Promise.all([
          sb.from('teens_alunos').select('*').eq('instituicao_id', id).order('nome'),
          sb.from('teens_assessments').select('*').eq('instituicao_id', id),
        ])
        setTeensAlunos(alunos || [])
        setTeensAssessments(assessments || [])
        setLoading(false)
        gerarInsight([], [], seg, [], alunos || [])
      } else {
        const [{ data: cols }, { data: resps }] = await Promise.all([
          sb.from('colaboradores').select('*').eq('empresa_id', id).order('nome'),
          sb.from('respostas').select('*').eq('empresa_id', id).eq('concluido', true),
        ])
        setColaboradores(cols || [])
        setRespostas(resps || [])
        setLoading(false)
        gerarInsight(cols || [], resps || [], seg, [], [])
      }
    }
    carregar()
  }, [router, gerarInsight])

  async function sair() {
    await fetch('/api/cliente-auth', { method: 'DELETE' })
    router.push('/cliente/login')
  }

  async function recarregarColaboradores() {
    const { data } = await sb.from('colaboradores').select('*').eq('empresa_id', empresaId).order('nome')
    setColaboradores(data || [])
    const { data: resps } = await sb.from('respostas').select('*').eq('empresa_id', empresaId).eq('concluido', true)
    setRespostas(resps || [])
  }

  async function adicionarColaborador() {
    if (!formCol.nome) return alert('Nome obrigatório.')
    setSalvandoCol(true)
    const { data: novo } = await sb.from('colaboradores').insert({
      nome: formCol.nome, cargo: formCol.cargo, setor: formCol.setor,
      email: formCol.email, empresa_id: empresaId,
    }).select().single()
    if (novo?.id && formCol.email) {
      await fetch('/api/colaborador-convite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colaborador_id: novo.id }),
      })
    }
    setSalvandoCol(false)
    setFormCol(VAZIO_COL)
    setShowFormCol(false)
    recarregarColaboradores()
  }

  async function reenviarLink(colId: string) {
    setReenvios(r => ({ ...r, [colId]: 'enviando' }))
    await fetch('/api/colaborador-convite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colaborador_id: colId }),
    })
    setReenvios(r => ({ ...r, [colId]: 'ok' }))
    setTimeout(() => setReenvios(r => { const n = { ...r }; delete n[colId]; return n }), 3000)
  }

  const isAgro = empresaSegmento?.toLowerCase().includes('agro')
  const isSense = empresaSegmento?.toLowerCase().includes('sense')
  const isTeens = empresaSegmento?.toLowerCase().includes('teen')

  const concluidos = new Set(respostas.map(r => r.colaborador_id))
  const totalConcluidos = concluidos.size
  const totalPendentes = colaboradores.length - totalConcluidos
  const pct = colaboradores.length > 0 ? Math.round((totalConcluidos / colaboradores.length) * 100) : 0

  const abaStyle = (aba: Aba): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 0, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
    background: 'transparent',
    color: abaAtiva === aba ? '#A78BFA' : 'rgba(248,248,255,0.4)',
    borderBottom: abaAtiva === aba ? '2px solid #A78BFA' : '2px solid transparent',
  })

  const numeros = isSense
    ? [
        { v: senseColabs.length, l: 'Colaboradores', icon: '👥', cor: '#8b5cf6' },
        { v: senseCheckins.length, l: 'Check-ins realizados', icon: '💜', cor: '#ec4899' },
        { v: senseColabs.length > 0 ? `${Math.round((senseCheckins.length / senseColabs.length) * 100)}%` : '0%', l: 'Taxa de engajamento', icon: '📊', cor: '#06b6d4' },
        { v: senseCheckins.filter(c => c.estresse >= 4).length, l: 'Alertas de estresse', icon: '⚠️', cor: '#ef4444' },
      ]
    : isTeens
      ? [
          { v: teensAlunos.length, l: 'Alunos cadastrados', icon: '🎓', cor: '#a78bfa' },
          { v: teensAssessments.filter(a => a.concluido).length, l: 'Assessments concluídos', icon: '✅', cor: '#34d399' },
          { v: teensAlunos.length - new Set(teensAssessments.filter(a => a.concluido).map(a => a.aluno_id)).size, l: 'Pendentes', icon: '⏳', cor: '#fbbf24' },
          { v: teensAlunos.length > 0 ? `${Math.round((teensAssessments.filter(a => a.concluido).length / teensAlunos.length) * 100)}%` : '0%', l: 'Taxa de conclusão', icon: '📊', cor: '#60a5fa' },
        ]
      : [
          { v: colaboradores.length, l: 'Colaboradores', icon: '👥', cor: '#A78BFA' },
          { v: totalConcluidos, l: 'Assessments concluídos', icon: '✅', cor: '#34D399' },
          { v: totalPendentes, l: 'Pendentes', icon: '⏳', cor: '#FBBf24' },
          { v: `${pct}%`, l: 'Taxa de conclusão', icon: '📊', cor: '#60A5FA' },
        ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#06060F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center', color: 'rgba(248,248,255,0.4)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
        <p>Carregando portal...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#06060F', fontFamily: 'system-ui,sans-serif', color: '#F8F8FF' }}>

      {/* ONBOARDING MODAL */}
      {onboarding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#0f0f1a', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 24, padding: 40, maxWidth: 480, width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>🚀</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 8px', color: '#f8f8ff' }}>Bem-vindo ao portal!</h2>
              <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.45)', margin: 0 }}>Veja como tirar o máximo da plataforma em 3 passos simples.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {[
                { n: '1', ico: '👥', titulo: 'Cadastre sua equipe', desc: 'Vá em "Equipe" e adicione seus colaboradores. O link do assessment é enviado automaticamente por email.' },
                { n: '2', ico: '🧠', titulo: 'A IA analisa tudo', desc: 'Após os assessments, a IA gera devolutivas individuais e o diagnóstico completo da equipe.' },
                { n: '3', ico: '📊', titulo: 'Acompanhe os índices HAI', desc: 'Veja o Human Score, DISC HAI, bem-estar e muito mais em tempo real.' },
              ].map(p => (
                <div key={p.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 14, padding: '14px 18px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{p.ico}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#A78BFA', marginBottom: 4 }}>{p.n}. {p.titulo}</div>
                    <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.45)', lineHeight: 1.6 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { setOnboarding(false); setAbaAtiva('equipe') }}
              style={{ width: '100%', padding: 15, background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 900, cursor: 'pointer' }}>
              Começar: cadastrar minha equipe →
            </button>
          </div>
        </div>
      )}

      {/* TOPO */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: isSense ? 'linear-gradient(135deg,#8b5cf6,#ec4899)' : isTeens ? 'linear-gradient(135deg,#06b6d4,#8b5cf6)' : 'linear-gradient(135deg,#A78BFA,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            {isSense ? '🧠' : isTeens ? '🎓' : '🏢'}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900 }}>{empresaNome}</div>
            <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.3)' }}>
              {isSense ? 'Portal Sense AI' : isTeens ? 'Portal Essencial Teens' : 'Portal RH Essencial'} — Essencial Digital
            </div>
          </div>
        </div>
        <button onClick={sair} style={{ fontSize: 12, color: 'rgba(248,248,255,0.4)', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>Sair</button>
      </div>

      {/* ABAS */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px', display: 'flex', gap: 4 }}>
        <button style={abaStyle('dashboard')} onClick={() => setAbaAtiva('dashboard')}>Dashboard</button>
        {!isSense && !isTeens && <button style={abaStyle('equipe')} onClick={() => setAbaAtiva('equipe')}>Equipe</button>}
        {!isSense && !isTeens && <button style={abaStyle('indices')} onClick={() => setAbaAtiva('indices')}>Índices HAI</button>}
        {isAgro && <button style={abaStyle('agro')} onClick={() => setAbaAtiva('agro')}>Agro Tech</button>}
        {isSense && <button style={abaStyle('sense')} onClick={() => setAbaAtiva('sense')}>Saúde Mental</button>}
        {isTeens && <button style={abaStyle('teens')} onClick={() => setAbaAtiva('teens')}>Alunos</button>}
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px' }}>

        {/* ===== DASHBOARD ===== */}
        {abaAtiva === 'dashboard' && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px' }}>Olá, bem-vindo ao portal</h1>
              <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', margin: 0 }}>Acompanhe sua {isTeens ? 'instituição' : 'equipe'} e os insights gerados pela IA em tempo real.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
              {numeros.map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px' }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: item.cor, marginBottom: 4 }}>{item.v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.35)', fontWeight: 600 }}>{item.l}</div>
                </div>
              ))}
            </div>

            {/* IA INSIGHT */}
            <div style={{ background: isSense ? 'rgba(139,92,246,0.06)' : isTeens ? 'rgba(6,182,212,0.06)' : 'rgba(139,92,246,0.06)', border: `1px solid ${isSense ? 'rgba(139,92,246,0.2)' : isTeens ? 'rgba(6,182,212,0.2)' : 'rgba(139,92,246,0.2)'}`, borderRadius: 20, padding: 28, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: isSense ? 'linear-gradient(135deg,#8b5cf6,#ec4899)' : isTeens ? 'linear-gradient(135deg,#06b6d4,#8b5cf6)' : 'linear-gradient(135deg,#A78BFA,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: isSense ? '#a78bfa' : isTeens ? '#06b6d4' : '#A78BFA' }}>Análise da IA</div>
                  <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.3)' }}>Diagnóstico gerado automaticamente</div>
                </div>
              </div>
              {loadingInsight
                ? <div style={{ color: 'rgba(248,248,255,0.4)', fontSize: 13 }}>Analisando dados...</div>
                : insight
                  ? <div style={{ fontSize: 13, color: 'rgba(248,248,255,0.75)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{insight}</div>
                  : <div style={{ color: 'rgba(248,248,255,0.3)', fontSize: 13 }}>Nenhum dado disponível para análise ainda.</div>
              }
            </div>

            {!isSense && !isTeens && totalPendentes > 0 && (
              <div style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 14, padding: '14px 20px', fontSize: 13, color: 'rgba(248,248,255,0.6)' }}>
                ⚠️ <strong style={{ color: '#FBBf24' }}>{totalPendentes} colaborador{totalPendentes > 1 ? 'es' : ''}</strong> ainda {totalPendentes > 1 ? 'não concluíram' : 'não concluiu'} o assessment.
              </div>
            )}
          </div>
        )}

        {/* ===== EQUIPE (RH) ===== */}
        {abaAtiva === 'equipe' && !isSense && !isTeens && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 4px' }}>Sua equipe</h2>
                <p style={{ fontSize: 12, color: 'rgba(248,248,255,0.35)', margin: 0 }}>{colaboradores.length} colaborador{colaboradores.length !== 1 ? 'es' : ''} cadastrado{colaboradores.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setShowFormCol(v => !v)}
                style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                + Adicionar colaborador
              </button>
            </div>

            {/* Formulário de adição */}
            {showFormCol && (
              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: '#A78BFA', marginTop: 0, marginBottom: 16 }}>Novo colaborador</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {[
                    ['nome', 'Nome completo *', 'text'],
                    ['email', 'E-mail (link enviado automaticamente)', 'email'],
                    ['cargo', 'Cargo', 'text'],
                    ['setor', 'Setor', 'text'],
                  ].map(([k, l, t]) => (
                    <div key={k}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(248,248,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</label>
                      <input type={t} value={(formCol as any)[k] || ''} onChange={e => setFormCol(f => ({ ...f, [k]: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F8F8FF', fontSize: 13, boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={adicionarColaborador} disabled={salvandoCol}
                    style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', opacity: salvandoCol ? 0.6 : 1 }}>
                    {salvandoCol ? 'Cadastrando...' : formCol.email ? '✉️ Cadastrar e enviar link' : 'Cadastrar'}
                  </button>
                  <button onClick={() => setShowFormCol(false)}
                    style={{ padding: '10px 18px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(248,248,255,0.4)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </div>
                {formCol.email && (
                  <p style={{ margin: '12px 0 0', fontSize: 11, color: 'rgba(248,248,255,0.35)' }}>O link do assessment será enviado automaticamente para {formCol.email}.</p>
                )}
              </div>
            )}

            {colaboradores.length === 0 && !showFormCol
              ? (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 20, padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: 'rgba(248,248,255,0.5)', marginBottom: 8 }}>Nenhum colaborador ainda</p>
                  <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.3)', marginBottom: 20 }}>Adicione o primeiro colaborador e o link do assessment é enviado automaticamente por e-mail.</p>
                  <button onClick={() => setShowFormCol(true)}
                    style={{ padding: '11px 28px', background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                    + Adicionar primeiro colaborador
                  </button>
                </div>
              )
              : colaboradores.length > 0 && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        {['Nome', 'Cargo', 'Status', 'Ação'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '14px 20px', color: 'rgba(248,248,255,0.35)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {colaboradores.map(col => {
                        const feito = concluidos.has(col.id)
                        const resp = respostas.find(r => r.colaborador_id === col.id)
                        const estado = reenvios[col.id]
                        return (
                          <tr key={col.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ fontWeight: 700 }}>{col.nome}</div>
                              {col.email && <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.3)', marginTop: 2 }}>{col.email}</div>}
                            </td>
                            <td style={{ padding: '14px 20px', color: 'rgba(248,248,255,0.5)' }}>{col.cargo || '-'}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: feito ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)', color: feito ? '#34D399' : '#FBBf24' }}>
                                {feito ? '✓ Concluído' : 'Pendente'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                {feito && resp && (
                                  <a href={`/cliente/devolutiva/${resp.id}`} style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textDecoration: 'none', padding: '5px 12px', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8 }}>Ver devolutiva</a>
                                )}
                                {!feito && col.email && (
                                  <button onClick={() => reenviarLink(col.id)} disabled={!!estado}
                                    style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, border: 'none', cursor: estado ? 'default' : 'pointer', background: estado === 'ok' ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)', color: estado === 'ok' ? '#34D399' : 'rgba(248,248,255,0.5)' }}>
                                    {estado === 'enviando' ? '...' : estado === 'ok' ? '✓ Enviado!' : '📧 Reenviar link'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* ===== INDICES HAI ===== */}
        {abaAtiva === 'indices' && !isSense && !isTeens && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 6px' }}>Índices HAI da Equipe</h2>
              <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', margin: 0 }}>Índices proprietários de saúde humana da sua equipe.</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg,rgba(52,211,153,0.08),rgba(16,185,129,0.04))', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 20, padding: 28, marginBottom: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Human Score HAI</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: totalConcluidos > 0 ? '#34D399' : 'rgba(240,253,244,0.15)', lineHeight: 1, marginBottom: 8 }}>
                {totalConcluidos > 0 ? pct : '--'}
              </div>
              {totalConcluidos > 0 && (
                <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 99, background: `${getClassificacao(pct).cor}15`, border: `1px solid ${getClassificacao(pct).cor}30`, fontSize: 13, fontWeight: 800, color: getClassificacao(pct).cor }}>
                  {getClassificacao(pct).label}
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {INDICES.map(ind => (
                <div key={ind.sigla} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${ind.cor}20`, borderRadius: 16, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{ind.icone}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: ind.cor }}>{ind.sigla}</div>
                      <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)' }}>{ind.nome}</div>
                    </div>
                    {ind.peso > 0 && <div style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: 'rgba(248,248,255,0.25)' }}>peso {ind.peso}%</div>}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.4)' }}>
                    {totalConcluidos > 0 ? `${totalConcluidos} colaborador${totalConcluidos > 1 ? 'es' : ''} avaliado${totalConcluidos > 1 ? 's' : ''}` : 'Aguardando assessments'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== AGRO TECH ===== */}
        {abaAtiva === 'agro' && isAgro && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 24px' }}>Módulos Agro Tech</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
              {MODULOS_AGRO.map((mod, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '22px 24px' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{mod.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>{mod.titulo}</div>
                  <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.4)', lineHeight: 1.6 }}>{mod.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(0,200,83,0.05)', border: '1px solid rgba(0,200,83,0.15)', borderRadius: 16, padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#34D399', marginBottom: 8 }}>🌾 Relatórios ESG e NR-31</div>
              <div style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)', lineHeight: 1.7, marginBottom: 14 }}>Os relatórios completos são gerados pela plataforma e entregues pela equipe Essencial Agro Tech.</div>
              <a href="https://wa.me/5561985272681?text=Olá%2C%20gostaria%20de%20solicitar%20o%20relatório%20ESG%20e%20NR-31." target="_blank" style={{ display: 'inline-block', padding: '10px 20px', background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.25)', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#34D399', textDecoration: 'none' }}>
                Solicitar relatório via WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* ===== SENSE AI ===== */}
        {abaAtiva === 'sense' && isSense && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 6px' }}>Saúde Mental da Equipe</h2>
            <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', margin: '0 0 28px' }}>Monitoramento emocional e psicossocial dos colaboradores.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
              {MODULOS_SENSE.map((mod, i) => (
                <div key={i} style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 18, padding: '22px 24px' }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{mod.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 6 }}>{mod.titulo}</div>
                  <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.4)', lineHeight: 1.6 }}>{mod.desc}</div>
                </div>
              ))}
            </div>

            {senseColabs.length === 0
              ? <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 24px', textAlign: 'center', color: 'rgba(248,248,255,0.3)', fontSize: 13 }}>Nenhum colaborador cadastrado ainda.</div>
              : (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        {['Colaborador', 'Cargo', 'Check-ins', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '14px 20px', color: 'rgba(248,248,255,0.35)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {senseColabs.map(col => {
                        const checkins = senseCheckins.filter(c => c.colaborador_id === col.id)
                        const alerta = checkins.some(c => c.estresse >= 4)
                        return (
                          <tr key={col.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '14px 20px', fontWeight: 700 }}>{col.nome}</td>
                            <td style={{ padding: '14px 20px', color: 'rgba(248,248,255,0.5)' }}>{col.cargo || '-'}</td>
                            <td style={{ padding: '14px 20px', color: 'rgba(248,248,255,0.5)' }}>{checkins.length}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: alerta ? 'rgba(239,68,68,0.12)' : 'rgba(52,211,153,0.12)', color: alerta ? '#ef4444' : '#34D399' }}>
                                {alerta ? '⚠️ Alerta' : '✓ Regular'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* ===== TEENS ===== */}
        {abaAtiva === 'teens' && isTeens && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 6px' }}>Alunos</h2>
            <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', margin: '0 0 28px' }}>Acompanhe o perfil e o bem-estar dos seus alunos.</p>

            {teensAlunos.length === 0
              ? <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px 24px', textAlign: 'center', color: 'rgba(248,248,255,0.3)', fontSize: 13 }}>Nenhum aluno cadastrado ainda.</div>
              : (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        {['Aluno', 'Turma', 'Assessments', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '14px 20px', color: 'rgba(248,248,255,0.35)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {teensAlunos.map(aluno => {
                        const assmts = teensAssessments.filter(a => a.aluno_id === aluno.id)
                        const concluido = assmts.some(a => a.concluido)
                        return (
                          <tr key={aluno.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '14px 20px', fontWeight: 700 }}>{aluno.nome}</td>
                            <td style={{ padding: '14px 20px', color: 'rgba(248,248,255,0.5)' }}>{aluno.turma || '-'}</td>
                            <td style={{ padding: '14px 20px', color: 'rgba(248,248,255,0.5)' }}>{assmts.length}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: concluido ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)', color: concluido ? '#34D399' : '#FBBf24' }}>
                                {concluido ? '✓ Concluído' : 'Pendente'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

      </div>
    </div>
  )
}
