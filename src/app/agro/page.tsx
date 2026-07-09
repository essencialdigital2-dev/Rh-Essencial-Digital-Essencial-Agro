'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const MODULOS = [
  { href: '/agro/nr31', icon: '🛡️', titulo: 'NR-31 Compliance', desc: 'Checklist de conformidade com norma do trabalho rural + análise IA', cor: '#dc2626', bg: '#fef2f2', brd: '#fecaca', badge: 'Crítico' },
  { href: '/agro/esg', icon: '📈', titulo: 'Dashboard ESG', desc: 'Indicadores de sustentabilidade, diversidade e governança com score IA', cor: '#14532d', bg: '#f0fdf4', brd: '#bbf7d0', badge: 'Novo' },
  { href: '/agro/sazonalidade', icon: '🔁', titulo: 'Gestão da Sazonalidade', desc: 'Planejamento de equipe por ciclo da safra com previsão inteligente', cor: '#854d0e', bg: '#fefce8', brd: '#fef08a', badge: 'IA' },
  { href: '/agro/saude-mental', icon: '💊', titulo: 'Saúde Mental no Campo', desc: 'Diagnóstico de risco psicossocial específico para equipes rurais', cor: '#6d28d9', bg: '#f5f3ff', brd: '#ddd6fe', badge: 'IA' },
  { href: '/agro/clima', icon: '🌦️', titulo: 'Clima & Bem-estar', desc: 'Impacto climático na equipe e protocolo de segurança gerado por IA', cor: '#0369a1', bg: '#eff6ff', brd: '#bfdbfe', badge: 'IA' },
  { href: '/agro/carbono', icon: '🌿', titulo: 'Crédito de Carbono', desc: 'Potencial de crédito de carbono e acesso a financiamentos verdes', cor: '#065f46', bg: '#ecfdf5', brd: '#a7f3d0', badge: 'Novo' },
]

const DIAGNOSTICOS = [
  { icon: '🌾', nome: 'Essencial Agro', desc: 'Diagnóstico completo para equipes rurais' },
  { icon: '🧠', nome: 'Psicossocial NR-1', desc: 'Riscos psicossociais adaptados ao campo' },
  { icon: '❤️', nome: 'Clima Organizacional', desc: 'Satisfação e engajamento no agro' },
  { icon: '👤', nome: 'DISC Comportamental', desc: 'Perfil comportamental dos colaboradores' },
]

export default function AgroPage() {
  const [empresasAgro, setEmpresasAgro] = useState<any[]>([])
  const [respostasAgro, setRespostasAgro] = useState<any[]>([])

  useEffect(() => {
    supabase.from('empresas').select('*').eq('segmento', 'Agro').order('nome').then(({ data }) => setEmpresasAgro(data || []))
    supabase.from('respostas').select('*, colaborador:colaboradores(nome), empresa:empresas(nome)')
      .eq('formulario_id', 5).eq('concluido', true).order('created_at', { ascending: false })
      .then(({ data }) => setRespostasAgro(data || []))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🌾</span>
          <h1 className="text-2xl font-bold text-gray-800">Essencial Agro</h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">Gestão de pessoas para o agronegócio — com IA no centro</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl mb-1">🏢</div>
          <div className="text-2xl font-bold text-gray-800">{empresasAgro.length}</div>
          <div className="text-xs text-gray-500">Empresas do Agro</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-2xl font-bold text-gray-800">{respostasAgro.length}</div>
          <div className="text-xs text-gray-500">Diagnósticos realizados</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl mb-1">🤖</div>
          <div className="text-2xl font-bold text-gray-800">6</div>
          <div className="text-xs text-gray-500">Módulos com IA</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-gray-800 mb-3">Módulos Agro</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODULOS.map(m => (
            <Link key={m.href} href={m.href}
              className="card hover:shadow-md transition-all group"
              style={{ background: m.bg, border: `1.5px solid ${m.brd}`, textDecoration: 'none' }}>
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-800">{m.titulo}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: m.cor, color: '#fff' }}>{m.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500">{m.desc}</p>
                </div>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-1">Novo Diagnóstico</h2>
          <p className="text-sm text-gray-500 mb-3">Avalie clima, liderança e bem-estar de equipes rurais.</p>
          <Link href="/formularios" className="btn btn-primary text-sm">Enviar Diagnóstico</Link>
        </div>
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-1">Empresas do Agro</h2>
          <p className="text-sm text-gray-500 mb-3">Gerencie suas empresas com segmento Agro.</p>
          <Link href="/empresas" className="btn btn-outline text-sm">Ver Empresas</Link>
        </div>
      </div>

      {respostasAgro.length > 0 && (
        <div className="card mb-4">
          <h2 className="font-bold text-gray-800 mb-4">Últimos Diagnósticos Agro</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="pb-2">Colaborador</th><th className="pb-2">Empresa</th><th className="pb-2">Data</th><th className="pb-2"></th>
            </tr></thead>
            <tbody>
              {respostasAgro.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-medium">{r.colaborador?.nome}</td>
                  <td className="py-3 text-gray-500">{r.empresa?.nome}</td>
                  <td className="py-3 text-gray-400 text-xs">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3 text-right">
                    <Link href={`/relatorios/${r.id}`} className="text-oliva hover:underline text-xs">Ver Devolutiva</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card bg-bege border-dourado/20">
        <h2 className="font-bold text-gray-800 mb-3">🌿 Diagnósticos disponíveis para o Agro</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {DIAGNOSTICOS.map(({ icon, nome, desc }) => (
            <div key={nome} className="flex gap-3 items-start">
              <span className="text-2xl">{icon}</span>
              <div><div className="font-medium text-gray-700">{nome}</div><div className="text-xs text-gray-500">{desc}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
