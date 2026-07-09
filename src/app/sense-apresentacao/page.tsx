'use client'

const WA = 'https://wa.me/5561985272681?text=Ol%C3%A1%2C+quero+conhecer+o+Essencial+Sense+AI.'

function BrainSVG({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M50 18 C30 18 14 31 14 48 C14 59 20 67 29 72 C29 78 33 84 40 86 C42 87 44 85 44 83 L44 74 C40 72 38 68 37 63 C33 60 30 55 30 48 C30 35 39 28 50 28 Z" fill="url(#bg1)" opacity="0.92" />
      <path d="M50 18 C70 18 86 31 86 48 C86 59 80 67 71 72 C71 78 67 84 60 86 C58 87 56 85 56 83 L56 74 C60 72 62 68 63 63 C67 60 70 55 70 48 C70 35 61 28 50 28 Z" fill="url(#bg2)" opacity="0.92" />
      <line x1="50" y1="20" x2="50" y2="82" stroke="#08080F" strokeWidth="2.5" />
      <path d="M24 46 Q32 41 38 46 Q32 51 24 46Z" fill="rgba(255,255,255,0.22)" />
      <path d="M21 59 Q30 54 36 59 Q30 64 21 59Z" fill="rgba(255,255,255,0.18)" />
      <path d="M28 34 Q36 30 41 35 Q36 40 28 34Z" fill="rgba(255,255,255,0.16)" />
      <path d="M76 46 Q68 41 62 46 Q68 51 76 46Z" fill="rgba(255,255,255,0.22)" />
      <path d="M79 59 Q70 54 64 59 Q70 64 79 59Z" fill="rgba(255,255,255,0.18)" />
      <path d="M72 34 Q64 30 59 35 Q64 40 72 34Z" fill="rgba(255,255,255,0.16)" />
      <circle cx="31" cy="45" r="3" fill="#F8F8FF" opacity="0.95" />
      <circle cx="39" cy="59" r="2.5" fill="#06B6D4" opacity="0.95" />
      <circle cx="26" cy="60" r="2" fill="#A78BFA" opacity="0.95" />
      <circle cx="69" cy="45" r="3" fill="#F8F8FF" opacity="0.95" />
      <circle cx="61" cy="59" r="2.5" fill="#06B6D4" opacity="0.95" />
      <circle cx="74" cy="60" r="2" fill="#A78BFA" opacity="0.95" />
      <circle cx="50" cy="36" r="2.5" fill="#EC4899" opacity="0.95" />
      <line x1="31" y1="45" x2="39" y2="59" stroke="#A78BFA" strokeWidth="1.2" opacity="0.7" />
      <line x1="39" y1="59" x2="26" y2="60" stroke="#06B6D4" strokeWidth="1.2" opacity="0.7" />
      <line x1="69" y1="45" x2="61" y2="59" stroke="#A78BFA" strokeWidth="1.2" opacity="0.7" />
      <line x1="61" y1="59" x2="74" y2="60" stroke="#06B6D4" strokeWidth="1.2" opacity="0.7" />
      <line x1="50" y1="36" x2="31" y2="45" stroke="#EC4899" strokeWidth="1" opacity="0.6" />
      <line x1="50" y1="36" x2="69" y2="45" stroke="#EC4899" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

const MODULOS = [
  { ico: '💚', t: 'Sense Health', d: 'Check-in emocional diario. A IA detecta padroes de burnout antes que virem crise.' },
  { ico: '🧬', t: 'Sense DISC', d: 'Mapeamento comportamental baseado em metodologia cientificamente validada.' },
  { ico: '⚠️', t: 'Sense NR-1', d: 'Diagnostico de riscos psicossociais com plano de acao para conformidade legal.' },
  { ico: '🔮', t: 'IA Preditiva', d: 'Score de risco de saida, janela de demissao e previsao de absenteismo.' },
  { ico: '🗺️', t: 'Culture Map', d: 'Mapa visual da saude organizacional por equipe, area e empresa.' },
  { ico: '🧠', t: 'Human Twin AI', d: 'Perfil digital de cada colaborador com historico comportamental e preditivo.' },
  { ico: '📊', t: 'Sense DNA', d: 'Score de cultura organizacional consolidado em tempo real.' },
  { ico: '💬', t: 'Feedback 360°', d: 'avaliação de competencias com anonimato e resultados acionaveis.' },
]

const DIFERENCIAIS = [
  { n: '01', t: 'não é software de clima', d: 'Pesquisas de clima medem o passado. O Sense AI monitora o presente e preve o futuro.' },
  { n: '02', t: 'não é saude mental', d: 'Saude mental reage. O Sense AI previne: identifica sinais de esgotamento antes do afastamento.' },
  { n: '03', t: 'não é BI de RH', d: 'Dashboards mostram o que aconteceu. O Sense AI mostra o que vai acontecer e o que fazer.' },
  { n: '04', t: 'E decisão estratégica', d: 'Transformamos o fator humano em dado confiável para o board. não apenas para o RH.' },
]

const COMO = [
  { n: '1', t: 'Check-in diario inteligente', d: 'Colaboradores respondem em menos de 1 minuto. A IA interpreta padroes ao longo do tempo.' },
  { n: '2', t: 'Mapeamento comportamental', d: 'DISC, valores e competencias integrados ao perfil de cada pessoa e equipe.' },
  { n: '3', t: 'Alertas preditivos', d: 'Gestor recebe alertas antes que o problema vire crise: rotatividade, burnout e conflito.' },
  { n: '4', t: 'Dashboard executivo', d: 'Visao consolidada da saude organizacional em tempo real. Para RH e para o C-level.' },
]

export default function SenseApresentacao() {
  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: '#08080f', minHeight: '100vh', color: '#f8f8ff' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid rgba(139,92,246,0.12)', background: 'rgba(8,8,15,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BrainSVG size={22} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#F8F8FF' }}>Essencial <span style={{ color: '#A78BFA' }}>Sense AI</span></span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href={WA} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)', textDecoration: 'none', padding: '8px 16px' }}>Falar com a Alana</a>
          <a href="/sense-login" style={{ fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '8px 20px', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', borderRadius: 8 }}>Acessar →</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0d0d1a 0%,#1a0533 50%,#0d0d1a 100%)', padding: '80px 24px 100px', borderBottom: '1px solid rgba(139,92,246,.15)' }}>
        {/* glows */}
        <div style={{ position: 'absolute', top: '-100px', left: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-150px', right: '-60px', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60, alignItems: 'center' }}>
          {/* texto */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.3)', borderRadius: 50, padding: '6px 20px', fontSize: 12, color: 'rgba(139,92,246,.9)', marginBottom: 32, letterSpacing: 1.5, textTransform: 'uppercase' as const }}>
              🇧🇷 Primeira Human Intelligence Platform Brasileira
            </div>
            <h1 style={{ fontSize: 'clamp(32px,4.5vw,58px)', fontWeight: 900, margin: '0 0 24px', lineHeight: 1.1 }}>
              Transformamos sinais humanos em{' '}
              <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                decisoes estratégicas
              </span>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(248,248,255,.6)', maxWidth: 580, margin: '0 0 40px', lineHeight: 1.8 }}>
              Psicologia Organizacional, Inteligencia Artificial e People Analytics Preditivo numa unica plataforma. Para empresas que entendem que o maior ativo e humano.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
              <a href={WA} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff', fontWeight: 900, fontSize: 15, padding: '16px 36px', borderRadius: 14, textDecoration: 'none', display: 'inline-block' }}>
                📲 Agendar demonstracao
              </a>
              <a href="/sense-login" style={{ background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.3)', color: '#c4b5fd', fontWeight: 700, fontSize: 15, padding: '16px 36px', borderRadius: 14, textDecoration: 'none', display: 'inline-block' }}>
                Acessar plataforma →
              </a>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              {[['< 1 min', 'check-in diario'], ['8 modulos', 'integrados'], ['100%', 'web e mobile']].map(([n, l]) => (
                <div key={n}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#A78BFA' }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: 1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* cerebro hero */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.1)' }} />
            <div style={{ position: 'absolute', width: 310, height: 310, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.18)' }} />
            <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)' }} />
            {[
              { top: '5%', left: '45%', bg: '#A78BFA', s: 10 },
              { top: '48%', left: '2%', bg: '#EC4899', s: 8 },
              { top: '88%', left: '25%', bg: '#06B6D4', s: 10 },
              { top: '88%', right: '25%', bg: '#A78BFA', s: 8 },
              { top: '48%', right: '2%', bg: '#EC4899', s: 9 },
              { top: '12%', right: '14%', bg: '#06B6D4', s: 7 },
            ].map((p, i) => (
              <div key={i} style={{ position: 'absolute', width: p.s, height: p.s, borderRadius: '50%', background: p.bg, boxShadow: `0 0 ${p.s * 4}px ${p.bg}`, top: p.top, left: (p as any).left, right: (p as any).right }} />
            ))}
            <BrainSVG size={220} />
          </div>
        </div>
      </div>

      {/* MODULOS */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ background: 'rgba(139,92,246,.15)', color: '#a78bfa', fontWeight: 800, fontSize: 11, padding: '4px 14px', borderRadius: 50, letterSpacing: 1.5, textTransform: 'uppercase' as const }}>Modulos</span>
          <h2 style={{ fontSize: 30, fontWeight: 900, margin: '16px 0 8px' }}>Uma plataforma. Oito modulos integrados.</h2>
          <p style={{ color: 'rgba(248,248,255,0.4)', fontSize: 15, margin: 0 }}>Do check-in diario ao relatorio executivo - tudo conectado.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {MODULOS.map((m, i) => (
            <div key={i} style={{ background: '#13131f', border: '1px solid rgba(139,92,246,.18)', borderRadius: 16, padding: '24px 22px', transition: 'border-color .2s' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{m.ico}</div>
              <p style={{ fontWeight: 800, fontSize: 15, margin: '0 0 8px', color: '#e9d5ff' }}>{m.t}</p>
              <p style={{ fontSize: 13, color: 'rgba(248,248,255,.45)', lineHeight: 1.6, margin: 0 }}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NAO E... */}
      <div style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ background: 'rgba(236,72,153,.1)', color: '#f472b6', fontWeight: 800, fontSize: 11, padding: '4px 14px', borderRadius: 50, letterSpacing: 1.5, textTransform: 'uppercase' as const }}>Posicionamento</span>
          <h2 style={{ fontSize: 30, fontWeight: 900, margin: '16px 0 0' }}>O que o Sense AI nao e</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
          {DIFERENCIAIS.map((d, i) => (
            <div key={i} style={{ background: '#13131f', border: '1px solid rgba(139,92,246,.15)', borderRadius: 16, padding: '22px 28px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#8b5cf6', opacity: .5, flexShrink: 0, paddingTop: 3 }}>{d.n}</span>
              <div>
                <p style={{ fontWeight: 800, fontSize: 16, color: '#e9d5ff', margin: '0 0 6px' }}>{d.t}</p>
                <p style={{ fontSize: 14, color: 'rgba(248,248,255,.5)', lineHeight: 1.7, margin: 0 }}>{d.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <div style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ background: 'rgba(139,92,246,.15)', color: '#a78bfa', fontWeight: 800, fontSize: 11, padding: '4px 14px', borderRadius: 50, letterSpacing: 1.5, textTransform: 'uppercase' as const }}>Como funciona</span>
          <h2 style={{ fontSize: 30, fontWeight: 900, margin: '16px 0 0' }}>Do sinal humano a decisão estratégica</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
          {COMO.map((c, i) => (
            <div key={i} style={{ background: '#13131f', border: '1px solid rgba(139,92,246,.15)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' as const }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 900, fontSize: 16, color: '#fff' }}>{c.n}</div>
              <p style={{ fontWeight: 800, fontSize: 14, color: '#e9d5ff', margin: '0 0 8px' }}>{c.t}</p>
              <p style={{ fontSize: 12, color: 'rgba(248,248,255,.45)', lineHeight: 1.6, margin: 0 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* QUEM E A ALANA */}
      <div style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,.1),rgba(236,72,153,.05))', border: '1px solid rgba(139,92,246,.2)', borderRadius: 24, padding: '48px 40px', display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontStyle: 'italic', color: '#fff', fontWeight: 700 }}>AC</span>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontWeight: 900, fontSize: 20, color: '#f8f8ff', margin: '0 0 4px' }}>Alana Carvalho</p>
            <p style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700, margin: '0 0 20px', letterSpacing: 1, textTransform: 'uppercase' as const }}>Fundadora e CEO · Essencial Digital</p>
            <p style={{ fontSize: 15, color: 'rgba(248,248,255,.65)', lineHeight: 1.85, margin: '0 0 14px' }}>
              Professora formada no magisterio, especialista em Psicologia Organizacional e gestora de pessoas. Alana construiu o Sense AI a partir de uma lacuna real: empresas brasileiras tomam decisoes sobre pessoas com base em intuicao, nao em dados.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(248,248,255,.65)', lineHeight: 1.85, margin: 0 }}>
              A plataforma nasceu da pratica, nao de um laboratorio. Cada indicador foi escolhido porque resolve um problema real que Alana encontrou no trabalho com equipes e liderancas.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap' as const }}>
              <a href="https://wa.me/5561985272681" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff', fontWeight: 800, fontSize: 13, padding: '10px 22px', borderRadius: 10, textDecoration: 'none' }}>📲 (61) 98527-2681</a>
              <a href="mailto:essencialdigital2@gmail.com" style={{ background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.3)', color: '#c4b5fd', fontWeight: 700, fontSize: 13, padding: '10px 22px', borderRadius: 10, textDecoration: 'none' }}>✉️ E-mail</a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ background: 'rgba(139,92,246,.15)', color: '#a78bfa', fontWeight: 800, fontSize: 11, padding: '4px 14px', borderRadius: 50, letterSpacing: 1.5, textTransform: 'uppercase' as const }}>Perguntas frequentes</span>
          <h2 style={{ fontSize: 30, fontWeight: 900, margin: '16px 0 0' }}>Duvidas comuns antes de contratar</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
          {[
            { p: 'Precisa instalar algum software?', r: 'Nao. O Sense AI e 100% web e mobile. Funciona no navegador, sem instalacao, em qualquer dispositivo.' },
            { p: 'Como os colaboradores fazem o check-in?', r: 'Pelo celular ou computador, em menos de 1 minuto por dia. Recebem um link ou notificacao e respondem perguntas rapidas.' },
            { p: 'Os dados dos colaboradores sao seguros?', r: 'Sim. A plataforma segue a LGPD. Dados individuais sensiveis sao tratados com anonimizacao. O gestor ve tendencias de equipe, nao exposicao individual.' },
            { p: 'Em quanto tempo a empresa comeca a usar?', r: 'O onboarding e feito em menos de uma semana com suporte direto da Alana. Sem burocracia.' },
            { p: 'O Sense AI substitui o RH?', r: 'Nao. Ele potencializa o RH com dados que antes nao existiam. A decisão continua sendo humana, agora com mais evidência.' },
            { p: 'Funciona para empresas de qual tamanho?', r: 'De 10 a milhares de colaboradores. Os planos sao escalonaveis por numero de usuarios.' },
          ].map((faq, i) => (
            <div key={i} style={{ background: '#13131f', border: '1px solid rgba(139,92,246,.12)', borderRadius: 14, padding: '22px 26px' }}>
              <p style={{ fontWeight: 800, fontSize: 15, color: '#e9d5ff', margin: '0 0 8px' }}>❓ {faq.p}</p>
              <p style={{ fontSize: 14, color: 'rgba(248,248,255,.5)', lineHeight: 1.7, margin: 0 }}>{faq.r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ position: 'relative', overflow: 'hidden', margin: '80px 0 0', background: 'linear-gradient(135deg,#1a0533,#0d0d1a)', padding: '80px 24px', borderTop: '1px solid rgba(139,92,246,.15)' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ margin: '0 auto 32px', width: 120, height: 120, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.3)' }} />
            <div style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.5)', background: 'rgba(139,92,246,0.08)' }} />
            <BrainSVG size={60} />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 16px' }}>Pronto para tomar decisoes baseadas em inteligencia humana?</h2>
          <p style={{ fontSize: 15, color: 'rgba(248,248,255,.5)', lineHeight: 1.8, margin: '0 0 40px' }}>
            A Alana apresenta o Sense AI ao vivo para sua equipe. Sem compromisso e com toda a atenção que sua empresa merece.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', color: '#fff', fontWeight: 900, fontSize: 16, padding: '18px 44px', borderRadius: 16, textDecoration: 'none' }}>
              📲 Falar com a Alana →
            </a>
            <a href="/sense-login" style={{ display: 'inline-block', background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.3)', color: '#c4b5fd', fontWeight: 700, fontSize: 16, padding: '18px 44px', borderRadius: 16, textDecoration: 'none' }}>
              Acessar plataforma
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(248,248,255,.25)', marginTop: 16 }}>WhatsApp · Retorno em ate 2h · Sem compromisso</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(139,92,246,.1)', padding: '20px 24px', textAlign: 'center' as const }}>
        <p style={{ color: 'rgba(248,248,255,.2)', fontSize: 11, margin: 0, letterSpacing: 1 }}>
          © {new Date().getFullYear()} ESSENCIAL DIGITAL · CNPJ 58.062.495/0001-63 · rhessencialdigital.com.br
        </p>
      </div>
    </div>
  )
}
