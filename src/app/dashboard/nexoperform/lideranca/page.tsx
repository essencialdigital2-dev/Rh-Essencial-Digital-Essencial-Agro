'use client'
import { useState, useEffect } from 'react'

const DIMENSOES = [
  {
    nome: 'Autoconhecimento', cor: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',
    desc: 'Capacidade de reconhecer seus próprios padrões, limites e impactos como líder.',
    perguntas: [
      'Sei quais situações me tiram do meu melhor estado como líder.',
      'Reconheço quando minhas reações estão sendo guiadas por emoção, não por estratégia.',
      'Busco ativamente feedback sobre meu estilo de liderança.',
      'Consigo distinguir minha percepção sobre alguém da realidade objetiva do desempenho.',
      'Tenho clareza sobre os valores que guiam minhas decisões como líder.',
    ],
  },
  {
    nome: 'Comunicação Adaptativa', cor: '#a78bfa', bg: 'rgba(167,139,250,0.08)',
    desc: 'Capacidade de adaptar a forma de se comunicar ao perfil de cada pessoa.',
    perguntas: [
      'Mudo conscientemente minha linguagem e tom conforme a pessoa com quem estou.',
      'Sei quando comunicar por escrito ou presencialmente para cada colaborador.',
      'Verifico se minha mensagem foi compreendida antes de assumir que foi.',
      'Dou feedback negativo de forma que a pessoa consiga receber e agir.',
      'Adapto o nível de detalhe da minha comunicação ao perfil do interlocutor.',
    ],
  },
  {
    nome: 'Gestão da Diversidade', cor: '#10b981', bg: 'rgba(16,185,129,0.08)',
    desc: 'Capacidade de liderar com equidade pessoas com perfis, origens e necessidades diferentes.',
    perguntas: [
      'Consigo identificar quando estou tratando pessoas de forma desigual sem perceber.',
      'Adapto minhas expectativas ao contexto e às condições reais de cada colaborador.',
      'Crio oportunidades equivalentes para pessoas com perfis diferentes.',
      'Me sinto confortável liderando pessoas mais experientes ou com formações diferentes das minhas.',
      'Abordo diferenças de forma direta, sem constrangimento ou evitação.',
    ],
  },
  {
    nome: 'Desenvolvimento de Pessoas', cor: '#f59e0b', bg: 'rgba(245,158,11,0.08)',
    desc: 'Capacidade de identificar e cultivar o potencial de cada colaborador.',
    perguntas: [
      'Conheço o potencial não realizado de cada pessoa da minha equipe.',
      'Dedico tempo regular a conversas de desenvolvimento individual.',
      'Delego tarefas pensando no crescimento da pessoa, não apenas na eficiência.',
      'Celebro crescimentos pequenos, não apenas conquistas grandes.',
      'Crio situações onde cada colaborador pode mostrar sua melhor capacidade.',
    ],
  },
]

const OPCOES = [
  { val: 1, label: 'Nunca' },
  { val: 2, label: 'Raramente' },
  { val: 3, label: 'Às vezes' },
  { val: 4, label: 'Frequentemente' },
  { val: 5, label: 'Sempre' },
]

function getClass(s: number) {
  if (s >= 85) return { label: 'Excepcional', cor: '#10b981' }
  if (s >= 70) return { label: 'Alto', cor: '#34d399' }
  if (s >= 50) return { label: 'Em Desenvolvimento', cor: '#f59e0b' }
  if (s >= 30) return { label: 'Atenção', cor: '#fb923c' }
  return { label: 'Ponto Cego', cor: '#ef4444' }
}

