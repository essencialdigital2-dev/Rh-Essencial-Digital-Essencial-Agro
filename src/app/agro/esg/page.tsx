'use client'
import { useState } from 'react'

const INDICADORES = [
  { id: 'diversidade', label: 'Diversidade na equipe', icon: '👥', categoria: 'Social', tipo: 'pct', desc: '% de mulheres, jovens aprendizes ou PCDs na equipe' },
  { id: 'acidentes', label: 'Taxa de acidentes (últimos 12 meses)', icon: '⚠️', categoria: 'Social', tipo: 'num', desc: 'Número de acidentes de trabalho registrados' },
  { id: 'treinamentos', label: 'Horas de treinamento por colaborador/ano', icon: '📚', categoria: 'Social', tipo: 'num', desc: 'Média de horas de capacitação por trabalhador' },
  { id: 'turnover', label: 'Turnover anual (%)', icon: '🔄', categoria: 'Social', tipo: 'pct', desc: '% de colaboradores que saíram no último ano' },
  { id: 'agua', label: 'Uso de água (reuso/captação)', icon: '💧', categoria: 'Ambiental', tipo: 'opcao', opcoes: ['Sem controle', 'Controle básico', 'Reuso implementado', 'Certificado'] },
  { id: 'solo', label: 'Práticas de conservação do solo', icon: '🌱', categoria: 'Ambiental', tipo: 'opcao', opcoes: ['Nenhuma', 'Rotação de culturas', 'Plantio direto', 'Certificação'] },
  { id: 'carbono', label: 'Inventário de emissões de carbono', icon: '🌿', categoria: 'Ambiental', tipo: 'opcao', opcoes: ['Não realizado', 'Em andamento', 'Realizado', 'Compensado'] },
  { id: 'residuos', label: 'Gestão de resíduos e embalagens', icon: '♻️', categoria: 'Ambiental', tipo: 'opcao', opcoes: ['Inadequado', 'Básico', 'Adequado', 'Certificado'] },
  { id: 'etica', label: 'Código de ética e conduta', icon: '⚖️', categoria: 'Governança', tipo: 'bool' },
  { id: 'compliance', label: 'Compliance trabalhista e ambiental', icon: '📋', categoria: 'Governança', tipo: 'bool' },
  { id: 'relatorio', label: 'Relatório de sustentabilidade publicado', icon: '📊', categoria: 'Governança', tipo: 'bool' },
  { id: 'auditoria', label: 'Auditoria interna ou externa realizada', icon: '🔍', categoria: 'Governança', tipo: 'bool' },
]

export default function ESGPage() {
  const [valores, setValores] = useState<Record<string, any>>({})
  const [empresa, setEmpresa] = useState('')
  const [analisando, setAnalisando] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)

  const set = (id: string, v: any) => setValores(prev => ({ ...prev, [id]: v }))

  const respondidos = Object.keys(valores).length
  const categorias = ['Social', 'Ambiental', 'Governança']

  async function analisarIA() {
    setAnalisando(true)
    setAnalise(null)
    const resumo = INDICADORES.map(i => `${i.categoria} - ${i.label}: ${valores[i.id] ?? 'não informado'}`).join('\n')
    const prompt = `Empresa: ${empresa || 'Fazenda Agro'}
Indicadores ESG preenchidos:\n${resumo}`
    try {
      const res = await fetch('/api/agro-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, modulo: 'esg' })
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
          <span className="text-3xl">📈</span>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard ESG Agro</h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">Indicadores de sustentabilidade, pessoas e governança com análise IA</p>
      </div>

      <div className="card mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da fazenda / empresa</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
          placeholder="Ex: Fazenda Santa Fé"
          value={empresa}
          onChange={e => setEmpresa(e.target.value)}
        />
      </div>

      {categorias.map(cat => {
        const cor = cat === 'Social' ? { bg: '#eff6ff', brd: '#bfdbfe', txt: '#1e40af' }
          : cat === 'Ambiental' ? { bg: '#f0fdf4', brd: '#bbf7d0', txt: '#14532d' }
          : { bg: '#fefce8', brd: '#fef08a', txt: '#854d0e' }
        return (
          <div key={cat} className="card mb-4" style={{ background: cor.bg, border: `1.5px solid ${cor.brd}` }}>
            <h2 className="font-bold mb-3" style={{ color: cor.txt }}>{cat}</h2>
            <div className="space-y-4">
              {INDICADORES.filter(i => i.categoria === cat).map(ind => (
                <div key={ind.id} className="bg-white rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{ind.icon}</span>
                    <span className="font-medium text-sm text-gray-800">{ind.label}</span>
                  </div>
                  {ind.desc && <p className="text-xs text-gray-400 mb-2 ml-6">{ind.desc}</p>}
                  {ind.tipo === 'pct' && (
                    <input type="number" min={0} max={100}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:border-oliva"
                      placeholder="%" value={valores[ind.id] ?? ''} onChange={e => set(ind.id, e.target.value)} />
                  )}
                  {ind.tipo === 'num' && (
                    <input type="number" min={0}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:border-oliva"
                      placeholder="Número" value={valores[ind.id] ?? ''} onChange={e => set(ind.id, e.target.value)} />
                  )}
                  {ind.tipo === 'bool' && (
                    <div className="flex gap-2">
                      {['Sim', 'Não', 'Em andamento'].map(op => (
                        <button key={op} onClick={() => set(ind.id, op)}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
                          style={{
                            background: valores[ind.id] === op ? cor.txt : '#fff',
                            color: valores[ind.id] === op ? '#fff' : cor.txt,
                            borderColor: cor.brd
                          }}>{op}</button>
                      ))}
                    </div>
                  )}
                  {ind.tipo === 'opcao' && (
                    <div className="flex flex-wrap gap-2">
                      {ind.opcoes?.map(op => (
                        <button key={op} onClick={() => set(ind.id, op)}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
                          style={{
                            background: valores[ind.id] === op ? cor.txt : '#fff',
                            color: valores[ind.id] === op ? '#fff' : cor.txt,
                            borderColor: cor.brd
                          }}>{op}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {respondidos >= 6 && (
        <div className="card mb-6" style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', border: '2px solid #86efac' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-gray-800">🤖 Análise ESG com IA</div>
              <div className="text-xs text-gray-500">{respondidos}/{INDICADORES.length} indicadores preenchidos</div>
            </div>
            <button onClick={analisarIA} disabled={analisando} className="btn btn-primary text-sm">
              {analisando ? 'Analisando...' : 'Gerar Score ESG'}
            </button>
          </div>
          {analise && (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line border border-green-100">
              {analise}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
