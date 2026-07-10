'use client'
import { useEffect, useState } from 'react'

const CATALOGO: Record<string, { label: string; icone: string; cor: string; desc: string; loginUrl: string }> = {
  edu:    { label: 'Essencial Edu', icone: '🎓', cor: '#A78BFA', desc: 'Inteligência educacional', loginUrl: 'https://essencial-edu.vercel.app/login' },
  estudo: { label: 'Essencial Estudo', icone: '📖', cor: '#7C3AED', desc: 'Plataforma de estudo com IA', loginUrl: 'https://essencialestudo.com.br/login' },
  teens:  { label: 'Essencial Teens', icone: '🌟', cor: '#06b6d4', desc: 'Desenvolvimento socioemocional', loginUrl: 'https://essencialestudo.com.br/teens-entrar' },
  sense:  { label: 'Sense AI', icone: '🧠', cor: '#8b5cf6', desc: 'Saúde emocional e conformidade NR-1', loginUrl: 'https://rhessencialdigital.com.br/sense-login' },
  nexo:   { label: 'NexoPerform', icone: '🧭', cor: '#10b981', desc: 'Assessment comportamental', loginUrl: 'https://nexoperform.vercel.app/auth/login' },
  agro:   { label: 'Agro Tech', icone: '🌾', cor: '#00e676', desc: 'Gestão preditiva para o agronegócio', loginUrl: 'https://agrotech.rhessencialdigital.com.br/sign-in' },
}

export default function PortalCliente({ params }: { params: { id: string } }) {
  const { id } = params
  const [cliente, setCliente] = useState<{ nome: string; tipo: string; modulos_liberados: string[]; trial?: boolean; trial_fim?: string | null; email?: string | null; senha_temporaria?: string | null } | null>(null)
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

        {cliente && cliente.senha_temporaria && (
          <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 14, padding: 18, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#A78BFA', marginBottom: 8, textTransform: 'uppercase' }}>🧠 Acesso já pronto — Sense AI</div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              <strong>E-mail:</strong> {cliente.email}<br />
              <strong>Senha temporária:</strong> {cliente.senha_temporaria}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
              Use esses dados no botão "Sense AI" abaixo para entrar. Recomendamos trocar a senha após o primeiro acesso.
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
