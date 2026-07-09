'use client'
import { useEffect, useState } from 'react'
import { ecoFetch } from '@/lib/ecoFetch'

const PRODUTOS = [
  { key: 'edu', label: 'Essencial Edu' },
  { key: 'teens', label: 'Essencial Teens' },
  { key: 'estudo', label: 'Essencial Estudo' },
  { key: 'med', label: 'Essencial Med' },
  { key: 'juridico', label: 'Essencial Jurídico' },
  { key: 'nexo', label: 'NexoPerform' },
  { key: 'agro', label: 'Agro Tech' },
]

export default function FinanceiroPage() {
  const [dados, setDados] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [analise, setAnalise] = useState<any>(null)
  const [analisando, setAnalisando] = useState(false)

  const [produto, setProduto] = useState('edu')
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7) + '-01')
  const [receita, setReceita] = useState('')
  const [despesas, setDespesas] = useState('')
  const [obs, setObs] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try {
      const r = await ecoFetch('/api/eco-financeiro')
      const d = await r.json()
      setDados(d)
    } finally {
      setCarregando(false)
    }
  }

  async function salvarManual() {
    if (!receita) return
    setSalvando(true)
    try {
      await ecoFetch('/api/eco-financeiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto, mes, receita: Number(receita), despesas: Number(despesas || 0), observacao: obs }),
      })
      setReceita(''); setDespesas(''); setObs('')
      carregar()
    } finally {
      setSalvando(false)
    }
  }

  async function analisarComIA() {
    if (!dados) return
    setAnalisando(true)
    try {
      const r = await ecoFetch('/api/eco-financeiro/analise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })
      const d = await r.json()
      if (d.analise) setAnalise(d.analise)
    } finally {
      setAnalisando(false)
    }
  }

  const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 60px', fontFamily: 'system-ui,sans-serif', color: '#F8F8FF' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, background: 'linear-gradient(135deg,#FBBf24,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>💰 Financeiro Consolidado</h1>
        <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.4)', marginTop: 4 }}>Sense AI/RH tem dados automáticos (Stripe). Os outros produtos ainda dependem de lançamento manual até terem billing integrado.</p>
      </div>

      {carregando ? (
        <div style={{ color: 'rgba(248,248,255,.4)', fontSize: 13 }}>Carregando...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#34D399' }}>{fmt(dados?.totais?.receita_total || 0)}</div>
              <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)' }}>Receita total consolidada</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#94A3B8' }}>{fmt(dados?.sense_rh?.pendente || 0)}</div>
              <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)' }}>A receber (Sense AI/RH)</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#F87171' }}>{fmt(dados?.totais?.despesas_total || 0)}</div>
              <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)' }}>Despesas (lançadas)</div>
            </div>
          </div>

          {/* IA */}
          <div style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.08),rgba(6,182,212,0.05))', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 20, padding: 24, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: analise ? 16 : 0, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#FBBf24,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900 }}>Diagnóstico financeiro com IA</div>
                  <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.35)' }}>Leitura honesta do que os números mostram — e o que falta medir</div>
                </div>
              </div>
              <button onClick={analisarComIA} disabled={analisando} style={{
                background: 'linear-gradient(135deg,#FBBf24,#06b6d4)', color: '#08080f', border: 'none', borderRadius: 10, padding: '9px 18px',
                fontSize: 12, fontWeight: 800, cursor: analisando ? 'not-allowed' : 'pointer',
              }}>{analisando ? 'Analisando...' : '✨ Analisar com IA'}</button>
            </div>
            {analise && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: 13, margin: 0 }}>{analise.diagnostico}</p>
                {analise.produto_destaque && <div style={{ fontSize: 12, color: '#34D399' }}><b>Destaque:</b> {analise.produto_destaque}</div>}
                <div style={{ fontSize: 12, color: '#F87171' }}><b>Risco:</b> {analise.risco_principal}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{analise.recomendacao}</div>
              </div>
            )}
          </div>

          {/* LANCAR MANUAL */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 22, marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14 }}>Lançar faturamento manual (produtos sem Stripe integrado)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 120px 120px 1fr', gap: 8, marginBottom: 12 }}>
              <select value={produto} onChange={e => setProduto(e.target.value)} style={{ padding: '9px 10px', fontSize: 12, borderRadius: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }}>
                {PRODUTOS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
              <input type="month" value={mes.slice(0, 7)} onChange={e => setMes(e.target.value + '-01')} style={{ padding: '9px 10px', fontSize: 12, borderRadius: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }} />
              <input type="number" value={receita} onChange={e => setReceita(e.target.value)} placeholder="Receita R$" style={{ padding: '9px 10px', fontSize: 12, borderRadius: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }} />
              <input type="number" value={despesas} onChange={e => setDespesas(e.target.value)} placeholder="Despesas R$" style={{ padding: '9px 10px', fontSize: 12, borderRadius: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }} />
              <input value={obs} onChange={e => setObs(e.target.value)} placeholder="Observação (opcional)" style={{ padding: '9px 10px', fontSize: 12, borderRadius: 8, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#F8F8FF' }} />
            </div>
            <button onClick={salvarManual} disabled={salvando || !receita} style={{
              background: 'rgba(52,211,153,.15)', border: '1px solid rgba(52,211,153,.3)', color: '#34D399', borderRadius: 10, padding: '9px 20px',
              fontSize: 12, fontWeight: 700, cursor: salvando || !receita ? 'not-allowed' : 'pointer',
            }}>{salvando ? 'Salvando...' : 'Salvar lançamento'}</button>
          </div>

          {/* LISTA MANUAL */}
          {dados?.outros_produtos?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dados.outros_produtos.map((p: any) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 14px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, minWidth: 140 }}>{PRODUTOS.find(x => x.key === p.produto)?.label || p.produto}</div>
                  <div style={{ fontSize: 12, color: 'rgba(248,248,255,.4)' }}>{new Date(p.mes).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</div>
                  <div style={{ fontSize: 12, color: '#34D399', marginLeft: 'auto' }}>+{fmt(Number(p.receita))}</div>
                  <div style={{ fontSize: 12, color: '#F87171' }}>-{fmt(Number(p.despesas))}</div>
                  {p.observacao && <div style={{ fontSize: 11, color: 'rgba(248,248,255,.35)', width: '100%' }}>{p.observacao}</div>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
