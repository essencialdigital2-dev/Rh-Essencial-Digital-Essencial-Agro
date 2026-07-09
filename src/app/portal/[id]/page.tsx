'use client'
import { useEffect, useState, use } from 'react'

const CATALOGO: Record<string, { label: string; icone: string; cor: string; desc: string; loginUrl: string }> = {
  edu:    { label: 'Essencial Edu', icone: '🎓', cor: '#A78BFA', desc: 'Inteligência educacional', loginUrl: 'https://essencial-edu.vercel.app/login' },
  estudo: { label: 'Essencial Estudo', icone: '📖', cor: '#7C3AED', desc: 'Plataforma de estudo com IA', loginUrl: 'https://essencialestudo.com.br/login' },
  teens:  { label: 'Essencial Teens', icone: '🌟', cor: '#06b6d4', desc: 'Desenvolvimento socioemocional', loginUrl: 'https://essencialestudo.com.br/teens-entrar' },
  sense:  { label: 'Sense AI', icone: '🧠', cor: '#8b5cf6', desc: 'Saúde emocional e conformidade NR-1', loginUrl: 'https://rhessencialdigital.com.br/sense-login' },
  nexo:   { label: 'NexoPerform', icone: '🧭', cor: '#10b981', desc: 'Assessment comportamental', loginUrl: 'https://nexoperform.vercel.app/auth/login' },
  agro:   { label: 'Agro Tech', icone: '🌾', cor: '#00e676', desc: 'Gestão preditiva para o agronegócio', loginUrl: 'https://agrotech.rhessencialdigital.com.br/sign-in' },
}

export default function PortalCliente({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [cliente, setCliente] = useState<{ nome: string; tipo: string; modulos_liberados: string[] } | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    fetch(`/api/portal/${id}`)
      .then(r => r.json())
      .then(d => { if (d.encontrado) setCliente(d); else setErro(true) })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false))
  }, [id])

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
              <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Olá, {cliente.nome} 👋</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>
                Aqui estão os produtos Essencial Digital disponíveis para {cliente.tipo === 'instituicao' ? 'sua instituição' : 'sua empresa'}.
              </p>
            </>
          )}
        </div>

        {cliente && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {cliente.modulos_liberados.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                Nenhum produto liberado ainda. Fale com a Essencial Digital.
              </div>
            ) : cliente.modulos_liberados.map(m => {
              const info = CATALOGO[m]
              if (!info) return null
              return (
                <a key={m} href={info.loginUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: 'block', padding: 22, borderRadius: 18, textDecoration: 'none', color: '#F8F8FF',
                  background: `${info.cor}0D`, border: `1px solid ${info.cor}30`, transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{info.icone}</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{info.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{info.desc}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: info.cor, marginTop: 14 }}>Entrar →</div>
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
