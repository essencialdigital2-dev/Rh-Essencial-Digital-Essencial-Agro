'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const INDICES = [
  { sigla: 'DISC HAI', nome: 'Perfil Comportamental', key: 'nxp_disc_score', cor: '#10b981', peso: 25, href: '/dashboard/nexoperform/disc', icone: '🎯' },
  { sigla: 'IHAL™', nome: 'Liderança Adaptativa', key: 'nxp_lideranca_score', cor: '#0ea5e9', peso: 25, href: '/dashboard/nexoperform/lideranca', icone: '🧭' },
  { sigla: 'INT HAI', nome: 'Inteligência Adaptativa', key: 'nxp_inteligencia_score', cor: '#f59e0b', peso: 20, href: '/dashboard/nexoperform/inteligencia', icone: '💡' },
  { sigla: 'BEM HAI', nome: 'Bem-Estar Relacional', key: 'nxp_bemestar_score', cor: '#a78bfa', peso: 30, href: '/dashboard/nexoperform/bemestar', icone: '💚' },
  { sigla: 'FIT HAI', nome: 'Fit Cultural', key: 'nxp_fitcultural_score', cor: '#f97316', peso: 0, href: '/dashboard/nexoperform/fitcultural', icone: '🌐' },
]

function calcularHumanScore(scores: Record<string, number>) {
  const pesos = INDICES.slice(0, 4)
  const totalPeso = pesos.reduce((a, i) => a + i.peso, 0)
  const soma = pesos.reduce((a, i) => {
    const s = scores[i.key] || 0
    return a + (s * i.peso)
  }, 0)
  return totalPeso > 0 ? Math.round(soma / totalPeso) : 0
}

function getClassificacao(score: number) {
  if (score >= 85) return { label: 'Referência', desc: 'Perfil de alta performance e potencial de multiplicação.', cor: '#10b981' }
  if (score >= 70) return { label: 'Destaque', desc: 'Acima da média. Pequenos ajustes têm grande impacto.', cor: '#34d399' }
  if (score >= 55) return { label: 'Em Desenvolvimento', desc: 'Potencial real. Precisa de acompanhamento estruturado.', cor: '#f59e0b' }
  if (score >= 40) return { label: 'Atenção', desc: 'Pontos críticos identificados. Ação imediata recomendada.', cor: '#fb923c' }
  return { label: 'Risco', desc: 'Desalinhamento significativo em múltiplas dimensões.', cor: '#ef4444' }
}

