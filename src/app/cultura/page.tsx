'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ValorCultura { nome: string; descricao?: string }
interface EmpresaRow { id: string; nome: string; token_cultura: string; valores_cultura: ValorCultura[] }

export default function CulturaPage() {
  const [empresas, setEmpresas] = useState<EmpresaRow[]>([])
  const [empresaId, setEmpresaId] = useState('')
  const [valores, setValores] = useState<ValorCultura[]>([])
  const [novoValor, setNovoValor] = useState('')
  const [novaDesc, setNovaDesc] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [analise, setAnalise] = useState('')
  const [analisando, setAnalisando] = useState(false)

  useEffect(() => {
    supabase.from('empresas').select('id, nome, token_cultura, valores_cultura').order('nome')
      .then(({ data }) => setEmpresas((data as EmpresaRow[]) || []))
  }, [])

  const empresa = empresas.find(e => e.id === empresaId)

  useEffect(() => {
    setValores(empresa?.valores_cultura || [])
    setAnalise('')
  }, [empresaId])

  function adicionarValor() {
    if (!novoValor.trim()) return
    setValores(prev => [...prev, { nome: novoValor.trim(), descricao: novaDesc.trim() || undefined }])
    setNovoValor(''); setNovaDesc('')
  }

  function removerValor(i: number) {
    setValores(prev => prev.filter((_, idx) => idx !== i))
  }

  async function salvar() {
    if (!empresaId) return
    setSalvando(true)
    try {
      await fetch('/api/empresa-cultura', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa_id: empresaId, valores_cultura: valores }),
      })
    } finally {
      setSalvando(false)
    }
  }

  function copiarLink() {
    if (!empresa) return
    const link = `${window.location.origin}/pulso/${empresa.token_cultura}`
    navigator.clipboard.writeText(link)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  async function gerarAnalise() {
    if (!empresaId) return
    setAnalisando(true)
    try {
      const res = await fetch('/api/cultura-preditivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa_id: empresaId }),
      })
      const d = await res.json()
      setAnalise(d.texto)
    } finally {
      setAnalisando(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">🧭 Cultura Organizacional Preditiva</h1>
      <p className="text-gray-500 text-sm mb-6">Defina os valores da empresa, colete o pulso real dos colaboradores e deixe a IA prever riscos culturais antes que virem problema.</p>

      <div className="card mb-6">
        <label className="label">Empresa</label>
        <select className="input" value={empresaId} onChange={e => setEmpresaId(e.target.value)}>
          <option value="">Selecione uma empresa</option>
          {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
        </select>
      </div>

      {empresa && (
        <>
          <div className="card mb-6">
            <h2 className="font-bold text-gray-800 mb-3">Valores declarados</h2>
            {valores.length === 0 && <p className="text-gray-400 text-sm mb-3">Nenhum valor cadastrado ainda.</p>}
            <div className="space-y-2 mb-4">
              {valores.map((v, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <div className="font-medium text-sm">{v.nome}</div>
                    {v.descricao && <div className="text-xs text-gray-500">{v.descricao}</div>}
                  </div>
                  <button onClick={() => removerValor(i)} className="text-red-500 text-xs hover:underline">Remover</button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input className="input" placeholder="Nome do valor (ex: Segurança em primeiro lugar)" value={novoValor} onChange={e => setNovoValor(e.target.value)} />
              <input className="input" placeholder="Descrição (opcional)" value={novaDesc} onChange={e => setNovaDesc(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button onClick={adicionarValor} className="btn btn-outline text-sm">+ Adicionar valor</button>
              <button onClick={salvar} disabled={salvando} className="btn btn-primary text-sm">{salvando ? 'Salvando...' : 'Salvar valores'}</button>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="font-bold text-gray-800 mb-3">Link para coletar pulso dos colaboradores</h2>
            <p className="text-sm text-gray-500 mb-3">Envie esse link pelos canais de qualquer app do ecossistema (Sense AI, Agro Tech, NexoPerform, RH Essencial Digital) — é central, não precisa duplicar em cada um.</p>
            <button onClick={copiarLink} className={`text-sm px-3 py-2 rounded-lg border ${linkCopiado ? 'bg-green-100 text-green-700 border-green-200' : 'border-gray-200 text-gray-600 hover:border-oliva'}`}>
              {linkCopiado ? '✓ Copiado!' : '🔗 Copiar link do pulso'}
            </button>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-800">🔮 Análise preditiva da IA</h2>
              <button onClick={gerarAnalise} disabled={analisando} className="btn btn-primary text-sm">
                {analisando ? 'Analisando...' : analise ? 'Regerar análise' : 'Gerar análise'}
              </button>
            </div>
            {analise && <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">{analise}</div>}
          </div>
        </>
      )}
    </div>
  )
}
