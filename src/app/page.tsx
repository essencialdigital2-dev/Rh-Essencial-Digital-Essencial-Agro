'use client'

const WA = 'https://wa.me/5561985272681?text=Ol%C3%A1%2C+quero+conhecer+o+Essencial+Sense+AI!'
const EMAIL = 'essencialdigital2@gmail.com'

export default function LandingSenseAI() {
  return (
    <div style={{ background: '#07070F', color: '#F0F0FF', fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7,7,15,.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🧠</span>
            <span style={{ fontWeight: 900, fontSize: 16, background: 'linear-gradient(135deg,#10B981,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Essencial Sense AI</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{ background: '#25D366', color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href="/empresa/criar" style={{ background: 'linear-gradient(135deg,#10B981,#A855F7)', color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
              Solicitar Demo
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '90px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.3)', borderRadius: 30, padding: '6px 18px', fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 28, letterSpacing: '.06em' }}>
          ⚠️ NR-1 vigente desde 26/05/2025 — sua empresa está em conformidade?
        </div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,62px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
          Saúde emocional e{' '}
          <span style={{ background: 'linear-gradient(135deg,#10B981,#A855F7,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            performance humana
          </span>
          {' '}com IA
        </h1>
        <p style={{ fontSize: 'clamp(15px,2vw,20px)', color: 'rgba(240,240,255,.6)', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.7 }}>
          A única plataforma no Brasil que monitora saúde emocional, burnout, DISC comportamental e conformidade NR-1 em tempo real — com diagnóstico gerado por Inteligência Artificial.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/empresa/criar" style={{ background: 'linear-gradient(135deg,#10B981,#A855F7)', color: '#fff', textDecoration: 'none', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800, letterSpacing: '.02em' }}>
            🚀 Solicitar demonstração gratuita
          </a>
          <a href={WA} target="_blank" rel="noopener noreferrer"
            style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', color: '#F0F0FF', textDecoration: 'none', padding: '16px 30px', borderRadius: 14, fontSize: 16, fontWeight: 700 }}>
            💬 Falar no WhatsApp
          </a>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(240,240,255,.25)', marginTop: 16 }}>Sem compromisso · Resposta em até 24h</p>

        {/* Métricas hero */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 600, margin: '60px auto 0' }}>
          {[
            { n: '100%', l: 'Conformidade NR-1' },
            { n: 'IA', l: 'Diagnóstico Gemini AI' },
            { n: '24h', l: 'Alertas em tempo real' },
          ].map(m => (
            <div key={m.l} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '20px 12px' }}>
              <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#10B981,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{m.n}</div>
              <div style={{ fontSize: 12, color: 'rgba(240,240,255,.4)', marginTop: 4 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NR-1 URGÊNCIA */}
      <section style={{ background: 'linear-gradient(135deg,rgba(16,185,129,.08),rgba(168,85,247,.08))', borderTop: '1px solid rgba(16,185,129,.15)', borderBottom: '1px solid rgba(16,185,129,.15)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚖️</div>
          <h2 style={{ fontSize: 'clamp(20px,3vw,30px)', fontWeight: 900, marginBottom: 16 }}>
            A NR-1 obriga sua empresa a monitorar riscos psicossociais
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(240,240,255,.6)', lineHeight: 1.8, marginBottom: 28 }}>
            A <strong style={{ color: '#10B981' }}>Portaria MTE nº 1.419/2024</strong> entrou em vigor em <strong style={{ color: '#F59E0B' }}>26 de maio de 2025</strong> e exige que toda empresa gerencie ativamente os fatores de risco psicossocial — estresse, burnout, assédio e pressão excessiva. O não cumprimento pode resultar em <strong style={{ color: '#EF4444' }}>autuação, multa e ação judicial</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { emoji: '✅', t: 'GRO documentado' },
              { emoji: '✅', t: 'Inventário psicossocial' },
              { emoji: '✅', t: 'Relatório PDF para o MTE' },
              { emoji: '✅', t: 'Declaração de conformidade' },
            ].map(i => (
              <div key={i.t} style={{ background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#10B981' }}>
                {i.emoji} {i.t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS / FUNCIONALIDADES */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 900, marginBottom: 12 }}>Tudo que sua empresa precisa em um só lugar</h2>
          <p style={{ fontSize: 15, color: 'rgba(240,240,255,.45)', maxWidth: 500, margin: '0 auto' }}>Tecnologia de ponta aliada à psicologia organizacional para transformar a saúde do seu time.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[
            {
              emoji: '🧠', titulo: 'Saúde Emocional em Tempo Real',
              desc: 'Check-ins diários de bem-estar com análise de sentimento. Detecta padrões de estresse, ansiedade e esgotamento antes que virem crises.',
              cor: '#10B981', badge: 'Destaque'
            },
            {
              emoji: '🔥', titulo: 'Prevenção de Burnout',
              desc: 'Score individual de risco de burnout atualizado semanalmente. Alertas automáticos para líderes quando um colaborador ultrapassa o limiar crítico.',
              cor: '#F59E0B', badge: 'Crítico'
            },
            {
              emoji: '📊', titulo: 'ISHO — Índice de Saúde Organizacional',
              desc: 'Score 0-100 da saúde do time como um todo. Histórico semanal, comparação entre departamentos e metas de melhoria com IA.',
              cor: '#06B6D4', badge: 'Exclusivo'
            },
            {
              emoji: '🎯', titulo: 'DISC Comportamental',
              desc: 'Mapeamento do perfil dominante, influente, estável e conformista de cada colaborador. Otimize times, reduza conflitos e aumente o engajamento.',
              cor: '#A855F7', badge: 'Popular'
            },
            {
              emoji: '🤖', titulo: 'Diagnóstico com Gemini AI',
              desc: 'Relatório executivo semanal gerado por IA com análise profunda, pontos de atenção e recomendações práticas para cada gestor.',
              cor: '#EC4899', badge: 'IA'
            },
            {
              emoji: '📋', titulo: 'Conformidade NR-1 Documentada',
              desc: 'Relatório PDF completo com inventário psicossocial, GRO, plano de ação e declaração jurídica pronta para apresentar ao MTE.',
              cor: '#10B981', badge: 'Legal'
            },
          ].map(s => (
            <div key={s.titulo} style={{ background: '#0E0E1A', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, background: `${s.cor}22`, border: `1px solid ${s.cor}44`, borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 800, color: s.cor, letterSpacing: '.06em' }}>{s.badge}</div>
              <div style={{ fontSize: 34, marginBottom: 14 }}>{s.emoji}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: '#F0F0FF' }}>{s.titulo}</h3>
              <p style={{ fontSize: 13, color: 'rgba(240,240,255,.5)', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(255,255,255,.05)', borderBottom: '1px solid rgba(255,255,255,.05)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, marginBottom: 48 }}>Como funciona em 3 passos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { n: '01', t: 'Cadastre sua empresa', d: 'Configure em minutos. Convide colaboradores por link ou e-mail. Sem necessidade de TI.' },
              { n: '02', t: 'Time responde check-ins', d: 'Formulários rápidos (2 min) enviados semanalmente. Adesão alta por ser simples e anônimo.' },
              { n: '03', t: 'Você recebe os insights', d: 'Dashboard em tempo real + relatório PDF gerado por IA toda segunda-feira no seu e-mail.' },
            ].map(p => (
              <div key={p.n} style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#10B981,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 18, fontWeight: 900, color: '#fff' }}>{p.n}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{p.t}</h3>
                <p style={{ fontSize: 13, color: 'rgba(240,240,255,.45)', lineHeight: 1.6 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(168,85,247,.12)', border: '1px solid rgba(168,85,247,.3)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: '#A855F7', marginBottom: 20, letterSpacing: '.08em' }}>DIFERENCIAL EXCLUSIVO</div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
              Psicologia Organizacional + IA + Jurídico em um só produto
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(240,240,255,.55)', lineHeight: 1.8, marginBottom: 28 }}>
              Criado por uma especialista em <strong style={{ color: '#F0F0FF' }}>Gestão de Pessoas e Psicologia Organizacional</strong>, o Essencial Sense AI combina a ciência do comportamento humano com inteligência artificial de última geração para entregar resultados que nenhum concorrente consegue oferecer.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                '🧬 Único com ISHO + DISC + Burnout integrados',
                '⚖️ Relatório NR-1 juridicamente válido',
                '🤖 IA Gemini 2.0 Flash — diagnóstico em linguagem humana',
                '🎯 Alertas proativos antes de problemas graves',
                '🔒 Dados anonimizados e conformidade LGPD',
              ].map(d => (
                <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(240,240,255,.75)' }}>{d}</div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { emoji: '📈', t: 'Reduz turnover', d: 'Detecta risco de saída com 2–4 semanas de antecedência' },
              { emoji: '💚', t: 'Clima saudável', d: 'Times mais engajados e produtivos comprovadamente' },
              { emoji: '🏆', t: 'Liderança data-driven', d: 'Decisões baseadas em dados, não em intuição' },
              { emoji: '⚡', t: 'ROI imediato', d: 'Economia em afastamentos e rescisões evitadas' },
            ].map(c => (
              <div key={c.t} style={{ background: '#0E0E1A', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{c.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>{c.t}</div>
                <div style={{ fontSize: 12, color: 'rgba(240,240,255,.4)', lineHeight: 1.5 }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg,rgba(16,185,129,.08),rgba(168,85,247,.12))', border: '1px solid rgba(168,85,247,.2)', borderRadius: 28, padding: '56px 40px' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 900, marginBottom: 16 }}>Pronto para transformar sua cultura?</h2>
          <p style={{ fontSize: 15, color: 'rgba(240,240,255,.55)', marginBottom: 36, lineHeight: 1.7 }}>
            Solicite uma demonstração gratuita e veja como o Essencial Sense AI pode proteger sua empresa, aumentar o engajamento e colocar você em conformidade com a NR-1.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/empresa/criar" style={{ background: 'linear-gradient(135deg,#10B981,#A855F7)', color: '#fff', textDecoration: 'none', padding: '16px 36px', borderRadius: 14, fontSize: 16, fontWeight: 800 }}>
              Solicitar demonstração →
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{ background: '#25D366', color: '#fff', textDecoration: 'none', padding: '16px 28px', borderRadius: 14, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 22, marginBottom: 8 }}>🧠</div>
              <div style={{ fontWeight: 900, fontSize: 15, background: 'linear-gradient(135deg,#10B981,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>Essencial Sense AI</div>
              <div style={{ fontSize: 12, color: 'rgba(240,240,255,.35)', lineHeight: 1.7 }}>
                Plataforma de saúde organizacional com IA.<br />
                Parte do ecossistema <strong style={{ color: 'rgba(240,240,255,.5)' }}>Essencial Digital</strong>.
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Especialista responsável</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F0F0FF', marginBottom: 2 }}>Alana Carvalho</div>
              <div style={{ fontSize: 12, color: 'rgba(240,240,255,.4)', lineHeight: 1.6, marginBottom: 10 }}>Gestão de Pessoas<br />Psicologia Organizacional</div>
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>
              <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700, fontSize: 42, color: 'rgba(240,240,255,.85)', lineHeight: 1 }}>AC</span>
              <div style={{ width: 42, height: 1.5, background: '#10B981', borderRadius: 2, marginTop: 2 }}></div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Contato</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href={WA} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  +55 (61) 98527-2681
                </a>
                <a href={`mailto:${EMAIL}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(240,240,255,.5)', textDecoration: 'none' }}>
                  ✉️ {EMAIL}
                </a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Legal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="/lgpd" style={{ fontSize: 13, color: 'rgba(240,240,255,.4)', textDecoration: 'none' }}>🔒 Política de Privacidade (LGPD)</a>
                <a href="/lgpd" style={{ fontSize: 13, color: 'rgba(240,240,255,.4)', textDecoration: 'none' }}>📋 Termos de Uso</a>
                <div style={{ fontSize: 12, color: 'rgba(240,240,255,.25)', marginTop: 6, lineHeight: 1.6 }}>Dados tratados conforme<br />Lei nº 13.709/2018 — LGPD</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'rgba(240,240,255,.2)' }}>© 2025 Essencial Digital · Todos os direitos reservados</div>
            <div style={{ fontSize: 12, color: 'rgba(240,240,255,.2)' }}>CNPJ · Brasília, DF · Brasil</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
