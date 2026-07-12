'use client'
import { useEffect, useState } from 'react'
import { ecoFetch } from '@/lib/ecoFetch'

const ETAPAS = [
  { id: 'novo', label: 'Novo', cor: '#A78BFA' },
  { id: 'contatado', label: 'Contatado', cor: '#60A5FA' },
  { id: 'reuniao', label: 'Reunião', cor: '#F0C36D' },
  { id: 'proposta', label: 'Proposta', cor: '#FB923C' },
  { id: 'ganhou', label: 'Ganhou', cor: '#34D399' },
  { id: 'perdeu', label: 'Perdeu', cor: '#64748B' },
]

export default function MetricasEcossistema() {
  const [funil, setFunil] = useState<any>(null)
  const [porProduto, setPorProduto] = useState<any[]>([])
  const [meses, setMeses] = useState<any[]>([])
  const [auto, setAuto] = useState<any>(null)
  const [carregandoAuto, setCarregandoAuto] = useState(true)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ mes: new Date().toISOString().slice(0, 7) + '-01', investimento_marketing: '', mrr: '', clientes_ativos: '', novos_clientes: '', clientes_perdidos: '' })
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { carregar(); carregarAuto() }, [])

  async function carregarAuto() {
    setCarregandoAuto(true)
    try {
      const r = await ecoFetch('/api/eco-metricas/automatico')
      const d = await r.json()
      if (d.ok) setAuto(d)
    } catch {}
    setCarregandoAuto(false)
  }

  async function carregar() {
    setLoading(true)
    try {
      const [rf, rm] = await Promise.all([ecoFetch('/api/eco-funil'), ecoFetch('/api/eco-metricas')])
      const df = await rf.json()
      const dm = await rm.json()
      if (df.ok) { setFunil(df.funil); setPorProduto(df.por_produto) }
      if (dm.ok) setMeses(dm.meses)
    } catch {}
    setLoading(false)
  }

  async function salvarMes() {
    setSalvando(true)
    try {
      await ecoFetch('/api/eco-metricas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mes: form.mes,
          investimento_marketing: Number(form.investimento_marketing) || 0,
          mrr: Number(form.mrr) || 0,
          clientes_ativos: Number(form.clientes_ativos) || 0,
          novos_clientes: Number(form.novos_clientes) || 0,
          clientes_perdidos: Number(form.clientes_perdidos) || 0,
        }),
      })
      await carregar()
    } catch {}
    setSalvando(false)
  }

  const mesAtual = meses[0]
  const mesAnterior = meses[1]
  const cac = mesAtual?.novos_clientes > 0 ? Math.round((mesAtual.investimento_marketing / mesAtual.novos_clientes) * 100) / 100 : null
  const ltv = mesAtual?.clientes_perdidos > 0 && mesAtual?.clientes_ativos > 0
    ? Math.round((mesAtual.mrr / mesAtual.clientes_ativos) / (mesAtual.clientes_perdidos / mesAtual.clientes_ativos) * 100) / 100
    : null
  const mrrGrowth = mesAtual && mesAnterior && mesAnterior.mrr > 0
    ? Math.round(((mesAtual.mrr - mesAnterior.mrr) / mesAnterior.mrr) * 100)
    : null

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>📊 Métricas do Ecossistema</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
          Funil calculado com dados reais de leads. CAC, LTV e crescimento de MRR dependem dos números mensais abaixo.
        </p>
      </div>

      {/* AUTOMATICO — calculado direto de eco_clientes */}
      <div style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#34D399', marginBottom: 14, textTransform: 'uppercase' }}>✨ Automático — calculado agora dos clientes reais</div>
        {carregandoAuto ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Calculando...</div>
        ) : auto ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
              {[
                ['MRR', `R$ ${auto.mrr.toLocaleString('pt-BR')}`, '#34D399'],
                ['Clientes pagantes', auto.clientes_pagantes, '#60A5FA'],
                ['Clientes ativos (+trial)', auto.clientes_ativos, '#A78BFA'],
                ['Trials em andamento', auto.trials, '#F0C36D'],
                ['Novos este mês', auto.novos_clientes, '#34D399'],
                ['Perdidos este mês', auto.clientes_perdidos, '#F87171'],
                ['NRR', auto.nrr ? `${auto.nrr.nrr}%` : '—', auto.nrr ? (auto.nrr.nrr >= 100 ? '#34D399' : '#F0C36D') : '#6B7280'],
              ].map(([label, valor, cor]) => (
                <div key={label as string} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: cor as string }}>{valor}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{label as string}</div>
                </div>
              ))}
            </div>
            {!auto.nrr && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
                NRR ainda sem dado suficiente — precisa de pelo menos 1 mês de histórico (snapshot automático roda todo dia 1º).
              </div>
            )}
            {auto.nrr && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
                NRR calculado sobre {auto.nrr.clientes_na_base} clientes desde {auto.nrr.mes_base} · receita então R$ {auto.nrr.receita_inicio.toLocaleString('pt-BR')} → agora R$ {auto.nrr.receita_atual.toLocaleString('pt-BR')}
              </div>
            )}
            {auto.narrativa && (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, background: 'rgba(0,0,0,0.15)', borderRadius: 10, padding: 14 }}>
                <b style={{ color: '#34D399' }}>Leitura da IA:</b> {auto.narrativa}
              </div>
            )}
          </>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Erro ao calcular. Verifique se os clientes têm valor mensal preenchido.</div>
        )}
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Carregando...</div>
      ) : (
        <>
          {/* FUNIL REAL */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#A78BFA', marginBottom: 14, textTransform: 'uppercase' }}>Funil de Vendas (todos os produtos)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
              {ETAPAS.map(e => (
                <div key={e.id} style={{ textAlign: 'center', padding: '12px 6px', borderRadius: 10, background: `${e.cor}12`, border: `1px solid ${e.cor}30` }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: e.cor }}>{funil?.por_etapa?.[e.id] ?? 0}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{e.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap' }}>
              <div>Total de leads: <b style={{ color: '#fff' }}>{funil?.total ?? 0}</b></div>
              <div>Em andamento: <b style={{ color: '#F0C36D' }}>{funil?.em_andamento ?? 0}</b></div>
              <div>Taxa de conversão geral: <b style={{ color: '#34D399' }}>{funil?.taxa_conversao_geral ?? 0}%</b></div>
            </div>
          </div>

          {/* POR PRODUTO */}
          {porProduto.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#A78BFA', marginBottom: 14, textTransform: 'uppercase' }}>Conversão por Produto</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {porProduto.map(p => (
                  <div key={p.produto} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                    <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{p.produto}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{p.total} leads · {p.ganhos} ganhos · <b style={{ color: '#34D399' }}>{p.taxa_conversao}%</b></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CAC / LTV / NRR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 6 }}>CAC (custo de aquisição)</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: cac != null ? '#fff' : 'rgba(255,255,255,0.25)' }}>{cac != null ? `R$ ${cac}` : '—'}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{cac != null ? 'investimento ÷ novos clientes do mês' : 'preencha os dados do mês abaixo'}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 6 }}>LTV (aproximado)</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: ltv != null ? '#fff' : 'rgba(255,255,255,0.25)' }}>{ltv != null ? `R$ ${ltv}` : '—'}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{ltv != null ? 'estimativa: receita média ÷ taxa de churn' : 'precisa de clientes perdidos no mês'}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 6 }}>Crescimento de MRR</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: mrrGrowth != null ? (mrrGrowth >= 0 ? '#34D399' : '#F87171') : 'rgba(255,255,255,0.25)' }}>{mrrGrowth != null ? `${mrrGrowth > 0 ? '+' : ''}${mrrGrowth}%` : '—'}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{mrrGrowth != null ? 'vs mês anterior' : 'precisa de 2 meses de dados'}</div>
            </div>
            <div style={{ background: 'rgba(240,195,109,0.06)', border: '1px solid rgba(240,195,109,0.2)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#F0C36D', textTransform: 'uppercase', marginBottom: 6 }}>NRR</div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>Ainda não calculável</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Precisa de receita por cliente individual ao longo do tempo. Recomendo começar a registrar isso assim que tiver os primeiros clientes pagantes recorrentes.</div>
            </div>
          </div>

          {/* INPUT MENSAL */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#A78BFA', marginBottom: 14, textTransform: 'uppercase' }}>Registrar números do mês</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 10 }}>
              <input type="month" value={form.mes.slice(0, 7)} onChange={e => setForm(f => ({ ...f, mes: e.target.value + '-01' }))} style={inputStyle} />
              <input value={form.investimento_marketing} onChange={e => setForm(f => ({ ...f, investimento_marketing: e.target.value }))} placeholder="Investimento marketing (R$)" style={inputStyle} />
              <input value={form.mrr} onChange={e => setForm(f => ({ ...f, mrr: e.target.value }))} placeholder="MRR total (R$)" style={inputStyle} />
              <input value={form.clientes_ativos} onChange={e => setForm(f => ({ ...f, clientes_ativos: e.target.value }))} placeholder="Clientes ativos" style={inputStyle} />
              <input value={form.novos_clientes} onChange={e => setForm(f => ({ ...f, novos_clientes: e.target.value }))} placeholder="Novos clientes" style={inputStyle} />
              <input value={form.clientes_perdidos} onChange={e => setForm(f => ({ ...f, clientes_perdidos: e.target.value }))} placeholder="Clientes perdidos" style={inputStyle} />
            </div>
            <button onClick={salvarMes} disabled={salvando} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: salvando ? 0.5 : 1 }}>
              {salvando ? 'Salvando...' : 'Salvar mês'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 13,
}
