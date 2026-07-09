'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/types'

const VAZIO: Partial<Lead> = { nome:'', empresa:'', cargo:'', email:'', whatsapp:'', linkedin:'', segmento:'', origem:'', servico_interesse:'', temperatura:'frio', status:'novo', valor_estimado:0, observacoes:'' }
const STATUS_COLS = ['novo','em_contato','reuniao_agendada','proposta_enviada','fechado','perdido']
const STATUS_LABEL: Record<string,string> = { novo:'Novo', em_contato:'Em Contato', reuniao_agendada:'Reunião', proposta_enviada:'Proposta', fechado:'Fechado', perdido:'Perdido' }
const TEMP_COR: Record<string,string> = { frio:'bg-blue-100 text-blue-700', morno:'bg-yellow-100 text-yellow-700', quente:'bg-red-100 text-red-700' }

export default function Leads() {
  const [rows, setRows] = useState<Lead[]>([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroTemp, setFiltroTemp] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<Lead>>(VAZIO)
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState<'funil'|'lista'>('funil')

  async function load() {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  function abrir(l?: Lead) { setForm(l ? { ...l } : { ...VAZIO }); setModal(true) }

  async function salvar() {
    if (!form.nome && !form.empresa) return alert('Informe nome ou empresa')
    setLoading(true)
    const payload = { ...form }
    if (form.id) await supabase.from('leads').update(payload).eq('id', form.id)
    else await supabase.from('leads').insert(payload)
    setLoading(false); setModal(false); load()
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    load()
  }

  async function mudarStatus(id: string, status: string) {
    await supabase.from('leads').update({ status }).eq('id', id)
    load()
  }

  const filtrados = rows.filter(r =>
    (!busca || r.nome?.toLowerCase().includes(busca.toLowerCase()) || r.empresa?.toLowerCase().includes(busca.toLowerCase())) &&
    (!filtroStatus || r.status === filtroStatus) &&
    (!filtroTemp || r.temperatura === filtroTemp)
  )

  const F = (k: keyof Lead, label: string, type='text') => (
    <div key={k}><label className="label">{label}</label>
      <input className="input" type={type} value={(form[k] as string)||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Leads</h1><p className="text-gray-500 text-sm">{rows.length} leads</p></div>
        <button onClick={() => abrir()} className="btn btn-primary">+ Novo Lead</button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setAba('funil')} className={`btn ${aba==='funil'?'btn-primary':'btn-outline'}`}>🏗️ Funil</button>
        <button onClick={() => setAba('lista')} className={`btn ${aba==='lista'?'btn-primary':'btn-outline'}`}>📋 Lista</button>
      </div>

      {aba === 'funil' && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STATUS_COLS.map(s => {
            const col = rows.filter(r => r.status === s)
            return (
              <div key={s} className="flex-shrink-0 w-52">
                <div className="bg-gray-100 rounded-lg p-2 mb-2 text-center">
                  <span className="text-xs font-semibold text-gray-600">{STATUS_LABEL[s]}</span>
                  <span className="text-xs text-gray-400 ml-1">({col.length})</span>
                </div>
                <div className="space-y-2">
                  {col.map(l => (
                    <div key={l.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:border-oliva/30" onClick={() => abrir(l)}>
                      <p className="text-sm font-medium text-gray-800 truncate">{l.nome || l.empresa}</p>
                      <p className="text-xs text-gray-500 truncate">{l.empresa}</p>
                      <div className="flex gap-1 mt-2">
                        <span className={`badge ${TEMP_COR[l.temperatura]} text-xs`}>{l.temperatura}</span>
                        {l.valor_estimado ? <span className="text-xs text-gray-400">R${l.valor_estimado}</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {aba === 'lista' && (
        <div className="card">
          <div className="flex gap-2 mb-4 flex-wrap">
            <input className="input flex-1 min-w-40" placeholder="Buscar..." value={busca} onChange={e=>setBusca(e.target.value)}/>
            <select className="input w-36" value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)}>
              <option value="">Todos status</option>
              {STATUS_COLS.map(s=><option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
            <select className="input w-32" value={filtroTemp} onChange={e=>setFiltroTemp(e.target.value)}>
              <option value="">Temperatura</option>
              <option value="frio">Frio</option><option value="morno">Morno</option><option value="quente">Quente</option>
            </select>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-2">Nome</th><th className="pb-2">Empresa</th><th className="pb-2">Temp</th><th className="pb-2">Status</th><th className="pb-2">Valor</th><th className="pb-2"></th>
            </tr></thead>
            <tbody>
              {filtrados.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="py-3 font-medium">{r.nome}</td>
                  <td className="py-3 text-gray-500">{r.empresa}</td>
                  <td className="py-3"><span className={`badge ${TEMP_COR[r.temperatura]}`}>{r.temperatura}</span></td>
                  <td className="py-3">
                    <select className="text-xs border border-gray-200 rounded px-1 py-0.5" value={r.status}
                      onChange={e => mudarStatus(r.id, e.target.value)}>
                      {STATUS_COLS.map(s=><option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                  </td>
                  <td className="py-3 text-gray-500">{r.valor_estimado ? `R$ ${r.valor_estimado}` : '-'}</td>
                  <td className="py-3 text-right space-x-2">
                    <button onClick={() => abrir(r)} className="text-oliva hover:underline text-xs">Editar</button>
                    <button onClick={() => excluir(r.id)} className="text-red-500 hover:underline text-xs">Excluir</button>
                  </td>
                </tr>
              ))}
              {filtrados.length===0&&<tr><td colSpan={6} className="py-8 text-center text-gray-400">Nenhum lead encontrado</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">{form.id?'Editar':'Novo'} Lead</h2>
            <div className="grid grid-cols-2 gap-3">
              {F('nome','Nome')} {F('empresa','Empresa')} {F('cargo','Cargo')} {F('email','E-mail','email')}
              {F('whatsapp','WhatsApp')} {F('linkedin','LinkedIn')}
              <div><label className="label">Segmento</label>
                <select className="input" value={form.segmento||''} onChange={e=>setForm(p=>({...p,segmento:e.target.value}))}>
                  <option value="">Selecione</option>
                  {['RH','Agro','Indústria','Comércio','Serviços','Tecnologia','Saúde','Educação','Outro'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="label">Origem</label>
                <select className="input" value={form.origem||''} onChange={e=>setForm(p=>({...p,origem:e.target.value}))}>
                  <option value="">Selecione</option>
                  {['Instagram','LinkedIn','WhatsApp','Indicação','Evento','Site','Tráfego Pago'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="label">Temperatura</label>
                <select className="input" value={form.temperatura||'frio'} onChange={e=>setForm(p=>({...p,temperatura:e.target.value as any}))}>
                  <option value="frio">Frio</option><option value="morno">Morno</option><option value="quente">Quente</option>
                </select>
              </div>
              <div><label className="label">Status</label>
                <select className="input" value={form.status||'novo'} onChange={e=>setForm(p=>({...p,status:e.target.value as any}))}>
                  {STATUS_COLS.map(s=><option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>
              {F('servico_interesse','Serviço de Interesse')}
              <div><label className="label">Valor Estimado (R$)</label>
                <input className="input" type="number" value={form.valor_estimado||''} onChange={e=>setForm(p=>({...p,valor_estimado:parseFloat(e.target.value)||0}))}/>
              </div>
              <div><label className="label">Próximo Contato</label>
                <input className="input" type="date" value={form.proximo_contato||''} onChange={e=>setForm(p=>({...p,proximo_contato:e.target.value}))}/>
              </div>
            </div>
            <div className="mt-3"><label className="label">Observações</label>
              <textarea className="input" rows={2} value={form.observacoes||''} onChange={e=>setForm(p=>({...p,observacoes:e.target.value}))}/>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModal(false)} className="btn btn-outline">Cancelar</button>
              <button onClick={salvar} disabled={loading} className="btn btn-primary">{loading?'Salvando...':'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
