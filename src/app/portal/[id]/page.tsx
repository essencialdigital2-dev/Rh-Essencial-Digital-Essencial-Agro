'use client'
import { useEffect, useState } from 'react'

const CATALOGO: Record<string, { label: string; icone: string; cor: string; desc: string; loginUrl: string }> = {
  edu:    { label: 'Essencial Edu', icone: '🎓', cor: '#A78BFA', desc: 'Inteligência educacional', loginUrl: 'https://essencial-edu.vercel.app/login' },
  estudo: { label: 'Essencial Estudo', icone: '📖', cor: '#7C3AED', desc: 'Plataforma de estudo com IA', loginUrl: 'https://essencialestudo.com.br/login' },
  teens:  { label: 'Essencial Teens', icone: '🌟', cor: '#06b6d4', desc: 'Desenvolvimento socioemocional', loginUrl: 'https://essencialestudo.com.br/teens-entrar' },
  sense:  { label: 'Sense AI', icone: '🧠', cor: '#8b5cf6', desc: 'Saúde emocional e conformidade NR-1', loginUrl: 'https://rhessencialdigital.com.br/sense-login' },
  nexo:   { label: 'NexoPerform', icone: '🧭', cor: '#10b981', desc: 'Assessment comportamental', loginUrl: 'https://nexoperform.vercel.app/empresa' },
  agro:   { label: 'Agro Tech', icone: '🌾', cor: '#00e676', desc: 'Gestão preditiva para o agronegócio', loginUrl: 'https://agrotech.rhessencialdigital.com.br/sign-up' },
}

const MODULOS_AUTOCADASTRO = ['sense', 'estudo', 'teens', 'edu']
const MODULOS_CODIGO_ACESSO = ['nexo']
const MODULOS_NATIVO = ['agro']

type Cliente = { nome: string; tipo: string; modulos_liberados: string[]; trial?: boolean; trial_fim?: string | null; email?: string | null; senha_temporaria?: string | null; nexo_codigo?: string | null }

