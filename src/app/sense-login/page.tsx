'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://uysmvziehlpugmgssibs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5c212emllaGxwdWdtZ3NzaWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzU5MDUsImV4cCI6MjA5NTY1MTkwNX0.iuhDiTQCoIZSfSccURAITwnuejEmWABG8KW7RtGH9-8'
)

function BrainSVG({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M50 18 C30 18 14 31 14 48 C14 59 20 67 29 72 C29 78 33 84 40 86 C42 87 44 85 44 83 L44 74 C40 72 38 68 37 63 C33 60 30 55 30 48 C30 35 39 28 50 28 Z" fill="url(#lg1)" opacity="0.92" />
      <path d="M50 18 C70 18 86 31 86 48 C86 59 80 67 71 72 C71 78 67 84 60 86 C58 87 56 85 56 83 L56 74 C60 72 62 68 63 63 C67 60 70 55 70 48 C70 35 61 28 50 28 Z" fill="url(#lg2)" opacity="0.92" />
      <line x1="50" y1="20" x2="50" y2="82" stroke="#08080F" strokeWidth="2.5" />
      <path d="M24 46 Q32 41 38 46 Q32 51 24 46Z" fill="rgba(255,255,255,0.22)" />
      <path d="M21 59 Q30 54 36 59 Q30 64 21 59Z" fill="rgba(255,255,255,0.18)" />
      <path d="M28 34 Q36 30 41 35 Q36 40 28 34Z" fill="rgba(255,255,255,0.16)" />
      <path d="M76 46 Q68 41 62 46 Q68 51 76 46Z" fill="rgba(255,255,255,0.22)" />
      <path d="M79 59 Q70 54 64 59 Q70 64 79 59Z" fill="rgba(255,255,255,0.18)" />
      <path d="M72 34 Q64 30 59 35 Q64 40 72 34Z" fill="rgba(255,255,255,0.16)" />
      <circle cx="31" cy="45" r="3" fill="#F8F8FF" opacity="0.95" />
      <circle cx="39" cy="59" r="2.5" fill="#06B6D4" opacity="0.95" />
      <circle cx="26" cy="60" r="2" fill="#A78BFA" opacity="0.95" />
      <circle cx="69" cy="45" r="3" fill="#F8F8FF" opacity="0.95" />
      <circle cx="61" cy="59" r="2.5" fill="#06B6D4" opacity="0.95" />
      <circle cx="74" cy="60" r="2" fill="#A78BFA" opacity="0.95" />
      <circle cx="50" cy="36" r="2.5" fill="#EC4899" opacity="0.95" />
      <line x1="31" y1="45" x2="39" y2="59" stroke="#A78BFA" strokeWidth="1.2" opacity="0.7" />
      <line x1="39" y1="59" x2="26" y2="60" stroke="#06B6D4" strokeWidth="1.2" opacity="0.7" />
      <line x1="69" y1="45" x2="61" y2="59" stroke="#A78BFA" strokeWidth="1.2" opacity="0.7" />
      <line x1="61" y1="59" x2="74" y2="60" stroke="#06B6D4" strokeWidth="1.2" opacity="0.7" />
      <line x1="50" y1="36" x2="31" y2="45" stroke="#EC4899" strokeWidth="1" opacity="0.6" />
      <line x1="50" y1="36" x2="69" y2="45" stroke="#EC4899" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

export default function SenseLogin() {
  const [aba, setAba] = useState<'login' | 'cadastro'>('login')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ texto: string; tipo: 'erro' | 'ok' } | null>(null)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [nome, setNome] = useState('')
  const [emailC, setEmailC] = useState('')
  const [senhaC, setSenhaC] = useState('')

  async function entrar() {
    if (!email || !senha) { setMsg({ texto: 'Preencha e-mail e senha.', tipo: 'erro' }); return }
    setLoading(true); setMsg(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setLoading(false)
    if (error) { setMsg({ texto: 'E-mail ou senha incorretos.', tipo: 'erro' }); return }
    const perfil = data.user?.user_metadata?.perfil
    window.location.href = perfil === 'colaborador' ? '/sense-colab' : '/sense-app'
  }

  async function cadastrar() {
    if (!empresa || !nome || !emailC || !senhaC) { setMsg({ texto: 'Preencha todos os campos.', tipo: 'erro' }); return }
    if (senhaC.length < 8) { setMsg({ texto: 'Senha minimo 8 caracteres.', tipo: 'erro' }); return }
    setLoading(true); setMsg(null)
    const { data, error } = await supabase.auth.signUp({
      email: emailC, password: senhaC,
      options: { data: { nome, empresa, perfil: 'gestor' } }
    })
    if (error) { setLoading(false); setMsg({ texto: error.message, tipo: 'erro' }); return }
    if (data.user) {
      await supabase.rpc('registrar_empresa', {
        p_user_id: data.user.id, p_nome_empresa: empresa, p_cnpj: '',
        p_plano: 'starter', p_nome_usuario: nome, p_email: emailC
      })
    }
    setLoading(false)
    setMsg({ texto: 'Conta criada! Entrando...', tipo: 'ok' })
    setTimeout(() => { window.location.href = '/sense-app' }, 1500)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.25)',
    borderRadius: 10, color: '#f8f8ff', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  }

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: 14, border: 'none', borderRadius: 10,
    fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8,
    background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    color: '#fff', fontFamily: 'inherit', opacity: loading ? .7 : 1,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>

      {/* LADO ESQUERDO — cerebro */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0533 60%, #0a0a18 100%)',
        padding: '48px 40px',
      }}>
        {/* glows */}
        <div style={{ position: 'absolute', top: '-100px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-120px', right: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* faixa topo */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#8B5CF6,#EC4899,#06B6D4)' }} />

        {/* conteudo */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 420 }}>
          {/* aneis ao redor do cerebro */}
          <div style={{ position: 'relative', width: 280, height: 280, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.12)' }} />
            <div style={{ position: 'absolute', width: 230, height: 230, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.2)' }} />
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.35)', background: 'rgba(139,92,246,0.05)' }} />
            {/* particulas */}
            {[
              { top: '8%', left: '50%', bg: '#A78BFA', s: 8 },
              { top: '50%', left: '4%', bg: '#EC4899', s: 6 },
              { top: '85%', left: '30%', bg: '#06B6D4', s: 8 },
              { top: '85%', right: '30%', bg: '#A78BFA', s: 6 },
              { top: '50%', right: '4%', bg: '#EC4899', s: 7 },
              { top: '15%', right: '18%', bg: '#06B6D4', s: 5 },
            ].map((p, i) => (
              <div key={i} style={{ position: 'absolute', width: p.s, height: p.s, borderRadius: '50%', background: p.bg, boxShadow: `0 0 ${p.s * 3}px ${p.bg}`, top: p.top, left: (p as any).left, right: (p as any).right }} />
            ))}
            <BrainSVG size={180} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 999, padding: '5px 16px', marginBottom: 20 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#A78BFA' }} />
            <span style={{ fontSize: 11, color: '#C4B5FD', fontWeight: 700, letterSpacing: 2 }}>ESSENCIAL SENSE AI</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#F8F8FF', margin: '0 0 12px', lineHeight: 1.15 }}>
            Human Intelligence<br />
            <span style={{ color: '#A78BFA' }}>Platform</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(248,248,255,0.5)', lineHeight: 1.7, margin: '0 0 32px' }}>
            Psicologia Organizacional + IA Preditiva.<br />Do sinal humano a decisao estrategica.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['DISC', 'Check-in', 'NR-1', 'Analytics', 'IA'].map(t => (
              <span key={t} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#C4B5FD', fontWeight: 600 }}>{t}</span>
            ))}
          </div>

          <p style={{ fontSize: 11, color: 'rgba(248,248,255,0.2)', marginTop: 40 }}>
            rhessencialdigital.com.br/sense-login
          </p>
        </div>
      </div>

      {/* LADO DIREITO — formulario */}
      <div style={{ width: '100%', maxWidth: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#0d0d1a', borderLeft: '1px solid rgba(139,92,246,0.15)' }}>
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ color: '#F8F8FF', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>
              {aba === 'login' ? 'Bem-vinda de volta' : 'Criar sua conta'}
            </h2>
            <p style={{ color: 'rgba(248,248,255,0.4)', fontSize: 13, margin: 0 }}>
              {aba === 'login' ? 'Acesse o painel Sense AI' : 'Comece gratuitamente hoje'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 4, background: 'rgba(139,92,246,.08)', borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {(['login', 'cadastro'] as const).map(t => (
              <button key={t} onClick={() => { setAba(t); setMsg(null) }} style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'inherit', background: aba === t ? '#8b5cf6' : 'none', color: aba === t ? '#fff' : 'rgba(248,248,255,.45)', transition: 'all .2s' }}>
                {t === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          {msg && (
            <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 18, fontSize: 13, background: msg.tipo === 'ok' ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${msg.tipo === 'ok' ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, color: msg.tipo === 'ok' ? '#4ade80' : '#f87171' }}>
              {msg.texto}
            </div>
          )}

          {aba === 'login' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>E-mail</label>
                <input style={inp} type="email" placeholder="voce@empresa.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && entrar()} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Senha</label>
                <input style={inp} type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && entrar()} />
              </div>
              <button style={btnStyle} onClick={entrar} disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar na plataforma →'}
              </button>
              <p style={{ textAlign: 'center', margin: 0 }}>
                <button onClick={async () => {
                  if (!email) { setMsg({ texto: 'Digite seu e-mail acima primeiro.', tipo: 'erro' }); return }
                  await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://rhessencialdigital.com.br/sense-login' })
                  setMsg({ texto: 'E-mail de redefinicao enviado! Verifique sua caixa de entrada.', tipo: 'ok' })
                }} style={{ background: 'none', border: 'none', color: 'rgba(139,92,246,.7)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                  Esqueci minha senha
                </button>
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Nome da empresa</label>
                <input style={inp} type="text" placeholder="Ex: Essencial Digital" value={empresa} onChange={e => setEmpresa(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Seu nome</label>
                <input style={inp} type="text" placeholder="Nome do responsavel" value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>E-mail corporativo</label>
                <input style={inp} type="email" placeholder="voce@empresa.com" value={emailC} onChange={e => setEmailC(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Senha (min. 8 caracteres)</label>
                <input style={inp} type="password" placeholder="••••••••" value={senhaC} onChange={e => setSenhaC(e.target.value)} />
              </div>
              <button style={btnStyle} onClick={cadastrar} disabled={loading}>
                {loading ? 'Criando conta...' : 'Comecar gratuitamente →'}
              </button>
            </div>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(139,92,246,0.1)' }}>
            <a href="/sense-apresentacao" style={{ fontSize: 12, color: 'rgba(139,92,246,0.6)', textDecoration: 'none' }}>
              ← Conhecer a plataforma
            </a>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(248,248,255,.15)', marginTop: 24, marginBottom: 0 }}>
            © 2026 Alana Carvalho · CNPJ 58.062.495/0001-63
          </p>
        </div>
      </div>
    </div>
  )
}
