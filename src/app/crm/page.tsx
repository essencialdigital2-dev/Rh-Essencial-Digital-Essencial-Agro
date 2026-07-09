'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://uysmvziehlpugmgssibs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5c212emllaGxwdWdtZ3NzaWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzU5MDUsImV4cCI6MjA5NTY1MTkwNX0.iuhDiTQCoIZSfSccURAITwnuejEmWABG8KW7RtGH9-8'
)

type Etapa = 'lead' | 'qualificado' | 'proposta' | 'negociacao' | 'cliente' | 'perdido'
type TipoInter = 'nota' | 'email' | 'ligacao' | 'reuniao'

type Contato = {
  id: string; nome: string; email: string; telefone: string
  empresa: string; cargo: string; origem: string; produto: string
  etapa: Etapa; valor: number | null; tags: string[]; notas: string
  criado_em: string; atualizado_em: string
}
type Interacao = { id: string; contato_id: string; tipo: TipoInter; conteudo: string; criado_em: string }

const ETAPAS = [
  { key: 'lead' as Etapa,        label: 'Lead',        cor: '#6B7280' },
  { key: 'qualificado' as Etapa, label: 'Qualificado', cor: '#06B6D4' },
  { key: 'proposta' as Etapa,    label: 'Proposta',    cor: '#F59E0B' },
  { key: 'negociacao' as Etapa,  label: 'Negociacao',  cor: '#A855F7' },
  { key: 'cliente' as Etapa,     label: 'Cliente',     cor: '#10B981' },
  { key: 'perdido' as Etapa,     label: 'Perdido',     cor: '#EF4444' },
]
const PRODUTOS = ['Sense AI', 'NexoPerform', 'Essencial Estudo', 'Essencial Teens', 'Outro']
const ORIGENS = ['Site', 'Indicacao', 'LinkedIn', 'WhatsApp', 'Assessment', 'Manual']
const TIPOS: { key: TipoInter; label: string; emoji: string }[] = [
  { key: 'nota', label: 'Nota', emoji: '📝' },
  { key: 'email', label: 'E-mail', emoji: '📧' },
  { key: 'ligacao', label: 'Ligacao', emoji: '📞' },
  { key: 'reuniao', label: 'Reuniao', emoji: '🤝' },
]
const VAZIO = { nome: '', email: '', telefone: '', empresa: '', cargo: '', origem: 'Manual', produto: 'Sense AI', etapa: 'lead' as Etapa, valor: null as number | null, tags: [] as string[], notas: '' }

