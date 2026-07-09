'use client'
import { useState } from 'react'

const CONDICOES = [
  { id: 'calor_extremo', label: 'Calor extremo (>35°C)', icon: '🌡️', risco: 'alto' },
  { id: 'seca', label: 'Período de seca prolongada', icon: '🏜️', risco: 'alto' },
  { id: 'chuvas', label: 'Chuvas excessivas / alagamentos', icon: '🌧️', risco: 'alto' },
  { id: 'geada', label: 'Risco de geada', icon: '❄️', risco: 'medio' },
  { id: 'vento', label: 'Ventos fortes / tempestades', icon: '🌪️', risco: 'medio' },
  { id: 'normal', label: 'Condições normais para a época', icon: '☀️', risco: 'baixo' },
]

const IMPACTOS = [
  { id: 'saude', label: 'Impacto na saúde dos trabalhadores', opcoes: ['Baixo', 'Moderado', 'Alto', 'Crítico'] },
  { id: 'producao', label: 'Impacto na produção/safra', opcoes: ['Baixo', 'Moderado', 'Alto', 'Crítico'] },
  { id: 'moral', label: 'Impacto no moral da equipe', opcoes: ['Baixo', 'Moderado', 'Alto', 'Crítico'] },
]

export default function ClimaPage() {
  const [regiao, setRegiao] = useState('')
  const [condicao, setCondicao] = useState('')
  const [temp, setTemp] = useState('')
  const [impactos, setImpactos] = useState<Record<string, string>>({})
  const [medidas, setMedidas] = useState<string[]>([])
  const [analisando, setAnalisando] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)

  const medidasDisponiveis = [
    'Pausas obrigatórias a cada 2h', 'Água e eletrólitos disponíveis', 'EPI adequado para o clima',
    'Mudança de horário de trabalho', 'Tendas/sombrites nos campos', 'Comunicação de emergência ativa',
    'Monitoramento de sintomas de exaustão', 'Plano de evacuação em caso de alagamento'
  ]

  const toggleMedida = (m: string) => setMedidas(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m])
  const setImpacto = (id: string, v: string) => setImpactos(p => ({ ...p, [id]: v }))

  const condicaoSelecionada = CONDICOES.find(c => c.id === condicao)

  async function analisarIA() {
    setAnalisando(true)
    setAnalise(null)
    const impactosTexto = IMPACTOS.map(i => `${i.label}: ${impactos[i.id] || 'não informado'}`).join(', ')
    const medidasTexto = medidas.join(', ') || 'Nenhuma medida ativa'
    const prompt = `Região: ${regiao || 'Não informado'}
Condição climática atual: ${condicaoSelecionada?.label || 'Não informado'}
Temperatura: ${temp || 'não informada'}°C
Impactos identificados: ${impactosTexto}
Medidas já em vigor: ${medidasTexto}`
    try {
      const res = await fetch('/api/agro-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, modulo: 'clima' })
      })
      const data = await res.json()
      setAnalise(data.text || data.error)
    } finally {
      setAnalisando(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🌦️</span>
          <h1 className="text-2xl font-bold text-gray-800">Clima & Bem-estar da Equipe</h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">Monitoramento do impacto climático na saúde e desempenho das equipes rurais</p>
      </div>

      <div className="card mb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Região / Município</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
              placeholder="Ex: Ribeirão Preto - SP" value={regiao} onChange={e => setRegiao(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Temperatura atual (°C)</label>
            <input type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
              placeholder="Ex: 38" value={temp} onChange={e => setTemp(e.target.value)} />
          </div>
        </div>
        <h2 className="font-bold text-gray-800 mb-3">Condição climática atual</h2>
        <div className="grid grid-cols-3 gap-2">
          {CONDICOES.map(c => (
            <button key={c.id} onClick={() => setCondicao(c.id)}
              className="p-3 rounded-xl border text-center transition-all"
              style={{
                background: condicao === c.id ? (c.risco === 'alto' ? '#fef2f2' : c.risco === 'medio' ? '#fff7ed' : '#f0fdf4') : '#f9fafb',
                borderColor: condicao === c.id ? (c.risco === 'alto' ? '#fca5a5' : c.risco === 'medio' ? '#fdba74' : '#86efac') : '#e5e7eb',
              }}>
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="text-xs font-medium text-gray-700">{c.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="font-bold text-gray-800 mb-3">Nível de impacto</h2>
        <div className="space-y-3">
          {IMPACTOS.map(imp => (
            <div key={imp.id}>
              <label className="text-sm font-medium text-gray-700 block mb-1">{imp.label}</label>
              <div className="flex gap-2">
                {imp.opcoes.map(op => (
                  <button key={op} onClick={() => setImpacto(imp.id, op)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
                    style={{
                      background: impactos[imp.id] === op ? (op === 'Crítico' ? '#dc2626' : op === 'Alto' ? '#d97706' : op === 'Moderado' ? '#0369a1' : '#16a34a') : '#fff',
                      color: impactos[imp.id] === op ? '#fff' : '#374151',
                      borderColor: '#e5e7eb'
                    }}>{op}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="font-bold text-gray-800 mb-3">Medidas já implementadas</h2>
        <div className="grid grid-cols-2 gap-2">
          {medidasDisponiveis.map(m => (
            <button key={m} onClick={() => toggleMedida(m)}
              className="text-left text-xs p-2.5 rounded-lg border flex items-center gap-2 transition-all"
              style={{
                background: medidas.includes(m) ? '#f0fdf4' : '#f9fafb',
                borderColor: medidas.includes(m) ? '#86efac' : '#e5e7eb',
              }}>
              <span style={{ color: medidas.includes(m) ? '#16a34a' : '#9ca3af' }}>
                {medidas.includes(m) ? '✓' : '○'}
              </span>
              {m}
            </button>
          ))}
        </div>
      </div>

      {condicao && (
        <div className="card mb-6" style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '2px solid #93c5fd' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-gray-800">🤖 Protocolo de Gestão Climática</div>
              <div className="text-xs text-gray-500">IA gera recomendações e protocolo de segurança para a equipe</div>
            </div>
            <button onClick={analisarIA} disabled={analisando} className="btn btn-primary text-sm">
              {analisando ? 'Gerando...' : 'Gerar Protocolo'}
            </button>
          </div>
          {analise && (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line border border-blue-100">
              {analise}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
