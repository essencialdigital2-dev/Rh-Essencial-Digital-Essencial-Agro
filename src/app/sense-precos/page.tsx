'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SensePrecosPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/empresa/criar') }, [router])
  return (
    <div style={{ minHeight: '100vh', background: '#07070F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(240,240,255,.4)', fontSize: 14 }}>
      Redirecionando...
    </div>
  )
}
