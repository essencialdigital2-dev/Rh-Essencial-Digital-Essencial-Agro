'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const MODULOS = [
  {
    href: '/dashboard/nexoperform/disc',
    icone: '🎯',
    sigla: 'DISC HAI',
    nome: 'Perfil Comportamental',
    desc: 'Mapeia o estilo dominante de comportamento: como a pessoa age, decide, se comunica e responde a pressão.',
    cor: '#10b981',
    key: 'nxp_disc_score',
    dimensoes: ['Dominância', 'Influência', 'Estabilidade', 'Conformidade'],
  },
  {
    href: '/dashboard/nexoperform/lideranca',
    icone: '🧭',
    sigla: 'LID HAI',
    nome: 'Liderança Adaptativa',
    desc: 'Avalia a capacidade do líder de adaptar seu estilo, desenvolver pessoas e criar ambientes de pertencimento.',
    cor: '#0ea5e9',
    key: 'nxp_lideranca_score',
    dimensoes: ['Autoconhecimento', 'Comunicação Adaptativa', 'Gestão da Diversidade', 'Desenvolvimento'],
  },
  {
    href: '/dashboard/nexoperform/inteligencia',
    icone: '💡',
    sigla: 'INT HAI',
    nome: 'Inteligência Adaptativa',
    desc: 'Mede a capacidade cognitiva e adaptativa: aprendizagem, resolução de problemas, criatividade e inovação.',
    cor: '#f59e0b',
    key: 'nxp_inteligencia_score',
    dimensoes: ['Aprendizagem', 'Resolução de Problemas', 'Inteligência Emocional', 'Inovação'],
  },
  {
    href: '/dashboard/nexoperform/bemestar',
    icone: '💚',
    sigla: 'BEM HAI',
    nome: 'Bem-Estar Relacional',
    desc: 'Avalia a saúde das relações de trabalho: segurança psicológica, reconhecimento, propósito e conexão.',
    cor: '#a78bfa',
    key: 'nxp_bemestar_score',
    dimensoes: ['Segurança Psicológica', 'Reconhecimento', 'Propósito', 'Qualidade Relacional'],
  },
  {
    href: '/dashboard/nexoperform/fitcultural',
    icone: '🌐',
    sigla: 'FIT HAI',
    nome: 'Fit Cultural',
    desc: 'Analisa o alinhamento entre os valores do colaborador e a cultura da organização em 4 dimensões.',
    cor: '#f97316',
    key: 'nxp_fitcultural_score',
    dimensoes: ['Valores', 'Estilo de Trabalho', 'Colaboração', 'Adaptabilidade'],
  },
  {
    href: '/dashboard/nexoperform/humanscore',
    icone: '🌟',
    sigla: 'HUMAN SCORE',
    nome: 'Human Score HAI',
    desc: 'Síntese de todos os assessments em um único índice 0-100. O ativo mais estratégico do NexoPerform.',
    cor: '#34d399',
    key: 'nxp_human_score',
    dimensoes: ['DISC', 'Liderança', 'Inteligência', 'Bem-Estar', 'Fit Cultural'],
  },
]

