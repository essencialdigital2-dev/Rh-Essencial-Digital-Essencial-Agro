'use client'
import { useState } from 'react'

const CHECKLIST = [
  { id: 1, categoria: 'EPI e Equipamentos', item: 'Colaboradores usam EPI adequado para cada atividade (luvas, botas, capacete, protetor solar)', critico: true },
  { id: 2, categoria: 'EPI e Equipamentos', item: 'EPIs são fornecidos gratuitamente pela empresa', critico: true },
  { id: 3, categoria: 'EPI e Equipamentos', item: 'Há registro de entrega de EPI assinado pelos colaboradores', critico: false },
  { id: 4, categoria: 'Treinamento e Capacitação', item: 'Todos os colaboradores receberam treinamento de segurança ao ser admitido', critico: true },
  { id: 5, categoria: 'Treinamento e Capacitação', item: 'Há treinamento específico para operação de máquinas agrícolas', critico: true },
  { id: 6, categoria: 'Treinamento e Capacitação', item: 'Treinamentos são documentados com lista de presença', critico: false },
  { id: 7, categoria: 'Agrotóxicos e Químicos', item: 'Manipulação de agrotóxicos segue as normas (EPI completo, ficha de segurança)', critico: true },
  { id: 8, categoria: 'Agrotóxicos e Químicos', item: 'Há local adequado para armazenagem de agrotóxicos (isolado, ventilado, identificado)', critico: true },
  { id: 9, categoria: 'Agrotóxicos e Químicos', item: 'Descarte de embalagens vazias é feito corretamente (tríplice lavagem + devolução)', critico: true },
  { id: 10, categoria: 'Instalações e Alojamento', item: 'Instalações sanitárias são adequadas e higienizadas', critico: false },
  { id: 11, categoria: 'Instalações e Alojamento', item: 'Há água potável disponível nos locais de trabalho', critico: true },
  { id: 12, categoria: 'Instalações e Alojamento', item: 'Alojamentos (quando houver) atendem condições mínimas de dignidade', critico: false },
  { id: 13, categoria: 'Saúde e Ergonomia', item: 'Há controle de exposição ao calor e pausas para descanso', critico: true },
  { id: 14, categoria: 'Saúde e Ergonomia', item: 'Trabalhadores em atividade de esforço físico intenso têm pausas programadas', critico: false },
  { id: 15, categoria: 'Saúde e Ergonomia', item: 'Há programa de exames médicos periódicos (PCMSO)', critico: true },
  { id: 16, categoria: 'Máquinas e Implementos', item: 'Máquinas possuem proteções e dispositivos de segurança em bom estado', critico: true },
  { id: 17, categoria: 'Máquinas e Implementos', item: 'Há registro de manutenção preventiva de máquinas e implementos', critico: false },
  { id: 18, categoria: 'Emergências', item: 'Há plano de emergência para acidentes e primeiros socorros', critico: true },
  { id: 19, categoria: 'Emergências', item: 'Há kit de primeiros socorros disponível e acessível', critico: true },
  { id: 20, categoria: 'Emergências', item: 'Colaboradores sabem o que fazer em caso de acidente com agrotóxicos', critico: true },
]

type Status = 'sim' | 'nao' | 'parcial' | null

export default function NR31Page() {
  const [respostas, setRespostas] = useState<Record<number, Status>>({})
  const [analisando, setAnalisando] = useState(false)
  const [analise, setAnalise] = useState<string | null>(null)
  const [empresa, setEmpresa] = useState('')

  const total = CHECKLIST.length
  const respondidos = Object.keys(respostas).length
  const conformes = Object.values(respostas).filter(v => v === 'sim').length
  const naoConformes = Object.values(respostas).filter(v => v === 'nao').length
  const parciais = Object.values(respostas).filter(v => v === 'parcial').length
  const score = respondidos > 0 ? Math.round((conformes / respondidos) * 100) : 0

  const categorias = CHECKLIST.map(i => i.categoria).filter((v, idx, arr) => arr.indexOf(v) === idx)

  async function analisarIA() {
    setAnalisando(true)
    setAnalise(null)
    const itensNaoConformes = CHECKLIST.filter(i => respostas[i.id] === 'nao' || respostas[i.id] === 'parcial')
      .map(i => `- [${respostas[i.id] === 'nao' ? 'NÃO CONFORME' : 'PARCIAL'}] ${i.categoria}: ${i.item}${i.critico ? ' ⚠️ CRÍTICO' : ''}`)
      .join('\n')
    const prompt = `Empresa: ${empresa || 'Fazenda'}
Score de conformidade NR-31: ${score}%
Itens conformes: ${conformes}/${total}
Itens não conformes ou parciais:\n${itensNaoConformes || 'Nenhum'}`
    try {
      const res = await fetch('/api/agro-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, modulo: 'nr31' })
      })
      const data = await res.json()
      setAnalise(data.text || data.error)
    } finally {
      setAnalisando(false)
    }
  }

  const corScore = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🛡️</span>
          <h1 className="text-2xl font-bold text-gray-800">NR-31 — Compliance Rural</h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">Checklist de conformidade com a Norma Regulamentadora do Trabalho Rural</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="card text-center">
          <div style={{ fontSize: 28, fontWeight: 900, color: corScore }}>{score}%</div>
          <div className="text-xs text-gray-500">Score NR-31</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{conformes}</div>
          <div className="text-xs text-gray-500">Conformes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{parciais}</div>
          <div className="text-xs text-gray-500">Parciais</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{naoConformes}</div>
          <div className="text-xs text-gray-500">Não Conformes</div>
        </div>
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

      {categorias.map(cat => (
        <div key={cat} className="card mb-4">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">{cat}</h2>
          <div className="space-y-3">
            {CHECKLIST.filter(i => i.categoria === cat).map(item => (
              <div key={item.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-start gap-2 mb-2">
                  {item.critico && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5">Crítico</span>}
                  <p className="text-sm text-gray-700">{item.item}</p>
                </div>
                <div className="flex gap-2">
                  {(['sim', 'parcial', 'nao'] as Status[]).map(op => (
                    <button
                      key={op}
                      onClick={() => setRespostas(r => ({ ...r, [item.id]: op }))}
                      style={{
                        padding: '4px 14px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        border: '1.5px solid',
                        cursor: 'pointer',
                        background: respostas[item.id] === op
                          ? op === 'sim' ? '#16a34a' : op === 'parcial' ? '#d97706' : '#dc2626'
                          : '#fff',
                        color: respostas[item.id] === op ? '#fff' : op === 'sim' ? '#16a34a' : op === 'parcial' ? '#d97706' : '#dc2626',
                        borderColor: op === 'sim' ? '#16a34a' : op === 'parcial' ? '#d97706' : '#dc2626',
                      }}
                    >
                      {op === 'sim' ? '✓ Sim' : op === 'parcial' ? '~ Parcial' : '✗ Não'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {respondidos >= 10 && (
        <div className="card mb-6" style={{ background: 'linear-gradient(135deg,#fef2f2,#fff7ed)', border: '2px solid #fca5a5' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-gray-800">🤖 Análise IA — NR-31</div>
              <div className="text-xs text-gray-500">{respondidos}/{total} itens avaliados</div>
            </div>
            <button
              onClick={analisarIA}
              disabled={analisando}
              className="btn btn-primary text-sm"
              style={{ background: '#dc2626' }}
            >
              {analisando ? 'Analisando...' : 'Gerar Análise IA'}
            </button>
          </div>
          {analise && (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line border border-red-100">
              {analise}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
