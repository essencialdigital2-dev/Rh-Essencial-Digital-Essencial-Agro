'use client'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AcessoAdmin() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/minha-conta'
      }
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center', color: 'rgba(248,248,255,.4)', fontSize: 14 }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🧠</div>
        <p>Verificando sessão...</p>
        <p style={{ fontSize: 12, marginTop: 8 }}>
          Se não redirecionar, <a href="/sense-login" style={{ color: '#A78BFA' }}>clique aqui</a>
        </p>
      </div>
    </div>
  )
}
