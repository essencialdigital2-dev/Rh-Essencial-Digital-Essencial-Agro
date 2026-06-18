import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Essencial Sense AI <noreply@rhessencialdigital.com.br>';

function htmlBase(titulo: string, corpo: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#08080F;font-family:'Segoe UI',Arial,sans-serif;color:#e2e8f0}
  .wrap{max-width:600px;margin:0 auto;background:#0f0f1a;border-radius:12px;overflow:hidden}
  .header{background:linear-gradient(135deg,#8B5CF6,#EC4899);padding:32px;text-align:center}
  .header h1{margin:0;color:#fff;font-size:22px;letter-spacing:1px}
  .header p{margin:6px 0 0;color:rgba(255,255,255,.8);font-size:13px}
  .body{padding:32px}
  .body h2{color:#8B5CF6;font-size:18px;margin:0 0 16px}
  .card{background:#1a1a2e;border:1px solid rgba(139,92,246,.3);border-radius:8px;padding:20px;margin:16px 0}
  .card h3{color:#06B6D4;font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.5px}
  .card p{margin:0;font-size:14px;line-height:1.6;color:#94a3b8}
  .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
  .badge-D{background:rgba(239,68,68,.2);color:#ef4444}
  .badge-I{background:rgba(234,179,8,.2);color:#eab308}
  .badge-S{background:rgba(34,197,94,.2);color:#22c55e}
  .badge-C{background:rgba(59,130,246,.2);color:#3b82f6}
  .badge-alerta{background:rgba(239,68,68,.2);color:#ef4444}
  .badge-ok{background:rgba(34,197,94,.2);color:#22c55e}
  .btn{display:block;width:fit-content;margin:24px auto 0;padding:14px 32px;background:linear-gradient(135deg,#8B5CF6,#EC4899);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;text-align:center}
  .footer{padding:20px 32px;border-top:1px solid rgba(255,255,255,.05);text-align:center;font-size:11px;color:#475569}
</style>
</head>
<body>
<div style="padding:20px">
<div class="wrap">
  <div class="header">
    <h1>✦ Essencial Sense AI™</h1>
    <p>Inteligência em Saúde Mental e RH</p>
  </div>
  <div class="body">
    <h2>${titulo}</h2>
    ${corpo}
    <a href="https://rhessencialdigital.com.br/sense-app" class="btn">Acessar o Painel Sense →</a>
  </div>
  <div class="footer">
    © 2026 Alana Carvalho · CNPJ 58.062.495/0001-63<br>
    rhessencialdigital.com.br · Todos os direitos reservados
  </div>
</div>
</div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, to, nome, dados } = body;

    if (!tipo || !to) {
      return NextResponse.json({ error: 'tipo e to são obrigatórios' }, { status: 400 });
    }

    let subject = '';
    let html = '';

    if (tipo === 'boas_vindas') {
      subject = 'Bem-vindo ao Essencial Sense AI™ 🚀';
      html = htmlBase('Seja bem-vindo, ' + (nome || 'colaborador') + '!', `
        <div class="card">
          <h3>Sua conta foi criada com sucesso</h3>
          <p>A plataforma de saúde mental e RH mais completa do Brasil está pronta para transformar a gestão de pessoas da sua empresa.</p>
        </div>
        <div class="card">
          <h3>O que você pode fazer agora</h3>
          <p>• <strong>Sense Health</strong> — Check-in emocional diário<br>
             • <strong>Sense DISC</strong> — Mapeamento de perfil comportamental<br>
             • <strong>Sense Neuro</strong> — Diagnóstico de saúde mental<br>
             • <strong>Sense NR-1</strong> — Conformidade com riscos psicossociais<br>
             • <strong>Sense Feedback 360°</strong> — Avaliação de competências<br>
             • <strong>Sense Inspire™</strong> — Mensagens que fortalecem pessoas</p>
        </div>
      `);

    } else if (tipo === 'disc') {
      const perfil = dados?.perfil || '—';
      const desc: Record<string, string> = {
        D: 'Dominância — Direto, decisivo, orientado a resultados e desafios.',
        I: 'Influência — Comunicativo, entusiasta, otimista e persuasivo.',
        S: 'Estabilidade — Paciente, confiável, colaborativo e consistente.',
        C: 'Conformidade — Analítico, preciso, sistemático e criterioso.',
      };
      subject = `Seu perfil DISC: ${perfil} — ${nome || ''}`;
      html = htmlBase('Resultado do Sense DISC', `
        <div class="card">
          <h3>Perfil predominante</h3>
          <p><span class="badge badge-${perfil}">${perfil} — ${perfil === 'D' ? 'Dominância' : perfil === 'I' ? 'Influência' : perfil === 'S' ? 'Estabilidade' : 'Conformidade'}</span></p>
          <p style="margin-top:12px">${desc[perfil] || ''}</p>
        </div>
        <div class="card">
          <h3>Pontuações</h3>
          <p>D: ${dados?.d ?? 0} &nbsp;|&nbsp; I: ${dados?.i ?? 0} &nbsp;|&nbsp; S: ${dados?.s ?? 0} &nbsp;|&nbsp; C: ${dados?.c ?? 0}</p>
        </div>
        <div class="card">
          <h3>Próximo passo</h3>
          <p>Acesse o painel para ver o relatório completo em PDF com análise detalhada do seu perfil e recomendações de carreira.</p>
        </div>
      `);

    } else if (tipo === 'nr1_alerta') {
      const severidade = dados?.severidade || 'medio';
      const badgeClass = severidade === 'critico' || severidade === 'alto' ? 'badge-alerta' : 'badge-ok';
      subject = `⚠️ Alerta NR-1 — ${dados?.titulo || 'Risco psicossocial identificado'}`;
      html = htmlBase('Alerta de Risco Psicossocial NR-1', `
        <div class="card">
          <h3>Alerta identificado</h3>
          <p><span class="badge ${badgeClass}">${severidade.toUpperCase()}</span></p>
          <p style="margin-top:12px"><strong>${dados?.titulo || ''}</strong></p>
          <p>${dados?.descricao || 'Risco psicossocial identificado no diagnóstico NR-1 2025.'}</p>
        </div>
        <div class="card">
          <h3>Ação recomendada</h3>
          <p>Acesse o painel Sense NR-1 para visualizar o diagnóstico completo e iniciar o plano de ação de conformidade.</p>
        </div>
      `);

    } else if (tipo === 'checkin_resumo') {
      subject = `Resumo do check-in — ${nome || 'Colaborador'}`;
      html = htmlBase('Resumo do Check-in Emocional', `
        <div class="card">
          <h3>Estado registrado</h3>
          <p>Estado: <strong>${dados?.estado || '—'}</strong></p>
          ${dados?.comentario ? `<p>Comentário: "${dados.comentario}"</p>` : ''}
        </div>
        <div class="card">
          <h3>Mensagem do Sense Inspire™</h3>
          <p><em>"${dados?.inspire || 'Cada passo conta. Você está construindo algo que importa.'}"</em></p>
          <p style="margin-top:8px;font-size:12px;color:#64748b">— Alana Carvalho · Essencial Sense AI</p>
        </div>
      `);

    } else if (tipo === 'relatorio_neuro') {
      subject = `Relatório Sense Neuro — ${nome || 'Colaborador'}`;
      html = htmlBase('Relatório Sense Neuro™', `
        <div class="card">
          <h3>Diagnóstico concluído</h3>
          <p>Seu relatório de saúde mental e bem-estar foi gerado com sucesso.</p>
        </div>
        <div class="card">
          <h3>Indicadores</h3>
          <p>Ansiedade: <strong>${dados?.ansiedade ?? '—'}/10</strong><br>
             Estresse: <strong>${dados?.estresse ?? '—'}/10</strong><br>
             Esgotamento: <strong>${dados?.esgotamento ?? '—'}/10</strong><br>
             Engajamento: <strong>${dados?.engajamento ?? '—'}/10</strong></p>
        </div>
        <div class="card">
          <h3>PDF disponível</h3>
          <p>Acesse o painel para baixar o PDF completo com análise e recomendações personalizadas.</p>
        </div>
      `);

    } else {
      return NextResponse.json({ error: 'tipo não reconhecido' }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: FROM,
      to: [to],
      subject,
      html,
    });

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err: any) {
    console.error('Email error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
