'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Empresa } from '@/types'

const VAZIO: Partial<Empresa> = { nome:'', cnpj:'', segmento:'', responsavel:'', email:'', telefone:'', cidade:'', estado:'', status:'ativo', observacoes:'', senha_cliente:'' }

export default function Empresas() {
  const [rows, setRows] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Partial<Empresa>>(VAZIO)
  const [loading, setLoading] = useState(false)
  const [enviando, setEnviando] = useState<string>('')
  const [enviado, setEnviado] = useState<string>('')

  async function enviarAcesso(empresa: any) {
    if (!empresa.email) return alert('Empresa sem e-mail cadastrado.')
    setEnviando(empresa.id)
    const res = await fetch('/api/cliente-convite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresa_id: empresa.id }),
    })
    setEnviando('')
    if (res.ok) { setEnviado(empresa.id); setTimeout(() => setEnviado(''), 4000) }
    else alert('Erro ao enviar convite.')
  }

  async function load() {
    const { data } = await supabase.from('empresas').select('*').order('nome')
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  function abrir(emp?: Empresa) { setForm(emp ? { ...emp } : { ...VAZIO }); setModal(true) }

  async function salvar() {
    if (!form.nome) return alert('Nome obrigatório')
    setLoading(true)
    const payload = { nome:form.nome, cnpj:form.cnpj, segmento:form.segmento, responsavel:form.responsavel, email:form.email, telefone:form.telefone, cidade:form.cidade, estado:form.estado, status:form.status, observacoes:form.observacoes, senha_cliente:form.senha_cliente||null }
    if (form.id) {
      await supabase.from('empresas').update(payload).eq('id', form.id)
    } else {
      await supabase.from('empresas').insert(payload)
    }
    setLoading(false); setModal(false); load()
  }

  async function excluir(id: string) {
    if (!confirm('Excluir esta empresa?')) return
    await supabase.from('empresas').delete().eq('id', id)
    load()
  }

  const filtradas = rows.filter(r => r.nome.toLowerCase().includes(busca.toLowerCase()) || r.segmento?.toLowerCase().includes(busca.toLowerCase()))

  const F = (k: keyof Empresa, label: string, type = 'text') => (
    <div key={k}>
      <label className="label">{label}</label>
      <input className="input" type={type} value={(form[k] as string) || ''}
        onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Empresas</h1><p className="text-gray-500 text-sm">{rows.length} cadastradas</p></div>
        <button onClick={() => abrir()} className="btn btn-primary">+ Nova Empresa</button>
      </div>

      <div className="card">
        <input className="input mb-4" placeholder="Buscar empresa..." value={busca} onChange={e => setBusca(e.target.value)} />
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="pb-2">Nome</th><th className="pb-2">Segmento</th><th className="pb-2">Responsável</th><th className="pb-2">Status</th><th className="pb-2"></th>
          </tr></thead>
          <tbody>
            {filtradas.map(r => (
              <tr key={r.id} className="table-row">
                <td className="py-3 font-medium">{r.nome}</td>
                <td className="py-3 text-gray-500">{r.segmento}</td>
                <td className="py-3 text-gray-500">{r.responsavel}</td>
                <td className="py-3">
                  <span className={`badge ${r.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
                </td>
                <td className="py-3 text-right space-x-2">
                  <button onClick={() => enviarAcesso(r)} disabled={enviando === r.id}
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${enviado === r.id ? 'bg-green-100 text-green-700 border-green-200' : 'border-purple-200 text-purple-600 hover:bg-purple-50'}`}>
                    {enviando === r.id ? 'Enviando...' : enviado === r.id ? '✓ Enviado!' : '📧 Enviar acesso'}
                  </button>
                  <button onClick={() => abrir(r)} className="text-oliva hover:underline text-xs">Editar</button>
                  <button onClick={() => excluir(r.id)} className="text-red-500 hover:underline text-xs">Excluir</button>
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-400">Nenhuma empresa encontrada</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold mb-4">{form.id ? 'Editar' : 'Nova'} Empresa</h2>
            <div className="grid grid-cols-2 gap-3">
              {F('nome','Nome')} {F('cnpj','CNPJ')}
              {F('segmento','Segmento')} {F('responsavel','Responsável')}
              {F('email','E-mail','email')} {F('telefone','Telefone')}
              {F('cidade','Cidade')} {F('estado','Estado')}
              <div className="col-span-2">
                <label className="label">Senha do Portal do Cliente</label>
                <input className="input" type="text" placeholder="Defina uma senha para o acesso da empresa" value={(form.senha_cliente as string) || ''}
                  onChange={e => setForm(p => ({ ...p, senha_cliente: e.target.value }))} />
                <p className="text-xs text-gray-400 mt-1">A empresa usa o e-mail cadastrado + esta senha para acessar o portal.</p>
              </div>
              <div><label className="label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}>
                  <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="label">Observações</label>
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
