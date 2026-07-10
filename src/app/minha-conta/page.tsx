'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function MinhaConta() {
  const [user, setUser] = useState<any>(null)
  const [nome, setNome] = useState('')
  const [cargo, setCargo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [msgSenha, setMsgSenha] = useState<{ texto: string; tipo: 'ok' | 'erro' } | null>(null)
  const [msgPerfil, setMsgPerfil] = useState<{ texto: string; tipo: 'ok' | 'erro' } | null>(null)
  const [carregando, setCarregando] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user || { email: 'admin@essencial.com', user_metadata: {} } as any)
      setNome(user?.user_metadata?.nome || user?.user_metadata?.name || '')
      setCargo(user?.user_metadata?.cargo || '')
      setAvatar(user?.user_metadata?.avatar_url || null)
      setCarregando(false)
    })
  }, [])

  async function salvarPerfil() {
    setLoading(true); setMsgPerfil(null)
    const { error } = await supabase.auth.updateUser({
      data: { nome, cargo }
    })
    setLoading(false)
    if (error) { setMsgPerfil({ texto: 'Erro ao salvar perfil.', tipo: 'erro' }); return }
    setMsgPerfil({ texto: 'Perfil atualizado com sucesso!', tipo: 'ok' })
  }

  async function trocarSenha() {
    if (!novaSenha || novaSenha.length < 8) { setMsgSenha({ texto: 'Senha deve ter ao menos 8 caracteres.', tipo: 'erro' }); return }
    if (novaSenha !== confirmarSenha) { setMsgSenha({ texto: 'As senhas não coincidem.', tipo: 'erro' }); return }
    setLoading(true); setMsgSenha(null)
    const { error } = await supabase.auth.updateUser({ password: novaSenha })
    setLoading(false)
    if (error) { setMsgSenha({ texto: 'Erro ao trocar senha. Tente novamente.', tipo: 'erro' }); return }
    setNovaSenha(''); setConfirmarSenha('')
    setMsgSenha({ texto: 'Senha atualizada com sucesso!', tipo: 'ok' })
  }

  async function uploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setLoading(true)
    const ext = file.name.split('.').pop()
    const path = `avatars/${user.id}.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { setLoading(false); setMsgPerfil({ texto: 'Erro ao enviar foto.', tipo: 'erro' }); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
    setAvatar(data.publicUrl)
    setLoading(false)
    setMsgPerfil({ texto: 'Foto atualizada!', tipo: 'ok' })
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.25)',
    borderRadius: 10, color: '#f8f8ff', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  }

  const card: React.CSSProperties = {
    background: '#0d0d1a', borderRadius: 16, border: '1px solid rgba(139,92,246,.15)', padding: '28px 32px', marginBottom: 20,
  }

  const btn = (cor = '#8b5cf6'): React.CSSProperties => ({
    padding: '12px 24px', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer', background: `linear-gradient(135deg,${cor},#ec4899)`,
    color: '#fff', fontFamily: 'inherit', opacity: loading ? .7 : 1,
  })

  const msg = (m: { texto: string; tipo: string } | null) => m ? (
    <div style={{ padding: '10px 14px', borderRadius: 8, marginTop: 12, fontSize: 13, background: m.tipo === 'ok' ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${m.tipo === 'ok' ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, color: m.tipo === 'ok' ? '#86EFAC' : '#FCA5A5' }}>{m.texto}</div>
  ) : null

  if (carregando) return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(248,248,255,.4)', fontSize: 14 }}>Carregando...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', fontFamily: 'system-ui,sans-serif', color: '#f8f8ff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(139,92,246,.12)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,8,15,.95)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Essencial <span style={{ color: '#A78BFA' }}>Sense AI</span></span>
        </div>
        <a href="/sense-app" style={{ fontSize: 13, color: 'rgba(248,248,255,.4)', textDecoration: 'none' }}>← Voltar</a>
      </div>

      <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Minha Conta</h1>
        <p style={{ color: 'rgba(248,248,255,.4)', fontSize: 13, marginBottom: 32 }}>{user?.email}</p>

        {/* Foto de perfil */}
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: '#A78BFA' }}>Foto de Perfil</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ width: 80, height: 80, borderRadius: '50%', background: avatar ? 'none' : 'linear-gradient(135deg,#8b5cf6,#ec4899)', border: '2px solid rgba(139,92,246,.4)', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}
            >
              {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
            </div>
            <div>
              <button style={btn()} onClick={() => fileRef.current?.click()} disabled={loading}>
                {loading ? 'Enviando...' : 'Alterar foto'}
              </button>
              <p style={{ fontSize: 12, color: 'rgba(248,248,255,.3)', marginTop: 8 }}>JPG ou PNG. Máximo 2MB.</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadFoto} />
          {msg(msgPerfil)}
        </div>

        {/* Dados pessoais */}
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: '#A78BFA' }}>Dados Pessoais</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Nome</label>
              <input style={inp} type="text" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Cargo</label>
              <input style={inp} type="text" placeholder="Ex: Gerente de RH" value={cargo} onChange={e => setCargo(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>E-mail</label>
              <input style={{ ...inp, opacity: .5, cursor: 'not-allowed' }} type="email" value={user?.email || ''} disabled />
            </div>
            <button style={btn()} onClick={salvarPerfil} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar dados'}
            </button>
          </div>
        </div>

        {/* Trocar senha */}
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, color: '#A78BFA' }}>Trocar Senha</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Nova senha</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inp, paddingRight: 44 }} type={mostrarSenha ? 'text' : 'password'} placeholder="••••••••" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
                <button type="button" onClick={() => setMostrarSenha(v => !v)} tabIndex={-1}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,248,255,.4)', fontSize: 16 }}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>
                  {mostrarSenha ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(248,248,255,.5)', marginBottom: 8 }}>Confirmar senha</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inp, paddingRight: 44 }} type={mostrarSenha ? 'text' : 'password'} placeholder="••••••••" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && trocarSenha()} />
                <button type="button" onClick={() => setMostrarSenha(v => !v)} tabIndex={-1}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,248,255,.4)', fontSize: 16 }}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>
                  {mostrarSenha ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button style={btn()} onClick={trocarSenha} disabled={loading}>
              {loading ? 'Salvando...' : 'Atualizar senha'}
            </button>
            {msg(msgSenha)}
          </div>
        </div>

        {/* Sair */}
        <div style={{ textAlign: 'center', paddingBottom: 40 }}>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/sense-login' }}
            style={{ background: 'none', border: '1px solid rgba(239,68,68,.3)', color: 'rgba(239,68,68,.7)', padding: '10px 24px', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  )
}
