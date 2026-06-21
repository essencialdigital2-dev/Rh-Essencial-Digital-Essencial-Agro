import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function gerarCodigo(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function POST(req: NextRequest) {
  const { nome, email, setor, porte, plano = 'growth', produto = 'sense' } = await req.json()
  if (!nome || !email) return NextResponse.json({ error: 'Nome e e-mail obrigatórios' }, { status: 400 })

  const client = sb()
  const codigo = gerarCodigo()

  const { data: existente } = await client
    .from('empresas')
    .select('id, codigo_convite, nome')
    .eq('email_owner', email)
    .single()

  if (existente) return NextResponse.json({ ok: true, empresa: existente, jaExistia: true })

  const { data, error } = await client
    .from('empresas')
    .insert({ nome, email_owner: email, setor, porte, plano, codigo_convite: codigo, produto })
    .select('id, codigo_convite, nome')
    .single()

  if (error) {
    // Se coluna não existir, tenta sem colunas opcionais
    const { data: data2, error: err2 } = await client
      .from('empresas')
      .insert({ nome, email_owner: email, plano, codigo_convite: codigo })
      .select('id, codigo_convite, nome')
      .single()
    if (err2) return NextResponse.json({ error: err2.message }, { status: 500 })

    await enviarEmailBoasVindas({ nome, email, codigo, plano })
    return NextResponse.json({ ok: true, empresa: data2 })
  }

  await enviarEmailBoasVindas({ nome, email, codigo, plano })
  return NextResponse.json({ ok: true, empresa: data })
}

async function enviarEmailBoasVindas({ nome, email, codigo, plano }: { nome: string; email: string; codigo: string; plano: string }) {
  if (!process.env.RESEND_API_KEY) return
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rhessencialdigital.com.br'
  const linkConvite = `${appUrl}/convite/${codigo}`
  const planoNomes: Record<string, string> = { starter: 'Starter', growth: 'Growth', scale: 'Scale' }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: 'Sense AI <noreply@essencialestudo.com.br>',
      to: email,
      subject: `${nome}, seu painel Sense AI está pronto!`,
      html: buildEmail({ nome, linkConvite, codigo, plano: planoNomes[plano] || plano }),
    }),
  }).catch(() => {})
}

function buildEmail({ nome, linkConvite, codigo, plano }: { nome: string; linkConvite: string; codigo: string; plano: string }) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
<style>
  body{margin:0;padding:20px;background:#07070F;font-family:-apple-system,sans-serif;}
  .wrap{max-width:560px;margin:0 auto;background:#0E0E1A;border-radius:20px;overflow:hidden;border:1px solid rgba(16,185,129,.15);}
  .hd{background:linear-gradient(135deg,#071a12,#0e1a2e);padding:32px;text-align:center;}
  h1{color:#F0F0FF;margin:8px 0 4px;font-size:22px;}
  .body{padding:28px 32px;}
  p{color:rgba(240,240,255,.65);font-size:14px;line-height:1.6;margin:0 0 16px;}
  .code-box{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:12px;padding:16px;text-align:center;margin:20px 0;}
  .code{font-size:28px;font-weight:900;letter-spacing:.2em;color:#10B981;}
  .btn{display:block;background:linear-gradient(135deg,#10B981,#A855F7);color:#fff;text-decoration:none;padding:14px;border-radius:12px;text-align:center;font-weight:700;font-size:15px;margin:20px 0;}
  .step{display:flex;gap:12px;margin-bottom:14px;align-items:flex-start;}
  .num{width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#10B981,#A855F7);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;flex-shrink:0;}
  .ft{padding:16px 32px;border-top:1px solid rgba(255,255,255,.05);text-align:center;font-size:11px;color:rgba(240,240,255,.25);}
</style></head>
<body><div class="wrap">
  <div class="hd">
    <div style="font-size:36px;">🧠</div>
    <h1>Bem-vinda ao Sense AI, ${nome}!</h1>
    <p style="color:rgba(240,240,255,.6);font-size:13px;margin:0;">Plano ${plano} — 7 dias gratuitos</p>
  </div>
  <div class="body">
    <p>Seu painel de saúde organizacional está pronto. A IA já está configurada para monitorar bem-estar, burnout e performance da sua equipe.</p>
    <div class="code-box">
      <div style="font-size:11px;color:#10B981;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Código de convite — compartilhe com o time</div>
      <div class="code">${codigo}</div>
    </div>
    <div class="step"><div class="num">1</div><div><strong style="color:#F0F0FF;">Acesse seu painel</strong><br><span style="font-size:12px;color:rgba(240,240,255,.45);">Visualize o dashboard em tempo real</span></div></div>
    <div class="step"><div class="num">2</div><div><strong style="color:#F0F0FF;">Convide sua equipe</strong><br><span style="font-size:12px;color:rgba(240,240,255,.45);">Compartilhe o código acima com os colaboradores</span></div></div>
    <div class="step"><div class="num">3</div><div><strong style="color:#F0F0FF;">IA começa a trabalhar</strong><br><span style="font-size:12px;color:rgba(240,240,255,.45);">Check-ins diários + ISHO semanal automático</span></div></div>
    <a href="${linkConvite}" class="btn">Acessar painel do gestor →</a>
    <p style="font-size:12px;">Link de convite para o time:<br><span style="color:#10B981;">${linkConvite}</span></p>
  </div>
  <div class="ft">Sense AI · Essencial Digital · essencialestudo.com.br</div>
</div></body></html>`
}
