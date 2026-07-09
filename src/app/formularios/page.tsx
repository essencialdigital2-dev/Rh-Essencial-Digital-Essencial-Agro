'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FORM_NOMES } from '@/lib/perguntas'
import type { Colaborador, Empresa } from '@/types'

interface Resposta { id: string; created_at: string; concluido: boolean; colaborador: any; empresa: any; formulario_id: number }

export default function Formularios() {
  const [aba, setAba] = useState<'enviar'|'respostas'>('enviar')
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [colSel, setColSel] = useState('')
  const [formSel, setFormSel] = useState('1')
  const [linkGerado, setLinkGerado] = useState('')
  const [filtroEmp, setFiltroEmp] = useState('')

  useEffect(() => {
    supabase.from('colaboradores').select('*, empresa:empresas(nome)').order('nome').then(({ data }) => setColaboradores(data || []))
    supabase.from('empresas').select('id,nome').order('nome').then(({ data }) => setEmpresas(data || []))
    carregarRespostas()
  }, [])

  async function carregarRespostas() {
    const { data } = await supabase.from('respostas')
      .select('*, colaborador:colaboradores(nome), empresa:empresas(nome)')
      .order('created_at', { ascending: false })
    setRespostas(data || [])
  }

  function gerarLink() {
    if (!colSel) return alert('Selecione um colaborador')
    const col = colaboradores.find(c => c.id === colSel)
    if (!col) return
    const link = `${window.location.origin}/form/${col.token_formulario}?f=${formSel}`
    setLinkGerado(link)
  }

  function copiar() {
    navigator.clipboard.writeText(linkGerado)
    alert('Link copiado! Envie por WhatsApp ou e-mail.')
  }

  function whatsapp() {
    const col = colaboradores.find(c => c.id === colSel)
    const msg = encodeURIComponent(`Olá, ${col?.nome}! Segue o link para você responder o diagnóstico:\n\n${linkGerado}\n\nQualquer dúvida, estou à disposição!\n\nAlana Carvalho | RH Essencial Digital`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }

  function email() {
    const col = colaboradores.find(c => c.id === colSel)
    const assunto = encodeURIComponent(`Diagnóstico ${FORM_NOMES[parseInt(formSel)]}`)
    const corpo = encodeURIComponent(`Olá, ${col?.nome}!\n\nSegue o link para você responder o diagnóstico:\n\n${linkGerado}\n\nAtenciosamente,\nAlana Carvalho\nRH Essencial Digital / Essencial Agro`)
    window.open(`https://mail.google.com/mail/?view=cm&su=${assunto}&body=${corpo}`, '_blank')
  }

  const respostasFiltradas = respostas.filter(r =>
    !filtroEmp || r.empresa?.nome?.toLowerCase().includes(filtroEmp.toLowerCase()) ||
    r.colaborador?.nome?.toLowerCase().includes(filtroEmp.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Diagnósticos</h1>
        <p className="text-gray-500 text-sm">Envie formulários e acompanhe respostas</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['enviar','respostas'] as const).map(a => (
          <button key={a} onClick={() => setAba(a)}
            className={`btn ${aba===a ? 'btn-primary' : 'btn-outline'}`}>
            {a === 'enviar' ? '📤 Enviar Formulário' : `📥 Respostas (${respostas.length})`}
          </button>
        ))}
      </div>

      {aba === 'enviar' && (
        <div className="card max-w-xl">
          <h2 className="font-semibold text-gray-700 mb-4">Gerar link individual</h2>
          <div className="space-y-3">
            <div>
              <label className="label">Colaborador</label>
              <select className="input" value={colSel} onChange={e => { setColSel(e.target.value); setLinkGerado('') }}>
                <option value="">Selecione...</option>
                {colaboradores.map(c => <option key={c.id} value={c.id}>{c.nome} {(c.empresa as any)?.nome ? `— ${(c.empresa as any).nome}` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Formulário</label>
              <select className="input" value={formSel} onChange={e => { setFormSel(e.target.value); setLinkGerado('') }}>
                {Object.entries(FORM_NOMES).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
              </select>
            </div>
            <button onClick={gerarLink} className="btn btn-primary">Gerar Link</button>

            {linkGerado && (
              <div className="mt-4 p-4 bg-bege rounded-xl border border-dourado/30">
                <p className="text-xs text-gray-500 mb-2">Link gerado:</p>
                <p className="text-sm font-mono text-gray-700 break-all mb-3">{linkGerado}</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={copiar} className="btn btn-outline text-xs py-1.5">📋 Copiar</button>
                  <button onClick={whatsapp} className="btn text-xs py-1.5 bg-green-500 text-white hover:bg-green-600">💬 WhatsApp</button>
                  <button onClick={email} className="btn text-xs py-1.5 bg-blue-500 text-white hover:bg-blue-600">📧 E-mail</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'respostas' && (
        <div className="card">
          <input className="input mb-4" placeholder="Filtrar por colaborador ou empresa..." value={filtroEmp} onChange={e => setFiltroEmp(e.target.value)} />
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-2">Colaborador</th><th className="pb-2">Empresa</th><th className="pb-2">Formulário</th><th className="pb-2">Status</th><th className="pb-2">Data</th><th className="pb-2"></th>
            </tr></thead>
            <tbody>
              {respostasFiltradas.map(r => (
                <tr key={r.id} className="table-row">
                  <td className="py-3 font-medium">{r.colaborador?.nome}</td>
                  <td className="py-3 text-gray-500">{r.empresa?.nome}</td>
                  <td className="py-3 text-gray-500">{FORM_NOMES[r.formulario_id]}</td>
                  <td className="py-3">
                    <span className={`badge ${r.concluido ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.concluido ? 'Concluído' : 'Pendente'}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3 text-right">
                    {r.concluido && (
                      <a href={`/relatorios/${r.id}`} className="text-oliva hover:underline text-xs">Ver Relatório</a>
                    )}
                  </td>
                </tr>
              ))}
              {respostasFiltradas.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">Nenhuma resposta ainda</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
