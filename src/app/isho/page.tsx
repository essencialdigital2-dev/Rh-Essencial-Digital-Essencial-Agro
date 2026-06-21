'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

type ISHOSemana = {
  id: string
  semana: string
  score: number
  nivel: 'saudavel' | 'atencao' | 'critico'
  tendencia: 'subindo' | 'estavel' | 'caindo'
  engajamento: number
  diagnostico: string
  metricas: {
    mediaHumor: number
    mediaEnergia: number
    mediaFoco: number
    mediaStresse: number
    colabsAtivos: number
    totalColabsCount: number
  }
}

const NIVEL = {
  saudavel: { cor: '#059669', bg: '#F0FDF4', borda: '#BBF7D0', label: 'Saudável', emoji: '🟢' },
  atencao:  { cor: '#d97706', bg: '#FFFBEB', borda: '#FDE68A', label: 'Atenção',  emoji: '🟡' },
  critico:  { cor: '#dc2626', bg: '#FEF2F2', borda: '#FECACA', label: 'Crítico',  emoji: '🔴' },
}

const TENDENCIA_ICON = { subindo: '↑', estavel: '→', caindo: '↓' }
const TENDENCIA_COR  = { subindo: '#059669', estavel: '#d97706', caindo: '#dc2626' }
const TENDENCIA_LABEL = { subindo: 'Subindo', estavel: 'Estável', caindo: 'Caindo' }

