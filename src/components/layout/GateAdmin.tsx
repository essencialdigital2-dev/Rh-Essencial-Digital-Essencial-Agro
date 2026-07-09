'use client'
import { useEffect, useState } from 'react'

const SENHA_CENTRAL = process.env.NEXT_PUBLIC_CENTRAL_PASSWORD

export default function GateAdmin({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null)
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    setOk(sessionStorage.getItem('central_auth') === 'ok')
  }, [])

  function entrar(e: React.FormEvent) {
    e.preventDefault()
    if (senha === SENHA_CENTRAL) {
      sessionStorage.setItem('central_auth', 'ok')
      setOk(true)
    } else {
      setErro('Senha incorreta.')
    }
  }

  if (ok === null) return null
  if (ok) return <>{children}</>

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', padding: 20 }}>
      <form onSubmit={entrar} style={{ width: '100%', maxWidth: 380, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌐</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#F8F8FF', margin: 0 }}>Ecossistema Essencial Digital</h1>
          <p style={{ fontSize: 12, color: 'rgba(248,248,255,0.4)', marginTop: 6 }}>Acesso restrito à fundadora</p>
        </div>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input type={mostrarSenha ? 'text' : 'password'} value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha de acesso" autoFocus
            style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8F8FF', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          <button type="button" onClick={() => setMostrarSenha(v => !v)} tabIndex={-1}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,248,255,.4)', fontSize: 16 }}
            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>
            {mostrarSenha ? '🙈' : '👁️'}
          </button>
        </div>
        {erro && <div style={{ fontSize: 12, color: '#F87171', marginBottom: 12 }}>{erro}</div>}
        <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg,#7C3AED,#06b6d4)', color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
          Entrar →
        </button>
      </form>
    </div>
  )
}
