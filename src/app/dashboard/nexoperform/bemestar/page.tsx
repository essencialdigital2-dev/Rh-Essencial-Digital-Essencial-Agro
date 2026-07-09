'use client'
import { useState, useEffect } from 'react'

const DIMENSOES = [
  {
    nome: 'Segurança Psicológica', cor: '#a78bfa', bg: 'rgba(167,139,250,0.08)',
    desc: 'Percepção de segurança para se expressar, errar e discordar sem punição.',
    perguntas: [
      'Me sinto confortável para compartilhar ideias mesmo que possam estar erradas.',
      'Posso discordar do meu gestor sem temer consequências negativas.',
      'Em reuniões, me sinto à vontade para fazer perguntas que outros podem considerar básicas.',
      'Quando erro, o foco do time é aprender, não punir.',
      'Posso ser eu mesmo no trabalho sem precisar filtrar minha personalidade.',
    ],
  },
  {
    nome: 'Reconhecimento', cor: '#f59e0b', bg: 'rgba(245,158,11,0.08)',
    desc: 'Percepção de que o trabalho e a contribuição individual são valorizados.',
    perguntas: [
      'Sinto que minha contribuição é reconhecida pela liderança.',
      'Recebo feedback positivo quando faço um bom trabalho.',
      'Meu esforço é percebido mesmo quando os resultados ainda não apareceram.',
      'Me sinto valorizado como indivíduo, não apenas como recurso produtivo.',
      'O reconhecimento que recebo é específico e significativo para mim.',
    ],
  },
  {
    nome: 'Propósito e Significado', cor: '#10b981', bg: 'rgba(16,185,129,0.08)',
    desc: 'Conexão com o sentido do trabalho realizado e seu impacto real.',
    perguntas: [
      'Entendo claramente como meu trabalho contribui para resultados maiores.',
      'O trabalho que faço está alinhado com o que considero importante na vida.',
      'Me sinto motivado intrinsecamente, não apenas por salário ou medo.',
      'Consigo encontrar significado nas tarefas do dia a dia, não apenas nos grandes projetos.',
      'O propósito da empresa faz sentido para mim e me orgulho de representá-la.',
    ],
  },
  {
    nome: 'Qualidade Relacional', cor: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',
    desc: 'Qualidade das relações interpessoais no ambiente de trabalho.',
    perguntas: [
      'Tenho ao menos uma relação genuína de confiança no trabalho.',
      'Me sinto parte de uma equipe, não apenas de um grupo de pessoas.',
      'As pessoas da minha equipe se apoiam mutuamente nos momentos difíceis.',
      'Conflitos são resolvidos de forma adulta, sem drama ou ressentimento.',
      'Me sinto incluído nas decisões e conversas que afetam meu trabalho.',
    ],
  },
]

const OPCOES = [
  { val: 1, label: 'Discordo totalmente' },
  { val: 2, label: 'Discordo' },
  { val: 3, label: 'Neutro' },
  { val: 4, label: 'Concordo' },
  { val: 5, label: 'Concordo totalmente' },
]

function getClass(s: number) {
  if (s >= 85) return { label: 'Saudável', cor: '#10b981' }
  if (s >= 70) return { label: 'Bom', cor: '#34d399' }
  if (s >= 50) return { label: 'Em Atenção', cor: '#f59e0b' }
  if (s >= 30) return { label: 'Risco', cor: '#fb923c' }
  return { label: 'Crítico', cor: '#ef4444' }
}

