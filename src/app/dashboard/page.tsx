'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import PainelRiscoEquipe from '@/components/PainelRiscoEquipe'
import CardISHO from '@/components/CardISHO'
import IndicesHAIPanel from '@/components/IndicesHAIPanel'

export default function DashboardGestor() {
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    setEmpresaId('admin')
    setNomeEmpresa('Painel Administrativo')
    setCarregando(false)
  }, [])

  if (carregando) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 text-sm animate-pulse">Carregando dashboard...</div>
    </div>
  )

  if (!empresaId) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🔒</div>
        <div className="text-gray-600 font-medium">Acesso restrito a gestores</div>
        <a href="/sense-login" className="mt-4 inline-block text-purple-600 font-bold text-sm">
          Fazer login →
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-purple-500 uppercase tracking-widest">Essencial Sense AI</div>
          <div className="text-lg font-black text-gray-900">{nomeEmpresa || 'Dashboard do Gestor'}</div>
        </div>
        <a href="/sense" className="text-xs text-gray-400 hover:text-gray-600 transition">
          ← Voltar
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* ISHO - saúde da empresa */}
        <CardISHO empresaId={empresaId} />

        {/* Painel de risco por pessoa */}
        <PainelRiscoEquipe empresaId={empresaId} />

        {/* Índices HAI */}
        <IndicesHAIPanel />

        {/* Info */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <div className="text-xs font-bold text-purple-700 mb-1">💡 Como funciona</div>
          <div className="text-sm text-purple-800 leading-relaxed">
            Os scores são calculados automáticamente toda segunda-feira com base nos check-ins emocionais da equipe.
            A IA analisa humor, energia, foco e estresse - e gera uma recomendação específica para cada pessoa.
          </div>
        </div>
      </div>
    </div>
  )
}
