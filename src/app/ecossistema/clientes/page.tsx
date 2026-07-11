'use client'
import { useEffect, useState } from 'react'
import { ecoFetch } from '@/lib/ecoFetch'

type Cliente = {
  id: string
  nome: string
  tipo: 'instituicao' | 'empresa'
  cnpj: string | null
  cidade: string | null
  estado: string | null
  modulos_liberados: string[]
  observacoes: string | null
  edu_escola_id: string | null
  sense_empresa_id: string | null
  teens_instituicao_id: string | null
  agro_empresa_id: string | null
  trial: boolean
  trial_fim: string | null
  ultimo_acesso: string | null
}

const PACOTES = {
  educacional:  { label: '🎓 Educacional', modulos: ['estudo', 'teens', 'sense', 'nexo'], tipo: 'instituicao' as const },
  agro:         { label: '🌾 Agro (+ Sense AI + NexoPerform)', modulos: ['agro', 'sense', 'nexo'], tipo: 'empresa' as const },
  agro_solo:    { label: '🌾 Agro Tech (só)', modulos: ['agro'], tipo: 'empresa' as const },
  juridico:     { label: '⚖️ Jurídico', modulos: ['estudo'], tipo: 'instituicao' as const },
  med:          { label: '🩺 Medicina', modulos: ['estudo'], tipo: 'instituicao' as const },
  juridico_med: { label: '⚖️🩺 Jurídico + Med', modulos: ['estudo'], tipo: 'instituicao' as const },
}

const CAMPOS_VINCULO = [
  { campo: 'edu_escola_id' as const, label: 'ID escola_id (Edu)' },
  { campo: 'sense_empresa_id' as const, label: 'ID empresa_id (Sense AI)' },
  { campo: 'teens_instituicao_id' as const, label: 'ID instituicao_id (Teens)' },
  { campo: 'agro_empresa_id' as const, label: 'ID empresa_id (Agro Tech)' },
]

const CATALOGO = [
  { grupo: 'Educação', modulos: [
    { id: 'edu', label: '🎓 Essencial Edu', cor: '#A78BFA' },
    { id: 'estudo', label: '📖 Essencial Estudo', cor: '#7C3AED' },
    { id: 'teens', label: '🌟 Essencial Teens', cor: '#06b6d4' },
  ]},
  { grupo: 'Gestão de Pessoas', modulos: [
    { id: 'sense', label: '🧠 Sense AI', cor: '#8b5cf6' },
    { id: 'nexo', label: '🧭 NexoPerform', cor: '#10b981' },
    { id: 'agro', label: '🌾 Agro Tech', cor: '#00e676' },
  ]},
]
const TODOS_MODULOS = CATALOGO.flatMap(g => g.modulos)

function formatarTempoRelativo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const horas = Math.floor(diffMs / 3600000)
  if (horas < 1) return 'agora mesmo'
  if (horas < 24) return `há ${horas}h`
  const dias = Math.floor(horas / 24)
  return `há ${dias} dia${dias !== 1 ? 's' : ''}`
}

