'use client'
import { useEffect, useState } from 'react'
import { ecoFetch } from '@/lib/ecoFetch'

type ResumoApp = { app: string; nome: string; ok: boolean; [k: string]: any }

const CARDS_CONFIG: Record<string, { icone: string; cor: string; titulo: string }> = {
  edu: { icone: '🎓', cor: '#A78BFA', titulo: 'Essencial Edu' },
  estudo: { icone: '📚', cor: '#7C3AED', titulo: 'Essencial Estudo' },
  agro: { icone: '🌾', cor: '#34D399', titulo: 'Essencial Agro Tech' },
  sense: { icone: '🧠', cor: '#F0C36D', titulo: 'Essencial Sense AI' },
}

export default function RadarPreditivoConsolidado() {
  const [apps, setApps] = useState<Record<string, ResumoApp> | null>(null)
  const [analise, setAnalise] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [gerando, setGerando] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try {
      const r = await ecoFetch('/api/eco-preditivo')
      const d = await r.json()
      if (d.ok) setApps(d.apps)
    } catch {}
    setCarregando(false)
  }

  async function gerarAnalise() {
    if (!apps) return
    setGerando(true)
    try {
      const r = await ecoFetch('/api/eco-preditivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apps }),
      })
      const d = await r.json()
      if (d.ok) setAnalise(d.analise)
    } catch {}
    setGerando(false)
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>🔮 Radar Preditivo Consolidado</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
          Os 4 produtos com IA preditiva (Edu, Estudo, Agro Tech, Sense AI) numa leitura única, gerada por IA.
        </p>
      </div>

      {carregando ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Consultando os apps...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 20 }}>
            {apps && Object.entries(apps).map(([key, dados]) => {
              const cfg = CARDS_CONFIG[key]
              return (
                <div key={key} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${cfg.cor}25`, borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: cfg.cor, marginBottom: 10 }}>{cfg.icone} {cfg.titulo}</div>
                  {!dados.ok ? (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Indisponível no momento</div>
                  ) : key === 'sense' ? (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                      ISHO médio: <b>{dados.isho_medio ?? '—'}/100</b><br />
                      ESG Social médio: <b>{dados.esg_social_medio ?? '—'}/100</b> ({dados.empresas_com_esg} empresas)<br />
                      Colaboradores em risco crítico: <b style={{ color: dados.colaboradores_risco_critico > 0 ? '#F87171' : undefined }}>{dados.colaboradores_risco_critico}</b>
                    </div>
                  ) : key === 'estudo' ? (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                      Engajamento com recomendações: <b>{dados.taxa_engajamento_recomendacoes ?? 'sem dado ainda'}{dados.taxa_engajamento_recomendacoes != null ? '%' : ''}</b><br />
                      Alunos com tendência de queda: <b style={{ color: dados.alunos_tendencia_caindo > 0 ? '#F0C36D' : undefined }}>{dados.alunos_tendencia_caindo}</b>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                      Taxa de acerto do modelo: <b>{dados.taxa_acerto ?? 'sem histórico ainda'}{dados.taxa_acerto != null ? '%' : ''}</b><br />
                      Previsões aguardando verificação: <b>{dados.previsoes_pendentes}</b><br />
                      Alertas críticos abertos: <b style={{ color: dados.alertas_criticos_abertos > 0 ? '#F87171' : undefined }}>{dados.alertas_criticos_abertos}</b>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#A78BFA' }}>✦ Leitura da IA Central</div>
              <button onClick={gerarAnalise} disabled={gerando}
                style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(167,139,250,0.3)', background: 'transparent', color: '#A78BFA', cursor: 'pointer', opacity: gerando ? 0.5 : 1 }}>
                {gerando ? 'Gerando...' : analise ? '↻ Atualizar leitura' : '✨ Gerar leitura'}
              </button>
            </div>

            {!analise && !gerando && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Clique em gerar pra IA cruzar os 4 produtos numa leitura só.</div>}

            {analise && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.6 }}>{analise.leitura_geral}</p>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#A78BFA', marginBottom: 4 }}>⚡ Prioridade do dia</div>
                  <div style={{ fontSize: 13, color: '#fff' }}>{analise.prioridade_do_dia}</div>
                </div>
                {analise.destaques?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#34D399', marginBottom: 4 }}>Destaques</div>
                    {analise.destaques.map((d: string, i: number) => <div key={i} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>• {d}</div>)}
                  </div>
                )}
                {analise.alertas?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#F87171', marginBottom: 4 }}>Alertas</div>
                    {analise.alertas.map((a: string, i: number) => <div key={i} style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>• {a}</div>)}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
