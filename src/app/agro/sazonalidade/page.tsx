'use client'
import { useState } from 'react'

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const CULTURAS = ['Soja','Milho','Cana-de-açúcar','Café','Algodão','Laranja','Arroz','Feijão','Trigo','Pecuária','Horticultura','Outra']

export default function SazonalidadePage() {
  const [cultura, setCultura] = useState('')
  const [outraCultura, setOutraCultura] = useState('')
  const [equipeAtual, setEquipeAtual] = useState('')
  const [demandaMensal, setDemandaMensal] = useState<Record<string, string>>({})
  const [analisando, setAnalisando] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)
  const [previsoes, setPrevisoes] = useState<{ mes: string; demanda: string; acao: string }[]>([])

  const setDemanda = (mes: string, val: string) => setDemandaMensal(p => ({ ...p, [mes]: val }))

  async function gerarPlanejamento() {
    setAnalisando(true)
    setAnalise(null)
    setPrevisoes([])
    const culturaNome = cultura === 'Outra' ? outraCultura : cultura
    const demandaTexto = MESES.map(m => `${m}: ${demandaMensal[m] || 'não informado'} pessoas`).join(', ')
    const prompt = `Cultura principal: ${culturaNome}
Equipe fixa atual: ${equipeAtual} colaboradores
Demanda estimada por mês: ${demandaTexto}
Análise solicitada: planejamento de equipe, previsão de picos, recomendações de contratação temporária e alertas de turnover.`
    try {
      const res = await fetch('/api/agro-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, modulo: 'sazonalidade' })
      })
      const data = await res.json()
      setAnalise(data.text || data.error)
    } finally {
      setAnalisando(false)
    }
  }

  const mesAtual = new Date().getMonth()

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🔁</span>
          <h1 className="text-2xl font-bold text-gray-800">Gestão da Sazonalidade</h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">Planejamento inteligente de equipes rurais por ciclo da safra</p>
      </div>

      <div className="card mb-4">
        <h2 className="font-bold text-gray-800 mb-3">Cultura e equipe</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Cultura principal</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
              value={cultura} onChange={e => setCultura(e.target.value)}>
              <option value="">Selecione...</option>
              {CULTURAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {cultura === 'Outra' && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Qual cultura?</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
                value={outraCultura} onChange={e => setOutraCultura(e.target.value)} placeholder="Ex: Mandioca" />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Equipe fixa atual (nº de pessoas)</label>
            <input type="number" min={0}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
              value={equipeAtual} onChange={e => setEquipeAtual(e.target.value)} placeholder="Ex: 15" />
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="font-bold text-gray-800 mb-1">Demanda de equipe por mês</h2>
        <p className="text-xs text-gray-500 mb-3">Informe quantas pessoas (fixas + temporárias) são necessárias em cada mês</p>
        <div className="grid grid-cols-4 gap-3">
          {MESES.map((mes, idx) => (
            <div key={mes} className={`rounded-xl p-3 border ${idx === mesAtual ? 'border-oliva bg-oliva/5' : 'border-gray-100 bg-gray-50'}`}>
              <div className="text-xs font-bold text-gray-600 mb-1">{mes}{idx === mesAtual ? ' ←' : ''}</div>
              <input type="number" min={0}
                className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-oliva bg-white"
                placeholder="0"
                value={demandaMensal[mes] ?? ''} onChange={e => setDemanda(mes, e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {cultura && equipeAtual && (
        <div className="card mb-6" style={{ background: 'linear-gradient(135deg,#fefce8,#fff7ed)', border: '2px solid #fde68a' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-gray-800">🤖 Planejamento Inteligente de Equipe</div>
              <div className="text-xs text-gray-500">IA analisa ciclo da safra e gera previsão de demanda</div>
            </div>
            <button onClick={gerarPlanejamento} disabled={analisando} className="btn btn-primary text-sm">
              {analisando ? 'Gerando...' : 'Gerar Planejamento'}
            </button>
          </div>
          {analise && (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line border border-yellow-100">
              {analise}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
