'use client'
import { useEffect, useState } from 'react'
import { ecoFetch } from '@/lib/ecoFetch'

export default function ErrosPage() {
  const [apps, setApps] = useState<any[]>([])
  const [verificadoEm, setVerificadoEm] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [analise, setAnalise] = useState<any>(null)
  const [analisando, setAnalisando] = useState(false)

  useEffect(() => { verificar() }, [])

  async function verificar() {
    setCarregando(true); setAnalise(null)
    try {
      const r = await ecoFetch('/api/eco-status')
      const d = await r.json()
      setApps(d.apps || [])
      setVerificadoEm(d.verificado_em)
    } finally {
      setCarregando(false)
    }
  }

  async function analisarComIA() {
    setAnalisando(true)
    try {
      const r = await ecoFetch('/api/eco-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apps }),
      })
      const d = await r.json()
      if (d.analise) setAnalise(d.analise)
    } finally {
      setAnalisando(false)
    }
  }

  const comFalha = apps.filter(a => !a.ok)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 60px', fontFamily: 'system-ui,sans-serif', color: '#F8F8FF' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, background: 'linear-gradient(135deg,#F87171,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🚨 Radar de Erros</h1>
          <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', marginTop: 4 }}>Verifica a saúde de cada app do ecossistema em tempo real.</p>
        </div>
        <button onClick={verificar} disabled={carregando} style={{
          background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF',
          padding: '10px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: carregando ? 'not-allowed' : 'pointer',
        }}>{carregando ? 'Verificando...' : '🔄 Verificar agora'}</button>
      </div>
      {verificadoEm && (
        <p style={{ fontSize: 11, color: 'rgba(248,248,255,0.3)', marginBottom: 24 }}>
          Última verificação: {new Date(verificadoEm).toLocaleString('pt-BR')}
        </p>
      )}

      {/* RESUMO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#34D399' }}>{apps.filter(a => a.ok).length}</div>
          <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)' }}>Apps no ar</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: comFalha.length > 0 ? '#F87171' : '#34D399' }}>{comFalha.length}</div>
          <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)' }}>Com falha</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#60A5FA' }}>
            {apps.length > 0 ? Math.round(apps.reduce((a, x) => a + x.latencia_ms, 0) / apps.length) : 0}ms
          </div>
          <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)' }}>Latência média</div>
        </div>
      </div>

      {/* LISTA DE APPS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {apps.map(app => (
          <div key={app.key} style={{
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            background: app.ok ? 'rgba(255,255,255,0.02)' : 'rgba(248,113,113,0.06)',
            border: `1px solid ${app.ok ? 'rgba(255,255,255,.06)' : 'rgba(248,113,113,.25)'}`,
            borderRadius: 12, padding: '12px 16px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: app.ok ? '#34D399' : '#F87171', boxShadow: `0 0 8px ${app.ok ? '#34D399' : '#F87171'}` }} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{app.nome}</div>
              <div style={{ fontSize: 11, color: 'rgba(248,248,255,.4)' }}>{app.url}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: app.ok ? '#34D399' : '#F87171' }}>{app.ok ? `${app.status} OK` : (app.status ? `${app.status} erro` : 'sem resposta')}</div>
            <div style={{ fontSize: 11, color: 'rgba(248,248,255,.4)', minWidth: 60, textAlign: 'right' }}>{app.latencia_ms}ms</div>
            {app.erro && <div style={{ fontSize: 11, color: '#F87171', width: '100%' }}>{app.erro}</div>}
          </div>
        ))}
      </div>

      {/* ANALISE IA */}
      <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(6,182,212,0.05))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: analise ? 16 : 0, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#7C3AED,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#A78BFA' }}>IA analisa e prioriza</div>
              <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.35)' }}>Diagnóstico automático do que precisa de atenção agora</div>
            </div>
          </div>
          <button onClick={analisarComIA} disabled={analisando || apps.length === 0} style={{
            background: 'linear-gradient(135deg,#7C3AED,#06b6d4)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px',
            fontSize: 12, fontWeight: 800, cursor: analisando ? 'not-allowed' : 'pointer', opacity: analisando ? 0.6 : 1,
          }}>{analisando ? 'Analisando...' : '✨ Analisar com IA'}</button>
        </div>
        {analise && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13, color: 'rgba(248,248,255,.75)', margin: 0 }}>{analise.situacao_geral}</p>
            {analise.criticos?.length > 0 && (
              <div style={{ background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 10, padding: 12 }}>
                <b style={{ color: '#F87171', fontSize: 11, textTransform: 'uppercase' }}>Críticos:</b> <span style={{ fontSize: 13 }}>{analise.criticos.join(', ')}</span>
              </div>
            )}
            {analise.atencao?.length > 0 && (
              <div style={{ background: 'rgba(240,195,109,.08)', border: '1px solid rgba(240,195,109,.25)', borderRadius: 10, padding: 12 }}>
                <b style={{ color: '#F0C36D', fontSize: 11, textTransform: 'uppercase' }}>Atenção:</b> <span style={{ fontSize: 13 }}>{analise.atencao.join(', ')}</span>
              </div>
            )}
            <div style={{ fontSize: 13, fontWeight: 600 }}>{analise.recomendacao}</div>
          </div>
        )}
      </div>
    </div>
  )
}
