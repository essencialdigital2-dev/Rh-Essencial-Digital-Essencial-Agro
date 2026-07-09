import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Essencial Digital para Escolas - Inteligencia Humana na Educacao',
  description: 'Plataforma completa para escolas: saude emocional, estudo com IA e gestao de pessoas. Essencial Teens, Estudo e Sense AI.',
}

const WA = 'https://wa.me/5561985272681'

export default function EscolasPage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#06060F', color: '#F8F8FF', minHeight: '100vh', margin: 0, padding: 0 }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #06060F 0%, #0D0D1F 50%, #06060F 100%)', padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(6,182,212,0.1), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 28 }}>
            <img src="/logo-essencial.png" alt="Essencial Digital" style={{ width: 90, height: 90, borderRadius: 22, boxShadow: '0 0 40px rgba(139,92,246,0.4)' }} />
          </div>
          <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 99, padding: '6px 20px', fontSize: 12, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>
            Ecossistema de Inteligencia Humana
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px', background: 'linear-gradient(135deg, #F8F8FF 30%, #A78BFA 70%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sua escola pronta para<br />o futuro das pessoas
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'rgba(248,248,255,0.6)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 40px' }}>
            Um ecossistema completo que une saude emocional dos alunos, estudo inteligente com IA e gestao humana da equipe escolar.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`${WA}?text=Ola%20Alana!%20Quero%20conhecer%20o%20Essencial%20Digital%20para%20minha%20escola.`} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', color: '#fff', borderRadius: 12, padding: '16px 36px', fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Quero uma demonstracao gratuita
            </a>
            <a href="#servicos" style={{ background: 'transparent', color: 'rgba(248,248,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
              Ver servicos
            </a>
          </div>
        </div>
      </section>

      {/* DORES */}
      <section style={{ padding: '80px 24px', background: '#08080F' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>O que esta acontecendo nas escolas</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: 0 }}>Voce reconhece algum desses cenarios?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              { emoji: '😰', texto: 'Alunos com ansiedade, burnout escolar e dificuldade de concentracao. Voce descobre tarde demais.' },
              { emoji: '📉', texto: 'Queda no desempenho academico sem saber a causa real. O conteudo foi dado, mas o aluno nao absorveu.' },
              { emoji: '👥', texto: 'Conflitos entre alunos, isolamento social e comportamentos de risco que surgem sem aviso.' },
              { emoji: '📋', texto: 'Professores sobrecarregados e sem ferramentas para identificar qual aluno precisa de atencao urgente.' },
              { emoji: '🎯', texto: 'Cada aluno aprende de um jeito diferente, mas a escola oferece o mesmo metodo para todos.' },
              { emoji: '📊', texto: 'Decisoes tomadas por intuicao, sem dados reais sobre o clima emocional da escola.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</span>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(248,248,255,0.65)', lineHeight: 1.7 }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICOS */}
      <section id="servicos" style={{ padding: '80px 24px', background: '#06060F' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Tres servicos integrados</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, margin: 0 }}>Um ecossistema completo para sua escola</h2>
          </div>

          {/* TEENS */}
          <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.05))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '36px', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🧠</div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Para alunos do 7o ao 9o ano</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px', color: '#F8F8FF' }}>Essencial Teens</h3>
                <p style={{ fontSize: 14, color: 'rgba(248,248,255,0.6)', lineHeight: 1.7, margin: '0 0 24px' }}>Plataforma de inteligencia emocional e desenvolvimento socioemocional para adolescentes. A escola que cuida do emocional forma pessoas que o mercado vai disputar.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 20 }}>
                  {[
                    'Check-in emocional diario com IA',
                    'Avaliacao DISC adaptada para jovens',
                    'Trilhas de autoconhecimento',
                    'Alerta precoce de ansiedade e isolamento',
                    'Dashboard para coordenacao',
                    'Relatorio de clima da turma',
                  ].map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'rgba(248,248,255,0.7)', padding: '8px 12px', background: 'rgba(139,92,246,0.08)', borderRadius: 8 }}>{item}</div>
                  ))}
                </div>
                <a href={`${WA}?text=Ola%20Alana!%20Tenho%20interesse%20no%20Essencial%20Teens%20para%20minha%20escola.`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: '#fff', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Conhecer o Essencial Teens
                </a>
              </div>
            </div>
          </div>

          {/* ESTUDO */}
          <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(59,130,246,0.05))', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 20, padding: '36px', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📚</div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#06B6D4', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Para estudantes e vestibulandos</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px', color: '#F8F8FF' }}>Essencial Estudo</h3>
                <p style={{ fontSize: 14, color: 'rgba(248,248,255,0.6)', lineHeight: 1.7, margin: '0 0 24px' }}>IA que personaliza o plano de estudos por perfil cognitivo. Preparacao completa para ENEM, PAS, vestibulares, concursos militares e TAF com tecnicas de neurociencia e foco monitorado.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 20 }}>
                  {[
                    'Plano personalizado por perfil cognitivo',
                    'Preparacao para ENEM e PAS',
                    'Vestibulares e concursos militares',
                    'TAF e testes fisicos militares',
                    'Monitor de foco e produtividade',
                    'Coach de estudos com IA',
                  ].map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'rgba(248,248,255,0.7)', padding: '8px 12px', background: 'rgba(6,182,212,0.08)', borderRadius: 8 }}>{item}</div>
                  ))}
                </div>
                <a href={`${WA}?text=Ola%20Alana!%20Tenho%20interesse%20no%20Essencial%20Estudo%20para%20minha%20escola.`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', color: '#fff', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Conhecer o Essencial Estudo
                </a>
              </div>
            </div>
          </div>

          {/* SENSE AI */}
          <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '36px' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 10 }}>
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <path d="M32 6C24 6 18 12 18 19c0 3 1 5.5 3 7.5C17 28 14 32 14 37c0 6 4.5 11 10.5 12.5V54h15v-4.5C45.5 48 50 43 50 37c0-5-3-9-7-11 2-2 3-4.5 3-7.5C46 12 40 6 32 6z" fill="rgba(255,255,255,0.95)"/>
                  <path d="M32 6C24 6 18 12 18 19c0 3 1 5.5 3 7.5C17 28 14 32 14 37c0 6 4.5 11 10.5 12.5V54h15v-4.5C45.5 48 50 43 50 37c0-5-3-9-7-11 2-2 3-4.5 3-7.5C46 12 40 6 32 6z" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <line x1="32" y1="20" x2="32" y2="50" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 2"/>
                  <circle cx="26" cy="26" r="2" fill="#06B6D4"/>
                  <circle cx="38" cy="26" r="2" fill="#06B6D4"/>
                  <circle cx="24" cy="38" r="2" fill="#06B6D4"/>
                  <circle cx="40" cy="38" r="2" fill="#06B6D4"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Para gestores e RH da escola</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px', color: '#F8F8FF' }}>Essencial Sense AI</h3>
                <p style={{ fontSize: 14, color: 'rgba(248,248,255,0.6)', lineHeight: 1.7, margin: '0 0 24px' }}>Gestao humana da equipe escolar com dados reais. Diagnostico NR-1 obrigatorio, clima organizacional e prevencao de burnout dos professores e funcionarios.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 20 }}>
                  {[
                    'Diagnostico NR-1 com laudo tecnico',
                    'Check-in emocional da equipe',
                    'DISC comportamental dos colaboradores',
                    'Alerta de burnout e turnover',
                    'Dashboard de clima organizacional',
                    'Conformidade legal garantida',
                  ].map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'rgba(248,248,255,0.7)', padding: '8px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 8 }}>{item}</div>
                  ))}
                </div>
                <a href={`${WA}?text=Ola%20Alana!%20Tenho%20interesse%20no%20Essencial%20Sense%20AI%20para%20minha%20escola.`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #10B981, #06B6D4)', color: '#fff', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Conhecer o Sense AI
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section style={{ padding: '80px 24px', background: '#08080F' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Por que a Essencial Digital</div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, margin: '0 0 52px' }}>Nao e mais um software. E uma parceria.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { emoji: '🎓', titulo: 'Especializacao em Psicologia Organizacional', texto: 'Por tras da plataforma ha uma especialista em comportamento humano, nao so desenvolvedores.' },
              { emoji: '🤖', titulo: 'IA que aprende com seus dados', texto: 'Quanto mais sua escola usa, mais inteligente e personalizada fica para a sua realidade.' },
              { emoji: '📋', titulo: 'NR-1 incluida', texto: 'Conformidade legal com a norma psicossocial obrigatoria desde 2025, com laudo tecnico.' },
              { emoji: '🇧🇷', titulo: 'Feito para o Brasil', texto: 'Servidor em Sao Paulo, suporte em portugues, precos em real. Sem complicacao.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 22px' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{item.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F8F8FF', marginBottom: 10 }}>{item.titulo}</div>
                <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)', lineHeight: 1.7, margin: 0 }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUMEROS */}
      <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))', borderTop: '1px solid rgba(139,92,246,0.15)', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, textAlign: 'center' }}>
            {[
              { numero: '3', label: 'servicos integrados' },
              { numero: '20min', label: 'para a demonstracao' },
              { numero: '100%', label: 'brasileiro e seguro' },
              { numero: 'LGPD', label: 'em conformidade total' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, background: 'linear-gradient(135deg, #A78BFA, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{item.numero}</div>
                <div style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)', marginTop: 6 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FRASE ALANA */}
      <section style={{ padding: '80px 24px', background: '#06060F' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>👩</div>
          <div style={{ margin: '0 0 28px', padding: '32px 36px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20 }}>
            <div style={{ fontSize: 48, color: 'rgba(139,92,246,0.3)', lineHeight: 1, marginBottom: 12, fontFamily: 'Georgia, serif' }}>"</div>
            <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(248,248,255,0.8)', lineHeight: 1.8, margin: '0 0 8px', fontStyle: 'italic' }}>
              Este ecossistema nao nasceu de uma empresa de tecnologia. Nasceu da mesa de estudos dos meus filhos. Foi vendo de perto a dificuldade deles que surgiu a ideia de criar algo diferente: uma plataforma que une inteligencia artificial e psicologia para desenvolver pessoas de verdade, da escola a empresa.
            </p>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#F8F8FF', marginBottom: 4 }}>Alana Carvalho</div>
          <div style={{ fontSize: 13, color: 'rgba(248,248,255,0.45)', lineHeight: 1.7 }}>
            Formada em Magisterio · Gestora de Pessoas · Especialista em Psicologia Organizacional
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '100px 24px', background: '#08080F', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <img src="/logo-essencial.png" alt="Essencial Digital" style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 24, boxShadow: '0 0 30px rgba(139,92,246,0.3)' }} />
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.2 }}>Pronto para transformar sua escola?</h2>
          <p style={{ fontSize: 15, color: 'rgba(248,248,255,0.55)', lineHeight: 1.7, margin: '0 0 40px' }}>
            Agende uma demonstracao gratuita de 20 minutos. Sem compromisso. Mostramos como funciona na pratica para a realidade da sua escola.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <a href={`${WA}?text=Ola%20Alana!%20Quero%20agendar%20uma%20demonstracao%20do%20Essencial%20Digital%20para%20minha%20escola.`} target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', borderRadius: 12, padding: '16px 32px', fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Falar no WhatsApp
            </a>
            <a href="mailto:essencialdigital2@gmail.com?subject=Demonstracao%20Essencial%20Digital%20para%20Escolas" style={{ background: 'transparent', color: 'rgba(248,248,255,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '16px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
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
