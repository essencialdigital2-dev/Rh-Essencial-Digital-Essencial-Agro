'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PERGUNTAS, FORM_NOMES } from '@/lib/perguntas'
import { calcularDimensoes, getNivel, PLANO_ACAO } from '@/lib/diagnostico'

export default function RelatorioDetalhe() {
  const { id } = useParams()
  const [dados, setDados] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: resp } = await supabase.from('respostas')
        .select('*, colaborador:colaboradores(nome,cargo,setor), empresa:empresas(nome)')
        .eq('id', id).single()
      const { data: itens } = await supabase.from('resposta_itens')
        .select('*').eq('resposta_id', id).order('pergunta_id')
      setDados({ resp, itens: itens || [] })
      setLoading(false)
    }
    load()
  }, [id])

  function imprimir() { window.print() }

  function enviarEmail() {
    if (!dados) return
    const { resp } = dados
    const assunto = encodeURIComponent(`Devolutiva: ${FORM_NOMES[resp.formulario_id]} — ${resp.colaborador?.nome}`)
    const corpo = encodeURIComponent(`Olá,\n\nSegue a devolutiva do diagnóstico:\n\nColaborador: ${resp.colaborador?.nome}\nDiagnóstico: ${FORM_NOMES[resp.formulario_id]}\nData: ${new Date(resp.created_at).toLocaleDateString('pt-BR')}\n\nAtenciosamente,\nAlana Carvalho\nRH Essencial Digital / Essencial Agro`)
    window.open(`https://mail.google.com/mail/?view=cm&su=${assunto}&body=${corpo}`, '_blank')
  }

  if (loading) return <div className="p-8 text-gray-400">Carregando relatório...</div>
  if (!dados?.resp) return <div className="p-8 text-gray-400">Relatório não encontrado.</div>

  const { resp, itens } = dados
  const perguntas = PERGUNTAS[resp.formulario_id] || []
  const dimensoes = calcularDimensoes(resp.formulario_id, itens)
  const mediaGeral = dimensoes.length ? dimensoes.reduce((a, d) => a + d.media, 0) / dimensoes.length : 0
  const nivel = getNivel(mediaGeral)
  const fortes = dimensoes.filter(d => d.media >= 4)
  const atencao = dimensoes.filter(d => d.media < 3.5).sort((a, b) => a.media - b.media)
  const planoAcoes = atencao.slice(0, 3).flatMap(d => (PLANO_ACAO[d.nome] || []).slice(0, 2).map(a => ({ dimensao: d.nome, acao: a })))
  const comentario = itens.find((i: any) => i.pergunta_id === 999 || i.valor_texto)?.valor_texto

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Devolutiva — {FORM_NOMES[resp.formulario_id]}</h1>
          <p className="text-gray-500 text-sm">{resp.colaborador?.nome} · {resp.empresa?.nome}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={enviarEmail} className="btn btn-outline text-sm">📧 E-mail</button>
          <button onClick={imprimir} className="btn btn-primary text-sm">🖨️ PDF</button>
        </div>
      </div>

      <div className="space-y-4 print:space-y-3">
        {/* Cabeçalho */}
        <div className="card bg-gradient-to-br from-oliva to-oliva-light text-white print:rounded-none">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-lg font-bold">RH Essencial Digital / Essencial Agro</div>
              <div className="text-sm opacity-80 mt-1">{FORM_NOMES[resp.formulario_id]}</div>
              <div className="text-sm opacity-70 mt-3">{resp.colaborador?.nome} — {resp.colaborador?.cargo}</div>
              <div className="text-sm opacity-70">{resp.empresa?.nome}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-60">Data</div>
              <div className="text-sm font-medium">{new Date(resp.created_at).toLocaleDateString('pt-BR')}</div>
            </div>
          </div>
        </div>

        {/* Nível geral */}
        <div className="card text-center">
          <div className="text-4xl mb-1">{nivel.emoji}</div>
          <div className="text-3xl font-bold" style={{ color: nivel.cor }}>{mediaGeral.toFixed(1)}</div>
          <div className="text-sm font-medium text-gray-600">{nivel.label}</div>
          <div className="text-xs text-gray-400 mt-1">Média geral (escala 1–5)</div>
        </div>

        {/* Dimensões */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-4">Análise por Dimensão</h2>
          <div className="space-y-3">
            {dimensoes.map(d => {
              const n = getNivel(d.media)
              return (
                <div key={d.nome}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{d.nome}</span>
                    <span className="font-bold" style={{ color: n.cor }}>{d.media.toFixed(1)} {n.emoji}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${(d.media/5)*100}%`, backgroundColor: n.cor }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pontos fortes e atenção */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-bold text-green-700 mb-3">✅ Pontos Fortes</h2>
            {fortes.length ? fortes.map(d => <p key={d.nome} className="text-sm text-gray-700 mb-1">• {d.nome} ({d.media.toFixed(1)})</p>)
              : <p className="text-sm text-gray-400">Nenhum ponto acima de 4.0</p>}
          </div>
          <div className="card">
            <h2 className="font-bold text-orange-600 mb-3">⚠️ Pontos de Atenção</h2>
            {atencao.length ? atencao.map(d => <p key={d.nome} className="text-sm text-gray-700 mb-1">• {d.nome} ({d.media.toFixed(1)})</p>)
              : <p className="text-sm text-gray-400">Sem pontos críticos</p>}
          </div>
        </div>

        {/* Plano de ação */}
        {planoAcoes.length > 0 && (
          <div className="card">
            <h2 className="font-bold text-gray-800 mb-4">📌 Plano de Ação Recomendado</h2>
            <div className="space-y-3">
              {planoAcoes.map((p, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-oliva text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</div>
                  <div>
                    <div className="text-xs text-dourado font-medium">{p.dimensao}</div>
                    <div className="text-sm text-gray-700">{p.acao}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Respostas detalhadas */}
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-4">Respostas Detalhadas</h2>
          <div className="space-y-3">
            {perguntas.map((p, i) => {
              const item = itens[i]
              return (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-600 flex-1 pr-4">{i+1}. {p}</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center ${item?.valor_escala === n ? 'bg-oliva text-white' : 'bg-gray-100 text-gray-400'}`}>{n}</div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Comentários */}
        {comentario && (
          <div className="card">
            <h2 className="font-bold text-gray-800 mb-2">💬 Comentários</h2>
            <p className="text-sm text-gray-600 italic">"{comentario}"</p>
          </div>
        )}

        {/* Assinatura */}
        <div className="card text-center text-sm text-gray-500 print:mt-8">
          <p className="font-medium text-gray-700">Alana Carvalho</p>
          <p>RH Essencial Digital / Essencial Agro</p>
          <p className="text-xs mt-1 text-gray-400">Este relatório é confidencial e destinado ao uso interno.</p>
        </div>
      </div>
    </div>
  )
}