export default function ClientesEcossistema() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [criando, setCriando] = useState(false)
  const [form, setForm] = useState({ nome: '', tipo: 'instituicao' as 'instituicao' | 'empresa', cnpj: '', cidade: '', estado: '' })
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [copiadoId, setCopiadoId] = useState<string | null>(null)
  const [nomeTrial, setNomeTrial] = useState('')
  const [emailTrial, setEmailTrial] = useState('')
  const [pacoteTrial, setPacoteTrial] = useState<keyof typeof PACOTES>('educacional')
  const [criandoTrial, setCriandoTrial] = useState(false)
  const [linkTrialCriado, setLinkTrialCriado] = useState('')
  const [linkTrialCopiado, setLinkTrialCopiado] = useState(false)
  const [analiseTrials, setAnaliseTrials] = useState<any>(null)
  const [gerandoAnalise, setGerandoAnalise] = useState(false)
  const [semTrials, setSemTrials] = useState(false)

  async function gerarAnaliseTrials() {
    setGerandoAnalise(true); setAnaliseTrials(null); setSemTrials(false)
    try {
      const r = await ecoFetch('/api/eco-clientes/analisar-trials', { method: 'POST' })
      const d = await r.json()
      if (d.sem_trials) setSemTrials(true)
      else if (d.ok) setAnaliseTrials(d.analise)
    } catch {}
    setGerandoAnalise(false)
  }

  async function copiarLinkTrial() {
    try {
      await navigator.clipboard.writeText(linkTrialCriado)
      setLinkTrialCopiado(true)
      setTimeout(() => setLinkTrialCopiado(false), 2500)
    } catch {
      // Fallback pra navegadores/contextos que bloqueiam a Clipboard API
      const area = document.createElement('textarea')
      area.value = linkTrialCriado
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.focus(); area.select()
      try {
        document.execCommand('copy')
        setLinkTrialCopiado(true)
        setTimeout(() => setLinkTrialCopiado(false), 2500)
      } catch {}
      document.body.removeChild(area)
    }
  }

  async function copiarLinkPortal(id: string) {
    const link = `${window.location.origin}/portal/${id}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiadoId(id)
      setTimeout(() => setCopiadoId(null), 2000)
    } catch {}
  }

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    try {
      const r = await ecoFetch('/api/eco-clientes')
      const d = await r.json()
      if (d.ok) setClientes(d.clientes)
    } catch {}
    setLoading(false)
  }

  async function criarTrial() {
    if (!nomeTrial) return
    setCriandoTrial(true)
    setLinkTrialCriado('')
    try {
      const p = PACOTES[pacoteTrial]
      const r = await ecoFetch('/api/eco-clientes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeTrial, tipo: p.tipo, modulos_liberados: p.modulos, trial: true, trial_dias: 7, email: emailTrial || undefined }),
      })
      const d = await r.json()
      if (d.ok && d.cliente?.id) {
        setLinkTrialCriado(`${window.location.origin}/portal/${d.cliente.id}`)
      }
      setNomeTrial('')
      setEmailTrial('')
      await carregar()
    } catch {}
    setCriandoTrial(false)
  }

  async function criar() {
    if (!form.nome) return
    setCriando(true)
    try {
      await ecoFetch('/api/eco-clientes', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setForm({ nome: '', tipo: 'instituicao', cnpj: '', cidade: '', estado: '' })
      await carregar()
    } catch {}
    setCriando(false)
  }

  async function alternarModulo(cliente: Cliente, moduloId: string) {
    const atual = cliente.modulos_liberados || []
    const novos = atual.includes(moduloId) ? atual.filter(m => m !== moduloId) : [...atual, moduloId]
    setClientes(prev => prev.map(c => c.id === cliente.id ? { ...c, modulos_liberados: novos } : c))
    await ecoFetch(`/api/eco-clientes/${cliente.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modulos_liberados: novos }),
    })
  }

  async function remover(id: string) {
    await ecoFetch(`/api/eco-clientes/${id}`, { method: 'DELETE' })
    setClientes(prev => prev.filter(c => c.id !== id))
  }

  async function salvarVinculo(cliente: Cliente, campo: string, valor: string) {
    setClientes(prev => prev.map(c => c.id === cliente.id ? { ...c, [campo]: valor || null } : c))
    await ecoFetch(`/api/eco-clientes/${cliente.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [campo]: valor || null }),
    })
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>🗂 Central Administradora — Clientes do Ecossistema</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
          Um único registro pra instituições e empresas. Cada uma escolhe módulos de qualquer catálogo — uma escola pode ter Edu/Teens e também Sense AI pra própria equipe, por exemplo.
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(236,72,153,0.06))',
        border: '1px solid rgba(124,58,237,0.25)', borderRadius: 18, padding: '22px 26px', marginBottom: 24,
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A78BFA', marginBottom: 8 }}>
          Essencial Digital · Human Tech
        </div>
        <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.6, margin: '0 0 8px' }}>
          Tecnologia que transforma vidas por meio da Inteligência Humana Adaptativa.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '0 0 16px' }}>
          Educação, Empresas e Agronegócio — todos os produtos do ecossistema usam a mesma base tecnológica e a mesma metodologia: a IA aprende o contexto, o comportamento, os objetivos e o ritmo de cada pessoa, criando experiências personalizadas de aprendizagem e desenvolvimento.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Educação</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>Essencial Estudo<br/>Essencial Teens</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Empresas</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>Essencial Sense AI<br/>NexoPerform</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Agronegócio</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>Essencial Agro</div>
          </div>
        </div>
      </div>

      {/* Trial de demonstração rápido */}
      <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#34D399', marginBottom: 4, textTransform: 'uppercase' }}>🎁 Criar trial de demonstração (7 dias)</div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
          Para instituições que entraram em contato direto (sem passar pela máquina de leads). Libera o pacote todo por 7 dias, depois bloqueia sozinho.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px auto', gap: 8 }}>
          <input value={nomeTrial} onChange={e => setNomeTrial(e.target.value)} placeholder="Nome da instituição/empresa" style={inputStyle} />
          <input value={emailTrial} onChange={e => setEmailTrial(e.target.value)} placeholder="E-mail de acesso (opcional)" style={inputStyle} />
          <select value={pacoteTrial} onChange={e => setPacoteTrial(e.target.value as any)} style={inputStyle}>
            <option value="educacional">🎓 Pacote Educacional (Estudo + Teens + Sense AI + NexoPerform)</option>
            <option value="juridico">⚖️ Jurídico (Essencial Estudo)</option>
            <option value="med">🩺 Medicina (Essencial Estudo)</option>
            <option value="juridico_med">⚖️🩺 Jurídico + Med (Essencial Estudo)</option>
            <option value="agro">🌾 Pacote Agro (Agro Tech + Sense AI + NexoPerform)</option>
            <option value="agro_solo">🌾 Agro Tech (só)</option>
          </select>
          <button onClick={criarTrial} disabled={criandoTrial || !nomeTrial} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: '#10b981', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: criandoTrial || !nomeTrial ? 0.5 : 1, whiteSpace: 'nowrap' }}>
            {criandoTrial ? 'Criando...' : '🎁 Criar trial'}
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
          Com e-mail preenchido, as contas do Sense AI e do Essencial Estudo/Teens já são criadas automaticamente (mesma senha nos dois) e enviadas por e-mail. Edu, NexoPerform e Agro Tech ainda precisam de cadastro manual por enquanto.
        </p>
        {linkTrialCriado && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,.2)', borderRadius: 10, padding: '8px 12px' }}>
            <span style={{ fontSize: 12, color: '#34D399', fontWeight: 700 }}>✓ Trial criado!</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{linkTrialCriado}</span>
            <button onClick={copiarLinkTrial} style={{ fontSize: 11, fontWeight: 700, color: '#34D399', background: 'none', border: '1px solid rgba(52,211,153,.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {linkTrialCopiado ? '✓ Copiado!' : '📋 Copiar link'}
            </button>
          </div>
        )}
      </div>

      {/* Leitura de IA sobre engajamento dos trials */}
      <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 14, padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: analiseTrials || semTrials ? 12 : 0, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase' }}>✦ Leitura da IA · Engajamento dos Trials</div>
          <button onClick={gerarAnaliseTrials} disabled={gerandoAnalise}
            style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(167,139,250,0.3)', background: 'transparent', color: '#A78BFA', cursor: 'pointer', opacity: gerandoAnalise ? 0.5 : 1 }}>
            {gerandoAnalise ? 'Analisando...' : analiseTrials ? '↻ Atualizar' : '✨ Analisar trials'}
          </button>
        </div>

        {semTrials && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Nenhum trial ativo no momento.</div>}

        {analiseTrials && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#fff', lineHeight: 1.6, margin: 0 }}>{analiseTrials.resumo}</p>

            {analiseTrials.risco_alto?.length > 0 && (
              <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#F87171', marginBottom: 6 }}>⚠️ Risco alto (trial acabando, sem uso)</div>
                {analiseTrials.risco_alto.map((n: string, i: number) => <div key={i} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)' }}>• {n}</div>)}
              </div>
            )}

            {analiseTrials.indo_bem?.length > 0 && (
              <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399', marginBottom: 6 }}>✓ Engajando bem</div>
                {analiseTrials.indo_bem.map((n: string, i: number) => <div key={i} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)' }}>• {n}</div>)}
              </div>
            )}

            <div style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.15),rgba(6,182,212,.05))', border: '1px solid rgba(167,139,250,.3)', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', marginBottom: 4 }}>⚡ Ação sugerida</div>
              <div style={{ fontSize: 13, color: '#fff' }}>{analiseTrials.acao_sugerida}</div>
            </div>
          </div>
        )}
      </div>

      {/* Novo cliente */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#A78BFA', marginBottom: 10, textTransform: 'uppercase' }}>+ Novo cliente</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 10 }}>
          <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome" style={inputStyle} />
          <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as any }))} style={inputStyle}>
            <option value="instituicao">Instituição</option>
            <option value="empresa">Empresa</option>
          </select>
          <input value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} placeholder="CNPJ (opcional)" style={inputStyle} />
          <input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} placeholder="Cidade" style={inputStyle} />
          <input value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))} placeholder="UF" style={inputStyle} />
        </div>
        <button onClick={criar} disabled={criando || !form.nome} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: criando ? 0.5 : 1 }}>
          {criando ? 'Criando...' : 'Adicionar cliente'}
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Carregando...</div>
      ) : clientes.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center', padding: 40 }}>Nenhum cliente cadastrado ainda.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {clientes.map(c => (
            <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {c.tipo === 'instituicao' ? '🏫' : '🏢'} {c.nome}
                    {c.trial && (() => {
                      const diasRestantes = c.trial_fim ? Math.ceil((new Date(c.trial_fim).getTime() - Date.now()) / 86400000) : 0
                      const expirado = diasRestantes <= 0
                      return (
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                          background: expirado ? 'rgba(248,113,113,.15)' : 'rgba(245,158,11,.15)',
                          color: expirado ? '#F87171' : '#F59E0B', border: `1px solid ${expirado ? 'rgba(248,113,113,.3)' : 'rgba(245,158,11,.3)'}`,
                        }}>
                          {expirado ? '⏱ Trial expirado' : `🎁 Trial · ${diasRestantes}d restantes`}
                        </span>
                      )
                    })()}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                    {c.tipo === 'instituicao' ? 'Instituição' : 'Empresa'}{c.cidade ? ` · ${c.cidade}${c.estado ? '/' + c.estado : ''}` : ''}{c.cnpj ? ` · ${c.cnpj}` : ''}
                  </div>
                  {c.trial && (
                    <div style={{ fontSize: 11, marginTop: 4, color: c.ultimo_acesso ? '#60A5FA' : 'rgba(255,255,255,0.3)' }}>
                      {c.ultimo_acesso
                        ? `👤 Último acesso: ${formatarTempoRelativo(c.ultimo_acesso)}`
                        : '👤 Ninguém acessou ainda'}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => copiarLinkPortal(c.id)} style={{ fontSize: 11, color: '#34D399', background: 'none', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>
                    {copiadoId === c.id ? '✓ Copiado!' : '🔗 Copiar link do portal'}
                  </button>
                  <button onClick={() => remover(c.id)} style={{ fontSize: 11, color: '#F87171', background: 'none', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Remover</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TODOS_MODULOS.map(m => {
                  const ativo = c.modulos_liberados?.includes(m.id)
                  return (
                    <button key={m.id} onClick={() => alternarModulo(c, m.id)} style={{
                      padding: '6px 14px', borderRadius: 99, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      background: ativo ? `${m.cor}22` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${ativo ? m.cor + '60' : 'rgba(255,255,255,0.1)'}`,
                      color: ativo ? m.cor : 'rgba(255,255,255,0.35)',
                    }}>
                      {ativo ? '✓ ' : ''}{m.label}
                    </button>
                  )
                })}
              </div>

              <details style={{ marginTop: 12 }}>
                <summary style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>🔗 Vincular IDs (pra travar acesso automático nos apps)</summary>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginTop: 10 }}>
                  {CAMPOS_VINCULO.map(cv => (
                    <input key={cv.campo} defaultValue={c[cv.campo] || ''} placeholder={cv.label}
                      onBlur={e => salvarVinculo(c, cv.campo, e.target.value)}
                      style={{ ...inputStyle, fontSize: 12 }} />
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 13,
}
