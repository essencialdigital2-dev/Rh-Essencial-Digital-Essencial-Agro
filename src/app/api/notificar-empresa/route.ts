import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { colaborador_id, empresa_id } = await req.json()
  if (!colaborador_id || !empresa_id) return NextResponse.json({ error: 'dados insuficientes' }, { status: 400 })

  const [{ data: col }, { data: empresa }] = await Promise.all([
    sb.from('colaboradores').select('nome, cargo').eq('id', colaborador_id).single(),
    sb.from('empresas').select('nome, email, responsavel').eq('id', empresa_id).single(),
  ])

  if (!empresa?.email) return NextResponse.json({ ok: true })

  const portalLink = `https://rhessencialdigital.com.br/cliente`

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'Essencial Digital <noreply@rhessencialdigital.com.br>',
    to: [empresa.email],
    subject: `Assessment concluído: ${col?.nome} — ${empresa.nome}`,
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#06060F;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:540px;margin:0 auto;background:#0d0d1a;border-radius:16px;overflow:hidden}
.header{background:linear-gradient(135deg,#7C3AED,#A78BFA);padding:28px;text-align:center}
.header h1{margin:0;color:#fff;font-size:18px;font-weight:900}
.body{padding:28px;color:rgba(255,255,255,.85)}
.badge{display:inline-block;background:rgba(52,211,153,.15);border:1px solid rgba(52,211,153,.3);border-radius:8px;padding:4px 12px;font-size:12px;font-weight:700;color:#34d399;margin-bottom:16px}
.card{background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.2);border-radius:12px;padding:18px;margin:12px 0;font-size:13px;line-height:1.7;color:rgba(240,253,244,.7)}
.btn{display:block;width:fit-content;margin:20px auto 0;padding:13px 36px;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;text-decoration:none;border-radius:12px;font-weight:900;font-size:14px}
.footer{padding:18px 28px;border-top:1px solid rgba(255,255,255,.05);text-align:center;font-size:11px;color:rgba(255,255,255,.2)}
</style></head>
<body>
<div style="padding:20px">
<div class="wrap">
  <div class="header">
    <h1>✅ Assessment Concluído</h1>
  </div>
  <div class="body">
    <div class="badge">NOVO ASSESSMENT</div>
    <p style="font-size:15px;font-weight:900;color:#f0fdf4;margin:0 0 8px">
      ${col?.nome} completou o assessment!
    </p>
    <div class="card">
      <strong>Colaborador:</strong> ${col?.nome}<br>
      <strong>Cargo:</strong> ${col?.cargo || 'não informado'}<br>
      <strong>Empresa:</strong> ${empresa.nome}<br><br>
      A devolutiva e os índices HAI já estão disponíveis no portal. A IA gerou a análise completa do perfil.
    </div>
    <a href="${portalLink}" class="btn">Ver no Portal →</a>
  </div>
  <div class="footer">© 2026 Essencial Digital · rhessencialdigital.com.br</div>
</div>
</div>
</body></html>`,
  })

  return NextResponse.json({ ok: true })
}
