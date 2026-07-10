'use client'
import { useEffect, useState } from 'react'
import { ecoFetch } from '@/lib/ecoFetch'

const PRODUTOS = [
  { key: 'edu', label: 'Essencial Edu' },
  { key: 'teens', label: 'Essencial Teens' },
  { key: 'estudo', label: 'Essencial Estudo' },
  { key: 'med', label: 'Essencial Med' },
  { key: 'juridico', label: 'Essencial Jurídico' },
  { key: 'sense', label: 'Sense AI' },
  { key: 'nexo', label: 'NexoPerform' },
  { key: 'agro', label: 'Agro Tech' },
]

const COR_TEMP: Record<string, string> = { quente: '#F87171', morno: '#F0C36D', frio: '#60A5FA' }

const PACOTES_TRIAL = {
  educacional: { label: '🎓 Educacional', modulos: ['edu', 'estudo', 'teens', 'sense', 'nexo'], tipo: 'instituicao' as const },
  agro: { label: '🌾 Agro', modulos: ['agro', 'sense', 'nexo'], tipo: 'empresa' as const },
}
function pacotePorProduto(produto: string): keyof typeof PACOTES_TRIAL {
  return produto === 'agro' ? 'agro' : 'educacional'
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [carregandoLista, setCarregandoLista] = useState(true)
  const [alvo, setAlvo] = useState('')
  const [contato, setContato] = useState('')
  const [produto, setProduto] = useState('edu')
  const [gerando, setGerando] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState('')
  const [gerandoAuto, setGerandoAuto] = useState(false)
  const [msgAuto, setMsgAuto] = useState('')
  const [criandoTrialId, setCriandoTrialId] = useState<string | null>(null)
  const [trialCriadoId, setTrialCriadoId] = useState<string | null>(null)
  const [linkTrialPorLead, setLinkTrialPorLead] = useState<Record<string, string>>({})

  useEffect(() => {
    carregarLeads()
    const intervalo = setInterval(() => carregarLeads(true), 15000)
    return () => clearInterval(intervalo)
  }, [])

  async function carregarLeads(silencioso = false) {
    if (!silencioso) setCarregandoLista(true)
    try {
      const r = await ecoFetch('/api/eco-leads')
      const d = await r.json()
      setLeads(d.leads || [])
    } finally {
      if (!silencioso) setCarregandoLista(false)
    }
  }

  async function gerarLead() {
    if (!alvo) return
    setGerando(true); setErro(''); setResultado(null)
    try {
      const r = await ecoFetch('/api/eco-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alvo, contato, produto }),
      })
      const d = await r.json()
      if (!r.ok) { setErro(d.error || 'Erro ao gerar.'); return }
      setResultado(d.abordagem)
      carregarLeads()
    } finally {
      setGerando(false)
    }
  }

  async function criarTrialDoLead(lead: any) {
    setCriandoTrialId(lead.id)
    try {
      const p = PACOTES_TRIAL[pacotePorProduto(lead.produto)]
      const r = await ecoFetch('/api/eco-clientes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: lead.instituicao || lead.nome, tipo: p.tipo,
          modulos_liberados: p.modulos, trial: true, trial_dias: 7,
        }),
      })
      const d = await r.json()
      if (d.ok && d.cliente?.id) {
        setLinkTrialPorLead(prev => ({ ...prev, [lead.id]: `${window.location.origin}/portal/${d.cliente.id}` }))
      }
      setTrialCriadoId(lead.id)
    } catch {}
    setCriandoTrialId(null)
  }

  async function gerarAutomatico() {
    setGerandoAuto(true); setMsgAuto('')
    try {
      const r = await ecoFetch('/api/eco-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto, auto: true, quantidade: 5 }),
      })
      const d = await r.json()
      if (!r.ok) { setMsgAuto('⚠️ ' + (d.error || 'Erro ao buscar leads automaticamente.')); return }
      setMsgAuto(`✅ ${d.total} lead${d.total !== 1 ? 's' : ''} encontrado${d.total !== 1 ? 's' : ''} e gerado${d.total !== 1 ? 's' : ''} pela IA!`)
      carregarLeads()
    } catch {
      setMsgAuto('❌ Erro de conexão')
    } finally {
      setGerandoAuto(false)
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 60px', fontFamily: 'system-ui,sans-serif', color: '#F8F8FF' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, background: 'linear-gradient(135deg,#A78BFA,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🎯 Leads Qualificados com IA Preditiva</h1>
        <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', marginTop: 4 }}>A IA pesquisa o alvo na web, gera a abordagem personalizada e calcula um score preditivo de conversão.</p>
      </div>

      {/* BUSCAR AUTOMATICAMENTE */}
      <div style={{ background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.25)', borderRadius: 18, padding: 20, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#A78BFA' }}>🤖 Buscar leads automaticamente</div>
          <div style={{ fontSize: 12, color: 'rgba(248,248,255,.5)', marginTop: 2 }}>A IA pesquisa 5 instituições/empresas reais para o produto selecionado, sem precisar digitar nome.</div>
          {msgAuto && <div style={{ fontSize: 12, marginTop: 8, color: msgAuto.startsWith('✅') ? '#4ADE80' : '#F87171' }}>{msgAuto}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={produto} onChange={e => setProduto(e.target.value)} style={{ padding: '10px 14px', fontSize: 13, borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }}>
            {PRODUTOS.map(p => <option key={p.key} value={p.key} style={{ background: '#1a1a2e', color: '#F8F8FF' }}>{p.label}</option>)}
          </select>
          <button onClick={gerarAutomatico} disabled={gerandoAuto} style={{
            background: 'linear-gradient(135deg,#7C3AED,#06b6d4)', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 20px',
            fontSize: 13, fontWeight: 800, cursor: gerandoAuto ? 'not-allowed' : 'pointer', opacity: gerandoAuto ? 0.5 : 1, whiteSpace: 'nowrap',
          }}>{gerandoAuto ? '🔄 Buscando na web...' : '🔍 Buscar automaticamente'}</button>
        </div>
      </div>

      {/* GERAR NOVO LEAD (manual) */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,.2)', borderRadius: 18, padding: 22, marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: 10, marginBottom: 14 }}>
          <input value={alvo} onChange={e => setAlvo(e.target.value)} placeholder="Instituição/empresa alvo" style={{ padding: '10px 14px', fontSize: 13, borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }} />
          <input value={contato} onChange={e => setContato(e.target.value)} placeholder="Contato (opcional)" style={{ padding: '10px 14px', fontSize: 13, borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }} />
          <select value={produto} onChange={e => setProduto(e.target.value)} style={{ padding: '10px 14px', fontSize: 13, borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }}>
            {PRODUTOS.map(p => <option key={p.key} value={p.key} style={{ background: '#1a1a2e', color: '#F8F8FF' }}>{p.label}</option>)}
          </select>
        </div>
        {erro && <div style={{ fontSize: 12, color: '#F87171', marginBottom: 12 }}>{erro}</div>}
        <button onClick={gerarLead} disabled={gerando || !alvo} style={{
          background: 'linear-gradient(135deg,#7C3AED,#06b6d4)', color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px',
          fontSize: 13, fontWeight: 800, cursor: gerando || !alvo ? 'not-allowed' : 'pointer', opacity: gerando || !alvo ? 0.5 : 1,
        }}>{gerando ? '🔄 IA pesquisando e gerando abordagem...' : '✨ Gerar lead com IA'}</button>

        {resultado && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,.2)', borderRadius: 14, padding: 18, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', minWidth: 70 }}>
                <div style={{ fontSize: 34, fontWeight: 900, color: COR_TEMP[resultado.temperatura] || '#94A3B8' }}>{resultado.score_preditivo}</div>
                <div style={{ fontSize: 9, color: 'rgba(248,248,255,.3)', textTransform: 'uppercase' }}>score / 100</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: COR_TEMP[resultado.temperatura] || '#94A3B8', textTransform: 'uppercase' }}>{resultado.temperatura}</div>
                <div style={{ fontSize: 13, color: 'rgba(248,248,255,.7)' }}>{resultado.justificativa_score}</div>
              </div>
            </div>
            <div style={{ background: 'rgba(139,92,246,.06)', border: '1px solid rgba(139,92,246,.15)', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', marginBottom: 6 }}>Gancho</div>
              <div style={{ fontSize: 13, color: 'rgba(248,248,255,.7)' }}>{resultado.gancho}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(248,248,255,.4)', textTransform: 'uppercase', marginBottom: 6 }}>E-mail: {resultado.email?.assunto}</div>
              <div style={{ fontSize: 13, color: 'rgba(248,248,255,.7)', whiteSpace: 'pre-wrap' }}>{resultado.email?.corpo}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.03)', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(248,248,255,.4)', textTransform: 'uppercase', marginBottom: 6 }}>WhatsApp</div>
              <div style={{ fontSize: 13, color: 'rgba(248,248,255,.7)' }}>{resultado.whatsapp}</div>
            </div>
          </div>
        )}
      </div>

      {/* PIPELINE */}
      <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(248,248,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Pipeline ({leads.length})</div>
      {carregandoLista ? (
        <div style={{ color: 'rgba(248,248,255,.4)', fontSize: 13 }}>Carregando...</div>
      ) : leads.length === 0 ? (
        <div style={{ color: 'rgba(248,248,255,.4)', fontSize: 13 }}>Nenhum lead ainda. Gere o primeiro acima.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leads.map(l => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '12px 16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: COR_TEMP[l.temperatura] || '#94A3B8', minWidth: 40 }}>{l.score ?? '—'}</div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{l.instituicao || l.nome}</div>
                <div style={{ fontSize: 11, color: 'rgba(248,248,255,.4)' }}>{l.produto} · {l.status}</div>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(248,248,255,.4)' }}>{new Date(l.criado_em).toLocaleDateString('pt-BR')}</div>
              {trialCriadoId === l.id ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399' }}>✓ Trial criado</span>
                  {linkTrialPorLead[l.id] && (
                    <button onClick={() => navigator.clipboard.writeText(linkTrialPorLead[l.id])} style={{ fontSize: 11, fontWeight: 700, color: '#34D399', background: 'none', border: '1px solid rgba(52,211,153,.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      📋 Copiar link
                    </button>
                  )}
                </div>
              ) : (
                <button onClick={() => criarTrialDoLead(l)} disabled={criandoTrialId === l.id}
                  style={{ fontSize: 11, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.25)', borderRadius: 8, padding: '5px 10px', cursor: criandoTrialId === l.id ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                  {criandoTrialId === l.id ? 'Criando...' : `🎁 Trial 7d (${PACOTES_TRIAL[pacotePorProduto(l.produto)].label})`}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
