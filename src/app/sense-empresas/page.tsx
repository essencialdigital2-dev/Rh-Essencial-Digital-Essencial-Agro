import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Essencial Sense AI para Empresas - Gestao Humana com Inteligencia Artificial',
  description: 'Diagnostico NR-1, DISC comportamental, check-in emocional e IA preditiva de burnout e turnover. Conformidade legal e dados reais sobre sua equipe.',
}

const WA = 'https://wa.me/5561985272681'

export default function SenseEmpresasPage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#06060F', color: '#F8F8FF', minHeight: '100vh', margin: 0, padding: 0 }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #06060F 0%, #0D0D1F 50%, #06060F 100%)', padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.3), rgba(6,182,212,0.15))', filter: 'blur(20px)' }} />
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 120, height: 120, position: 'relative', zIndex: 1 }}>
                <circle cx="50" cy="50" r="48" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1"/>
                <path d="M50 18C38 18 29 27 29 38c0 4.5 1.5 8.5 4 11.5C28 52.5 24 58 24 65c0 9 7 16 16 17.5V86h20v-3.5C69 81 76 74 76 65c0-7-4-12.5-9-15.5 2.5-3 4-7 4-11.5C71 27 62 18 50 18z" fill="url(#brainGradE)" opacity="0.95"/>
                <line x1="50" y1="32" x2="50" y2="78" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" strokeDasharray="4 3"/>
                <path d="M38 38 Q44 34 50 38 Q56 34 62 38" stroke="rgba(6,182,212,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M35 52 Q42 47 50 52 Q58 47 65 52" stroke="rgba(6,182,212,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M36 64 Q43 59 50 64 Q57 59 64 64" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="38" cy="44" r="2.5" fill="#10B981"/>
                <circle cx="62" cy="44" r="2.5" fill="#10B981"/>
                <circle cx="35" cy="58" r="2" fill="#06B6D4"/>
                <circle cx="65" cy="58" r="2" fill="#06B6D4"/>
                <defs>
                  <linearGradient id="brainGradE" x1="29" y1="18" x2="76" y2="86" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F8F8FF"/>
                    <stop offset="100%" stopColor="#A7F3D0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 99, padding: '6px 20px', fontSize: 12, fontWeight: 700, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>
            Gestao Humana com Inteligencia Artificial
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px', background: 'linear-gradient(135deg, #F8F8FF 30%, #10B981 65%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sua empresa em conformidade.<br />Sua equipe no melhor nivel.
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'rgba(248,248,255,0.6)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 16px' }}>
            A NR-1 psicossocial e obrigatoria desde 2025. Burnout e turnover custam mais do que qualquer investimento em prevencao. O Essencial Sense AI resolve os dois com dados reais e IA preditiva.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 20px', fontSize: 13, color: '#FCA5A5', fontWeight: 600, marginBottom: 40 }}>
            Empresas sem diagnostico NR-1 estao sujeitas a autuacao e multa
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`${WA}?text=Ola%20Alana!%20Quero%20conhecer%20o%20Essencial%20Sense%20AI%20para%20minha%20empresa.`} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', color: '#fff', borderRadius: 12, padding: '16px 36px', fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Quero uma demonstracao gratuita
            </a>
            <a href="#solucao" style={{ background: 'transparent', color: 'rgba(248,248,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
              Ver a solucao
            </a>
          </div>
        </div>
      </section>

      {/* DORES */}
      <section style={{ padding: '80px 24px', background: '#08080F' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>O que custa nao agir</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: 0 }}>Sua empresa convive com algum desses problemas?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { emoji: '🔥', texto: 'Colaboradores em burnout que voce so descobre quando ja pediram demissao ou foram afastados.' },
              { emoji: '📋', texto: 'NR-1 psicossocial obrigatoria desde 2025 e sua empresa ainda nao fez o diagnostico.' },
              { emoji: '💸', texto: 'Turnover alto consumindo entre 50% e 200% do salario de cada colaborador substituido.' },
              { emoji: '😶', texto: 'Clima organizacional medido por intuicao. Sem dados, sem historico, sem previsao.' },
              { emoji: '⚖️', texto: 'Risco de acao trabalhista por adoecimento psicologico sem nenhum registro de prevencao.' },
              { emoji: '📉', texto: 'Queda de produtividade sem saber qual area, qual lider ou qual fator esta causando.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</span>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(248,248,255,0.65)', lineHeight: 1.7 }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUCAO */}
      <section id="solucao" style={{ padding: '80px 24px', background: '#06060F' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Essencial Sense AI</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, margin: '0 0 16px' }}>Uma plataforma. Todos os dados da sua equipe.</h2>
            <p style={{ fontSize: 15, color: 'rgba(248,248,255,0.5)', margin: 0 }}>Do diagnostico legal a predicao de risco. Tudo em tempo real.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { cor: '#EF4444', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.2)', emoji: '📋', titulo: 'Diagnostico NR-1', texto: 'Formulario psicossocial com 20 questoes aplicado a toda equipe. Identifica riscos por area, gera alertas automaticos e entrega laudo tecnico para conformidade legal.' },
              { cor: '#A78BFA', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)', emoji: '🎯', titulo: 'DISC Comportamental', texto: 'Avaliacao do perfil comportamental de cada colaborador. Mapa completo da equipe para montar times mais equilibrados e liderar com mais precisao.' },
              { cor: '#10B981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)', emoji: '💚', titulo: 'Check-in Emocional Diario', texto: 'Colaboradores registram como estao em menos de 1 minuto. A IA identifica padroes de risco antes que virem afastamento ou demissao.' },
              { cor: '#06B6D4', bg: 'rgba(6,182,212,0.07)', border: 'rgba(6,182,212,0.2)', emoji: '🔮', titulo: 'IA Preditiva de Risco', texto: 'Algoritmo que cruza dados de humor, NR-1, DISC e clima para prever risco de burnout e turnover com ate 30 dias de antecedencia.' },
              { cor: '#F59E0B', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)', emoji: '📊', titulo: 'Dashboard em Tempo Real', texto: 'Visao completa do clima organizacional, ISHO, eNPS e evolucao semana a semana para a lideranca tomar decisoes com dados.' },
              { cor: '#EC4899', bg: 'rgba(236,72,153,0.07)', border: 'rgba(236,72,153,0.2)', emoji: '📄', titulo: 'Laudo Tecnico NR-1', texto: 'Relatorio elaborado por especialista em Psicologia Organizacional para apresentar a fiscalizacao e documentar as acoes de prevencao.' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 16, padding: '24px' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.cor, marginBottom: 8 }}>{item.titulo}</div>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(248,248,255,0.6)', lineHeight: 1.7 }}>{item.texto}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href={`${WA}?text=Ola%20Alana!%20Quero%20agendar%20uma%20demonstracao%20do%20Sense%20AI%20para%20minha%20empresa.`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #10B981, #06B6D4)', color: '#fff', borderRadius: 12, padding: '16px 40px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              Agendar demonstracao gratuita
            </a>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ padding: '80px 24px', background: '#08080F' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Processo de implantacao</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: 0 }}>Do primeiro acesso ao primeiro resultado em 30 dias</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { dia: 'Dias 1 a 3', cor: '#10B981', titulo: 'Configuracao e kickoff', texto: 'Cadastro da empresa, importacao dos colaboradores e reuniao de alinhamento com o gestor de RH.' },
              { dia: 'Dias 4 a 10', cor: '#06B6D4', titulo: 'Diagnostico base', texto: 'Colaboradores respondem o DISC, o check-in emocional e o diagnostico NR-1. Meta de 70% de adesao.' },
              { dia: 'Dias 11 a 20', cor: '#A78BFA', titulo: 'Primeiros relatorios', texto: 'Mapa DISC da equipe, primeiro ISHO, alertas NR-1 configurados e relatorio executivo entregue ao RH.' },
              { dia: 'Dia 30', cor: '#F59E0B', titulo: 'Laudo NR-1 e plano de acao', texto: 'Laudo tecnico elaborado pela especialista e plano de acao personalizado para os riscos identificados.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ minWidth: 80, fontSize: 11, fontWeight: 700, color: item.cor, textTransform: 'uppercase', paddingTop: 2 }}>{item.dia}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F8F8FF', marginBottom: 4 }}>{item.titulo}</div>
                  <p style={{ margin: 0, fontSize: 13, color: 'rgba(248,248,255,0.5)', lineHeight: 1.6 }}>{item.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASSINATURA */}
      <section style={{ padding: '60px 24px', background: '#06060F' }}>
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 72, fontStyle: 'italic', fontWeight: 700, background: 'linear-gradient(135deg, #10B981, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 12 }}>AC</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F8F8FF', marginBottom: 4 }}>Alana Carvalho</div>
          <div style={{ fontSize: 12, color: 'rgba(248,248,255,0.4)', lineHeight: 1.7 }}>
            Gestora de Pessoas · Especialista em Psicologia Organizacional
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '100px 24px', background: '#08080F', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <img src="/logo-essencial.png" alt="Essencial Sense AI" style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 24, boxShadow: '0 0 30px rgba(16,185,129,0.3)' }} />
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.2 }}>Sua empresa nao pode esperar mais</h2>
          <p style={{ fontSize: 15, color: 'rgba(248,248,255,0.55)', lineHeight: 1.7, margin: '0 0 40px' }}>
            Agende uma demonstracao gratuita de 20 minutos. Mostramos como funciona e o que sua empresa precisa para estar em conformidade com a NR-1 ainda este mes.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <a href={`${WA}?text=Ola%20Alana!%20Quero%20agendar%20uma%20demonstracao%20do%20Sense%20AI%20para%20minha%20empresa.`} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', borderRadius: 12, padding: '16px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Falar no WhatsApp
            </a>
            <a href="mailto:essencialdigital2@gmail.com?subject=Demonstracao%20Essencial%20Sense%20AI%20para%20Empresas" style={{ background: 'transparent', color: 'rgba(248,248,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '16px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
              Enviar e-mail
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(248,248,255,0.25)', margin: 0 }}>
            Essencial Digital · Alana Carvalho · (61) 98527-2681 · essencialdigital2@gmail.com
          </p>
        </div>
      </section>

    </main>
  )
}
