'use client'
import { useEffect, useState } from 'react'
import { ecoFetch } from '@/lib/ecoFetch'

const PRODUTOS = [
  { key: 'edu', label: '🏛 Essencial Edu' },
  { key: 'teens', label: '🎓 Essencial Teens' },
  { key: 'estudo', label: '📚 Essencial Estudo' },
  { key: 'med', label: '🩺 Essencial Med' },
  { key: 'juridico', label: '⚖️ Essencial Jurídico' },
  { key: 'sense', label: '🧠 Sense AI' },
  { key: 'nexo', label: '🧭 NexoPerform' },
  { key: 'agro', label: '🌾 Agro Tech' },
]

export default function RadarPage() {
  const [ultimos, setUltimos] = useState<Record<string, any>>({})
  const [gerando, setGerando] = useState('')
  const [radar, setRadar] = useState<any>(null)
  const [produtoAtual, setProdutoAtual] = useState('')
  const [origemAtual, setOrigemAtual] = useState<{ origem: string; criado_em: string } | null>(null)

  useEffect(() => {
    ecoFetch('/api/eco-radar').then(r => r.json()).then(d => { if (d.ultimos) setUltimos(d.ultimos) })
  }, [])

  function verUltimo(key: string, label: string) {
    const salvo = ultimos[key]
    if (!salvo) return
    setRadar(salvo.radar)
    setProdutoAtual(label)
    setOrigemAtual({ origem: salvo.origem, criado_em: salvo.criado_em })
  }

  async function gerar(key: string, label: string) {
    setGerando(key)
    try {
      const r = await ecoFetch('/api/eco-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto: key }),
      })
      const d = await r.json()
      if (d.radar) {
        setRadar(d.radar); setProdutoAtual(label)
        const agora = new Date().toISOString()
        setOrigemAtual({ origem: 'manual', criado_em: agora })
        setUltimos(prev => ({ ...prev, [key]: { radar: d.radar, origem: 'manual', criado_em: agora } }))
      }
    } finally {
      setGerando('')
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 60px', fontFamily: 'system-ui,sans-serif', color: '#F8F8FF' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, background: 'linear-gradient(135deg,#A78BFA,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📡 Radar de Inovação Preditivo</h1>
        <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', marginTop: 4 }}>A IA pesquisa a web e gera tendências, oportunidades e ameaças para cada produto do ecossistema.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {PRODUTOS.map(p => {
          const salvo = ultimos[p.key]
          return (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px' }}>
              <button onClick={() => verUltimo(p.key, p.label)} disabled={!salvo} style={{
                padding: '9px 16px', borderRadius: 10, cursor: salvo ? 'pointer' : 'not-allowed',
                background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.3)', color: '#A78BFA', fontSize: 13, fontWeight: 700,
              }}>{p.label}</button>
              {salvo && (
                <span style={{ fontSize: 11, color: 'rgba(248,248,255,0.35)' }}>
                  {salvo.origem === 'cron' ? '🤖 auto' : '✋ manual'} · {new Date(salvo.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              )}
              <button onClick={() => gerar(p.key, p.label)} disabled={!!gerando} style={{
                marginLeft: 'auto', padding: '7px 14px', borderRadius: 99, cursor: gerando ? 'not-allowed' : 'pointer',
                background: gerando === p.key ? 'rgba(6,182,212,.15)' : 'transparent', border: '1px solid rgba(6,182,212,.3)', color: '#06b6d4', fontSize: 11, fontWeight: 700,
              }}>{gerando === p.key ? 'IA pesquisando...' : '✨ Pesquisar agora'}</button>
            </div>
          )
        })}
      </div>

      {radar && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 900 }}>
            Radar: {produtoAtual}
            {origemAtual && (
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(248,248,255,0.35)', marginLeft: 10 }}>
                {origemAtual.origem === 'cron' ? '🤖 automático' : '✋ manual'} em {new Date(origemAtual.criado_em).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.7)', lineHeight: 1.6 }}>{radar.resumo_mercado}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
            {(radar.tendencias || []).map((td: any, i: number) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16, borderLeft: `3px solid ${td.urgencia === 'alta' ? '#F87171' : td.urgencia === 'media' ? '#F0C36D' : '#60A5FA'}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{td.titulo}</div>
                <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.55)', lineHeight: 1.5 }}>{td.descricao}</div>
                <div style={{ fontSize: 10, fontWeight: 800, marginTop: 8, color: td.urgencia === 'alta' ? '#F87171' : td.urgencia === 'media' ? '#F0C36D' : '#60A5FA' }}>urgência {td.urgencia}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>O que construir</div>
            {(radar.oportunidades_produto || []).map((op: any, i: number) => (
              <div key={i} style={{ fontSize: 13, color: 'rgba(248,248,255,0.7)', marginBottom: 10 }}>
                <b style={{ color: '#fff' }}>{op.funcionalidade}</b> · {op.por_que} <span style={{ color: '#34D399', fontWeight: 700 }}>({op.esforco})</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.6)', background: 'rgba(248,113,113,0.05)', borderRadius: 10, padding: 14 }}>
            <b style={{ color: '#F87171' }}>Ameaças:</b> {(radar.ameacas || []).join(' · ')}
          </div>

          <div style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.15),rgba(6,182,212,.05))', border: '1px solid rgba(167,139,250,.3)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Aposta do Conselheiro (60 dias)</div>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{radar.aposta_do_conselheiro}</p>
          </div>
        </div>
      )}
    </div>
  )
}