export default function LiderancaPage() {
  const [fase, setFase] = useState<'intro' | 'avaliacao' | 'resultado'>('intro')
  const [dimAtual, setDimAtual] = useState(0)
  const [pergAtual, setPergAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[][]>(DIMENSOES.map(() => []))
  const [scores, setScores] = useState<number[]>([])
  const [analise, setAnalise] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nxp_lideranca_respostas')
    if (saved) {
      const r = JSON.parse(saved)
      setRespostas(r)
      calcular(r)
      setFase('resultado')
    }
  }, [])

  function calcular(r: number[][]) {
    const s = r.map(dim => Math.round((dim.reduce((a, b) => a + b, 0) / (dim.length * 5)) * 100))
    setScores(s)
    const media = Math.round(s.reduce((a, b) => a + b, 0) / s.length)
    localStorage.setItem('nxp_lideranca_score', String(media))
    localStorage.setItem('nxp_lideranca_respostas', JSON.stringify(r))
  }

  function responder(val: number) {
    const novas = respostas.map((d, i) => i === dimAtual ? [...d, val] : d)
    setRespostas(novas)
    if (pergAtual + 1 < DIMENSOES[dimAtual].perguntas.length) {
      setPergAtual(p => p + 1)
    } else if (dimAtual + 1 < DIMENSOES.length) {
      setDimAtual(d => d + 1); setPergAtual(0)
    } else {
      calcular(novas); setFase('resultado')
    }
  }

  async function gerarAnalise() {
    setLoading(true)
    const resumo = DIMENSOES.map((d, i) => `${d.nome}: ${scores[i]}/100`).join(' | ')
    try {
      const r = await fetch('/api/nexoperform-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: 'lideranca-inclusiva',
          prompt: `Assessment IHAL — Índice HAI de Liderança Adaptativa. Resultados: ${resumo}. Score geral: ${Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}/100. Gere análise em 3 blocos: (1) Qual é o estilo de liderança revelado pelos dados, (2) Qual dimensão é o maior ponto cego e por que isso impacta a equipe, (3) 3 ações práticas de desenvolvimento para as próximas 4 semanas. Seja específico e estratégico.`,
        }),
      })
      const d = await r.json()
      setAnalise(d.resultado || '')
    } catch { setAnalise('Erro ao gerar análise.') }
    setLoading(false)
  }

  const totalR = respostas.flat().length
  const totalP = DIMENSOES.reduce((a, d) => a + d.perguntas.length, 0)
  const prog = Math.round((totalR / totalP) * 100)
  const scoreGeral = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const pontoForte = scores.length ? DIMENSOES[scores.indexOf(Math.max(...scores))] : null
  const pontoCego = scores.length ? DIMENSOES[scores.indexOf(Math.min(...scores))] : null

  if (fase === 'intro') return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 0', color: '#f0fdf4' }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>NexoPerform HAI</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>🧭 IHAL™ — Liderança Adaptativa HAI</h1>
      <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>Assessment de Liderança</p>
      <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.6)', lineHeight: 1.85, marginBottom: 28 }}>
        Este assessment avalia como você lidera na prática. Não o que você sabe sobre liderança, mas o que você realmente faz. A IA identifica seus pontos cegos e entrega um plano de desenvolvimento personalizado.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {DIMENSOES.map((d, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 14, background: d.bg, border: `1px solid ${d.cor}20` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: d.cor, marginBottom: 4 }}>{d.nome}</div>
            <div style={{ fontSize: 11, color: 'rgba(240,253,244,0.45)', lineHeight: 1.5 }}>{d.desc}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setFase('avaliacao')} style={{ padding: '14px 32px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 15, background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff' }}>
        Iniciar Assessment de Liderança
      </button>
    </div>
  )

  if (fase === 'avaliacao') {
    const dim = DIMENSOES[dimAtual]
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 0', color: '#f0fdf4' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: dim.cor, textTransform: 'uppercase', letterSpacing: 1 }}>{dim.nome}</span>
            <span style={{ fontSize: 10, color: 'rgba(240,253,244,0.3)' }}>{prog}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: '100%', width: `${prog}%`, background: dim.cor, borderRadius: 99, transition: 'width 0.4s' }} />
          </div>
        </div>
        <div style={{ padding: '28px', borderRadius: 20, background: dim.bg, border: `1px solid ${dim.cor}20`, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: dim.cor, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Pergunta {pergAtual + 1} de {dim.perguntas.length}
          </div>
          <p style={{ fontSize: 16, color: '#f0fdf4', lineHeight: 1.7, fontWeight: 600, margin: 0 }}>{dim.perguntas[pergAtual]}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {OPCOES.map((op, i) => (
            <button key={i} onClick={() => responder(op.val)} style={{
              padding: '14px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)', color: 'rgba(240,253,244,0.75)',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `${dim.cor}12`; e.currentTarget.style.borderColor = `${dim.cor}40`; e.currentTarget.style.color = dim.cor }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(240,253,244,0.75)' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{op.val}</span>
              {op.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0', color: '#f0fdf4' }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Resultado — IHAL™ Liderança Adaptativa</div>

      <div style={{ padding: '24px', borderRadius: 20, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#0ea5e9', lineHeight: 1 }}>{scoreGeral}</div>
          <div style={{ fontSize: 9, color: 'rgba(240,253,244,0.3)', marginTop: 2 }}>/ 100</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: getClass(scoreGeral).cor, marginTop: 4 }}>{getClass(scoreGeral).label}</div>
        </div>
        <div style={{ flex: 1 }}>
          {pontoForte && <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Ponto Forte: </span>
            <span style={{ fontSize: 12, color: 'rgba(240,253,244,0.6)' }}>{pontoForte.nome} ({scores[DIMENSOES.indexOf(pontoForte)]}/100)</span>
          </div>}
          {pontoCego && <div>
            <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Ponto Cego: </span>
            <span style={{ fontSize: 12, color: 'rgba(240,253,244,0.6)' }}>{pontoCego.nome} ({scores[DIMENSOES.indexOf(pontoCego)]}/100)</span>
          </div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {DIMENSOES.map((d, i) => {
          const s = scores[i] || 0
          const cls = getClass(s)
          return (
            <div key={i} style={{ padding: '18px', borderRadius: 16, background: d.bg, border: `1px solid ${d.cor}18` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: d.cor }}>{d.nome}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: d.cor, lineHeight: 1 }}>{s}</div>
                  <div style={{ fontSize: 9, color: cls.cor, fontWeight: 700 }}>{cls.label}</div>
                </div>
              </div>
              <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', width: `${s}%`, background: d.cor, borderRadius: 99 }} />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(14,165,233,0.1)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: analise ? 16 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Análise HAI — Plano de Desenvolvimento</div>
          <button onClick={gerarAnalise} disabled={loading} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', outline: '1px solid rgba(14,165,233,0.2)' }}>
            {loading ? 'Analisando...' : '🤖 Analisar com IA'}
          </button>
        </div>
        {analise && <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.7)', lineHeight: 1.9, whiteSpace: 'pre-line', margin: 0 }}>{analise}</p>}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => { setRespostas(DIMENSOES.map(() => [])); setScores([]); setAnalise(''); setDimAtual(0); setPergAtual(0); localStorage.removeItem('nxp_lideranca_score'); localStorage.removeItem('nxp_lideranca_respostas'); setFase('intro') }} style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(240,253,244,0.4)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
          Refazer
        </button>
        <a href="/dashboard/nexoperform/inteligencia" style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}>
          Próximo: Inteligência Adaptativa →
        </a>
      </div>
    </div>
  )
}
