'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClienteLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const res = await fetch('/api/cliente-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setErro(data.error || 'Erro ao entrar.')
    router.push('/cliente')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px', boxShadow: '0 0 32px rgba(139,92,246,0.4)' }}>🏢</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#F8F8FF', margin: '0 0 6px' }}>Portal do Cliente</h1>
          <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', margin: 0 }}>Essencial Digital — acesso exclusivo para empresas</p>
        </div>

        <form onSubmit={entrar} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 32 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(248,248,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>E-mail da empresa</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="empresa@email.com"
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8F8FF', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(248,248,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Senha</label>
            <input
              type="password" value={senha} onChange={e => setSenha(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8F8FF', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {erro && <p style={{ color: '#F87171', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{erro}</p>}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Entrando...' : 'Entrar no Portal'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(248,248,255,0.25)' }}>
          Problemas com acesso? Entre em contato com a Essencial Digital.
        </p>
      </div>
    </div>
  )
}
