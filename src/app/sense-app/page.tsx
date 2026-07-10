'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SenseApp() {
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', '?'))
      const token = params.get('access_token')
      const refresh = params.get('refresh_token')
      if (token && refresh) {
        supabase.auth.setSession({ access_token: token, refresh_token: refresh }).finally(() => {
          window.history.replaceState(null, '', window.location.pathname)
          setPronto(true)
        })
        return
      }
    }
    setPronto(true)
  }, [])

  if (!pronto) return null

  return (
    <iframe
      src="/sense-app.html"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
    />
  )
}
