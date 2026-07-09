import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { colaborador_id } = await req.json()
  if (!colaborador_id) return NextResponse.json({ error: 'colaborador_id obrigatório' }, { status: 400 })

  const { data: col } = await sb
    .from('colaboradores')
    .select('id, nome, email, token_formulario, empresa:empresas(nome)')
    .eq('id', colaborador_id)
    .single()

  if (!col) return NextResponse.json({ error: 'Colaborador não encontrado' }, { status: 404 })
  if (!col.email) return NextResponse.json({ error: 'Colaborador sem e-mail' }, { status: 400 })

  const link = `https://rhessencialdigital.com.br/form/${col.token_formulario}`
  const empresa = (col.empresa as any)?.nome || 'sua empresa'

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Essencial Digital <noreply@rhessencialdigital.com.br>',
    to: [col.email],
    subject: `${col.nome}, seu assessment está pronto — ${empresa}`,
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#06060F;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:560px;margin:0 auto;background:#0d0d1a;border-radius:16px;overflow:hidden}
.header{background:linear-gradient(135deg,#10b981,#0ea5e9);padding:32px;text-align:center}
.header h1{margin:0;color:#fff;font-size:20px;font-weight:900}
.header p{margin:8px 0 0;color:rgba(255,255,255,.8);font-size:13px}
.body{padding:32px;color:rgba(255,255,255,.85)}
.body h2{font-size:17px;font-weight:900;margin:0 0 12px;color:#f0fdf4}
.card{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:12px;padding:18px;margin:16px 0;font-size:13px;line-height:1.7;color:rgba(240,253,244,.7)}
.btn{display:block;width:fit-content;margin:24px auto 0;padding:14px 40px;background:linear-gradient(135deg,#10b981,#0ea5e9);color:#fff;text-decoration:none;border-radius:12px;font-weight:900;font-size:15px}
.footer{padding:20px 32px;border-top:1px solid rgba(255,255,255,.05);text-align:center;font-size:11px;color:rgba(255,255,255,.2)}
</style></head>
<body>
<div style="padding:20px">
<div class="wrap">
  <div class="header">
    <h1>🧠 Assessment HAI</h1>
    <p>Essencial Digital — Gestão de Pessoas com IA</p>
  </div>
  <div class="body">
    <h2>Olá, ${col.nome}!</h2>
    <div class="card">
      <strong>${empresa}</strong> convidou você para responder o <strong>Assessment HAI</strong> — nossa avaliação de perfil comportamental, liderança e bem-estar.<br><br>
      Leva cerca de <strong>10 minutos</strong> e suas respostas ajudam a sua empresa a criar um ambiente de trabalho melhor para todos.
    </div>
    <div class="card">
      ✅ Suas respostas são <strong>confidenciais</strong><br>
      ✅ Não há respostas certas ou erradas<br>
      ✅ Responda com sinceridade
    </div>
    <a href="${link}" class="btn">Responder meu assessment →</a>
  </div>
  <div class="footer">
    © 2026 Essencial Digital · rhessencialdigital.com.br<br>
    Dúvidas? essencialdigital2@gmail.com
  </div>
</div>
</div>
</body></html>`,
  })

  await sb.from('colaboradores').update({ convite_enviado_em: new Date().toISOString() }).eq('id', col.id)

  return NextResponse.json({ ok: true })
}