export default function HumanScorePage() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [humanScore, setHumanScore] = useState(0)
  const [analise, setAnalise] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const s: Record<string, number> = {}
    INDICES.forEach(i => {
      const v = parseFloat(localStorage.getItem(i.key) || '0')
      s[i.key] = isNaN(v) ? 0 : Math.round(v)
    })
    setScores(s)
    const hs = calcularHumanScore(s)
    setHumanScore(hs)
    localStorage.setItem('nxp_human_score', String(hs))
  }, [])

  const concluidos = INDICES.filter(i => scores[i.key] > 0).length
  const cls = getClassificacao(humanScore)

  async function gerarAnalise() {
    setLoading(true)
    const resumo = INDICES.map(i => `${i.sigla} (peso ${i.peso}%): ${scores[i.key] || 'não avaliado'}/100`).join(' | ')
    try {
      const r = await fetch('/api/nexoperform-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: 'human-score',
          prompt: `Human Score HAI final: ${humanScore}/100 (${cls.label}). Dados dos assessments: ${resumo}. Assessments concluídos: ${concluidos} de ${INDICES.length}. Gere uma análise estratégica em 4 blocos: (1) O que o Human Score revela sobre esta pessoa como ativo humano da organização, (2) A principal alavanca de desenvolvimento que geraria mais impacto no score, (3) O principal risco não tratado que pode comprometer o desempenho futuro, (4) Recomendação de próximo passo concreto para o gestor. Linguagem executiva, direta, baseada nos dados.`,
        }),
      })
      const d = await r.json()
      setAnalise(d.resultado || '')
    } catch { setAnalise('Erro ao gerar análise.') }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0', color: '#f0fdf4' }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>NexoPerform HAI</div>

      {/* Human Score principal */}
      <div style={{ padding: '36px', borderRadius: 24, background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(16,185,129,0.04))', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Human Score HAI</div>
        <div style={{ fontSize: 80, fontWeight: 900, color: humanScore > 0 ? '#34d399' : 'rgba(240,253,244,0.15)', lineHeight: 1, marginBottom: 8 }}>
          {humanScore > 0 ? humanScore : '--'}
        </div>
        <div style={{ fontSize: 9, color: 'rgba(240,253,244,0.3)', marginBottom: 12 }}>/ 100</div>
        {humanScore > 0 && <>
          <div style={{ display: 'inline-block', padding: '6px 18px', borderRadius: 99, background: `${cls.cor}15`, border: `1px solid ${cls.cor}30`, fontSize: 13, fontWeight: 800, color: cls.cor, marginBottom: 10 }}>
            {cls.label}
          </div>
          <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.5)', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>{cls.desc}</p>
        </>}
        {humanScore === 0 && (
          <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.35)', lineHeight: 1.6 }}>Complete os assessments para calcular o Human Score HAI.</p>
        )}
      </div>

      {/* Fórmula */}
      <div style={{ padding: '18px 20px', borderRadius: 16, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(240,253,244,0.3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Composição do Score</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {INDICES.filter(i => i.peso > 0).map((i, idx, arr) => (
            <div key={i.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: i.cor }}>{i.sigla} × {i.peso}%</span>
              {idx < arr.length - 1 && <span style={{ color: 'rgba(240,253,244,0.2)', fontSize: 14 }}>+</span>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(240,253,244,0.25)', marginTop: 10 }}>
          Fit Cultural contextualiza a análise mas não entra no cálculo ponderado.
        </div>
      </div>

      {/* 5 Índices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {INDICES.map(i => {
          const s = scores[i.key] || 0
          const concluido = s > 0
          return (
            <Link key={i.key} href={i.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '16px 20px', borderRadius: 16, background: concluido ? `${i.cor}06` : 'rgba(255,255,255,0.02)', border: `1px solid ${concluido ? i.cor + '20' : 'rgba(255,255,255,0.05)'}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{i.icone}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 900, color: concluido ? i.cor : 'rgba(240,253,244,0.4)' }}>{i.sigla}</span>
                      {i.peso > 0 && <span style={{ fontSize: 9, color: 'rgba(240,253,244,0.2)', marginLeft: 6, fontWeight: 700 }}>peso {i.peso}%</span>}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: concluido ? i.cor : 'rgba(240,253,244,0.2)' }}>
                      {concluido ? s : '--'}
                    </div>
                  </div>
                  <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ height: '100%', width: `${s}%`, background: i.cor, borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Análise IA */}
      <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(52,211,153,0.1)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: analise ? 16 : 0 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Análise Estratégica do Human Score</div>
            <div style={{ fontSize: 11, color: 'rgba(240,253,244,0.3)' }}>IA interpreta o perfil completo e entrega diagnóstico executivo</div>
          </div>
          <button onClick={gerarAnalise} disabled={loading || concluidos < 2} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', cursor: concluidos < 2 ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 12, background: 'rgba(52,211,153,0.15)', color: '#34d399', outline: '1px solid rgba(52,211,153,0.2)', opacity: concluidos < 2 ? 0.4 : 1 }}>
            {loading ? 'Analisando...' : '🤖 Analisar com IA'}
          </button>
        </div>
        {concluidos < 2 && !analise && <div style={{ fontSize: 11, color: 'rgba(240,253,244,0.25)', marginTop: 12 }}>Complete ao menos 2 assessments para ativar a análise.</div>}
        {analise && <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.7)', lineHeight: 1.9, whiteSpace: 'pre-line', margin: 0 }}>{analise}</p>}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Link href="/dashboard/nexoperform/relatorio" style={{ padding: '11px 22px', borderRadius: 12, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
          📄 Ver Relatório Completo
        </Link>
        <Link href="/dashboard/nexoperform" style={{ padding: '11px 22px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(240,253,244,0.4)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          ← Hub NexoPerform
        </Link>
      </div>
    </div>
  )
}
