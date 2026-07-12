'use client'
import { usePathname } from 'next/navigation'

const ITENS = [
  { href: '/ecossistema', label: '🌐 Visão Geral' },
  { href: '/ecossistema/clientes', label: '🗂 Clientes' },
  { href: '/ecossistema/metricas', label: '📊 Métricas' },
  { href: '/ecossistema/preditivo', label: '🔮 Radar Preditivo' },
  { href: '/ecossistema/radar', label: '📡 Radar de Inovação' },
  { href: '/ecossistema/leads', label: '🎯 Leads Qualificados' },
  { href: '/ecossistema/prospeccao', label: '✨ Prospecção IA' },
  { href: '/ecossistema/erros', label: '🚨 Radar de Erros' },
  { href: '/ecossistema/financeiro', label: '💰 Financeiro' },
]

export default function EcoNav() {
  const path = usePathname()
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {ITENS.map(item => {
        const ativo = path === item.href
        return (
          <a key={item.href} href={item.href} style={{
            padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none',
            border: `1px solid ${ativo ? 'rgba(139,92,246,.5)' : 'rgba(255,255,255,.08)'}`,
            background: ativo ? 'rgba(139,92,246,.15)' : 'transparent',
            color: ativo ? '#A78BFA' : 'rgba(248,248,255,.5)',
          }}>{item.label}</a>
        )
      })}
    </div>
  )
}
