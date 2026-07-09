'use client'
import { useState, useEffect } from 'react'

const DIMENSOES = [
  {
    nome: 'Alinhamento de Valores', cor: '#f97316', bg: 'rgba(249,115,22,0.08)',
    desc: 'Grau de convergência entre os valores pessoais e os valores reais praticados pela organização.',
    perguntas: [
      'Os valores que a empresa declara são os que eu vejo praticados no dia a dia.',
      'Me identifico com a missão e o propósito da organização.',
      'As decisões que a empresa toma são consistentes com o que afirma valorizar.',
      'Me orgulho de trabalhar aqui e contaria a amigos sobre esse lugar.',
      'Os comportamentos valorizados aqui são os que também valorizo na vida.',
    ],
  },
  {
    nome: 'Estilo de Trabalho', cor: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',
    desc: 'Compatibilidade entre o modo como você trabalha melhor e o modo como a empresa opera.',
    perguntas: [
      'O ritmo de trabalho aqui combina com o meu estilo natural.',
      'O nível de autonomia que tenho está alinhado com o que prefiro.',
      'A forma como as decisões são tomadas aqui faz sentido para mim.',
      'O equilíbrio entre estrutura e flexibilidade é o que funciona para mim.',
      'A forma de comunicação predominante aqui é a que prefiro.',
    ],
  },
  {
    nome: 'Colaboração e Pertencimento', cor: '#10b981', bg: 'rgba(16,185,129,0.08)',
    desc: 'Sentimento de pertencimento e integração genuína com o grupo.',
    perguntas: [
      'Me sinto parte do grupo, não um elemento isolado.',
      'As pessoas aqui colaboram genuinamente, não apenas formalmente.',
      'Minha opinião é considerada nas decisões do time.',
      'As relações aqui vão além do profissional quando necessário.',
      'Me sinto aceito como sou, sem precisar me moldar a um padrão artificial.',
    ],
  },
  {
    nome: 'Adaptabilidade Cultural', cor: '#a78bfa', bg: 'rgba(167,139,250,0.08)',
    desc: 'Capacidade de se adaptar e contribuir para a evolução da cultura organizacional.',
    perguntas: [
      'Me adapto bem quando a empresa muda de direção ou estratégia.',
      'Consigo contribuir para a cultura sem perder minha identidade.',
      'Aprendo os códigos não escritos da organização com facilidade.',
      'Navego bem pelas diferentes personalidades e estilos que existem aqui.',
      'Consigo influenciar a cultura positivamente sem precisar de autoridade formal.',
    ],
  },
]

const OPCOES = [
  { val: 1, label: 'Discordo totalmente' },
  { val: 2, label: 'Discordo parcialmente' },
  { val: 3, label: 'Neutro' },
  { val: 4, label: 'Concordo parcialmente' },
  { val: 5, label: 'Concordo totalmente' },
]

function getClass(s: number) {
  if (s >= 85) return { label: 'Excelente Fit', cor: '#10b981' }
  if (s >= 70) return { label: 'Bom Fit', cor: '#34d399' }
  if (s >= 50) return { label: 'Fit Parcial', cor: '#f59e0b' }
  if (s >= 30) return { label: 'Desalinhamento', cor: '#fb923c' }
  return { label: 'Ruptura Cultural', cor: '#ef4444' }
}

export default function FitCulturalPage() {
  const [fase, setFase] = useState<'intro' | 'avaliacao' | 'resultado'>('intro')
  const [dimAtual, setDimAtual] = useState(0)
  const [pergAtual, setPergAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[][]>(DIMENSOES.map(() => []))
  const [scores, setScores] = useState<number[]>([])
  const [analise, setAnalise] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nxp_fitcultural_respostas')
    if (saved) { const r = JSON.parse(saved); setRespostas(r); calcular(r); setFase('resultado') }
  }, [])

  function calcular(r: number[][]) {
    const s = r.map(dim => Math.round((dim.reduce((a, b) => a + b, 0) / (dim.length * 5)) * 100))
    setScores(s)
    const media = Math.round(s.reduce((a, b) => a + b, 0) / s.length)
    localStorage.setItem('nxp_fitcultural_score', String(media))
    localStorage.setItem('nxp_fitcultural_respostas', JSON.stringify(r))
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
          modulo: 'fit-cultural',
          prompt: `Assessment de Fit Cultural HAI. Resultados: ${resumo}. Score geral: ${scoreGeral}/100. Gere análise em 3 blocos: (1) Qual é o nível real de alinhamento cultural e o que os dados revelam sobre a permanência desta pessoa na organização, (2) Qual dimensão representa maior risco de ruptura ou fonte de fricção silenciosa, (3) Ações concretas para o gestor fortalecer o alinhamento ou antecipar uma conversa difícil sobre fit. Seja direto, sem suavizar os dados.`,
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
      <div style={{ fontSize: 10, fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>NexoPerform HAI</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>🌐 Fit Cultural HAI</h1>
      <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>Assessment de Alinhamento Cultural</p>
      <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.6)', lineHeight: 1.85, marginBottom: 28 }}>
        Avalia o alinhamento real entre o colaborador e a cultura da organização. Vai além do discurso e revela o que os dados mostram sobre permanência, engajamento e risco de ruptura.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {DIMENSOES.map((d, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 14, background: d.bg, border: `1px solid ${d.cor}20` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: d.cor, marginBottom: 4 }}>{d.nome}</div>
            <div style={{ fontSize: 11, color: 'rgba(240,253,244,0.45)', lineHeight: 1.5 }}>{d.desc}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setFase('avaliacao')} style={{ padding: '14px 32px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 15, background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff' }}>
        Iniciar Assessment de Fit Cultural
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
      <div style={{ fontSize: 10, fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Resultado — Fit Cultural HAI</div>
      <div style={{ padding: '20px 24px', borderRadius: 20, background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#f97316', lineHeight: 1 }}>{scoreGeral}</div>
          <div style={{ fontSize: 9, color: 'rgba(240,253,244,0.3)', marginTop: 2 }}>/ 100</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: getClass(scoreGeral).cor, marginTop: 4 }}>{getClass(scoreGeral).label}</div>
        </div>
        <div style={{ flex: 1, fontSize: 13, color: 'rgba(240,253,244,0.5)', lineHeight: 1.7 }}>
          Score de Fit Cultural HAI. Reflete o alinhamento entre colaborador e organização. Prediz permanência, engajamento e risco de saída.
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
      <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(249,115,22,0.1)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: analise ? 16 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Análise HAI — Alinhamento e Risco</div>
          <button onClick={gerarAnalise} disabled={loading} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, background: 'rgba(249,115,22,0.15)', color: '#f97316', outline: '1px solid rgba(249,115,22,0.2)' }}>
            {loading ? 'Analisando...' : '🤖 Analisar com IA'}
          </button>
        </div>
        {analise && <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.7)', lineHeight: 1.9, whiteSpace: 'pre-line', margin: 0 }}>{analise}</p>}
      </div>
      <a href="/dashboard/nexoperform/humanscore" style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'inline-block' }}>
        Próximo: Human Score HAI →
      </a>
    </div>
  )
}
