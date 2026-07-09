'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PERGUNTAS, FORM_NOMES } from '@/lib/perguntas'

export default function FormPublico() {
  const { token } = useParams()
  const searchParams = useSearchParams()
  const formId = parseInt(searchParams.get('f') || '1')

  const [colaborador, setColaborador] = useState<any>(null)
  const [respostas, setRespostas] = useState<Record<number, number | string>>({})
  const [etapa, setEtapa] = useState<'loading'|'form'|'enviado'|'erro'>('loading')
  const [enviando, setEnviando] = useState(false)

  const perguntas = PERGUNTAS[formId] || []

  useEffect(() => {
    supabase.from('colaboradores').select('*, empresa:empresas(id,nome)').eq('token_formulario', token).single()
      .then(({ data, error }) => {
        if (error || !data) { setEtapa('erro'); return }
        setColaborador(data)
        setEtapa('form')
      })
  }, [token])

  async function enviar() {
    const escalas = perguntas.filter((_, i) => i < 20)
    const incompleto = escalas.some((_, i) => !respostas[i])
    if (incompleto) return alert('Por favor, responda todas as perguntas com nota de 1 a 5.')
    setEnviando(true)

    const { data: resp, error } = await supabase.from('respostas').insert({
      colaborador_id: colaborador.id,
      formulario_id: formId,
      empresa_id: colaborador.empresa?.id,
      concluido: true,
    }).select().single()

    if (error || !resp) { setEnviando(false); alert('Erro ao enviar. Tente novamente.'); return }

    const itens = perguntas.map((_, i) => ({
      resposta_id: resp.id,
      pergunta_id: i + 1,
      valor_escala: typeof respostas[i] === 'number' ? respostas[i] : null,
      valor_texto: typeof respostas[i] === 'string' ? respostas[i] : null,
    }))

    await supabase.from('resposta_itens').insert(itens)

    // Notifica a empresa por email
    if (colaborador.empresa?.id) {
      fetch('/api/notificar-empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colaborador_id: colaborador.id, empresa_id: colaborador.empresa.id }),
      }).catch(() => null)
    }

    setEnviando(false)
    setEtapa('enviado')
  }

  if (etapa === 'loading') return (
    <div className="min-h-screen bg-bege flex items-center justify-center">
      <p className="text-gray-400">Carregando formulário...</p>
    </div>
  )

  if (etapa === 'erro') return (
    <div className="min-h-screen bg-bege flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md text-center shadow">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="font-bold text-gray-800 mb-2">Link inválido</h2>
        <p className="text-gray-500 text-sm">Este link não é válido ou já expirou.</p>
      </div>
    </div>
  )

  if (etapa === 'enviado') return (
    <div className="min-h-screen bg-bege flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-md text-center shadow">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Respostas enviadas!</h2>
        <p className="text-gray-500 text-sm">Obrigado, {colaborador?.nome}. Suas respostas foram registradas com sucesso.</p>
        <p className="text-xs text-gray-400 mt-4">RH Essencial Digital / Essencial Agro</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bege py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-oliva to-oliva-light rounded-2xl p-6 text-white mb-6">
          <h1 className="text-xl font-bold">{FORM_NOMES[formId]}</h1>
          <p className="text-sm opacity-80 mt-1">Olá, <strong>{colaborador?.nome}</strong> — {colaborador?.empresa?.nome}</p>
          <p className="text-xs opacity-60 mt-3">Responda com sinceridade. Suas respostas são confidenciais.</p>
        </div>

        <div className="space-y-4">
          {perguntas.map((pergunta, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-700 mb-4 font-medium">{i+1}. {pergunta}</p>
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRespostas(p => ({ ...p, [i]: n }))}
                    className={`w-12 h-12 rounded-xl border-2 font-bold text-sm transition-all ${respostas[i] === n ? 'bg-oliva border-oliva text-white' : 'border-gray-200 text-gray-500 hover:border-oliva hover:text-oliva'}`}>
                    {n}
                  </button>
                ))}
                <span className="text-xs text-gray-400 self-center ml-2">1 = Discordo totalmente &nbsp; 5 = Concordo totalmente</span>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-700 mb-3 font-medium">Comentários ou sugestões (opcional)</p>
            <textarea className="input" rows={3} placeholder="Escreva aqui..."
              value={(respostas[999] as string) || ''}
              onChange={e => setRespostas(p => ({ ...p, 999: e.target.value }))} />
          </div>

          <button onClick={enviar} disabled={enviando}
            className="btn btn-primary w-full justify-center py-4 text-base">
            {enviando ? 'Enviando...' : 'Enviar Respostas'}
          </button>

          <p className="text-center text-xs text-gray-400 pb-8">
            RH Essencial Digital / Essencial Agro — Alana Carvalho
          </p>
        </div>
      </div>
    </div>
  )
}