export default function PaginaISHO() {
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [historico, setHistorico] = useState<ISHOSemana[]>([])
  const [calculando, setCalculando] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { inicializar() }, [])

  async function inicializar() {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { setCarregando(false); return }

    const { data: profile } = await sb
      .from('profiles')
      .select('empresa_id, empresas(nome)')
      .eq('id', user.id)
      .single()

    if (profile?.empresa_id) {
      setEmpresaId(profile.empresa_id)
      setNomeEmpresa((profile as any).empresas?.nome || '')
      await carregarHistorico(profile.empresa_id)
    }
    setCarregando(false)
  }

  async function carregarHistorico(eid: string) {
    const res = await fetch(`/api/isho?empresa_id=${eid}`)
    const data = await res.json()
    if (data.historico) setHistorico(data.historico)
  }

  async function calcular() {
    if (!empresaId) return
    setCalculando(true)
    try {
      const res = await fetch('/api/isho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa_id: empresaId }),
      })
      const data = await res.json()
      if (data.ok) await carregarHistorico(empresaId)
    } catch {}
    setCalculando(false)
  }

  if (carregando) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 animate-pulse text-sm">Carregando ISHO...</div>
    </div>
  )

  if (!empresaId) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🔒</div>
        <div className="text-gray-600 font-medium">Acesso restrito a gestores</div>
        <a href="/sense-login" className="mt-4 inline-block text-purple-600 font-bold text-sm">Fazer login →</a>
      </div>
    </div>
  )

  const atual = historico[0]
  const cfgAtual = atual ? NIVEL[atual.nivel] : NIVEL.atencao
  const maxScore = Math.max(...historico.map(h => h.score), 1)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-purple-600 mb-0.5">
            Essencial Sense AI
          </div>
          <div className="text-lg font-black text-gray-900">{nomeEmpresa || 'ISHO'}</div>
          <div className="text-xs text-gray-400">Índice de Saúde Humana Organizacional</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={calcular}
            disabled={calculando}
            className="text-xs font-bold border border-purple-200 text-purple-600 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition disabled:opacity-50"
          >
            {calculando ? '⏳ Calculando...' : '↻ Recalcular'}
          </button>
          <a href="/dashboard" className="text-xs text-gray-400 hover:text-gray-600">← Dashboard</a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

        {atual ? (
          <>
            {/* Score principal */}
            <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: cfgAtual.borda }}>
              <div className="px-5 py-3" style={{ background: cfgAtual.bg }}>
                <div className="text-xs font-black uppercase tracking-widest" style={{ color: cfgAtual.cor }}>
                  ISHO desta semana
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-6">
                  {/* Score grande */}
                  <div className="flex-shrink-0 relative w-28 h-28">
                    <svg width="112" height="112" viewBox="0 0 112 112">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="#e5e7eb" strokeWidth="9" />
                      <circle cx="56" cy="56" r="48" fill="none"
                        stroke={cfgAtual.cor} strokeWidth="9"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - atual.score / 100)}
                        strokeLinecap="round" transform="rotate(-90 56 56)"
                        style={{ transition: 'stroke-dashoffset 1.4s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black" style={{ color: cfgAtual.cor }}>{atual.score}</span>
                      <span className="text-xs text-gray-400 font-medium">/100</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-base px-3 py-1 rounded-full" style={{ background: cfgAtual.bg, color: cfgAtual.cor }}>
                        {cfgAtual.emoji} {cfgAtual.label}
                      </span>
                      <span className="text-sm font-bold" style={{ color: TENDENCIA_COR[atual.tendencia] }}>
                        {TENDENCIA_ICON[atual.tendencia]} {TENDENCIA_LABEL[atual.tendencia]}
                      </span>
                    </div>

                    {/* Engajamento */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500 font-medium">Engajamento da equipe</span>
                        <span className="font-black" style={{ color: cfgAtual.cor }}>
                          {atual.engajamento}%
                          {atual.metricas && ` (${atual.metricas.colabsAtivos}/${atual.metricas.totalColabsCount})`}
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${atual.engajamento}%`, background: cfgAtual.cor }} />
                      </div>
                    </div>

                    <div className="text-xs text-gray-400">
                      Semana de {new Date(atual.semana + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Pilares */}
            {atual.metricas && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="text-sm font-black text-gray-800 mb-4">Os 5 pilares do ISHO</div>
                <div className="space-y-3">
                  {[
                    { label: 'Humor',      val: atual.metricas.mediaHumor,    max: 5, desc: 'Estado emocional geral da equipe',       inverso: false },
                    { label: 'Energia',    val: atual.metricas.mediaEnergia,  max: 5, desc: 'Disposição física e mental coletiva',    inverso: false },
                    { label: 'Foco',       val: atual.metricas.mediaFoco,     max: 5, desc: 'Capacidade de concentração da equipe',   inverso: false },
                    { label: 'Estresse',   val: atual.metricas.mediaStresse,  max: 5, desc: 'Nível de pressão e sobrecarga',         inverso: true  },
                    { label: 'Engajamento',val: atual.engajamento,            max: 100, desc: '% da equipe fazendo check-in semanal', inverso: false, percent: true },
                  ].map(pilar => {
                    const pct = pilar.percent
                      ? pilar.val
                      : pilar.inverso
                        ? ((pilar.max - pilar.val) / pilar.max) * 100
                        : (pilar.val / pilar.max) * 100
                    const cor = pct >= 70 ? '#059669' : pct >= 50 ? '#d97706' : '#dc2626'
                    const valorExibido = pilar.percent ? `${pilar.val}%` : `${pilar.val.toFixed(1)}/5`
                    return (
                      <div key={pilar.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <span className="text-sm font-bold text-gray-800">{pilar.label}</span>
                            <span className="text-xs text-gray-400 ml-2">{pilar.desc}</span>
                          </div>
                          <span className="text-sm font-black" style={{ color: cor }}>{valorExibido}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(pct, 100)}%`, background: cor }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legenda */}
                <div className="mt-4 flex gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Saudável ≥70%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Atenção 50–69%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Crítico &lt;50%</span>
                </div>
              </div>
            )}

            {/* Diagnóstico IA */}
            {atual.diagnostico && (
              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: cfgAtual.borda }}>
                <div className="px-5 py-3 flex items-center gap-2" style={{ background: cfgAtual.bg }}>
                  <span className="text-base">🤖</span>
                  <div className="text-xs font-black uppercase tracking-widest" style={{ color: cfgAtual.cor }}>
                    Diagnóstico da IA — Gemini
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-700 leading-relaxed">{atual.diagnostico}</p>
                </div>
              </div>
            )}

            {/* Histórico 8 semanas */}
            {historico.length > 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="text-sm font-black text-gray-800 mb-4">Histórico — últimas {historico.length} semanas</div>

                {/* Gráfico de barras */}
                <div className="flex items-end gap-2 h-24 mb-3">
                  {[...historico].reverse().map((h, i) => {
                    const altura = Math.round((h.score / 100) * 96)
                    const cfg = NIVEL[h.nivel]
                    const isAtual = i === historico.length - 1
                    return (
                      <div key={h.id} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-black" style={{ color: cfg.cor }}>{h.score}</span>
                        <div className="w-full rounded-t-md transition-all duration-700"
                          style={{ height: `${altura}px`, background: isAtual ? cfg.cor : cfg.cor + '60' }} />
                      </div>
                    )
                  })}
                </div>

                {/* Labels semanas */}
                <div className="flex gap-2">
                  {[...historico].reverse().map((h, i) => (
                    <div key={h.id} className="flex-1 text-center">
                      <div className="text-xs text-gray-400">
                        {i === historico.length - 1 ? 'Esta' : `S-${historico.length - 1 - i}`}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabela resumida */}
                <div className="mt-4 space-y-1.5">
                  {historico.map((h, i) => {
                    const cfg = NIVEL[h.nivel]
                    return (
                      <div key={h.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: i === 0 ? cfg.bg : 'transparent' }}>
                        <span className="text-xs text-gray-400 w-20 flex-shrink-0">
                          {new Date(h.semana + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${h.score}%`, background: cfg.cor }} />
                        </div>
                        <span className="text-xs font-black w-8 text-right" style={{ color: cfg.cor }}>{h.score}</span>
                        <span className="text-xs" style={{ color: TENDENCIA_COR[h.tendencia] }}>
                          {TENDENCIA_ICON[h.tendencia]}
                        </span>
                        <span className="text-xs text-gray-400 w-8">{h.engajamento}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* O que é o ISHO */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="text-sm font-black text-gray-800 mb-3">Como o ISHO é calculado</div>
              <div className="space-y-2 text-xs text-gray-600">
                {[
                  { emoji: '😊', label: 'Humor',      peso: '25%', desc: 'Média do estado emocional da equipe (check-ins semanais)' },
                  { emoji: '⚡', label: 'Energia',    peso: '20%', desc: 'Disposição física e mental coletiva' },
                  { emoji: '🎯', label: 'Foco',       peso: '20%', desc: 'Capacidade de concentração relatada' },
                  { emoji: '😰', label: 'Estresse',   peso: '20%', desc: 'Nível de pressão (invertido — menos estresse = mais saudável)' },
                  { emoji: '📲', label: 'Engajamento',peso: '15%', desc: '% da equipe que fez check-in na semana' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2">
                    <span>{item.emoji}</span>
                    <span className="font-bold text-gray-700 w-20 flex-shrink-0">{item.label} <span className="font-normal text-gray-400">({item.peso})</span></span>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Score calculado toda segunda-feira às 9h com base nos check-ins dos últimos 30 dias.
              </div>
            </div>
          </>
        ) : (
          /* Sem dados ainda */
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
            <div className="text-5xl mb-4">📊</div>
            <div className="text-lg font-black text-gray-800 mb-2">ISHO ainda não calculado</div>
            <div className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
              O ISHO precisa de check-ins emocionais da equipe para ser calculado. Quanto mais colaboradores fizeram check-in, mais preciso fica o índice.
            </div>
            <button
              onClick={calcular}
              disabled={calculando}
              className="bg-purple-600 text-white font-bold px-6 py-3 rounded-xl text-sm disabled:opacity-50"
            >
              {calculando ? '⏳ Calculando...' : '🤖 Calcular ISHO agora'}
            </button>
            <div className="mt-4 text-xs text-gray-400">
              O cálculo automático acontece toda segunda-feira
            </div>
          </div>
        )}

        {/* CTA check-in */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-purple-700 mb-0.5">💡 Melhore o ISHO</div>
            <div className="text-xs text-purple-600">Incentive sua equipe a fazer check-in toda semana</div>
          </div>
          <a href="/sense" className="text-xs font-bold text-purple-600 border border-purple-300 rounded-lg px-3 py-1.5 bg-white">
            Ver equipe →
          </a>
        </div>

      </div>
    </div>
  )
}
