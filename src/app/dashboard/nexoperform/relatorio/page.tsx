'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const MODULOS = [
  { sigla: 'DISC HAI', nome: 'Perfil Comportamental', key: 'nxp_disc_score', cor: '#10b981', peso: 25, icone: '🎯' },
  { sigla: 'IHAL™', nome: 'Liderança Adaptativa', key: 'nxp_lideranca_score', cor: '#0ea5e9', peso: 25, icone: '🧭' },
  { sigla: 'INT HAI', nome: 'Inteligência Adaptativa', key: 'nxp_inteligencia_score', cor: '#f59e0b', peso: 20, icone: '💡' },
  { sigla: 'BEM HAI', nome: 'Bem-Estar Relacional', key: 'nxp_bemestar_score', cor: '#a78bfa', peso: 30, icone: '💚' },
  { sigla: 'FIT HAI', nome: 'Fit Cultural', key: 'nxp_fitcultural_score', cor: '#f97316', peso: 0, icone: '🌐' },
]

function calcHS(scores: Record<string, number>) {
  const pesos = MODULOS.filter(m => m.peso > 0)
  const total = pesos.reduce((a, m) => a + m.peso, 0)
  const soma = pesos.reduce((a, m) => a + (scores[m.key] || 0) * m.peso, 0)
  return total > 0 ? Math.round(soma / total) : 0
}

function getLabel(s: number) {
  if (s >= 85) return { label: 'Referência', cor: '#10b981' }
  if (s >= 70) return { label: 'Destaque', cor: '#34d399' }
  if (s >= 55) return { label: 'Em Desenvolvimento', cor: '#f59e0b' }
  if (s >= 40) return { label: 'Atenção', cor: '#fb923c' }
  return { label: 'Risco', cor: '#ef4444' }
}

