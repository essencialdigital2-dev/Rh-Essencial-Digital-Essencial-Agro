'use client'
import { useState } from 'react'

const FATORES = [
  { id: 'isolamento', label: 'Isolamento geográfico', icon: '🏔️', desc: 'Colaboradores trabalham longe de centros urbanos, família ou serviços' },
  { id: 'divida', label: 'Dívida rural / pressão financeira', icon: '💸', desc: 'Pressão por resultados, financiamentos, custo de insumos' },
  { id: 'clima_pressao', label: 'Pressão climática e perda de safra', icon: '🌩️', desc: 'Riscos de seca, chuvas excessivas, perdas de colheita' },
  { id: 'acidente', label: 'Histórico de acidente de trabalho', icon: '🚨', desc: 'Acidentes recentes na equipe ou risco elevado de ocorrência' },
  { id: 'sazonalidade_est', label: 'Instabilidade de emprego sazonal', icon: '📅', desc: 'Medo de demissão na entressafra, contratos temporários' },
  { id: 'lideranca', label: 'Liderança autoritária ou violência', icon: '⚡', desc: 'Relatos de assédio, pressão excessiva ou conflitos com gestores' },
  { id: 'moradia', label: 'Condições de moradia inadequadas', icon: '🏠', desc: 'Alojamentos precários, sem privacidade ou conforto básico' },
  { id: 'familia', label: 'Distância da família', icon: '👨‍👩‍👧', desc: 'Tempo longe de filhos, cônjuge, longos períodos na fazenda' },
]

const SINTOMAS = [
  { id: 'absenteismo', label: 'Aumento de faltas e absenteísmo' },
  { id: 'conflitos', label: 'Aumento de conflitos entre equipes' },
  { id: 'produtividade', label: 'Queda na produtividade sem causa técnica' },
  { id: 'alcool', label: 'Suspeita de uso de álcool ou substâncias' },
  { id: 'humor', label: 'Alterações de humor frequentes' },
  { id: 'resignacao', label: 'Resignação, falta de motivação generalizada' },
  { id: 'rotatividade', label: 'Alta rotatividade sem motivo claro' },
]

export default function SaudeMentalPage() {
  const [empresa, setEmpresa] = useState('')
  const [equipe, setEquipe] = useState('')
  const [fatoresSelecionados, setFatoresSelecionados] = useState<string[]>([])
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([])
  const [contexto, setContexto] = useState('')
  const [analisando, setAnalisando] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)

  const toggleFator = (id: string) => setFatoresSelecionados(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleSintoma = (id: string) => setSintomasSelecionados(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const nivelRisco = fatoresSelecionados.length + sintomasSelecionados.length
  const corRisco = nivelRisco <= 2 ? '#16a34a' : nivelRisco <= 5 ? '#d97706' : '#dc2626'
  const labelRisco = nivelRisco <= 2 ? 'Baixo' : nivelRisco <= 5 ? 'Moderado' : 'Alto'

  async function analisarIA() {
    setAnalisando(true)
    setAnalise(null)
    const fatoresTexto = FATORES.filter(f => fatoresSelecionados.includes(f.id)).map(f => `- ${f.label}`).join('\n')
    const sintomasTexto = SINTOMAS.filter(s => sintomasSelecionados.includes(s.id)).map(s => `- ${s.label}`).join('\n')
    const prompt = `Empresa/Fazenda: ${empresa || 'Não informado'}
Tamanho da equipe: ${equipe || 'Não informado'} pessoas
Nível de risco estimado: ${labelRisco} (${nivelRisco} fatores)

Fatores de risco identificados:\n${fatoresTexto || 'Nenhum selecionado'}

Sintomas observados na equipe:\n${sintomasTexto || 'Nenhum selecionado'}

Contexto adicional: ${contexto || 'Não informado'}`
    try {
      const res = await fetch('/api/agro-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, modulo: 'saude_mental' })
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
          <span className="text-3xl">💊</span>
          <h1 className="text-2xl font-bold text-gray-800">Saúde Mental no Campo</h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">Diagnóstico de risco psicossocial específico para equipes rurais</p>
      </div>

      <div className="card mb-4" style={{ background: '#fff7ed', border: '1.5px solid #fed7aa' }}>
        <p className="text-sm text-orange-800">⚠️ Este módulo é uma ferramenta de triagem e apoio à gestão. Não substitui avaliação clínica de psicólogo ou médico do trabalho.</p>
      </div>

      <div className="card mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Fazenda / empresa</label>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
              placeholder="Ex: Fazenda Boa Vista" value={empresa} onChange={e => setEmpresa(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Tamanho da equipe</label>
            <input type="number" min={1}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
              placeholder="Nº de colaboradores" value={equipe} onChange={e => setEquipe(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="font-bold text-gray-800 mb-3">Fatores de Risco Específicos do Campo</h2>
        <p className="text-xs text-gray-500 mb-3">Selecione os fatores presentes na sua realidade</p>
        <div className="grid grid-cols-2 gap-2">
          {FATORES.map(f => (
            <button key={f.id} onClick={() => toggleFator(f.id)}
              className="text-left p-3 rounded-xl border transition-all"
              style={{
                background: fatoresSelecionados.includes(f.id) ? '#fef2f2' : '#f9fafb',
                borderColor: fatoresSelecionados.includes(f.id) ? '#fca5a5' : '#e5e7eb',
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span>{f.icon}</span>
                <span className="font-medium text-sm text-gray-800">{f.label}</span>
                {fatoresSelecionados.includes(f.id) && <span className="ml-auto text-red-500">✓</span>}
              </div>
              <p className="text-xs text-gray-500 ml-6">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-4">
        <h2 className="font-bold text-gray-800 mb-3">Sintomas Observados na Equipe</h2>
        <div className="space-y-2">
          {SINTOMAS.map(s => (
            <button key={s.id} onClick={() => toggleSintoma(s.id)}
              className="w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all"
              style={{
                background: sintomasSelecionados.includes(s.id) ? '#fff7ed' : '#f9fafb',
                borderColor: sintomasSelecionados.includes(s.id) ? '#fdba74' : '#e5e7eb',
              }}>
              <span style={{ color: sintomasSelecionados.includes(s.id) ? '#d97706' : '#9ca3af', fontSize: 18 }}>
                {sintomasSelecionados.includes(s.id) ? '●' : '○'}
              </span>
              <span className="text-sm text-gray-700">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Contexto adicional (opcional)</label>
        <textarea rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva resize-none"
          placeholder="Descreva situações específicas, eventos recentes, mudanças na equipe..."
          value={contexto} onChange={e => setContexto(e.target.value)} />
      </div>

      {(fatoresSelecionados.length > 0 || sintomasSelecionados.length > 0) && (
        <div className="card mb-6" style={{
          background: `linear-gradient(135deg,${corRisco}15,${corRisco}08)`,
          border: `2px solid ${corRisco}60`
        }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-gray-800">🤖 Análise de Risco Psicossocial</div>
              <div className="text-sm font-bold mt-1" style={{ color: corRisco }}>
                Risco {labelRisco} — {nivelRisco} indicadores identificados
              </div>
            </div>
            <button onClick={analisarIA} disabled={analisando} className="btn btn-primary text-sm">
              {analisando ? 'Analisando...' : 'Gerar Diagnóstico'}
            </button>
          </div>
          {analise && (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line border border-gray-100">
              {analise}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
