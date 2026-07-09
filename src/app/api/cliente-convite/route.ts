import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { empresa_id } = await req.json()
  if (!empresa_id) return NextResponse.json({ error: 'empresa_id obrigatório.' }, { status: 400 })

  const { data: empresa, error } = await sb
    .from('empresas')
    .select('id, nome, email, responsavel')
    .eq('id', empresa_id)
    .single()

  if (error || !empresa) return NextResponse.json({ error: 'Empresa não encontrada.' }, { status: 404 })
  if (!empresa.email) return NextResponse.json({ error: 'Empresa sem e-mail cadastrado.' }, { status: 400 })

  const token = crypto.randomBytes(32).toString('hex')
  const expira = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  await sb.from('empresas').update({ token_acesso: token, token_expira: expira }).eq('id', empresa_id)

  const link = `https://rhessencialdigital.com.br/cliente/criar-senha?token=${token}`

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Essencial Digital <noreply@rhessencialdigital.com.br>',
    to: [empresa.email],
    subject: `Seu acesso ao Portal Essencial Digital — ${empresa.nome}`,
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#06060F;font-family:'Segoe UI',Arial,sans-serif;color:#f0fdf4}
.wrap{max-width:560px;margin:0 auto;background:#0a0f0a;border-radius:16px;overflow:hidden}
.header{background:linear-gradient(135deg,#7C3AED,#A78BFA);padding:36px;text-align:center}
.header h1{margin:0;color:#fff;font-size:22px;font-weight:900}
.header p{margin:8px 0 0;color:rgba(255,255,255,.75);font-size:13px}
.body{padding:36px}
.body h2{color:#A78BFA;font-size:17px;margin:0 0 16px}
.card{background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2);border-radius:12px;padding:20px;margin:16px 0;font-size:14px;color:rgba(240,253,244,.7);line-height:1.7}
.btn{display:block;width:fit-content;margin:28px auto 0;padding:15px 40px;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;text-decoration:none;border-radius:12px;font-weight:900;font-size:15px;text-align:center}
.footer{padding:20px 36px;border-top:1px solid rgba(255,255,255,.05);text-align:center;font-size:11px;color:rgba(240,253,244,.25)}
</style></head>
<body>
<div style="padding:24px">
<div class="wrap">
  <div class="header">
    <h1>Essencial Digital</h1>
    <p>Gestão de Pessoas com Inteligência Artificial</p>
  </div>
  <div class="body">
    <h2>Olá, ${empresa.responsavel || empresa.nome}!</h2>
    <div class="card">
      Seu acesso ao <strong>Portal do Cliente Essencial Digital</strong> foi criado.<br><br>
      Clique no botão abaixo para definir sua senha e acessar o portal com os dados da sua equipe, assessments e relatórios gerados pela IA.
    </div>
    <div class="card">
      <strong>Este link expira em 48 horas.</strong><br>
      Se expirar, entre em contato com a equipe Essencial Digital.
    </div>
    <a href="${link}" class="btn">Criar minha senha →</a>
  </div>
  <div class="footer">
    © 2026 Essencial Digital · rhessencialdigital.com.br<br>
    Dúvidas? essencialdigital2@gmail.com
  </div>
</div>
</div>
</body></html>`
  })

  return NextResponse.json({ ok: true })
}