function ScoreBar({ score, cor }: { score: number; cor: string }) {
  return (
    <div style={{ marginTop: 10, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${score}%`, background: cor, borderRadius: 99, transition: 'width 1s ease' }} />
    </div>
  )
}

export default function NexoPerformHub() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [analise, setAnalise] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const s: Record<string, number> = {}
    MODULOS.forEach(m => {
      const v = parseFloat(localStorage.getItem(m.key) || '0')
      s[m.key] = isNaN(v) ? 0 : Math.round(v)
    })
    setScores(s)
  }, [])

  const concluidos = MODULOS.filter(m => scores[m.key] > 0).length
  const humanScore = scores['nxp_human_score'] || 0

  async function gerarAnalise() {
    const resumo = MODULOS.map(m => `${m.sigla}: ${scores[m.key] || 'não avaliado'}/100`).join(' | ')
    setLoading(true)
    try {
      const r = await fetch('/api/nexoperform-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: 'hub',
          prompt: `Gestor completou ${concluidos} de ${MODULOS.length} assessments do NexoPerform HAI. Resultados: ${resumo}. Gere uma análise executiva em 3 parágrafos: (1) perfil geral da liderança baseado nos índices, (2) maior força e maior ponto de atenção identificados, (3) 2 ações prioritárias para os próximos 30 dias. Linguagem direta, estratégica, sem jargão.`,
        }),
      })
      const d = await r.json()
      setAnalise(d.resultado || '')
    } catch { setAnalise('Não foi possível gerar a análise agora.') }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0', color: '#f0fdf4' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2 }}>Assessment Comportamental — Método Essencial HAI</span>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1.5, marginBottom: 4 }}>NexoPerform <span style={{ color: '#10b981' }}>HAI</span></h1>
        <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.3)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Human Adaptive Intelligence</p>
        <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.5)', marginTop: 10, lineHeight: 1.7, maxWidth: 600 }}>
          O sistema de assessment comportamental do Método Essencial HAI. Cada módulo revela uma dimensão diferente da inteligência humana. Juntos, formam o Human Score HAI.
        </p>
      </div>

      {/* Progresso geral */}
      <div style={{ marginBottom: 32, padding: '20px 24px', borderRadius: 18, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>{concluidos}</div>
          <div style={{ fontSize: 10, color: 'rgba(240,253,244,0.35)', marginTop: 4, fontWeight: 700 }}>de {MODULOS.length} assessments</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: humanScore > 0 ? '#34d399' : 'rgba(240,253,244,0.2)', lineHeight: 1 }}>{humanScore > 0 ? humanScore : '--'}</div>
          <div style={{ fontSize: 10, color: 'rgba(240,253,244,0.35)', marginTop: 4, fontWeight: 700 }}>Human Score HAI</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>{Math.round((concluidos / MODULOS.length) * 100)}%</div>
          <div style={{ fontSize: 10, color: 'rgba(240,253,244,0.35)', marginTop: 4, fontWeight: 700 }}>completo</div>
        </div>
      </div>

      {/* 6 Módulos */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Módulos de Assessment</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {MODULOS.map((m, i) => {
            const score = scores[m.key] || 0
            const concluido = score > 0
            return (
              <Link key={i} href={m.href} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '20px', borderRadius: 18, background: concluido ? `${m.cor}06` : 'rgba(255,255,255,0.03)', border: `1px solid ${concluido ? m.cor + '20' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{m.icone}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 900, color: concluido ? m.cor : '#f0fdf4' }}>{m.sigla}</div>
                        <div style={{ fontSize: 10, color: 'rgba(240,253,244,0.4)', marginTop: 1 }}>{m.nome}</div>
                      </div>
                    </div>
                    {concluido ? (
                      <div style={{ fontSize: 18, fontWeight: 900, color: m.cor }}>{score}</div>
                    ) : (
                      <div style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', fontSize: 9, fontWeight: 700, color: 'rgba(240,253,244,0.3)' }}>Iniciar</div>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(240,253,244,0.4)', lineHeight: 1.55, marginBottom: 10 }}>{m.desc}</p>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {m.dimensoes.map((d, j) => (
                      <span key={j} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, background: `${m.cor}10`, color: m.cor, fontWeight: 700 }}>{d}</span>
                    ))}
                  </div>
                  {concluido && <ScoreBar score={score} cor={m.cor} />}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Análise IA */}
      {concluidos >= 2 && (
        <div style={{ marginBottom: 32, padding: '22px', borderRadius: 18, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(16,185,129,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: analise ? 16 : 0 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#f0fdf4' }}>Análise Executiva HAI</div>
              <div style={{ fontSize: 11, color: 'rgba(240,253,244,0.35)' }}>IA sintetiza todos os assessments em um diagnóstico estratégico</div>
            </div>
            <button onClick={gerarAnalise} disabled={loading} style={{ padding: '9px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, background: loading ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.15)', color: '#10b981', outline: '1px solid rgba(16,185,129,0.2)' }}>
              {loading ? 'Analisando...' : '🤖 Gerar Análise'}
            </button>
          </div>
          {analise && <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.7)', lineHeight: 1.9, whiteSpace: 'pre-line', margin: 0 }}>{analise}</p>}
        </div>
      )}

      {/* Links ação */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link href="/dashboard/nexoperform/relatorio" style={{ padding: '11px 22px', borderRadius: 12, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
          📄 Relatório HAI Completo
        </Link>
        <Link href="/dashboard/metodologia-hai" style={{ padding: '11px 22px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(240,253,244,0.5)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          🌟 Método Essencial HAI
        </Link>
      </div>

    </div>
  )
}
