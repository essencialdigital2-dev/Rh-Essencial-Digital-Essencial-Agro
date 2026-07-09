'use client'
import { useState, useEffect } from 'react'

const PILARES = [
  {
    letra: 'H',
    titulo: 'Humanizar',
    cor: '#10b981',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.15)',
    desc: 'Compreender cada colaborador como um indivíduo único, com sua história, seu ritmo e suas necessidades específicas.',
    detalhe: 'O primeiro passo é parar de tratar as pessoas como recursos idênticos. A IA mapeia perfis comportamentais, emocionais e cognitivos, entregando ao gestor uma visão individualizada que nenhuma planilha consegue oferecer.',
  },
  {
    letra: 'A',
    titulo: 'Adaptar',
    cor: '#f59e0b',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.15)',
    desc: 'Adaptar comunicação, liderança e desenvolvimento ao perfil real de cada pessoa.',
    detalhe: 'Não existe liderança eficaz sem adaptação. A IA ensina o gestor a mudar sua abordagem conforme o perfil de quem está na sua frente: o que motiva um colaborador entrava outro.',
  },
  {
    letra: 'I',
    titulo: 'Integrar',
    cor: '#a78bfa',
    bg: 'rgba(167,139,250,0.06)',
    border: 'rgba(167,139,250,0.15)',
    desc: 'Promover inclusão, desempenho e pertencimento por meio da tecnologia.',
    detalhe: 'Integrar vai além de incluir. É criar um ambiente onde cada pessoa sente que pertence, que contribui e que importa. A IA identifica rupturas e antecipa exclusões antes que o problema se torne crise.',
  },
  {
    letra: 'IA',
    titulo: 'Inteligência Adaptativa',
    cor: '#0ea5e9',
    bg: 'rgba(14,165,233,0.06)',
    border: 'rgba(14,165,233,0.15)',
    desc: 'Aprendizado contínuo baseado em evidências, sempre com o ser humano no centro.',
    detalhe: 'A IA do Método HAI não substitui o gestor. Ela o torna mais capaz. Cada interação alimenta um modelo que aprende os padrões daquela equipe e daquele gestor. Com o tempo, as recomendações ficam mais precisas e mais eficazes.',
  },
  {
    letra: 'E',
    titulo: 'Evidenciar',
    cor: '#34d399',
    bg: 'rgba(52,211,153,0.06)',
    border: 'rgba(52,211,153,0.15)',
    desc: 'Transformar inteligência humana em métricas reais, mensuráveis e evolutivas.',
    detalhe: 'O que não é medido não muda. O Método HAI cria o primeiro sistema de métricas de inteligência humana: 4 índices proprietários que formam o Human Score, uma meta humana tão mensurável quanto a meta de faturamento.',
  },
]

const INDICES = [
  { sigla: 'IQH', nome: 'Qualidade Humana', cor: '#10b981', peso: '25%', pilar: 'H', icone: '🏅', desc: '7 dimensões. Saúde humana geral da organização.' },
  { sigla: 'IEBO', nome: 'Bem-Estar Organizacional', cor: '#a78bfa', peso: '30%', pilar: 'I', icone: '💚', desc: '10 dimensões. Relação entre gestor e equipe.' },
  { sigla: 'IEIH', nome: 'Inteligência Humana', cor: '#f59e0b', peso: '20%', pilar: 'IA', icone: '💡', desc: '7 dimensões. Capacidade cognitiva coletiva.' },
  { sigla: 'IHAL™', nome: 'Liderança Adaptativa', cor: '#0ea5e9', peso: '25%', pilar: 'A', icone: '🧭', desc: '8 dimensões. O gestor avaliado como líder.' },
]

const ECOSSISTEMA = [
  { nome: 'Essencial Agro Tech', tagline: 'Movido pelo Método Essencial HAI', cor: '#10b981' },
  { nome: 'Essencial Sense AI', tagline: 'Inteligência desenvolvida com o Método Essencial HAI', cor: '#a78bfa' },
  { nome: 'RH Essencial Digital', tagline: 'Baseado no Método Essencial HAI', cor: '#0ea5e9' },
  { nome: 'NexoPerform HAI', tagline: 'Assessment comportamental do Método Essencial HAI', cor: '#f59e0b' },
]

