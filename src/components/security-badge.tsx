'use client'
import { useState } from 'react'

export default function SecurityBadge() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 8000 }}>
      {open && (
        <div style={{
          background: '#0D1117', border: '1px solid rgba(16,185,129,.25)',
          borderRadius: 14, padding: '14px 16px', marginBottom: 10, width: 240,
          boxShadow: '0 8px 32px rgba(0,0,0,.5)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#10B981', marginBottom: 10 }}>🔒 App Seguro</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              '✅ Conexão criptografada (HTTPS)',
              '✅ Dados protegidos no Supabase',
              '✅ Autenticação segura por sessão',
              '✅ Headers de proteção ativos',
              '✅ Rate limiting nas APIs de IA',
              '✅ Acesso restrito por perfil',
              '✅ Conforme LGPD',
            ].map(item => (
              <div key={item} style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{item}</div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,.25)' }}>
            Essencial Digital · CNPJ 58.062.495/0001-63
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: open ? 'rgba(16,185,129,.12)' : 'rgba(13,17,23,.95)',
          border: '1px solid rgba(16,185,129,.3)',
          borderRadius: 20, padding: '6px 12px', cursor: 'pointer',
          boxShadow: '0 2px 12px rgba(0,0,0,.3)',
        }}
        title="Informações de segurança"
      >
        <span style={{ fontSize: 13 }}>🔒</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>App Seguro</span>
      </button>
    </div>
  )
}