export default function PortalCliente({ params }: { params: { id: string } }) {
  const { id } = params
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

  const [emailForm, setEmailForm] = useState('')
  const [senhaForm, setSenhaForm] = useState('')
  const [criando, setCriando] = useState(false)
  const [erroCadastro, setErroCadastro] = useState('')

  function carregar() {
    fetch(`/api/portal/${id}`)
      .then(r => r.json())
      .then(d => { if (d.encontrado) setCliente(d); else setErro(true) })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false))
  }

  useEffect(() => { carregar() }, [id])

  async function criarAcesso() {
    if (!emailForm || senhaForm.length < 6) {
      setErroCadastro('Preencha e-mail e uma senha com pelo menos 6 caracteres.')
      return
    }
    setCriando(true)
    setErroCadastro('')
    try {
      const r = await fetch(`/api/portal/${id}/cadastrar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailForm, senha: senhaForm }),
      })
      const d = await r.json()
      if (!r.ok) { setErroCadastro(d.error || 'Erro ao criar acesso.'); setCriando(false); return }
      carregar()
    } catch {
      setErroCadastro('Erro ao criar acesso. Tente novamente.')
    }
    setCriando(false)
  }

  const modulosComAutocadastro = cliente ? cliente.modulos_liberados.filter(m => MODULOS_AUTOCADASTRO.includes(m) || MODULOS_CODIGO_ACESSO.includes(m)) : []
  const precisaCadastrar = !!cliente && !cliente.senha_temporaria && !cliente.nexo_codigo && modulosComAutocadastro.length > 0

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', color: '#F8F8FF', fontFamily: 'system-ui,sans-serif', padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10, background: 'linear-gradient(135deg,#A78BFA,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Essencial Human Tech · Transformando tecnologia em desenvolvimento humano
          </div>
          {carregando ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Carregando...</div>
          ) : erro || !cliente ? (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Link não encontrado. Fale com a Essencial Digital.</div>
          ) : (
            <>
              {cliente.trial && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 99, padding: '6px 16px', marginBottom: 16, fontSize: 12, fontWeight: 800, color: '#F59E0B' }}>
                  🎁 Link de Demonstração
                  {cliente.trial_fim && (() => {
                    const dias = Math.max(0, Math.ceil((new Date(cliente.trial_fim!).getTime() - Date.now()) / 86400000))
                    return <span style={{ color: 'rgba(245,158,11,0.7)', fontWeight: 600 }}>· {dias > 0 ? `${dias} dia${dias !== 1 ? 's' : ''} restante${dias !== 1 ? 's' : ''}` : 'expirado'}</span>
                  })()}
                </div>
              )}
              <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Olá, {cliente.nome} 👋</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>
                {cliente.trial
                  ? `Este é o seu acesso de demonstração aos produtos Essencial Digital para ${cliente.tipo === 'instituicao' ? 'sua instituição' : 'sua empresa'} conhecer.`
                  : `Aqui estão os produtos Essencial Digital disponíveis para ${cliente.tipo === 'instituicao' ? 'sua instituição' : 'sua empresa'}.`}
              </p>
            </>
          )}
        </div>

        {precisaCadastrar && (
          <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#A78BFA', marginBottom: 4, textTransform: 'uppercase' }}>🔑 Crie seu acesso</div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
              Escolha um e-mail e uma senha — sua conta é criada na hora nos produtos deste pacote que já suportam cadastro automático ({modulosComAutocadastro.map(m => CATALOGO[m]?.label).join(', ')}).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
              <input value={emailForm} onChange={e => setEmailForm(e.target.value)} placeholder="Seu e-mail" style={inputStyle} />
              <input value={senhaForm} onChange={e => setSenhaForm(e.target.value)} placeholder="Crie uma senha" type="password" style={inputStyle} />
              <button onClick={criarAcesso} disabled={criando} style={{ padding: '0 18px', borderRadius: 10, border: 'none', background: '#8B5CF6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: criando ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                {criando ? 'Criando...' : 'Criar acesso'}
              </button>
            </div>
            {erroCadastro && <p style={{ fontSize: 12, color: '#FCA5A5', marginTop: 10 }}>{erroCadastro}</p>}
          </div>
        )}

        {cliente && cliente.senha_temporaria && (
          <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 14, padding: 18, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#34D399', marginBottom: 8, textTransform: 'uppercase' }}>✓ Acesso pronto</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              <strong>E-mail:</strong> {cliente.email}<br />
              <strong>Senha:</strong> {cliente.senha_temporaria}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              Use esses dados nos botões abaixo marcados como prontos.
            </p>
          </div>
        )}

        {cliente && cliente.nexo_codigo && (
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: 18, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#10B981', marginBottom: 8, textTransform: 'uppercase' }}>🧭 Código do NexoPerform</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              <strong>Código de acesso:</strong> {cliente.nexo_codigo}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              Não precisa de senha — cole esse código na tela do NexoPerform pra entrar direto no painel da empresa.
            </p>
          </div>
        )}

        {cliente && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {cliente.modulos_liberados.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                Nenhum produto liberado ainda. Fale com a Essencial Digital.
              </div>
            ) : cliente.modulos_liberados.map(m => {
              const info = CATALOGO[m]
              if (!info) return null

              // Agro Tech: cadastro proprio (Clerk), sempre disponivel
              if (MODULOS_NATIVO.includes(m)) {
                return (
                  <a key={m} href={info.loginUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: 'block', padding: 22, borderRadius: 18, textDecoration: 'none', color: '#F8F8FF',
                    background: `${info.cor}0D`, border: `1px solid ${info.cor}30`,
                  }}>
                    <div style={{ fontSize: 30, marginBottom: 10 }}>{info.icone}</div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{info.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{info.desc}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: info.cor, marginTop: 14 }}>Criar minha conta →</div>
                  </a>
                )
              }

              // NexoPerform: acesso por codigo de convite, sem senha
              if (MODULOS_CODIGO_ACESSO.includes(m)) {
                const pronto = !!cliente.nexo_codigo
                return (
                  <a key={m} href={pronto ? info.loginUrl : undefined} target="_blank" rel="noopener noreferrer" style={{
                    display: 'block', padding: 22, borderRadius: 18, textDecoration: 'none', color: '#F8F8FF',
                    background: `${info.cor}0D`, border: `1px solid ${info.cor}30`,
                    opacity: pronto ? 1 : 0.5, pointerEvents: pronto ? 'auto' : 'none',
                  }}>
                    <div style={{ fontSize: 30, marginBottom: 10 }}>{info.icone}</div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{info.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{info.desc}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: info.cor, marginTop: 14 }}>
                      {pronto ? 'Entrar com código →' : 'Crie seu acesso acima primeiro'}
                    </div>
                  </a>
                )
              }

              const autocadastro = MODULOS_AUTOCADASTRO.includes(m)
              const pronto = autocadastro && !!cliente.senha_temporaria
              const bloqueadoSemConta = autocadastro && !pronto
              if (!autocadastro) {
                return (
                  <div key={m} style={{ padding: 22, borderRadius: 18, color: '#F8F8FF', background: `${info.cor}0D`, border: `1px solid ${info.cor}30` }}>
                    <div style={{ fontSize: 30, marginBottom: 10 }}>{info.icone}</div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{info.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{info.desc}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginTop: 14 }}>Fale com a Essencial Digital para liberar este acesso</div>
                  </div>
                )
              }
              return (
                <a key={m} href={pronto ? info.loginUrl : undefined} target="_blank" rel="noopener noreferrer" style={{
                  display: 'block', padding: 22, borderRadius: 18, textDecoration: 'none', color: '#F8F8FF',
                  background: `${info.cor}0D`, border: `1px solid ${info.cor}30`, transition: 'all 0.2s',
                  opacity: bloqueadoSemConta ? 0.5 : 1, pointerEvents: bloqueadoSemConta ? 'none' : 'auto',
                }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{info.icone}</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{info.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{info.desc}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: info.cor, marginTop: 14 }}>
                    {bloqueadoSemConta ? 'Crie seu acesso acima primeiro' : 'Entrar →'}
                  </div>
                </a>
              )
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 48, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Essencial Digital Human Tech · Todos os direitos reservados
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, color: '#fff', fontSize: 13, outline: 'none',
}
