'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const INDICES = [
  {
    sigla: 'IQH',
    nome: 'Índice de Qualidade Humana',
    keys: ['nxp_disc_score', 'nxp_lideranca_score'],
    pesos: [50, 50],
    peso_human: 25,
    cor: '#10b981',
    href: '/dashboard/nexoperform/disc',
    icone: '🎯',
    desc: 'Comportamento e liderança',
  },
  {
    sigla: 'IEBO',
    nome: 'Engajamento e Bem-Estar',
    keys: ['nxp_bemestar_score', 'nxp_fitcultural_score'],
    pesos: [60, 40],
    peso_human: 30,
    cor: '#a78bfa',
    href: '/dashboard/nexoperform/bemestar',
    icone: '💚',
    desc: 'Bem-estar e fit cultural',
  },
  {
    sigla: 'IEIH',
    nome: 'Inteligência Emocional e Inclusão',
    keys: ['nxp_inteligencia_score'],
    pesos: [100],
    peso_human: 20,
    cor: '#f59e0b',
    href: '/dashboard/nexoperform/inteligencia',
    icone: '💡',
    desc: 'Inteligência adaptativa',
  },
  {
    sigla: 'IHAL™',
    nome: 'Liderança Adaptativa',
    keys: ['nxp_lideranca_score'],
    pesos: [100],
    peso_human: 25,
    cor: '#0ea5e9',
    href: '/dashboard/nexoperform/lideranca',
    icone: '🧭',
    desc: 'Capacidade de liderança',
  },
]

function calcIndice(keys: string[], pesos: number[], scores: Record<string, number>) {
  let totalPeso = 0, soma = 0
  keys.forEach((k, i) => {
    const s = scores[k] || 0
    if (s > 0) { soma += s * pesos[i]; totalPeso += pesos[i] }
  })
  return totalPeso > 0 ? Math.round(soma / totalPeso) : 0
}

function calcHumanScore(indiceScores: number[]) {
  const pesos = [25, 30, 20, 25]
  const validos = indiceScores.filter(s => s > 0)
  if (validos.length === 0) return 0
  let soma = 0, totalPeso = 0
  indiceScores.forEach((s, i) => {
    if (s > 0) { soma += s * pesos[i]; totalPeso += pesos[i] }
  })
  return totalPeso > 0 ? Math.round(soma / totalPeso) : 0
}

function getLabel(s: number) {
  if (s >= 85) return { label: 'Excepcional', cor: '#10b981' }
  if (s >= 70) return { label: 'Alto', cor: '#34d399' }
  if (s >= 50) return { label: 'Desenvolvendo', cor: '#f59e0b' }
  if (s >= 30) return { label: 'Atenção', cor: '#fb923c' }
  if (s === 0) return { label: 'Não avaliado', cor: 'rgba(240,253,244,0.2)' }
  return { label: 'Crítico', cor: '#ef4444' }
}

export default function IndicesHAIPanel() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [indiceScores, setIndiceScores] = useState<number[]>([0, 0, 0, 0])
  const [humanScore, setHumanScore] = useState(0)

  useEffect(() => {
    const keys = ['nxp_disc_score', 'nxp_lideranca_score', 'nxp_inteligencia_score', 'nxp_bemestar_score', 'nxp_fitcultural_score']
    const s: Record<string, number> = {}
    keys.forEach(k => {
      const v = parseFloat(localStorage.getItem(k) || '0')
      s[k] = isNaN(v) ? 0 : Math.round(v)
    })
    setScores(s)
    const is = INDICES.map(i => calcIndice(i.keys, i.pesos, s))
    setIndiceScores(is)
    setHumanScore(calcHumanScore(is))
  }, [])

  const concluidos = Object.values(scores).filter(v => v > 0).length
  const hs = humanScore
  const hsLabel = getLabel(hs)

  return (
    <div style={{ borderRadius: 20, background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(16,185,129,0.12)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.03))', borderBottom: '1px solid rgba(16,185,129,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 3 }}>Método Essencial HAI</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#111' }}>Índices HAI — NexoPerform</div>
          <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>{concluidos} de 5 assessments concluídos</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Human Score</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: hs > 0 ? '#10b981' : 'rgba(0,0,0,0.15)', lineHeight: 1 }}>{hs > 0 ? hs : '--'}</div>
          {hs > 0 && <div style={{ fontSize: 10, fontWeight: 800, color: hsLabel.cor }}>{hsLabel.label}</div>}
        </div>
      </div>

      {/* 4 Índices */}
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {INDICES.map((idx, i) => {
          const s = indiceScores[i]
          const lbl = getLabel(s)
          return (
            <Link key={i} href={idx.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '14px 16px', borderRadius: 14, background: s > 0 ? `${idx.cor}08` : 'rgba(0,0,0,0.02)', border: `1px solid ${s > 0 ? idx.cor + '20' : 'rgba(0,0,0,0.06)'}`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: s > 0 ? idx.cor : 'rgba(0,0,0,0.3)', marginBottom: 2 }}>{idx.sigla}</div>
                    <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', lineHeight: 1.3 }}>{idx.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s > 0 ? idx.cor : 'rgba(0,0,0,0.15)', lineHeight: 1 }}>{s > 0 ? s : '--'}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: lbl.cor }}>{lbl.label}</div>
                  </div>
                </div>
                <div style={{ height: 3, borderRadius: 99, background: 'rgba(0,0,0,0.06)' }}>
                  <div style={{ height: '100%', width: `${s}%`, background: idx.cor, borderRadius: 99, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ marginTop: 6, fontSize: 9, color: 'rgba(0,0,0,0.25)', fontWeight: 700 }}>peso {idx.peso_human}% no Human Score</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Formula + Links */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.3)', fontWeight: 700, fontStyle: 'italic' }}>
          A IA reconhece padrões. <span style={{ color: '#10b981' }}>O HAI ensina líderes a reconhecer pessoas.</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/dashboard/nexoperform" style={{ padding: '7px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 800, fontSize: 11, textDecoration: 'none' }}>
            Abrir NexoPerform →
          </Link>
          <Link href="/dashboard/metodologia-hai/documento" style={{ padding: '7px 16px', borderRadius: 10, background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.4)', fontWeight: 700, fontSize: 11, textDecoration: 'none' }}>
            📖 Documento HAI
          </Link>
        </div>
      </div>
    </div>
  )
}
