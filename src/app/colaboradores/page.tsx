'use client'
import { Fragment, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Colaborador, Empresa } from '@/types'
import { PCD_INFO } from '@/lib/sense-neuro'

const VAZIO = { nome:'', cargo:'', setor:'', empresa_id:'', email:'', telefone:'', observacoes:'', tipo_pcd:'' }

export default function Colaboradores() {
  const [rows, setRows] = useState<Colaborador[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<any>(VAZIO)
  const [loading, setLoading] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState('')
  const [guias, setGuias] = useState<Record<string, string>>({})
  const [gerandoGuia, setGerandoGuia] = useState<string | null>(null)

  async function gerarGuiaPcd(c: Colaborador) {
    if (!c.tipo_pcd) return
    setGerandoGuia(c.id)
    try {
      const res = await fetch('/api/colaborador-guia-pcd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: c.nome, cargo: c.cargo, setor: c.setor, observacoes: c.observacoes, pcdInfo: PCD_INFO[c.tipo_pcd] }),
      })
      const d = await res.json()
      setGuias(prev => ({ ...prev, [c.id]: d.texto }))
    } finally {
      setGerandoGuia(null)
    }
  }

  async function load() {
    const [{ data: cols }, { data: emps }] = await Promise.all([
      supabase.from('colaboradores').select('*, empresa:empresas(nome)').order('nome'),
      supabase.from('empresas').select('*').order('nome'),
    ])
    setRows(cols || [])
    setEmpresas((emps || []) as any)
  }
  useEffect(() => { load() }, [])

  function abrir(c?: Colaborador) { setForm(c ? { ...c } : { ...VAZIO }); setModal(true) }

  async function salvar() {
    if (!form.nome) return alert('Nome obrigatório')
    setLoading(true)
    const payload = { nome:form.nome, cargo:form.cargo, setor:form.setor, empresa_id:form.empresa_id||null, email:form.email, telefone:form.telefone, observacoes:form.observacoes, tipo_pcd:form.tipo_pcd||'' }
    if (form.id) {
      await supabase.from('colaboradores').update(payload).eq('id', form.id)
    } else {
      const { data: novo } = await supabase.from('colaboradores').insert(payload).select().single()
      // Auto-envia link de assessment se tiver email
      if (novo?.id && form.email) {
        fetch('/api/colaborador-convite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ colaborador_id: novo.id }),
        }).catch(() => null)
      }
    }
    setLoading(false); setModal(false); load()
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este colaborador?')) return
    await supabase.from('colaboradores').delete().eq('id', id)
    load()
  }

  function copiarLink(token: string) {
    const origem = window.location.origin
    const link = `${origem}/form/${token}`
    navigator.clipboard.writeText(link)
    setLinkCopiado(token)
    setTimeout(() => setLinkCopiado(''), 2000)
  }

  const filtradas = rows.filter(r =>
    r.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (r.empresa as any)?.nome?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Colaboradores</h1><p className="text-gray-500 text-sm">{rows.length} cadastrados</p></div>
        <button onClick={() => abrir()} className="btn btn-primary">+ Novo Colaborador</button>
      </div>

      <div className="card">
        <input className="input mb-4" placeholder="Buscar colaborador ou empresa..." value={busca} onChange={e => setBusca(e.target.value)} />
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="pb-2">Nome</th><th className="pb-2">Cargo</th><th className="pb-2">Empresa</th><th className="pb-2">PCD</th><th className="pb-2">Link Formulário</th><th className="pb-2"></th>
          </tr></thead>
          <tbody>
            {filtradas.map(r => (
              <Fragment key={r.id}>
              <tr className="table-row">
                <td className="py-3 font-medium">{r.nome}</td>
                <td className="py-3 text-gray-500">{r.cargo}</td>
                <td className="py-3 text-gray-500">{(r.empresa as any)?.nome}</td>
                <td className="py-3">
                  {r.tipo_pcd ? (
                    <button onClick={() => gerarGuiaPcd(r)} disabled={gerandoGuia === r.id}
                      className="text-xs px-2 py-1 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50">
                      {PCD_INFO[r.tipo_pcd].icone} {gerandoGuia === r.id ? 'Gerando...' : guias[r.id] ? '🔄 Regerar guia' : 'Gerar guia'}
                    </button>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
                <td className="py-3">
                  <button onClick={() => copiarLink(r.token_formulario)}
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${linkCopiado === r.token_formulario ? 'bg-green-100 text-green-700 border-green-200' : 'border-gray-200 text-gray-500 hover:border-oliva hover:text-oliva'}`}>
                    {linkCopiado === r.token_formulario ? '✓ Copiado!' : '🔗 Copiar link'}
                  </button>
                </td>
                <td className="py-3 text-right space-x-2">
                  <button onClick={() => abrir(r)} className="text-oliva hover:underline text-xs">Editar</button>
                  <button onClick={() => excluir(r.id)} className="text-red-500 hover:underline text-xs">Excluir</button>
                </td>
              </tr>
              {guias[r.id] && (
                <tr>
                  <td colSpan={6} className="pb-4">
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line">
                      {guias[r.id]}
                    </div>
                  </td>
                </tr>
              )}
              </Fragment>
            ))}
            {filtradas.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Nenhum colaborador encontrado</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4">{form.id ? 'Editar' : 'Novo'} Colaborador</h2>
            <div className="grid grid-cols-2 gap-3">
              {[['nome','Nome'],['cargo','Cargo'],['setor','Setor'],['email','E-mail'],['telefone','Telefone']].map(([k,l]) => (
                <div key={k}>
                  <label className="label">{l}</label>
                  <input className="input" value={form[k]||''} onChange={e=>setForm((p:any)=>({...p,[k]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <label className="label">Empresa</label>
                <select className="input" value={form.empresa_id||''} onChange={e=>setForm((p:any)=>({...p,empresa_id:e.target.value}))}>
                  <option value="">Selecione</option>
                  {empresas.map(e=><option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="label">PCD</label>
                <select className="input" value={form.tipo_pcd||''} onChange={e=>setForm((p:any)=>({...p,tipo_pcd:e.target.value}))}>
                  <option value="">Não é PCD</option>
                  <option value="Visual">👁️ Deficiência Visual</option>
                  <option value="Auditiva">👂 Deficiência Auditiva</option>
                  <option value="Motora">🦽 Deficiência Motora</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="label">Observações</label>
              <textarea className="input" rows={2} value={form.observacoes||''} onChange={e=>setForm((p:any)=>({...p,observacoes:e.target.value}))}/>
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
