import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { empresa, email, tipo } = await req.json()
    const resend = new Resend(process.env.RESEND_API_KEY!)

    await resend.emails.send({
      from: 'Essencial Sense AI <noreply@essencialestudo.com.br>',
      to: 'essencialdigital2@gmail.com',
      subject: `📋 Solicitação de Laudo ${tipo} — ${empresa}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#08080f;color:#f8f8ff;padding:40px;border-radius:16px;">
          <h2 style="color:#A78BFA;margin:0 0 20px;">📋 Nova Solicitação de Laudo ${tipo}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:rgba(248,248,255,0.5);font-size:13px;">Empresa</td><td style="padding:8px 0;font-weight:700;font-size:13px;">${empresa}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(248,248,255,0.5);font-size:13px;">E-mail</td><td style="padding:8px 0;font-size:13px;">${email}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(248,248,255,0.5);font-size:13px;">Tipo</td><td style="padding:8px 0;font-size:13px;">${tipo}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(248,248,255,0.5);font-size:13px;">Data</td><td style="padding:8px 0;font-size:13px;">${new Date().toLocaleDateString('pt-BR')}</td></tr>
          </table>
          <div style="margin-top:24px;padding:16px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:10px;">
            <p style="margin:0;font-size:13px;color:rgba(248,248,255,0.7);">Acesse o painel admin para gerar o relatório desta empresa e entregar em até 5 dias úteis.</p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ erro: e.message }, { status: 500 })
  }
}
