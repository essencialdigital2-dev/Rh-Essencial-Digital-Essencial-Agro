'use client'
import { useState } from 'react'

const PACOTES = [
  { id: 'educacional', label: '🎓 Educacional', desc: 'Essencial Estudo + Teens + Sense AI + NexoPerform' },
  { id: 'agro', label: '🌾 Agro Tech + gestão', desc: 'Agro Tech + Sense AI + NexoPerform' },
  { id: 'agro_solo', label: '🌾 Só o Agro Tech', desc: 'Foco só na gestão de pessoas do campo' },
]

export default function QueroConhecerPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [contato, setContato] = useState('')
  const [pacote, setPacote] = useState('educacional')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [portalId, setPortalId] = useState('')

  async function enviar() {
    if (!nome.trim() || !email.trim()) { setErro('Preencha nome e e-mail'); return }
    setErro('')
    setEnviando(true)
    try {
      const res = await fetch('/api/lead-trial', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, pacote, contato }),
      })
      const d = await res.json()
      if (d.error) { setErro(d.error); return }
      setPortalId(d.portalId)
    } catch {
      setErro('Não foi possível processar agora. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (portalId) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a15', color: '#F8F8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Seu acesso de demonstração está pronto!</h1>
          <p style={{ color: 'rgba(248,248,255,.6)', fontSize: 14, marginBottom: 24 }}>7 dias grátis, sem cartão. Clique abaixo pra entrar.</p>
          <a href={`/portal/${portalId}`} style={{ display: 'inline-block', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: 14, fontWeight: 800, fontSize: 15 }}>
            Acessar meu trial →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a15', color: '#F8F8FF', fontFamily: 'system-ui', padding: '64px 24px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>Essencial Human Tech</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 10 }}>Conheça o ecossistema de perto</h1>
          <p style={{ color: 'rgba(248,248,255,.55)', fontSize: 14 }}>Preencha e receba seu acesso de demonstração de 7 dias na hora, sem cartão.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {PACOTES.map(p => (
            <button key={p.id} onClick={() => setPacote(p.id)} style={{
              textAlign: 'left', padding: '14px 16px', borderRadius: 14,
              border: `1.5px solid ${pacote === p.id ? '#A78BFA' : 'rgba(255,255,255,.12)'}`,
              background: pacote === p.id ? 'rgba(139,92,246,.1)' : 'transparent', cursor: 'pointer',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: pacote === p.id ? '#A78BFA' : '#fff' }}>{p.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(248,248,255,.45)', marginTop: 2 }}>{p.desc}</div>
            </button>
          ))}
        </div>

        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome da escola/empresa/fazenda"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }} />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu e-mail" type="email"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }} />
        <input value={contato} onChange={e => setContato(e.target.value)} placeholder="WhatsApp (opcional)"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }} />

        {erro && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{erro}</p>}

        <button onClick={enviar} disabled={enviando} style={{ width: '100%', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', border: 'none', borderRadius: 14, padding: 16, fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
          {enviando ? 'Criando seu acesso...' : 'Quero meu acesso de demonstração →'}
        </button>
      </div>
    </div>
  )
}