export default function CRMSenseAI() {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [interacoes, setInteracoes] = useState<Interacao[]>([])
  const [aba, setAba] = useState<'resumo' | 'pipeline' | 'contatos'>('pipeline')
  const [busca, setBusca] = useState('')
  const [filtroEtapa, setFiltroEtapa] = useState<Etapa | ''>('')
  const [detalhe, setDetalhe] = useState<Contato | null>(null)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ ...VAZIO })
  const [novaInter, setNovaInter] = useState('')
  const [tipoInter, setTipoInter] = useState<TipoInter>('nota')
  const [salvando, setSalvando] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    const [{ data: c }, { data: i }] = await Promise.all([
      sb.from('crm_contatos').select('*').order('criado_em', { ascending: false }),
      sb.from('crm_interacoes').select('*').order('criado_em', { ascending: false }),
    ])
    setContatos(c || [])
    setInteracoes(i || [])
    setLoading(false)
  }

  async function salvar() {
    setSalvando(true)
    if (detalhe) {
      await sb.from('crm_contatos').update({ ...form, atualizado_em: new Date().toISOString() }).eq('id', detalhe.id)
      setContatos(p => p.map(c => c.id === detalhe.id ? { ...c, ...form } : c))
      setDetalhe({ ...detalhe, ...form })
    } else {
      const { data } = await sb.from('crm_contatos').insert([form]).select().single()
      if (data) setContatos(p => [data, ...p])
    }
    setSalvando(false); setModal(false); setForm({ ...VAZIO })
  }

  async function mover(id: string, etapa: Etapa) {
    await sb.from('crm_contatos').update({ etapa, atualizado_em: new Date().toISOString() }).eq('id', id)
    setContatos(p => p.map(c => c.id === id ? { ...c, etapa } : c))
    if (detalhe?.id === id) setDetalhe(p => p ? { ...p, etapa } : null)
  }

  async function deletar(id: string) {
    if (!confirm('Remover este contato?')) return
    await sb.from('crm_contatos').delete().eq('id', id)
    setContatos(p => p.filter(c => c.id !== id)); setDetalhe(null)
  }

  async function addInter() {
    if (!novaInter.trim() || !detalhe) return
    const { data } = await sb.from('crm_interacoes').insert([{ contato_id: detalhe.id, tipo: tipoInter, conteudo: novaInter.trim() }]).select().single()
    if (data) setInteracoes(p => [data, ...p]); setNovaInter('')
  }

  const filtrados = contatos.filter(c => {
    const q = busca.toLowerCase()
    return (!busca || [c.nome, c.email, c.empresa].some(f => (f || '').toLowerCase().includes(q)))
      && (!filtroEtapa || c.etapa === filtroEtapa)
  })

  const interDetalhe = interacoes.filter(i => i.contato_id === detalhe?.id)
  const totalValor = contatos.filter(c => c.etapa === 'cliente').reduce((s, c) => s + (c.valor || 0), 0)
  const taxaConv = contatos.length > 0 ? Math.round((contatos.filter(c => c.etapa === 'cliente').length / contatos.length) * 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-[#07070F] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#07070F] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0D0D1A]/95 backdrop-blur border-b border-white/5 px-5 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-base font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Essencial · Sense AI</span>
            <span className="text-xs font-bold bg-purple-500/15 text-purple-400 rounded-md px-2.5 py-1">CRM</span>
          </div>
          <div className="flex gap-2">
            <a href="/sense-app" className="text-xs text-white/40 px-3 py-2 hover:text-white/60 transition-colors">App</a>
            <button onClick={() => { setForm({ ...VAZIO }); setDetalhe(null); setModal(true) }} className="bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
              + Novo Contato
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6 pb-20">
        {/* Abas */}
        <div className="flex gap-1 mb-6 bg-white/3 rounded-xl p-1 w-fit">
          {(['resumo','pipeline','contatos'] as const).map(a => (
            <button key={a} onClick={() => setAba(a)} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all capitalize ${aba === a ? 'bg-purple-600/30 text-purple-400' : 'text-white/40 hover:text-white/60'}`}>
              {a === 'contatos' ? `Contatos (${contatos.length})` : a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>

        {/* RESUMO */}
        {aba === 'resumo' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { l: 'Total Leads', v: contatos.length, c: 'text-purple-400' },
                { l: 'Clientes', v: contatos.filter(c => c.etapa === 'cliente').length, c: 'text-emerald-400' },
                { l: 'Conversao', v: `${taxaConv}%`, c: 'text-cyan-400' },
                { l: 'Receita Est.', v: `R$${totalValor.toLocaleString('pt-BR')}`, c: 'text-amber-400' },
                { l: 'Negociacao', v: contatos.filter(c => c.etapa === 'negociacao').length, c: 'text-orange-400' },
                { l: 'Perdidos', v: contatos.filter(c => c.etapa === 'perdido').length, c: 'text-red-400' },
              ].map(m => (
                <div key={m.l} className="bg-[#0E0E1A] border border-white/7 rounded-2xl p-4">
                  <div className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-2">{m.l}</div>
                  <div className={`text-2xl font-black ${m.c}`}>{m.v}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#0E0E1A] border border-white/7 rounded-2xl p-6">
              <div className="text-sm font-bold mb-5">Distribuicao por Etapa</div>
              <div className="space-y-3">
                {ETAPAS.map(e => {
                  const n = contatos.filter(c => c.etapa === e.key).length
                  const pct = contatos.length > 0 ? Math.round((n / contatos.length) * 100) : 0
                  return (
                    <div key={e.key} className="flex items-center gap-3">
                      <div className="w-24 text-xs font-bold" style={{ color: e.cor }}>{e.label}</div>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: e.cor }} />
                      </div>
                      <div className="w-6 text-xs font-bold text-right" style={{ color: e.cor }}>{n}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* TABELA DE PREÇOS - visível apenas no CRM interno */}
            <div className="bg-[#0E0E1A] border border-white/7 rounded-2xl p-6">
              <div className="text-sm font-bold mb-1">💰 Tabela de Preços - Essencial Digital</div>
              <div className="text-[11px] text-white/35 mb-5">Visível apenas no painel interno · Não exibida no site público</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sense AI */}
                <div>
                  <div className="text-xs font-bold text-emerald-400 mb-3">🧠 Essencial Sense AI</div>
                  <div className="space-y-2">
                    {[
                      { plano: 'Starter', preco: 'R$ 800/mês', limite: 'até 30 colaboradores', cor: '#6B7280' },
                      { plano: 'Growth', preco: 'R$ 1.990/mês', limite: 'até 100 colaboradores', cor: '#06B6D4' },
                      { plano: 'Scale', preco: 'R$ 5.000/mês', limite: '100+ ilimitado', cor: '#10B981' },
                    ].map(p => (
                      <div key={p.plano} className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-3">
                        <div>
                          <span className="text-xs font-bold" style={{ color: p.cor }}>{p.plano}</span>
                          <span className="text-[10px] text-white/30 ml-2">{p.limite}</span>
                        </div>
                        <span className="text-sm font-black text-white">{p.preco}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* NexoPerform */}
                <div>
                  <div className="text-xs font-bold text-purple-400 mb-3">🧬 NexoPerform</div>
                  <div className="space-y-2">
                    {[
                      { plano: 'Starter', preco: 'R$ 800/mês', limite: 'até 20 pessoas', cor: '#6B7280' },
                      { plano: 'Growth', preco: 'R$ 1.990/mês', limite: 'até 50 pessoas', cor: '#A855F7' },
                      { plano: 'Scale', preco: 'R$ 5.000/mês', limite: '50+ ilimitado', cor: '#EC4899' },
                    ].map(p => (
                      <div key={p.plano} className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-3">
                        <div>
                          <span className="text-xs font-bold" style={{ color: p.cor }}>{p.plano}</span>
                          <span className="text-[10px] text-white/30 ml-2">{p.limite}</span>
                        </div>
                        <span className="text-sm font-black text-white">{p.preco}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Bundle */}
              <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-emerald-900/20 to-purple-900/20 border border-white/10 rounded-xl px-4 py-3">
                <div>
                  <span className="text-xs font-bold text-amber-400">🔥 Bundle - Sense AI + NexoPerform</span>
                  <span className="text-[10px] text-white/30 ml-2">Ambos os produtos · Ilimitado</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white">R$ 8.000/mês</div>
                  <div className="text-[10px] text-emerald-400">economia R$ 2.000/mês</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE */}
        {aba === 'pipeline' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-[900px]">
              {ETAPAS.map(e => {
                const cols = contatos.filter(c => c.etapa === e.key)
                return (
                  <div key={e.key} className="flex-1 min-w-[150px] rounded-2xl p-3" style={{ background: `${e.cor}10`, border: `1px solid ${e.cor}25` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider" style={{ color: e.cor }}>{e.label}</span>
                      <span className="text-xs font-bold rounded-md px-1.5 py-0.5" style={{ background: `${e.cor}20`, color: e.cor }}>{cols.length}</span>
                    </div>
                    <div className="space-y-2">
                      {cols.map(c => (
                        <div key={c.id} onClick={() => setDetalhe(c)} className="bg-[#0E0E1A] border border-white/7 rounded-xl p-3 cursor-pointer hover:border-white/15 transition-colors">
                          <div className="text-sm font-bold mb-1">{c.nome}</div>
                          {c.empresa && <div className="text-xs text-white/40 mb-2">{c.empresa}</div>}
                          <div className="flex items-center justify-between">
                            {c.produto && <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 rounded px-1.5 py-0.5">{c.produto}</span>}
                            {c.valor && <span className="text-xs font-bold text-emerald-400">R${c.valor.toLocaleString('pt-BR')}</span>}
                          </div>
                        </div>
                      ))}
                      {cols.length === 0 && <div className="text-xs text-white/20 text-center py-5">Vazio</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CONTATOS */}
        {aba === 'contatos' && (
          <div>
            <div className="flex gap-3 mb-4 flex-wrap">
              <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar..." className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none max-w-xs flex-1" />
              <select value={filtroEtapa} onChange={e => setFiltroEtapa(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
                <option value="">Todas etapas</option>
                {ETAPAS.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              {filtrados.map(c => {
                const e = ETAPAS.find(e => e.key === c.etapa)!
                return (
                  <div key={c.id} onClick={() => setDetalhe(c)} className="bg-[#0E0E1A] border border-white/6 rounded-xl px-4 py-3 cursor-pointer hover:border-white/15 transition-colors flex items-center gap-3 flex-wrap">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0" style={{ background: `${e.cor}20`, color: e.cor }}>{c.nome.charAt(0)}</div>
                    <div className="flex-1 min-w-[120px]">
                      <div className="text-sm font-bold">{c.nome}</div>
                      <div className="text-xs text-white/40">{c.email}{c.empresa ? ` · ${c.empresa}` : ''}</div>
                    </div>
                    {c.produto && <span className="text-xs font-bold text-purple-400 bg-purple-500/10 rounded-md px-2 py-1">{c.produto}</span>}
                    <span className="text-xs font-bold rounded-md px-2.5 py-1" style={{ background: `${e.cor}15`, color: e.cor }}>{e.label}</span>
                    {c.valor && <span className="text-xs font-bold text-emerald-400">R${c.valor.toLocaleString('pt-BR')}</span>}
                    <span className="text-xs text-white/25">{new Date(c.criado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                )
              })}
              {filtrados.length === 0 && <div className="text-center py-12 text-white/25 text-sm">Nenhum contato encontrado.</div>}
            </div>
          </div>
        )}
      </div>

      {/* Painel Detalhe */}
      {detalhe && (
        <div className="fixed top-0 right-0 bottom-0 w-[400px] max-w-[95vw] bg-[#0D0D1A] border-l border-white/8 z-[300] overflow-y-auto p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black">{detalhe.nome}</h3>
            <button onClick={() => setDetalhe(null)} className="text-white/40 hover:text-white text-xl bg-none border-none cursor-pointer">✕</button>
          </div>
          <div className="bg-white/3 rounded-xl p-4 space-y-2">
            {[['Email', detalhe.email],['Telefone', detalhe.telefone],['Empresa', detalhe.empresa],['Cargo', detalhe.cargo],['Produto', detalhe.produto],['Origem', detalhe.origem],['Valor', detalhe.valor ? `R$${detalhe.valor.toLocaleString('pt-BR')}` : '']].filter(([,v]) => v).map(([k, v]) => (
              <div key={k as string} className="flex gap-2">
                <span className="text-xs font-bold text-white/35 w-16 shrink-0">{k as string}</span>
                <span className="text-xs text-white/70">{v as string}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-bold text-white/35 uppercase tracking-wider mb-2">Etapa</div>
            <div className="flex flex-wrap gap-1.5">
              {ETAPAS.map(e => (
                <button key={e.key} onClick={() => mover(detalhe.id, e.key)} className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all" style={{ border: `1px solid ${detalhe.etapa === e.key ? e.cor : 'rgba(255,255,255,.1)'}`, background: detalhe.etapa === e.key ? `${e.cor}20` : 'transparent', color: detalhe.etapa === e.key ? e.cor : 'rgba(255,255,255,.4)', cursor: 'pointer' }}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>
          {detalhe.notas && (
            <div>
              <div className="text-xs font-bold text-white/35 uppercase tracking-wider mb-2">Notas</div>
              <div className="text-xs text-white/60 leading-relaxed bg-white/3 rounded-xl p-3">{detalhe.notas}</div>
            </div>
          )}
          <div>
            <div className="text-xs font-bold text-white/35 uppercase tracking-wider mb-2">Historico</div>
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {TIPOS.map(t => (
                <button key={t.key} onClick={() => setTipoInter(t.key)} className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all" style={{ border: `1px solid ${tipoInter === t.key ? '#A855F7' : 'rgba(255,255,255,.1)'}`, background: tipoInter === t.key ? 'rgba(168,85,247,.15)' : 'transparent', color: tipoInter === t.key ? '#A855F7' : 'rgba(255,255,255,.4)', cursor: 'pointer' }}>
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={novaInter} onChange={e => setNovaInter(e.target.value)} onKeyDown={e => e.key === 'Enter' && addInter()} placeholder="Registrar interacao..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none" />
              <button onClick={addInter} className="bg-purple-600 text-white px-3 py-2 rounded-xl font-bold text-sm hover:bg-purple-500 transition-colors">+</button>
            </div>
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {interDetalhe.map(i => {
                const t = TIPOS.find(t => t.key === i.tipo)!
                return (
                  <div key={i.id} className="bg-white/3 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">{t?.emoji}</span>
                      <span className="text-xs font-bold text-purple-400">{t?.label}</span>
                      <span className="text-xs text-white/25 ml-auto">{new Date(i.criado_em).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="text-xs text-white/65 leading-relaxed">{i.conteudo}</div>
                  </div>
                )
              })}
              {interDetalhe.length === 0 && <div className="text-xs text-white/20 text-center py-4">Nenhum registro ainda.</div>}
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-white/6">
            <button onClick={() => { setForm({ nome: detalhe.nome, email: detalhe.email, telefone: detalhe.telefone, empresa: detalhe.empresa, cargo: detalhe.cargo, origem: detalhe.origem, produto: detalhe.produto, etapa: detalhe.etapa, valor: detalhe.valor, tags: detalhe.tags, notas: detalhe.notas }); setModal(true) }} className="flex-1 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity">Editar</button>
            <button onClick={() => deletar(detalhe.id)} className="text-red-400 border border-red-500/25 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors">Remover</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-[400] flex items-center justify-center p-5">
          <div className="bg-[#0E0E1A] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-black">{detalhe ? 'Editar Contato' : 'Novo Contato'}</h3>
              <button onClick={() => setModal(false)} className="text-white/40 text-xl cursor-pointer bg-none border-none">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([['nome','Nome *','text'],['email','E-mail','email'],['telefone','Telefone','text'],['empresa','Empresa','text'],['cargo','Cargo','text'],['valor','Valor estimado (R$)','number']] as [keyof typeof VAZIO, string, string][]).map(([k, l, t]) => (
                <div key={k} className={k === 'nome' ? 'col-span-2' : ''}>
                  <label className="text-xs font-bold text-white/40 block mb-1.5">{l}</label>
                  <input type={t} value={(form[k] as string) || ''} onChange={e => setForm(f => ({ ...f, [k]: t === 'number' ? (e.target.value ? +e.target.value : null) : e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none" />
                </div>
              ))}
              {([['produto','Produto',PRODUTOS],['origem','Origem',ORIGENS]] as [keyof typeof VAZIO, string, string[]][]).map(([k, l, opts]) => (
                <div key={k}>
                  <label className="text-xs font-bold text-white/40 block mb-1.5">{l}</label>
                  <select value={(form[k] as string) || ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-white/40 block mb-1.5">Etapa</label>
                <select value={form.etapa} onChange={e => setForm(f => ({ ...f, etapa: e.target.value as Etapa }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  {ETAPAS.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-white/40 block mb-1.5">Notas</label>
                <textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-y" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={salvar} disabled={salvando || !form.nome} className="flex-1 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-bold py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity">
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
              <button onClick={() => setModal(false)} className="text-white/40 border border-white/10 text-sm font-bold px-5 py-2.5 rounded-xl hover:text-white/60 transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
