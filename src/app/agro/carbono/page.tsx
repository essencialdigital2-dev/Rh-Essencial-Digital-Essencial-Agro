'use client'
import { useState } from 'react'

export default function CarbonoPage() {
  const [form, setForm] = useState({
    area: '', cultura: '', plantio_direto: '', cobertura_solo: '',
    rebanho: '', biodigestor: '', energia_solar: '', reflorestamento: '',
    irrigacao: '', defensivos: '', certificacoes: ''
  })
  const [analisando, setAnalisando] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const campos = [
    { key: 'area', label: 'Área total da fazenda (hectares)', tipo: 'num', placeholder: 'Ex: 500' },
    { key: 'cultura', label: 'Culturas principais', tipo: 'text', placeholder: 'Ex: Soja, Milho, Pastagem' },
    { key: 'plantio_direto', label: 'Adota plantio direto ou conservacionista?', tipo: 'bool' },
    { key: 'cobertura_solo', label: 'Cobertura de solo / palhada', tipo: 'bool' },
    { key: 'rebanho', label: 'Número de cabeças de gado (se houver)', tipo: 'num', placeholder: '0 se não tiver' },
    { key: 'biodigestor', label: 'Possui biodigestor ou tratamento de dejetos?', tipo: 'bool' },
    { key: 'energia_solar', label: 'Usa energia solar ou renovável?', tipo: 'bool' },
    { key: 'reflorestamento', label: 'Área de preservação ou reflorestamento (ha)', tipo: 'num', placeholder: 'Ex: 50' },
    { key: 'irrigacao', label: 'Tipo de irrigação', tipo: 'opcao', opcoes: ['Não irriga', 'Superficial', 'Aspersão', 'Gotejamento / preciso'] },
    { key: 'defensivos', label: 'Uso de defensivos biológicos ou MIP', tipo: 'bool' },
    { key: 'certificacoes', label: 'Certificações já obtidas', tipo: 'text', placeholder: 'Ex: Rainforest, RTRS, orgânico...' },
  ]

  const preenchidos = Object.values(form).filter(v => v !== '').length

  async function analisarIA() {
    setAnalisando(true)
    setAnalise(null)
    const resumo = campos.map(c => `${c.label}: ${(form as any)[c.key] || 'não informado'}`).join('\n')
    try {
      const res = await fetch('/api/agro-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: resumo, modulo: 'carbono' })
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
          <span className="text-3xl">🌿</span>
          <h1 className="text-2xl font-bold text-gray-800">Crédito de Carbono & ESG</h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">Avalie o potencial de crédito de carbono e acesso a financiamentos verdes</p>
      </div>

      <div className="card mb-4" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
        <p className="text-sm text-green-800">💡 O mercado de crédito de carbono no agro movimentou mais de R$ 2 bilhões em 2024. Pequenas e médias fazendas com boas práticas têm alto potencial e poucas sabem disso.</p>
      </div>

      <div className="card mb-4">
        <h2 className="font-bold text-gray-800 mb-4">Dados da fazenda</h2>
        <div className="space-y-4">
          {campos.map(c => (
            <div key={c.key}>
              <label className="text-sm font-medium text-gray-700 block mb-1">{c.label}</label>
              {c.tipo === 'num' && (
                <input type="number" min={0}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:border-oliva"
                  placeholder={c.placeholder} value={(form as any)[c.key]} onChange={e => set(c.key, e.target.value)} />
              )}
              {c.tipo === 'text' && (
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-oliva"
                  placeholder={c.placeholder} value={(form as any)[c.key]} onChange={e => set(c.key, e.target.value)} />
              )}
              {c.tipo === 'bool' && (
                <div className="flex gap-2">
                  {['Sim', 'Não', 'Parcialmente'].map(op => (
                    <button key={op} onClick={() => set(c.key, op)}
                      className="text-xs px-4 py-1.5 rounded-lg border font-medium transition-all"
                      style={{
                        background: (form as any)[c.key] === op ? '#14532d' : '#fff',
                        color: (form as any)[c.key] === op ? '#fff' : '#374151',
                        borderColor: '#e5e7eb'
                      }}>{op}</button>
                  ))}
                </div>
              )}
              {c.tipo === 'opcao' && (
                <div className="flex flex-wrap gap-2">
                  {c.opcoes?.map(op => (
                    <button key={op} onClick={() => set(c.key, op)}
                      className="text-xs px-4 py-1.5 rounded-lg border font-medium transition-all"
                      style={{
                        background: (form as any)[c.key] === op ? '#14532d' : '#fff',
                        color: (form as any)[c.key] === op ? '#fff' : '#374151',
                        borderColor: '#e5e7eb'
                      }}>{op}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {preenchidos >= 5 && (
        <div className="card mb-6" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '2px solid #86efac' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-gray-800">🤖 Análise de Potencial de Carbono</div>
              <div className="text-xs text-gray-500">IA estima potencial e recomenda próximos passos</div>
            </div>
            <button onClick={analisarIA} disabled={analisando} className="btn btn-primary text-sm" style={{ background: '#14532d' }}>
              {analisando ? 'Calculando...' : 'Calcular Potencial'}
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
