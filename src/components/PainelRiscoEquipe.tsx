'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

type ScoreRisco = {
  colaborador_id: string
  risco_burnout: number
  risco_saida: number
  nivel: 'saudavel' | 'atenção' | 'critico'
  recomendacao: string
  comportamento_sob_pressao?: string | null
  calculado_em: string
  profiles: { nome: string; cargo: string; setor: string } | null
}

const NIVEL_COR = {
  saudavel: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  atenção:  { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500' },
  critico:  { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500' },
}

const NIVEL_LABEL = { saudavel: 'Saudável', atenção: 'Atenção', critico: 'Crítico' }

export default function PainelRiscoEquipe({ empresaId }: { empresaId: string }) {
  const [scores, setScores] = useState<ScoreRisco[]>([])
  const [carregando, setCarregando] = useState(true)
  const [calculando, setCalculando] = useState(false)
  const [filtro, setFiltro] = useState<'todos' | 'atenção' | 'critico'>('todos')
  const [expandido, setExpandido] = useState<string | null>(null)

  useEffect(() => { if (empresaId) carregar() }, [empresaId])

  async function carregar() {
    setCarregando(true)
    try {
      const res = await fetch(`/api/score-risco-individual?empresa_id=${empresaId}`)
      const data = await res.json()
      setScores(data.scores || [])
    } catch {}
    setCarregando(false)
  }

  async function recalcular() {
    setCalculando(true)
    try {
      await fetch('/api/cron/score-risco', {
        headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}` }
      })
      await carregar()
    } catch {}
    setCalculando(false)
  }

  const filtrados = scores.filter(s =>
    filtro === 'todos' ? true : s.nivel === filtro
  )

  const criticos = scores.filter(s => s.nivel === 'critico').length
  const atenção  = scores.filter(s => s.nivel === 'atenção').length
  const saudaveis = scores.filter(s => s.nivel === 'saudavel').length

  if (carregando) return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 animate-pulse space-y-3">
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
    </div>
  )

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-0.5">Sense AI · Risco Individual</div>
          <h2 className="text-lg font-black text-gray-900">Painel de Saúde da Equipe</h2>
        </div>
        <button onClick={recalcular} disabled={calculando}
          className="text-xs text-purple-600 font-bold border border-purple-200 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition disabled:opacity-50">
          {calculando ? '⏳' : '↻ Atualizar'}
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Saudáveis', valor: saudaveis, cor: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Atenção',   valor: atenção,   cor: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Críticos',  valor: criticos,  cor: 'text-red-600',   bg: 'bg-red-50' },
        ].map((m, i) => (
          <div key={i} className={`${m.bg} rounded-xl p-3 text-center`}>
            <div className={`text-2xl font-black ${m.cor}`}>{m.valor}</div>
            <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Filtro */}
      <div className="flex gap-2">
        {(['todos', 'critico', 'atenção'] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${filtro === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f === 'todos' ? 'Todos' : f === 'critico' ? '🔴 Críticos' : '🟡 Atenção'}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {scores.length === 0
            ? 'Nenhum score calculado ainda. Os scores são gerados automáticamente toda segunda-feira.'
            : 'Nenhum colaborador neste filtro.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtrados.map(s => {
            const cor = NIVEL_COR[s.nivel]
            const nome = s.profiles?.nome || 'Colaborador'
            const cargo = s.profiles?.cargo || ''
            const aberto = expandido === s.colaborador_id

            return (
              <div key={s.colaborador_id}
                className={`rounded-xl border ${cor.border} ${cor.bg} overflow-hidden transition-all`}>
                <button
                  className="w-full flex items-center gap-3 p-3 text-left"
                  onClick={() => setExpandido(aberto ? null : s.colaborador_id)}>
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm flex-shrink-0">
                    {nome.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 truncate">{nome}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cor.badge}`}>
                        {NIVEL_LABEL[s.nivel]}
                      </span>
                    </div>
                    {cargo && <div className="text-xs text-gray-500 truncate">{cargo}</div>}
                  </div>

                  {/* Scores */}
                  <div className="flex gap-3 flex-shrink-0 text-right">
                    <div>
                      <div className="text-xs text-gray-400">Burnout</div>
                      <div className={`text-sm font-black ${s.risco_burnout >= 70 ? 'text-red-600' : s.risco_burnout >= 45 ? 'text-amber-600' : 'text-green-600'}`}>
                        {s.risco_burnout}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Saída</div>
                      <div className={`text-sm font-black ${s.risco_saida >= 70 ? 'text-red-600' : s.risco_saida >= 45 ? 'text-amber-600' : 'text-green-600'}`}>
                        {s.risco_saida}%
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">{aberto ? '▲' : '▼'}</div>
                  </div>
                </button>

                {/* Recomendação e comportamento sob pressão expandidos */}
                {aberto && (s.recomendacao || s.comportamento_sob_pressao) && (
                  <div className="px-3 pb-3 pt-0 space-y-2">
                    {s.recomendacao && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs font-bold text-purple-600 mb-1">💡 Recomendação da IA para esta semana</div>
                        <div className="text-sm text-gray-700 leading-relaxed">{s.recomendacao}</div>
                      </div>
                    )}
                    {s.comportamento_sob_pressao && (
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <div className="text-xs font-bold text-indigo-600 mb-1">🎯 Como age e decide sob pressão</div>
                        <div className="text-sm text-gray-700 leading-relaxed">{s.comportamento_sob_pressao}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {criticos > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-sm font-bold text-red-700">
            🚨 {criticos} colaborador{criticos > 1 ? 'es' : ''} em nível crítico
          </div>
          <div className="text-xs text-red-600 mt-1">
            Sinais de esgotamento detectados. Ação recomendada esta semana.
          </div>
        </div>
      )}
    </div>
  )
}
