import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = new Resend(process.env.RESEND_API_KEY!)
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ erro: 'E-mail obrigatório' }, { status: 400 })

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: 'https://rhessencialdigital.com.br/sense-app' }
    })

    if (error || !data?.properties?.action_link) {
      return NextResponse.json({ erro: 'Não foi possível gerar o link. Verifique o e-mail.' }, { status: 400 })
    }

    const link = data.properties.action_link

    await resend.emails.send({
      from: 'Essencial Sense AI <noreply@essencialestudo.com.br>',
      to: email,
      subject: 'Seu link de acesso — Essencial Sense AI',
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#08080f;color:#f8f8ff;padding:40px;border-radius:16px;">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#ec4899);padding:2px;border-radius:12px;">
              <div style="background:#08080f;padding:12px 24px;border-radius:10px;">
                <span style="font-size:13px;font-weight:700;letter-spacing:2px;color:#c4b5fd;">ESSENCIAL SENSE AI</span>
              </div>
            </div>
          </div>
          <h2 style="font-size:22px;font-weight:800;margin:0 0 12px;color:#f8f8ff;">Seu link de acesso chegou ✨</h2>
          <p style="color:rgba(248,248,255,0.6);font-size:14px;line-height:1.6;margin:0 0 28px;">
            Clique no botão abaixo para entrar na plataforma. O link é válido por <strong style="color:#c4b5fd;">1 hora</strong>.
          </p>
          <a href="${link}" style="display:block;text-align:center;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-weight:700;font-size:15px;padding:14px 24px;border-radius:10px;text-decoration:none;margin-bottom:24px;">
            Entrar na plataforma →
          </a>
          <p style="color:rgba(248,248,255,0.3);font-size:12px;text-align:center;margin:0;">
            Se você não solicitou este acesso, ignore este e-mail.
          </p>
        </div>
      `
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ erro: e.message }, { status: 500 })
  }
}
