'use client'
import { useState } from 'react'

const CANAIS = [
  { id: 'instagram', label: '📸 Instagram' },
  { id: 'whatsapp', label: '💬 WhatsApp' },
  { id: 'email', label: '✉️ E-mail' },
  { id: 'linkedin', label: '💼 LinkedIn' },
]

export default function ProspeccaoPage() {
  const [canal, setCanal] = useState('whatsapp')
  const [publico, setPublico] = useState('')
  const [contexto, setContexto] = useState('')
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState('')
  const [texto, setTexto] = useState('')
  const [copiado, setCopiado] = useState(false)

  async function gerar() {
    setErro('')
    setGerando(true)
    setTexto('')
    try {
      const res = await fetch('/api/eco-prospeccao', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canal, publico, contexto }),
      })
      const d = await res.json()
      if (d.error) { setErro(d.error); return }
      setTexto(d.text)
    } catch {
      setErro('Não foi possível gerar agora. Tente novamente.')
    } finally {
      setGerando(false)
    }
  }

  function copiar() {
    navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px', color: '#F8F8FF', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Assistente de Prospecção</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Gerar mensagem para lead</h1>
        <p style={{ color: 'rgba(248,248,255,.55)', fontSize: 13 }}>Descreva o lead e o contexto, escolha o canal, e a IA gera uma mensagem pronta pra enviar.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {CANAIS.map(c => (
          <button key={c.id} onClick={() => setCanal(c.id)} style={{
            flex: 1, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 700,
            border: `1.5px solid ${canal === c.id ? '#A78BFA' : 'rgba(255,255,255,.12)'}`,
            background: canal === c.id ? 'rgba(139,92,246,.12)' : 'transparent',
            color: canal === c.id ? '#A78BFA' : '#fff',
          }}>{c.label}</button>
        ))}
      </div>

      <input value={publico} onChange={e => setPublico(e.target.value)}
        placeholder="Público-alvo (ex: escolas de Mato Grosso, fazendas de soja...)"
        style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }} />

      <textarea value={contexto} onChange={e => setContexto(e.target.value)}
        placeholder="Contexto (ex: já conversei com o diretor, quero focar no Sense AI, oferecer trial de 7 dias...)"
        rows={4}
        style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 14, marginBottom: 16, boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />

      {erro && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{erro}</p>}

      <button onClick={gerar} disabled={gerando} style={{ width: '100%', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', border: 'none', borderRadius: 14, padding: 14, fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>
        {gerando ? 'Gerando...' : '✨ Gerar mensagem'}
      </button>

      {texto && (
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 18 }}>
          <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 14 }}>{texto}</p>
          <button onClick={copiar} style={{ background: 'rgba(139,92,246,.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,.3)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {copiado ? '✓ Copiado!' : '📋 Copiar mensagem'}
          </button>
        </div>
      )}
    </div>
  )
}
