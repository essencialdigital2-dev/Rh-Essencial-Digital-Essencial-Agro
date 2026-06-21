'use client'
import { useEffect, useState } from 'react'

type ISHOData = {
  score: number
  nivel: 'saudavel' | 'atencao' | 'critico'
  tendencia: 'subindo' | 'estavel' | 'caindo'
  engajamento: number
  diagnostico: string
  semana: string
  metricas?: {
    mediaHumor: number
    mediaEnergia: number
    mediaFoco: number
    mediaStresse: number
    colabsAtivos: number
    totalColabsCount: number
  }
}

const NIVEL_CONFIG = {
  saudavel: { cor: '#059669', bg: '#F0FDF4', borda: '#BBF7D0', label: 'Saudável', emoji: '🟢' },
  atencao:  { cor: '#d97706', bg: '#FFFBEB', borda: '#FDE68A', label: 'Atenção',  emoji: '🟡' },
  critico:  { cor: '#dc2626', bg: '#FEF2F2', borda: '#FECACA', label: 'Crítico',  emoji: '🔴' },
}

const TENDENCIA_ICON = { subindo: '↑', estavel: '→', caindo: '↓' }
const TENDENCIA_COR  = { subindo: '#059669', estavel: '#d97706', caindo: '#dc2626' }

export default function CardISHO({ empresaId }: { empresaId: string }) {
  const [isho, setIsho] = useState<ISHOData | null>(null)
  const [calculando, setCalculando] = useState(false)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => { carregar() }, [empresaId])

  async function carregar() {
    setCarregando(true)
    try {
      const res = await fetch(`/api/isho?empresa_id=${empresaId}`)
      const data = await res.json()
      if (data.historico?.[0]) setIsho(data.historico[0])
      else await calcular()
    } catch {}
    setCarregando(false)
  }

  async function calcular() {
    setCalculando(true)
    try {
      const res = await fetch('/api/isho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ empresa_id: empresaId }),
      })
      const data = await res.json()
      if (data.ok) setIsho(data)
    } catch {}
    setCalculando(false)
    setCarregando(false)
  }

  if (carregando) return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
      <div className="h-16 bg-gray-100 rounded" />
    </div>
  )

  const nivel = isho?.nivel || 'atencao'
  const cfg = NIVEL_CONFIG[nivel]
  const score = isho?.score ?? 0
  const circunf = 2 * Math.PI * 36
  const progresso = circunf - (score / 100) * circunf

  return (
    <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: cfg.borda }}>
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: cfg.bg }}>
        <div>
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: cfg.cor }}>
            ISHO · Índice de Saúde Humana Organizacional
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Saúde coletiva da sua equipe esta semana</div>
        </div>
        <button
          onClick={calcular}
          disabled={calculando}
          className="text-xs font-bold border rounded-lg px-3 py-1.5 bg-white transition disabled:opacity-50"
          style={{ color: cfg.cor, borderColor: cfg.cor + '40' }}
        >
          {calculando ? '⏳' : '↻'}
        </button>
      </div>

      <div className="bg-white p-5">
        {calculando ? (
          <div className="py-4 text-center space-y-2">
            <div className="text-2xl animate-pulse">🏢</div>
            <div className="text-sm text-gray-500 animate-pulse">Calculando saúde organizacional...</div>
          </div>
        ) : isho ? (
          <div className="space-y-4">
            {/* Score + métricas */}
            <div className="flex gap-4 items-center">
              {/* Círculo ISHO */}
              <div className="flex-shrink-0 relative w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#e5e7eb" strokeWidth="7" />
                  <circle cx="40" cy="40" r="36" fill="none"
                    stroke={cfg.cor} strokeWidth="7"
                    strokeDasharray={circunf} strokeDashoffset={progresso}
                    strokeLinecap="round" transform="rotate(-90 40 40)"
                    style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black" style={{ color: cfg.cor }}>{score}</span>
                  <span className="text-xs text-gray-400">/100</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {/* Nível + tendência */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.cor }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: TENDENCIA_COR[isho.tendencia] }}>
                    {TENDENCIA_ICON[isho.tendencia]} {isho.tendencia}
                  </span>
                </div>

                {/* Engajamento */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">Engajamento da equipe</span>
                    <span className="font-bold" style={{ color: cfg.cor }}>{isho.engajamento}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${isho.engajamento}%`, background: cfg.cor }} />
                  </div>
                </div>

                {/* Métricas rápidas */}
                {isho.metricas && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Humor', val: isho.metricas.mediaHumor },
                      { label: 'Energia', val: isho.metricas.mediaEnergia },
                      { label: 'Foco', val: isho.metricas.mediaFoco },
                      { label: 'Estresse', val: isho.metricas.mediaStresse, inverso: true },
                    ].map(m => {
                      const pct = m.inverso ? ((5 - m.val) / 5) * 100 : (m.val / 5) * 100
                      const cor = pct >= 70 ? '#059669' : pct >= 50 ? '#d97706' : '#dc2626'
                      return (
                        <div key={m.label} className="text-center bg-gray-50 rounded-lg p-1.5">
                          <div className="text-xs font-black" style={{ color: cor }}>{m.val.toFixed(1)}</div>
                          <div className="text-xs text-gray-400">{m.label}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Diagnóstico IA */}
            {isho.diagnostico && (
              <div className="rounded-xl p-3 border" style={{ background: cfg.bg, borderColor: cfg.borda }}>
                <div className="text-xs font-black mb-1" style={{ color: cfg.cor }}>🤖 Diagnóstico da IA</div>
                <p className="text-sm text-gray-700 leading-relaxed">{isho.diagnostico}</p>
              </div>
            )}

            {isho.semana && (
              <div className="text-xs text-gray-400 text-right">
                Semana de {new Date(isho.semana).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="text-3xl">🏢</div>
            <div className="text-sm text-gray-500">Calcule o ISHO da sua empresa</div>
            <button
              onClick={calcular}
              className="bg-purple-600 text-white font-bold px-5 py-2 rounded-xl text-sm"
            >
              Calcular ISHO
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
