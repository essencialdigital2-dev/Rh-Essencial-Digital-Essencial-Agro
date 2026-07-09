'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import clsx from 'clsx'

const menu = [
  { href: '/painel', icon: '🌐', label: 'Painel Unificado' },
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/metodologia-hai', icon: '🌟', label: 'Método HAI' },
  { href: '/empresas', icon: '🏢', label: 'Empresas' },
  { href: '/colaboradores', icon: '👥', label: 'Colaboradores' },
  { href: '/formularios', icon: '📋', label: 'Diagnósticos' },
  { href: '/relatorios', icon: '📄', label: 'Relatórios' },
  { href: '/leads', icon: '🎯', label: 'Leads' },
  { href: '/esg-social', icon: '🌱', label: 'ESG Social' },
  { href: '/financeiro', icon: '💰', label: 'Financeiro' },
  { href: '/agro', icon: '🌾', label: 'Essencial Agro' },
]

export default function Sidebar() {
  const path = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [licencaBloqueada, setLicencaBloqueada] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: profile } = await supabase.from('profiles').select('empresa_id').eq('id', data.user.id).single()
      if (!profile?.empresa_id) return
      try {
        const res = await fetch('/api/licenca/verificar', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empresa_id: profile.empresa_id }),
        })
        const d = await res.json()
        if (d.bloqueado) setLicencaBloqueada(true)
      } catch {}
    })
  }, [])

  async function sair() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-oliva-light/30 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">🧠 Essencial<br/>
            <span className="text-dourado-light">Sense AI</span>
          </h1>
          <p className="text-white/60 text-xs mt-1">Painel Gestor</p>
          <div style={{ marginTop: 8, padding: '3px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'inline-block' }}>
            <span style={{ fontSize: 8, fontWeight: 800, color: '#10b981', letterSpacing: 1, textTransform: 'uppercase' }}>Método Essencial HAI</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 8, color: 'rgba(240,253,244,0.2)', lineHeight: 1.5 }}>
            A IA reconhece padrões.<br />
            <span style={{ color: 'rgba(16,185,129,0.5)', fontWeight: 700 }}>O HAI ensina líderes a reconhecer pessoas.</span>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden text-white/60 text-xl leading-none p-1">✕</button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menu.map(item => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
              path.startsWith(item.href)
                ? 'bg-white/15 text-white font-medium'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        {/* NexoPerform HAI */}
        <div style={{ marginTop: 12, marginBottom: 4, paddingLeft: 4 }}>
          <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(16,185,129,0.5)', textTransform: 'uppercase', letterSpacing: 1.5 }}>NexoPerform HAI</div>
        </div>
        <Link href="/dashboard/nexoperform" onClick={() => setOpen(false)}
          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all', path === '/dashboard/nexoperform' ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
          <span>🎯</span><span>Hub de Assessments</span>
        </Link>
        <Link href="/dashboard/nexoperform/disc" onClick={() => setOpen(false)}
          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all', path.startsWith('/dashboard/nexoperform/disc') ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
          <span>🎭</span><span>DISC HAI</span>
        </Link>
        <Link href="/dashboard/nexoperform/lideranca" onClick={() => setOpen(false)}
          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all', path.startsWith('/dashboard/nexoperform/lideranca') ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
          <span>🧭</span><span>IHAL™ Liderança Adaptativa</span>
        </Link>
        <Link href="/dashboard/nexoperform/inteligencia" onClick={() => setOpen(false)}
          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all', path.startsWith('/dashboard/nexoperform/inteligencia') ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
          <span>💡</span><span>Inteligência Adaptativa</span>
        </Link>
        <Link href="/dashboard/nexoperform/bemestar" onClick={() => setOpen(false)}
          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all', path.startsWith('/dashboard/nexoperform/bemestar') ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
          <span>💚</span><span>Bem-Estar Relacional</span>
        </Link>
        <Link href="/dashboard/nexoperform/fitcultural" onClick={() => setOpen(false)}
          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all', path.startsWith('/dashboard/nexoperform/fitcultural') ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
          <span>🌐</span><span>Fit Cultural</span>
        </Link>
        <Link href="/dashboard/nexoperform/humanscore" onClick={() => setOpen(false)}
          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all', path.startsWith('/dashboard/nexoperform/humanscore') ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
          <span>🌟</span><span>Human Score HAI</span>
        </Link>
        <Link href="/dashboard/nexoperform/relatorio" onClick={() => setOpen(false)}
          className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all', path.startsWith('/dashboard/nexoperform/relatorio') ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:bg-white/10 hover:text-white')}>
          <span>📄</span><span>Relatório Completo</span>
        </Link>
      </nav>

      <div className="p-3 border-t border-oliva-light/30">
        <button onClick={sair}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white w-full transition-all">
          <span>🚪</span><span>Sair</span>
        </button>
      </div>
    </>
  )

  if (licencaBloqueada) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#07070F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12, padding: 24 }}>
        <div style={{ fontSize: 40 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Módulo Sense AI não liberado</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 380 }}>Sua empresa ainda não tem este módulo ativo. Fale com a Essencial Digital para liberar o acesso.</div>
      </div>
    )
  }

  return (
    <>
      {/* Barra mobile topo */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-oliva flex items-center justify-between px-4 py-3 border-b border-oliva-light/30">
        <h1 className="text-white font-bold text-sm leading-tight">🧠 Essencial<br/>
          <span className="text-dourado-light text-xs">Sense AI</span>
        </h1>
        <button onClick={() => setOpen(true)} className="text-white p-1 text-2xl leading-none">☰</button>
      </div>

      {/* Overlay mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <aside className="w-64 bg-oliva flex flex-col h-full shadow-2xl">{sidebarContent}</aside>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 bg-oliva flex-col z-40">
        {sidebarContent}
      </aside>
    </>
  )
}