export default function MetodologiaHAIPage() {
  const [pilar, setPilar] = useState(0)
  const [analise, setAnalise] = useState('')
  const [loading, setLoading] = useState(false)

  const p = PILARES[pilar]

  async function gerarAnalise() {
    setLoading(true)
    try {
      const r = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modulo: 'metodologia-hai',
          prompt: `Você é especialista em desenvolvimento humano organizacional. Explique em 2 parágrafos como o pilar "${p.letra} — ${p.titulo}" do Método Essencial HAI transforma a gestão de pessoas na prática. Seja específico, use exemplos reais, linguagem direta. Sem travessões.`,
        }),
      })
      const d = await r.json()
      setAnalise(d.resultado || d.text || '')
    } catch { setAnalise('Não foi possível gerar a análise agora.') }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0', color: '#f0fdf4' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2 }}>Metodologia Proprietária — Ecossistema Essencial</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, marginBottom: 4, color: '#f0fdf4' }}>
          Método Essencial <span style={{ color: '#10b981' }}>HAI</span>
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.3)', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20 }}>Human Adaptive Intelligence</p>

        <div style={{ padding: '16px 22px', borderRadius: 16, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.7)', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
            "A Inteligência Artificial reconhece padrões.<br />
            O Método Essencial HAI ensina líderes a reconhecer pessoas."
          </p>
        </div>
      </div>

      {/* 5 PILARES — BOTÕES */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>Os 5 Pilares do Método</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PILARES.map((pl, i) => (
            <button key={i} onClick={() => { setPilar(i); setAnalise('') }} style={{
              padding: '9px 18px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 13,
              background: pilar === i ? `${pl.cor}15` : 'rgba(255,255,255,0.04)',
              color: pilar === i ? pl.cor : 'rgba(240,253,244,0.35)',
              outline: pilar === i ? `2px solid ${pl.cor}40` : '1px solid rgba(255,255,255,0.07)',
              transition: 'all 0.2s',
            }}>
              {pl.letra}
            </button>
          ))}
        </div>
      </div>

      {/* PILAR ATIVO */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ padding: '24px', borderRadius: 20, background: p.bg, border: `1px solid ${p.border}`, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `${p.cor}15`, border: `2px solid ${p.cor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: p.cor }}>{p.letra}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: p.cor, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 }}>Pilar {pilar + 1} de 5</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f0fdf4', marginBottom: 8, letterSpacing: -0.5 }}>{p.titulo}</div>
              <p style={{ fontSize: 14, color: 'rgba(240,253,244,0.65)', lineHeight: 1.75, marginBottom: 10 }}>{p.desc}</p>
              <p style={{ fontSize: 12, color: 'rgba(240,253,244,0.4)', lineHeight: 1.7 }}>{p.detalhe}</p>
            </div>
          </div>
        </div>

        {/* IA insight do pilar */}
        <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {analise ? (
            <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.7)', lineHeight: 1.85, margin: 0, whiteSpace: 'pre-line' }}>{analise}</p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, color: 'rgba(240,253,244,0.25)' }}>Peça a IA para aprofundar este pilar na prática</div>
              <button onClick={gerarAnalise} disabled={loading} style={{
                padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12,
                background: loading ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.15)',
                color: '#10b981',
                outline: '1px solid rgba(16,185,129,0.2)',
              }}>
                {loading ? 'Gerando...' : `🤖 IA: Pilar ${p.letra}`}
              </button>
            </div>
          )}
        </div>

        {/* Navegação */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          {pilar > 0 ? (
            <button onClick={() => { setPilar(pilar - 1); setAnalise('') }} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: 'rgba(240,253,244,0.4)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              ← {PILARES[pilar - 1].titulo}
            </button>
          ) : <div />}
          {pilar < PILARES.length - 1 && (
            <button onClick={() => { setPilar(pilar + 1); setAnalise('') }} style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${PILARES[pilar + 1].cor}30`, background: `${PILARES[pilar + 1].cor}08`, color: PILARES[pilar + 1].cor, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              {PILARES[pilar + 1].titulo} →
            </button>
          )}
        </div>
      </div>

      {/* O QUE É */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>O que é o Método HAI</div>
        <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.55)', lineHeight: 1.9, marginBottom: 10 }}>
          Uma metodologia proprietária que combina Inteligência Artificial, ciência do comportamento e liderança humanizada para ajudar gestores a compreender, desenvolver e incluir cada colaborador de acordo com suas características individuais.
        </p>
        <p style={{ fontSize: 13, color: 'rgba(240,253,244,0.55)', lineHeight: 1.9 }}>
          O HAI parte de um princípio simples e radical: a maioria das ferramentas de RH mede o colaborador. O Método Essencial HAI mede a relação entre gestor e colaborador. Porque é nessa relação que o desempenho, o engajamento e a saúde organizacional realmente acontecem ou deixam de acontecer.
        </p>
      </div>

      {/* 4 ÍNDICES */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Os 4 Índices Proprietários HAI</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {INDICES.map((idx, i) => (
            <div key={i} style={{ padding: '18px', borderRadius: 16, background: `${idx.cor}06`, border: `1px solid ${idx.cor}18` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{idx.icone}</span>
                  <span style={{ fontSize: 17, fontWeight: 900, color: idx.cor }}>{idx.sigla}</span>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div style={{ padding: '2px 8px', borderRadius: 99, background: `${idx.cor}12` }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: idx.cor }}>{idx.peso}</span>
                  </div>
                  <div style={{ padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(240,253,244,0.35)' }}>Pilar {idx.pilar}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(240,253,244,0.45)', marginBottom: 4 }}>{idx.nome}</div>
              <p style={{ fontSize: 10, color: 'rgba(240,253,244,0.35)', lineHeight: 1.55, margin: 0 }}>{idx.desc}</p>
              <div style={{ marginTop: 10, height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.05)' }}>
                <div style={{ height: '100%', width: idx.peso, background: idx.cor, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, padding: '16px 20px', borderRadius: 14, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Human Score — Pilar E (Evidenciar)</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {INDICES.map((idx, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: idx.cor }}>{idx.sigla}</span>
                {i < INDICES.length - 1 && <span style={{ color: 'rgba(240,253,244,0.15)' }}>+</span>}
              </span>
            ))}
            <span style={{ color: 'rgba(240,253,244,0.15)' }}>=</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>Human Score 0-100</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(240,253,244,0.3)', lineHeight: 1.6 }}>O único número que mede a saúde humana completa de uma organização.</div>
        </div>
      </div>

      {/* DIFERENCIAL */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Por que o HAI é diferente</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { antes: 'RH mede o colaborador', depois: 'HAI mede a relação gestor-colaborador' },
            { antes: 'Relatórios que ficam em gaveta', depois: 'IA que gera ação personalizada em tempo real' },
            { antes: 'Treinamentos genéricos para todos', depois: 'Plano adaptado ao perfil de cada pessoa' },
            { antes: 'IA que substitui decisões humanas', depois: 'IA que forma líderes mais conscientes' },
            { antes: 'Índices desconectados entre si', depois: 'Human Score: uma meta humana mensurável' },
            { antes: 'Inclusão como discurso', depois: 'Pertencimento medido e orientado pela IA' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 9, color: 'rgba(240,253,244,0.18)', textDecoration: 'line-through', marginBottom: 4 }}>{c.antes}</div>
              <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>✓ {c.depois}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ECOSSISTEMA */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Ecossistema HAI</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ECOSSISTEMA.map((e, i) => (
            <div key={i} style={{ padding: '12px 16px', borderRadius: 12, background: `${e.cor}05`, border: `1px solid ${e.cor}14`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: e.cor, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#f0fdf4' }}>{e.nome}</div>
                <div style={{ fontSize: 10, color: e.cor, fontWeight: 700, marginTop: 1 }}>{e.tagline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOCUMENTO OFICIAL */}
      <div style={{ marginBottom: 24, padding: '22px 24px', borderRadius: 18, background: 'linear-gradient(135deg, rgba(16,185,129,0.07), rgba(52,211,153,0.03))', border: '1px solid rgba(16,185,129,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>Disponível Agora</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#f0fdf4', marginBottom: 4 }}>📖 Documento Oficial do Método HAI</div>
          <div style={{ fontSize: 12, color: 'rgba(240,253,244,0.4)' }}>Missão, princípios, pilares, ética, privacidade, inclusão e exemplos práticos.</div>
        </div>
        <a href="/dashboard/metodologia-hai/documento" style={{ padding: '12px 24px', borderRadius: 14, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontWeight: 900, fontSize: 13, textDecoration: 'none', flexShrink: 0 }}>
          Ler Documento Completo →
        </a>
      </div>

      {/* RODAPÉ */}
      <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.09)', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: 'rgba(240,253,244,0.25)', lineHeight: 1.7 }}>
          Método Essencial HAI é uma metodologia proprietária criada por <strong style={{ color: 'rgba(240,253,244,0.4)' }}>Alana Carvalho</strong>, Gestora de Pessoas com especialidade em Psicologia Organizacional.<br />
          Todos os índices, dimensões e pesos foram desenvolvidos com base em ciência do comportamento, evidências empíricas e validação prática.
        </div>
      </div>

    </div>
  )
}
