'use client'
import { useState, useEffect } from 'react'

const DIMENSOES = [
  {
    letra: 'D', nome: 'Dominância', cor: '#ef4444', bg: 'rgba(239,68,68,0.08)',
    desc: 'Como você responde a desafios e exerce controle sobre o ambiente.',
    perguntas: [
      'Prefiro tomar decisões rapidamente, mesmo com informações incompletas.',
      'Aceito bem situações de conflito quando necessário para atingir resultados.',
      'Em grupo, costumo naturalmente assumir a liderança das decisões.',
      'Priorizo resultados concretos acima de processos e procedimentos.',
      'Não tenho dificuldade em dizer "não" quando discordo de algo.',
    ],
  },
  {
    letra: 'I', nome: 'Influência', cor: '#f59e0b', bg: 'rgba(245,158,11,0.08)',
    desc: 'Como você influencia pessoas e busca conexão social.',
    perguntas: [
      'Me sinto energizado quando estou interagindo com muitas pessoas.',
      'Tenho facilidade para persuadir outros a adotarem meu ponto de vista.',
      'Prefiro comunicar ideias de forma inspiradora a apresentar apenas dados.',
      'O reconhecimento e aprovação dos outros são importantes para mim.',
      'Criar um ambiente animado e positivo é algo que valorizo no trabalho.',
    ],
  },
  {
    letra: 'S', nome: 'Estabilidade', cor: '#10b981', bg: 'rgba(16,185,129,0.08)',
    desc: 'Como você responde ao ritmo do trabalho e às mudanças.',
    perguntas: [
      'Prefiro um ambiente de trabalho previsível e com rotinas estabelecidas.',
      'Me importo genuinamente com o bem-estar das pessoas ao meu redor.',
      'Evito mudanças bruscas e prefiro implementar transformações gradualmente.',
      'Sou reconhecido como uma pessoa paciente e constante na equipe.',
      'Termino o que começo e cumpro compromissos independentemente das circunstâncias.',
    ],
  },
  {
    letra: 'C', nome: 'Conformidade', cor: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',
    desc: 'Como você responde a regras, padrões e necessidade de precisão.',
    perguntas: [
      'Antes de agir, preciso entender completamente as regras e expectativas.',
      'Prefiro ter certeza de que meu trabalho está correto antes de entregar.',
      'Me incomoda quando processos não seguem padrões claros de qualidade.',
      'Analiso riscos cuidadosamente antes de tomar qualquer decisão importante.',
      'Gosto de ter dados e evidências antes de formar uma opinião.',
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

function getClassificacao(score: number) {
  if (score >= 85) return { label: 'Muito Alto', cor: '#10b981' }
  if (score >= 70) return { label: 'Alto', cor: '#34d399' }
  if (score >= 50) return { label: 'Moderado', cor: '#f59e0b' }
  if (score >= 30) return { label: 'Baixo', cor: '#fb923c' }
  return { label: 'Muito Baixo', cor: '#ef4444' }
}

function getPerfil(scores: number[]) {
  const max = Math.max(...scores)
  const idx = scores.indexOf(max)
  const perfis = [
    { nome: 'Executor', desc: 'Orientado a resultados, direto e decisivo. Age com velocidade e foco em conquistas.' },
    { nome: 'Comunicador', desc: 'Carismático e persuasivo. Inspira pessoas e cria conexões com facilidade.' },
    { nome: 'Mediador', desc: 'Confiável e colaborativo. Estabiliza equipes e cria harmonia no ambiente.' },
    { nome: 'Analista', desc: 'Preciso e metódico. Garante qualidade e toma decisões baseadas em dados.' },
  ]
  return { dim: DIMENSOES[idx], perfil: perfis[idx] }
}

export default function DiscPage() {
  const [fase, setFase] = useState<'intro' | 'avaliacao' | 'resultado'>('intro')
  const [dimAtual, setDimAtual] = useState(0)
  const [pergAtual, setPergAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[][]>(DIMENSOES.map(() => []))
  const [scores, setScores] = useState<number[]>([])
  const [analise, setAnalise] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nxp_disc_respostas')
    if (saved) {
      const r = JSON.parse(saved)
      setRespostas(r)
      calcularScores(r)
      setFase('resultado')
    }
  }, [])

  function calcularScores(r: number[][]) {
    const s = r.map(dim => {
      const soma = dim.reduce((a, b) => a + b, 0)
      return Math.round((soma / (dim.length * 5)) * 100)
    })
    setScores(s)
    const media = Math.round(s.reduce((a, b) => a + b, 0) / s.length)
    localStorage.setItem('nxp_disc_score', String(media))
    localStorage.setItem('nxp_disc_respostas', JSON.stringify(r))
  }

  function responder(val: number) {
    const novas = respostas.map((d, i) => i === dimAtual ? [...d, val] : d)
    setRespostas(novas)
    const totalPergs = DIMENSOES[dimAtual].perguntas.length
    if (pergAtual + 1 < totalPergs) {
      setPergAtual(p => p + 1)
    } else if (dimAtual + 1 < DIMENSOES.length) {
      setDimAtual(d => d + 1)
      setPergAtual(0)
    } else {
      calcularScores(novas)
      setFase('resultado')
    }
  }

  async function gerarAnalise() {
    const { dim, perfil } = getPerfil(scores)
    setLoading(true)
    try {
      const r = await fetch('/api/nexoperform-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: 'disc',
          prompt: `Pessoa com perfil DISC HAI: Dominância ${scores[0]}/100, Influência ${scores[1]}/100, Estabilidade ${scores[2]}/100, Conformidade ${scores[3]}/100. Perfil dominante: ${dim.nome} (${perfil.nome} - ${perfil.desc}). Gere análise em 3 blocos: (1) Como esse perfil age e decide naturalmente, (2) Como funciona melhor em equipe e o que pode ser ponto cego, (3) Como o gestor deve adaptar comunicação e desenvolvimento para esse perfil. Seja específico e prático.`,
        }),
      })
      const d = await r.json()
      setAnalise(d.resultado || '')
    } catch { setAnalise('Erro ao gerar análise.') }
    setLoading(false)
  }

  function reiniciar() {
    setRespostas(DIMENSOES.map(() => []))
    setScores([])
    setAnalise('')
    setDimAtual(0)
    setPergAtual(0)
    localStorage.removeItem('nxp_disc_score')
    localStorage.removeItem('nxp_disc_respostas')
    setFase('intro')
  }

  const totalRespondidas = respostas.flat().length
  const totalPerguntas = DIMENSOES.reduce((a, d) => a + d.perguntas.length, 0)
  const progresso = Math.round((totalRespondidas / totalPerguntas) * 100)

  if (fase === 'intro') return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 0', color: '#f0fdf4' }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>NexoPerform HAI</div>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>🎯 Perfil DISC HAI</h1>
      <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>Assessment Comportamental</p>
      <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.6)', lineHeight: 1.85, marginBottom: 28 }}>
        O DISC HAI mapeia seu estilo dominante de comportamento em 4 dimensões. A IA analisa o resultado e gera um guia personalizado de como você age, decide e se relaciona, e como gestores devem adaptar a liderança ao seu perfil.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {DIMENSOES.map((d, i) => (
          <div key={i} style={{ padding: '14px 16px', borderRadius: 14, background: d.bg, border: `1px solid ${d.cor}20` }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: d.cor, marginBottom: 4 }}>{d.letra} — {d.nome}</div>
            <div style={{ fontSize: 11, color: 'rgba(240,253,244,0.45)', lineHeight: 1.5 }}>{d.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, padding: '12px 16px', borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: 20 }}>🤖</span>
        <div style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', lineHeight: 1.6 }}>{totalPerguntas} afirmações sobre comportamento real. Responda com honestidade, não com o que acha que deveria ser.</div>
      </div>
      <button onClick={() => setFase('avaliacao')} style={{ padding: '14px 32px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 15, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
        Iniciar Assessment DISC HAI
      </button>
    </div>
  )

  if (fase === 'avaliacao') {
    const dim = DIMENSOES[dimAtual]
    const perg = dim.perguntas[pergAtual]
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 0', color: '#f0fdf4' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: dim.cor, textTransform: 'uppercase', letterSpacing: 1 }}>{dim.letra} — {dim.nome}</span>
            <span style={{ fontSize: 10, color: 'rgba(240,253,244,0.3)' }}>{progresso}% concluído</span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: '100%', width: `${progresso}%`, background: dim.cor, borderRadius: 99, transition: 'width 0.4s' }} />
          </div>
        </div>

        <div style={{ padding: '28px', borderRadius: 20, background: dim.bg, border: `1px solid ${dim.cor}20`, marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: dim.cor, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Pergunta {pergAtual + 1} de {dim.perguntas.length}
          </div>
          <p style={{ fontSize: 16, color: '#f0fdf4', lineHeight: 1.7, fontWeight: 600, margin: 0 }}>{perg}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {OPCOES.map((op, i) => (
            <button key={i} onClick={() => responder(op.val)} style={{
              padding: '14px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)', color: 'rgba(240,253,244,0.75)',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 12,
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

  const { dim: dimDom, perfil } = getPerfil(scores)
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0', color: '#f0fdf4' }}>
      <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Resultado — DISC HAI</div>

      {/* Perfil dominante */}
      <div style={{ padding: '24px', borderRadius: 20, background: `${dimDom.cor}08`, border: `1px solid ${dimDom.cor}25`, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${dimDom.cor}15`, border: `2px solid ${dimDom.cor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: dimDom.cor }}>{dimDom.letra}</div>
          <div>
            <div style={{ fontSize: 9, color: dimDom.cor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 }}>Perfil Dominante</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#f0fdf4' }}>{dimDom.nome} — {perfil.nome}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.6)', lineHeight: 1.7, margin: 0 }}>{perfil.desc}</p>
      </div>

      {/* 4 dimensões */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {DIMENSOES.map((d, i) => {
          const s = scores[i] || 0
          const cls = getClassificacao(s)
          return (
            <div key={i} style={{ padding: '18px', borderRadius: 16, background: d.bg, border: `1px solid ${d.cor}18` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 900, color: d.cor }}>{d.letra}</span>
                  <span style={{ fontSize: 12, color: 'rgba(240,253,244,0.5)', marginLeft: 6 }}>{d.nome}</span>
                </div>
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

      {/* Análise IA */}
      <div style={{ padding: '20px', borderRadius: 18, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(16,185,129,0.1)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: analise ? 16 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Análise HAI do seu Perfil DISC</div>
          <button onClick={gerarAnalise} disabled={loading} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, background: 'rgba(16,185,129,0.15)', color: '#10b981', outline: '1px solid rgba(16,185,129,0.2)' }}>
            {loading ? 'Analisando...' : '🤖 Analisar com IA'}
          </button>
        </div>
        {analise && <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.7)', lineHeight: 1.9, whiteSpace: 'pre-line', margin: 0 }}>{analise}</p>}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={reiniciar} style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(240,253,244,0.4)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
          Refazer Assessment
        </button>
        <a href="/dashboard/nexoperform/lideranca" style={{ padding: '10px 20px', borderRadius: 12, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', color: '#0ea5e9', fontWeight: 800, fontSize: 12, textDecoration: 'none' }}>
          Próximo: IHAL™ Liderança Adaptativa →
        </a>
      </div>
    </div>
  )
}
