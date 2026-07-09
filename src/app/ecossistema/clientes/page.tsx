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

export default function ClientesEcossistema() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [criando, setCriando] = useState(false)
  const [form, setForm] = useState({ nome: '', tipo: 'instituicao' as 'instituicao' | 'empresa', cnpj: '', cidade: '', estado: '' })
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [copiadoId, setCopiadoId] = useState<string | null>(null)

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
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                    {c.tipo === 'instituicao' ? '🏫' : '🏢'} {c.nome}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                    {c.tipo === 'instituicao' ? 'Instituição' : 'Empresa'}{c.cidade ? ` · ${c.cidade}${c.estado ? '/' + c.estado : ''}` : ''}{c.cnpj ? ` · ${c.cnpj}` : ''}
                  </div>
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
