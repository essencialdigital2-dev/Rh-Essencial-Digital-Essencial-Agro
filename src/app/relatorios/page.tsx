'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FORM_NOMES } from '@/lib/perguntas'
import Link from 'next/link'

export default function Relatorios() {
  const [respostas, setRespostas] = useState<any[]>([])
  const [busca, setBusca] = useState('')

  useEffect(() => {
    supabase.from('respostas')
      .select('*, colaborador:colaboradores(nome), empresa:empresas(nome)')
      .eq('concluido', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setRespostas(data || []))
  }, [])

  const filtradas = respostas.filter(r =>
    r.colaborador?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    r.empresa?.nome?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios & Devolutivas</h1>
        <p className="text-gray-500 text-sm">{respostas.length} diagnósticos concluídos</p>
      </div>

      <div className="card">
        <input className="input mb-4" placeholder="Buscar colaborador ou empresa..." value={busca} onChange={e => setBusca(e.target.value)} />
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b border-gray-100">
            <th className="pb-2">Colaborador</th><th className="pb-2">Empresa</th><th className="pb-2">Diagnóstico</th><th className="pb-2">Data</th><th className="pb-2"></th>
          </tr></thead>
          <tbody>
            {filtradas.map(r => (
              <tr key={r.id} className="table-row">
                <td className="py-3 font-medium">{r.colaborador?.nome}</td>
                <td className="py-3 text-gray-500">{r.empresa?.nome}</td>
                <td className="py-3 text-gray-500">{FORM_NOMES[r.formulario_id]}</td>
                <td className="py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="py-3 text-right">
                  <Link href={`/relatorios/${r.id}`} className="btn btn-primary text-xs py-1.5 px-3">Ver Devolutiva</Link>
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-400">Nenhum relatório disponível</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
