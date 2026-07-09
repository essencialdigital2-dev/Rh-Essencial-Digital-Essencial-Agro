'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Registro = {
  semana: string
  score_esg_social: number
  pilares: { bem_estar_saude_mental: number; retencao_talentos: number | null; seguranca_psicologica: number | null; diversidade_inclusao: number | null }
  selos_elegiveis: string[]
  resumo_executivo: string
  recomendacao: string
}

const PILARES_LABEL: Record<string, { label: string; icone: string }> = {
  bem_estar_saude_mental: { label: 'Bem-estar e Saúde Mental', icone: '💚' },
  retencao_talentos: { label: 'Retenção de Talentos', icone: '🤝' },
  seguranca_psicologica: { label: 'Segurança Psicológica', icone: '🛡️' },
  diversidade_inclusao: { label: 'Diversidade e Inclusão', icone: '🌈' },
}

export default function EsgSocialPage() {
  const [empresaId, setEmpresaId] = useState('')
  const [historico, setHistorico] = useState<Registro[]>([])
  const [carregando, setCarregando] = useState(true)
  const [calculando, setCalculando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => { inicializar() }, [])

  async function inicializar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCarregando(false); return }
    const { data: profile } = await supabase.from('profiles').select('empresa_id').eq('id', user.id).single()
    if (profile?.empresa_id) {
      setEmpresaId(profile.empresa_id)
      await carregar(profile.empresa_id)
    }
    setCarregando(false)
  }

  async function carregar(eid: string) {
    const res = await fetch(`/api/esg-social?empresa_id=${eid}`)
    const d = await res.json()
    if (d.ok) setHistorico(d.historico || [])
  }

  async function calcular() {
    if (!empresaId) return
    setCalculando(true)
    setErro('')
    try {
      const res = await fetch('/api/esg-social', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa_id: empresaId }),
      })
      const d = await res.json()
      if (!d.ok) setErro(d.msg || 'Não foi possível calcular ainda.')
      else await carregar(empresaId)
    } catch { setErro('Erro ao calcular o score.') }
    setCalculando(false)
  }

  const atual = historico[0]
  const anterior = historico[1]
  const cor = (v: number) => v >= 75 ? '#059669' : v >= 55 ? '#d97706' : '#dc2626'

  if (carregando) return <div className="p-8 text-center text-gray-400">Carregando...</div>

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">🌱 ESG Social</h1>
        <p className="text-gray-500 text-sm mt-1">
          O primeiro score ESG Social do mercado calculado automaticamente a partir de dados reais de bem-estar e retenção, sem questionário manual. Atualiza toda semana sozinho.
        </p>
      </div>

      {!atual && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center space-y-3 shadow-sm">
          <div className="text-3xl">🌱</div>
          <div className="text-sm font-bold text-gray-700">
            {erro || 'Calcule o primeiro score ESG Social da sua empresa.'}
          </div>
          <button onClick={calcular} disabled={calculando}
            className="font-bold px-5 py-2.5 rounded-xl text-sm text-white bg-emerald-600 disabled:opacity-50">
            {calculando ? 'Calculando...' : 'Calcular agora'}
          </button>
        </div>
      )}

      {atual && (
        <>
          <div className="rounded-2xl border border-emerald-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-emerald-50 flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-widest text-emerald-700">🌱 Score ESG Social · IA</div>
              <button onClick={calcular} disabled={calculando}
                className="text-xs font-bold border rounded-lg px-3 py-1.5 bg-white text-emerald-700 border-emerald-300 disabled:opacity-50">
                {calculando ? 'Recalculando...' : '↻ Atualizar'}
              </button>
            </div>
            <div className="bg-white p-5 space-y-4">
              <div className="flex gap-5 items-center">
                <div className="flex-shrink-0 relative w-24 h-24">
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke={cor(atual.score_esg_social)} strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 - (atual.score_esg_social / 100) * 2 * Math.PI * 40}
                      strokeLinecap="round" transform="rotate(-90 48 48)" style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black" style={{ color: cor(atual.score_esg_social) }}>{atual.score_esg_social}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-700 leading-relaxed">{atual.resumo_executivo}</p>
                  {atual.selos_elegiveis?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {atual.selos_elegiveis.map((s, i) => (
                        <span key={i} className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">🏅 {s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(atual.pilares).map(([key, valor]) => {
                  const info = PILARES_LABEL[key]
                  return (
                    <div key={key} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <div className="text-xs font-bold text-gray-600 mb-1">{info.icone} {info.label}</div>
                      <div className="text-lg font-black" style={{ color: valor != null ? cor(valor) : '#9ca3af' }}>
                        {valor != null ? `${valor}/100` : 'Sem dado ainda'}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="text-xs font-bold text-emerald-700 mb-0.5">⚡ Ação desta semana</div>
                <div className="text-sm text-gray-700">{atual.recomendacao}</div>
              </div>

              <div className="text-xs text-gray-400 text-center pt-2 border-t border-gray-100">
                💡 Diferencial de mercado: este score é auditável e baseado em dados reais de uso, não em autodeclaração — pode ser usado para comprovar governança de pessoas a clientes, investidores e certificadoras.
              </div>
            </div>
          </div>

          {anterior && (
            <div className="text-xs text-gray-400 text-center">
              Semana anterior: {anterior.score_esg_social}/100 {atual.score_esg_social > anterior.score_esg_social ? '↑' : atual.score_esg_social < anterior.score_esg_social ? '↓' : '→'}
            </div>
          )}
        </>
      )}
    </div>
  )
}
