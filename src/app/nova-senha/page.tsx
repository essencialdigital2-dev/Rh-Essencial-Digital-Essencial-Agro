'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NovaSenha() {
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [msg, setMsg] = useState<{ texto: string; tipo: 'erro' | 'ok' } | null>(null)
  const [loading, setLoading] = useState(false)
  const [pronto, setPronto] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', '?'))
      const token = params.get('access_token')
      const refresh = params.get('refresh_token')
      if (token && refresh) {
        supabase.auth.setSession({ access_token: token, refresh_token: refresh })
      }
    }
    setPronto(true)
  }, [])

  async function salvar() {
    if (!senha || senha.length < 8) { setMsg({ texto: 'Senha deve ter ao menos 8 caracteres.', tipo: 'erro' }); return }
    if (senha !== confirmar) { setMsg({ texto: 'As senhas não coincidem.', tipo: 'erro' }); return }
    setLoading(true); setMsg(null)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setLoading(false)
    if (error) { setMsg({ texto: 'Erro ao atualizar senha. Tente novamente.', tipo: 'erro' }); return }
    setMsg({ texto: 'Senha atualizada! Redirecionando...', tipo: 'ok' })
    setTimeout(() => { window.location.href = '/sense-app' }, 2000)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.25)',
    borderRadius: 10, color: '#f8f8ff', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  }

  if (!pronto) return null

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '40px 32px', background: '#0d0d1a', borderRadius: 16, border: '1px solid rgba(139,92,246,.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔐</div>
          <h1 style={{ color: '#F8F8FF', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Nova senha</h1>
          <p style={{ color: 'rgba(248,248,255,.4)', fontSize: 13, margin: 0 }}>Defina sua senha de acesso ao Sense AI</p>
        </div>

        {msg && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, background: msg.tipo === 'erro' ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)', border: `1px solid ${msg.tipo === 'erro' ? 'rgba(239,68,68,.3)' : 'rgba(34,197,94,.3)'}`, color: msg.tipo === 'erro' ? '#FCA5A5' : '#86EFAC', fontSize: 13 }}>
            {msg.texto}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Nova senha</label>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inp, paddingRight: 44 }} type={mostrarSenha ? 'text' : 'password'} placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} />
              <button type="button" onClick={() => setMostrarSenha(v => !v)} tabIndex={-1}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,248,255,.4)', fontSize: 16 }}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>
                {mostrarSenha ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Confirmar senha</label>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inp, paddingRight: 44 }} type={mostrarSenha ? 'text' : 'password'} placeholder="••••••••" value={confirmar} onChange={e => setConfirmar(e.target.value)} onKeyDown={e => e.key === 'Enter' && salvar()} />
              <button type="button" onClick={() => setMostrarSenha(v => !v)} tabIndex={-1}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,248,255,.4)', fontSize: 16 }}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>
                {mostrarSenha ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button
            onClick={salvar}
            disabled={loading}
            style={{ width: '100%', padding: 14, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff', fontFamily: 'inherit', opacity: loading ? .7 : 1 }}
          >
            {loading ? 'Salvando...' : 'Salvar nova senha →'}
          </button>
        </div>
      </div>
    </div>
  )
}
