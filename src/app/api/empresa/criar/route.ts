import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()
  const { nome, email, empresa, telefone, setor, porte, mensagem } = body

  await sb.from('sense_leads').insert({
    contato: nome, email, empresa,
    telefone: telefone || '',
    setor: setor || '', porte: porte || '',
    mensagem: mensagem || '',
    estagio: 'Prospecção', origem: 'Landing Page', valor: 0,
  }).then(({ error }) => { if (error) console.error('Lead save error:', error.message) })

  try {
    const RESEND_KEY = process.env.RESEND_API_KEY
    if (RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Sense AI <noreply@rhessencialdigital.com.br>',
          to: ['essencialdigital2@gmail.com'],
          subject: `🎯 Novo lead: ${empresa}`,
          html: `<h2>Novo lead pelo Sense AI</h2><p><b>Empresa:</b> ${empresa}</p><p><b>Contato:</b> ${nome}</p><p><b>Email:</b> ${email}</p><p><b>Telefone:</b> ${telefone||'—'}</p><p><b>Setor:</b> ${setor||'—'}</p>`,
        }),
      })
    }
  } catch(e) { console.error('Email error:', e) }

  return NextResponse.json({ ok: true })
}
