'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CriarSenhaForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') || ''

  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    if (!token) setErro('Link inválido. Solicite um novo acesso à equipe Essencial Digital.')
  }, [token])

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (senha !== confirma) return setErro('As senhas não coincidem.')
    if (senha.length < 6) return setErro('Senha mínima de 6 caracteres.')
    setLoading(true)
    const res = await fetch('/api/cliente-criar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, senha }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setErro(data.error || 'Erro ao salvar senha.')
    setSucesso(true)
    setTimeout(() => router.push('/cliente/login'), 2500)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#F8F8FF',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px', boxShadow: '0 0 32px rgba(139,92,246,0.4)' }}>🔐</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#F8F8FF', margin: '0 0 6px' }}>Criar senha de acesso</h1>
          <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', margin: 0 }}>Portal do Cliente — Essencial Digital</p>
        </div>

        {sucesso ? (
          <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#34D399', marginBottom: 8 }}>Senha criada com sucesso!</div>
            <div style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)' }}>Redirecionando para o login...</div>
          </div>
        ) : (
          <form onSubmit={salvar} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 32 }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(248,248,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Nova senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required placeholder="Mínimo 6 caracteres" style={inp} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(248,248,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Confirmar senha</label>
              <input type="password" value={confirma} onChange={e => setConfirma(e.target.value)} required placeholder="Repita a senha" style={inp} />
            </div>

            {erro && <p style={{ color: '#F87171', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{erro}</p>}

            <button type="submit" disabled={loading || !token}
              style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading || !token ? 0.6 : 1 }}>
              {loading ? 'Salvando...' : 'Criar senha e acessar portal'}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(248,248,255,0.2)' }}>
          Problemas? Entre em contato: essencialdigital2@gmail.com
        </p>
      </div>
    </div>
  )
}

export default function CriarSenhaPage() {
  return (
    <Suspense>
      <CriarSenhaForm />
    </Suspense>
  )
}