export default function BemestarPage() {
  const [fase, setFase] = useState<'intro' | 'avaliacao' | 'resultado'>('intro')
  const [dimAtual, setDimAtual] = useState(0)
  const [pergAtual, setPergAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[][]>(DIMENSOES.map(() => []))
  const [scores, setScores] = useState<number[]>([])
  const [analise, setAnalise] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nxp_bemestar_respostas')
    if (saved) { const r = JSON.parse(saved); setRespostas(r); calcular(r); setFase('resultado') }
  }, [])

  function calcular(r: number[][]) {
    const s = r.map(dim => Math.round((dim.reduce((a, b) => a + b, 0) / (dim.length * 5)) * 100))
    setScores(s)
    const media = Math.round(s.reduce((a, b) => a + b, 0) / s.length)
    localStorage.setItem('nxp_bemestar_score', String(media))
    localStorage.setItem('nxp_bemestar_respostas', JSON.stringify(r))
  }

  function responder(val: number) {
    const novas = respostas.map((d, i) => i === dimAtual ? [...d, val] : d)
    setRespostas(novas)
    if (pergAtual + 1 < DIMENSOES[dimAtual].perguntas.length) { setPergAtual(p => p + 1) }
    else if (dimAtual + 1 < DIMENSOES.length) { setDimAtual(d => d + 1); setPergAtual(0) }
    else { calcular(novas); setFase('resultado') }
  }

  async function gerarAnalise() {
    setLoading(true)
    const resumo = DIMENSOES.map((d, i) => `${d.nome}: ${scores[i]}/100`).join(' | ')
    const scoreGeral = Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)
    try {
      const r = await fetch('/api/nexoperform-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: 'bem-estar-relacional',
          prompt: `Assessment de Bem-Estar Relacional HAI. Resultados: ${resumo}. Score geral: ${scoreGeral}/100. Gere análise em 3 blocos: (1) Como o nível de bem-estar atual impacta diretamente o desempenho e a retenção desta pessoa, (2) Qual dimensão está criando mais risco de desengajamento e como se manifesta no comportamento, (3) O que o gestor pode fazer nas próximas 2 semanas para reverter o quadro ou reforçar os pontos positivos. Seja direto e prático.`,
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

  if (fase === 'intro') return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 0', color: '#f0fdf4' }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>NexoPerform HAI</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>💚 Bem-Estar Relacional HAI</h1>
      <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>Assessment de Clima e Pertencimento</p>
      <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.6)', lineHeight: 1.85, marginBottom: 28 }}>
        Avalia a saúde relacional do colaborador no ambiente de trabalho. Mede segurança psicológica, reconhecimento, propósito e qualidade das relações. A IA identifica riscos de desengajamento e entrega ações concretas para o gestor.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {DIMENSOES.map((d, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 14, background: d.bg, border: `1px solid ${d.cor}20` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: d.cor, marginBottom: 4 }}>{d.nome}</div>
            <div style={{ fontSize: 11, color: 'rgba(240,253,244,0.45)', lineHeight: 1.5 }}>{d.desc}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setFase('avaliacao')} style={{ padding: '14px 32px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 15, background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff' }}>
        Iniciar Assessment de Bem-Estar
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
          <div style={{ fontSize: 10, color: dim.cor, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Pergunta {pergAtual + 1} de {dim.perguntas.length}</div>
          <p style={{ fontSize: 16, color: '#f0fdf4', lineHeight: 1.7, fontWeight: 600, margin: 0 }}>{dim.perguntas[pergAtual]}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {OPCOES.map((op, i) => (
            <button key={i} onClick={() => responder(op.val)} style={{ padding: '14px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(240,253,244,0.75)', fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}
              onMouseEnter={e => { e.currentTarget.style.background = `${dim.cor}12`; e.currentTarget.style.color = dim.cor }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(240,253,244,0.75)' }}>
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
      <div style={{ fontSize: 10, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Resultado — Bem-Estar Relacional HAI</div>
      <div style={{ padding: '20px 24px', borderRadius: 20, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{scoreGeral}</div>
          <div style={{ fontSize: 9, color: 'rgba(240,253,244,0.3)', marginTop: 2 }}>/ 100</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: getClass(scoreGeral).cor, marginTop: 4 }}>{getClass(scoreGeral).label}</div>
        </div>
        <div style={{ flex: 1, fontSize: 13, color: 'rgba(240,253,244,0.5)', lineHeight: 1.7 }}>
          Score de Bem-Estar Relacional. Reflete a saúde do ambiente de trabalho e o risco de desengajamento. Alimenta o Human Score HAI com peso 30%.
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {DIMENSOES.map((d, i) => {
          const s = scores[i] || 0; const cls = getClass(s)
          return (
            <div key={i} style={{ padding: '18px', borderRadius: 16, background: d.bg, border: `1px solid ${d.cor}18` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
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
      <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(167,139,250,0.1)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: analise ? 16 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Análise HAI — Risco e Ações</div>
          <button onClick={gerarAnalise} disabled={loading} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, background: 'rgba(167,139,250,0.15)', color: '#a78bfa', outline: '1px solid rgba(167,139,250,0.2)' }}>
            {loading ? 'Analisando...' : '🤖 Analisar com IA'}
          </button>
        </div>
        {analise && <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.7)', lineHeight: 1.9, whiteSpace: 'pre-line', margin: 0 }}>{analise}</p>}
      </div>
      <a href="/dashboard/nexoperform/fitcultural" style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)', color: '#f97316', fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'inline-block' }}>
        Próximo: Fit Cultural →
      </a>
    </div>
  )
}
