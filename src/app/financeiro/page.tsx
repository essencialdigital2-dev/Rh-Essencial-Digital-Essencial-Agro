'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Financeiro, Empresa } from '@/types'

const VAZIO: Partial<Financeiro> = { descricao:'', valor:0, tipo:'receita', status:'pendente', forma_pagamento:'', observacoes:'' }
const STATUS_COR: Record<string,string> = { pendente:'bg-yellow-100 text-yellow-700', pago:'bg-green-100 text-green-700', vencido:'bg-red-100 text-red-700', cancelado:'bg-gray-100 text-gray-500' }

export default function FinanceiroPage() {
  const [rows, setRows] = useState<Financeiro[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [modalRecibo, setModalRecibo] = useState<Financeiro|null>(null)
  const [form, setForm] = useState<Partial<Financeiro>>(VAZIO)
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState('')

  async function load() {
    const [{ data: fin }, { data: emps }] = await Promise.all([
      supabase.from('financeiro').select('*, empresa:empresas(nome)').order('created_at', { ascending: false }),
      supabase.from('empresas').select('id,nome').order('nome'),
    ])
    setRows(fin || [])
    setEmpresas(emps || [])
  }
  useEffect(() => { load() }, [])

  function abrir(f?: Financeiro) { setForm(f ? { ...f } : { ...VAZIO }); setModal(true) }

  async function salvar() {
    if (!form.descricao || !form.valor) return alert('Preencha descrição e valor')
    setLoading(true)
    if (form.id) await supabase.from('financeiro').update(form).eq('id', form.id)
    else await supabase.from('financeiro').insert(form)
    setLoading(false); setModal(false); load()
  }

  async function excluir(id: string) {
    if (!confirm('Excluir?')) return
    await supabase.from('financeiro').delete().eq('id', id)
    load()
  }

  const filtrados = rows.filter(r => r.descricao?.toLowerCase().includes(busca.toLowerCase()) || (r.empresa as any)?.nome?.toLowerCase().includes(busca.toLowerCase()))
  const receita = rows.filter(r=>r.tipo==='receita'&&r.status==='pago').reduce((a,r)=>a+r.valor,0)
  const pendente = rows.filter(r=>r.status==='pendente').reduce((a,r)=>a+r.valor,0)

  function imprimirRecibo(f: Financeiro) {
    const empresa = empresas.find(e => e.id === f.empresa_id)
    const w = window.open('', '_blank', 'width=700,height=600')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><title>Recibo</title>
    <style>body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:auto}
    h1{color:#4e5c2d;border-bottom:2px solid #4e5c2d;pb:8px}
    .row{display:flex;justify-content:space-between;margin:8px 0;font-size:14px}
    .val{font-weight:bold}.assinatura{margin-top:60px;border-top:1px solid #ccc;pt:16px;text-align:center}
    @media print{button{display:none}}</style></head><body>
    <h1>🌿 RH Essencial Digital</h1>
    <p style="color:#666;font-size:12px">CNPJ: MEI - Alana Carvalho</p>
    <h2 style="margin-top:24px">Recibo de Prestação de Serviços</h2>
    <div class="row"><span>Empresa/Cliente:</span><span class="val">${empresa?.nome || 'N/A'}</span></div>
    <div class="row"><span>Serviço:</span><span class="val">${f.descricao}</span></div>
    <div class="row"><span>Valor:</span><span class="val">R$ ${f.valor.toFixed(2).replace('.',',')}</span></div>
    <div class="row"><span>Forma de pagamento:</span><span class="val">${f.forma_pagamento||'—'}</span></div>
    <div class="row"><span>Data:</span><span class="val">${new Date().toLocaleDateString('pt-BR')}</span></div>
    <div class="assinatura"><p>Alana Carvalho</p><p style="font-size:12px;color:#666">RH Essencial Digital / Essencial Agro</p></div>
    <br><button onclick="window.print()">🖨️ Imprimir</button>
    </body></html>`)
    w.document.close()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Financeiro</h1><p className="text-gray-500 text-sm">{rows.length} lançamentos</p></div>
        <button onClick={() => abrir()} className="btn btn-primary">+ Novo Lançamento</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card flex items-center gap-4">
          <div className="bg-green-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl">💰</div>
          <div><div className="text-xl font-bold text-gray-800">R$ {receita.toFixed(2).replace('.',',')}</div><div className="text-xs text-gray-500">Receita recebida</div></div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="bg-yellow-400 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl">⏳</div>
          <div><div className="text-xl font-bold text-gray-800">R$ {pendente.toFixed(2).replace('.',',')}</div><div className="text-xs text-gray-500">A receber</div></div>
        </div>
      </div>

      <div className="card">
        <input className="input mb-4" placeholder="Buscar..." value={busca} onChange={e=>setBusca(e.target.value)}/>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="pb-2">Descrição</th><th className="pb-2">Empresa</th><th className="pb-2">Valor</th><th className="pb-2">Status</th><th className="pb-2">Vencimento</th><th className="pb-2"></th>
          </tr></thead>
          <tbody>
            {filtrados.map(r => (
              <tr key={r.id} className="table-row">
                <td className="py-3 font-medium">{r.descricao}</td>
                <td className="py-3 text-gray-500">{(r.empresa as any)?.nome}</td>
                <td className="py-3 font-medium text-gray-800">R$ {r.valor.toFixed(2).replace('.',',')}</td>
                <td className="py-3"><span className={`badge ${STATUS_COR[r.status]}`}>{r.status}</span></td>
                <td className="py-3 text-gray-400 text-xs">{r.vencimento ? new Date(r.vencimento).toLocaleDateString('pt-BR') : '—'}</td>
                <td className="py-3 text-right space-x-2">
                  <button onClick={() => imprimirRecibo(r)} className="text-dourado hover:underline text-xs">Recibo</button>
                  <button onClick={() => abrir(r)} className="text-oliva hover:underline text-xs">Editar</button>
                  <button onClick={() => excluir(r.id)} className="text-red-500 hover:underline text-xs">Excluir</button>
                </td>
              </tr>
            ))}
            {filtrados.length===0&&<tr><td colSpan={6} className="py-8 text-center text-gray-400">Nenhum lançamento</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4">{form.id?'Editar':'Novo'} Lançamento</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="label">Descrição do Serviço</label>
                <input className="input" value={form.descricao||''} onChange={e=>setForm(p=>({...p,descricao:e.target.value}))}/>
              </div>
              <div><label className="label">Empresa</label>
                <select className="input" value={form.empresa_id||''} onChange={e=>setForm(p=>({...p,empresa_id:e.target.value}))}>
                  <option value="">Selecione</option>
                  {empresas.map(e=><option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>
              <div><label className="label">Valor (R$)</label>
                <input className="input" type="number" value={form.valor||''} onChange={e=>setForm(p=>({...p,valor:parseFloat(e.target.value)||0}))}/>
              </div>
              <div><label className="label">Tipo</label>
                <select className="input" value={form.tipo||'receita'} onChange={e=>setForm(p=>({...p,tipo:e.target.value as any}))}>
                  <option value="receita">Receita</option><option value="despesa">Despesa</option>
                </select>
              </div>
              <div><label className="label">Status</label>
                <select className="input" value={form.status||'pendente'} onChange={e=>setForm(p=>({...p,status:e.target.value as any}))}>
                  <option value="pendente">Pendente</option><option value="pago">Pago</option>
                  <option value="vencido">Vencido</option><option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div><label className="label">Vencimento</label>
                <input className="input" type="date" value={form.vencimento||''} onChange={e=>setForm(p=>({...p,vencimento:e.target.value}))}/>
              </div>
              <div><label className="label">Forma de Pagamento</label>
                <select className="input" value={form.forma_pagamento||''} onChange={e=>setForm(p=>({...p,forma_pagamento:e.target.value}))}>
                  <option value="">Selecione</option>
                  {['PIX','Transferência','Boleto','Cartão','Dinheiro'].map(s=><option key={s}>{s}</option>)}
                </select>
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