export default function RelatorioPage() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [humanScore, setHumanScore] = useState(0)
  const [relatorio, setRelatorio] = useState('')
  const [loading, setLoading] = useState(false)
  const [gerado, setGerado] = useState(false)

  useEffect(() => {
    const s: Record<string, number> = {}
    MODULOS.forEach(m => {
      const v = parseFloat(localStorage.getItem(m.key) || '0')
      s[m.key] = isNaN(v) ? 0 : Math.round(v)
    })
    setScores(s)
    setHumanScore(calcHS(s))
  }, [])

  const concluidos = MODULOS.filter(m => scores[m.key] > 0).length
  const hs = humanScore
  const cls = getLabel(hs)

  async function gerarRelatorio() {
    setLoading(true)
    const resumo = MODULOS.map(m => `${m.sigla}: ${scores[m.key] > 0 ? scores[m.key] + '/100' : 'nao avaliado'}${m.peso > 0 ? ` (peso ${m.peso}%)` : ''}`).join(' | ')
    try {
      const r = await fetch('/api/nexoperform-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: 'relatorio-completo',
          prompt: `Gere um Relatório HAI Completo para este perfil. Human Score: ${hs}/100 (${cls.label}). Assessments (${concluidos} de ${MODULOS.length} concluídos): ${resumo}. Estruture o relatório com os seguintes blocos: 1. PERFIL GERAL - quem é esta pessoa como ativo humano da organização; 2. PONTOS FORTES - 3 forças identificadas nos dados; 3. PONTOS DE ATENÇÃO - 2 a 3 riscos ou lacunas críticas; 4. PLANO DE DESENVOLVIMENTO - 4 ações concretas e sequenciadas para os próximos 90 dias; 5. RECOMENDAÇÃO PARA O GESTOR - como adaptar liderança, comunicação e delegação a este perfil. Seja específico, estratégico e direto. Sem jargão vazio. Mínimo de 400 palavras.`,
        }),
      })
      const d = await r.json()
      setRelatorio(d.resultado || '')
      setGerado(true)
    } catch { setRelatorio('Erro ao gerar relatório.') }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 0', color: '#f0fdf4' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>NexoPerform HAI</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>📄 Relatório HAI Completo</h1>
        <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Diagnóstico Integrado de Desenvolvimento</p>
      </div>

      {/* Scorecard resumido */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, marginBottom: 28 }}>
        <div style={{ padding: '24px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.03))', border: '1px solid rgba(52,211,153,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Human Score</div>
          <div style={{ fontSize: 56, fontWeight: 900, color: hs > 0 ? '#34d399' : 'rgba(240,253,244,0.15)', lineHeight: 1 }}>{hs > 0 ? hs : '--'}</div>
          <div style={{ fontSize: 9, color: 'rgba(240,253,244,0.25)', marginBottom: 8 }}>/ 100</div>
          {hs > 0 && <div style={{ fontSize: 11, fontWeight: 800, color: cls.cor }}>{cls.label}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MODULOS.map(m => {
            const s = scores[m.key] || 0
            const lbl = getLabel(s)
            return (
              <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: s > 0 ? `${m.cor}06` : 'rgba(255,255,255,0.02)', border: `1px solid ${s > 0 ? m.cor + '18' : 'rgba(255,255,255,0.04)'}` }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{m.icone}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: s > 0 ? m.cor : 'rgba(240,253,244,0.3)' }}>{m.sigla}</span>
                  {m.peso > 0 && <span style={{ fontSize: 9, color: 'rgba(240,253,244,0.2)', marginLeft: 6 }}>peso {m.peso}%</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {s > 0 ? <>
                    <div style={{ height: 3, width: 80, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ height: '100%', width: `${s}%`, background: m.cor, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 900, color: m.cor, minWidth: 28, textAlign: 'right' }}>{s}</span>
                    <span style={{ fontSize: 9, color: lbl.cor, fontWeight: 700, minWidth: 60 }}>{lbl.label}</span>
                  </> : (
                    <Link href={`/dashboard/nexoperform/${m.key.replace('nxp_', '').replace('_score', '')}`} style={{ fontSize: 10, color: 'rgba(240,253,244,0.25)', fontWeight: 700, textDecoration: 'none', padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.04)' }}>
                      Iniciar
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Gerar relatório */}
      {!gerado ? (
        <div style={{ padding: '28px', borderRadius: 20, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(52,211,153,0.12)', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>Relatório HAI com Inteligência Artificial</div>
          <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.45)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 20px' }}>
            A IA sintetiza todos os assessments em um diagnóstico completo: perfil, forças, pontos de atenção, plano de desenvolvimento e recomendações para o gestor.
          </p>
          {concluidos < 2 && (
            <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.25)', marginBottom: 16 }}>Complete ao menos 2 assessments para gerar o relatório completo. ({concluidos}/{MODULOS.length} concluídos)</p>
          )}
          <button onClick={gerarRelatorio} disabled={loading || concluidos < 2} style={{ padding: '14px 36px', borderRadius: 14, border: 'none', cursor: concluidos < 2 ? 'not-allowed' : 'pointer', fontWeight: 900, fontSize: 15, background: concluidos >= 2 ? 'linear-gradient(135deg, #34d399, #10b981)' : 'rgba(255,255,255,0.06)', color: concluidos >= 2 ? '#fff' : 'rgba(240,253,244,0.3)', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Gerando Relatório...' : '🤖 Gerar Relatório HAI Completo'}
          </button>
        </div>
      ) : (
        <div style={{ padding: '28px', borderRadius: 20, background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(52,211,153,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>Relatório HAI Completo</div>
            <button onClick={() => { setRelatorio(''); setGerado(false) }} style={{ padding: '6px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(240,253,244,0.35)', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>
              Regenerar
            </button>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(240,253,244,0.75)', lineHeight: 2, whiteSpace: 'pre-line' }}>{relatorio}</div>
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
        <Link href="/dashboard/nexoperform" style={{ padding: '11px 22px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(240,253,244,0.4)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          ← Hub NexoPerform
        </Link>
        <Link href="/dashboard/nexoperform/humanscore" style={{ padding: '11px 22px', borderRadius: 12, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)', color: '#34d399', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          🌟 Human Score HAI
        </Link>
      </div>
    </div>
  )
}
