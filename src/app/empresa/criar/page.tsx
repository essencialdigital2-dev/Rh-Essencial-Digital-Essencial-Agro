'use client'

import { useState } from 'react'

const PLANOS = [
  {
    id: 'starter',
    nome: 'Starter',
    preco: 'R$ 800/mês',
    limite: 'até 30 colaboradores',
    features: [
      'Check-in emocional diário',
      'ISHO — saúde organizacional',
      'Score de burnout individual',
      'Alertas de risco de saída',
      'Dashboard RH em tempo real',
      'Conformidade NR-1 documentada',
    ],
    economia: 'R$ 26/colab/mês — NR-1 cumprida + saúde + DISC',
    cor: '#10B981',
  },
  {
    id: 'growth',
    nome: 'Growth',
    preco: 'R$ 1.990/mês',
    limite: 'até 100 colaboradores',
    destaque: true,
    features: [
      'Tudo do Starter',
      'DISC comportamental completo',
      'Relatório executivo com IA',
      'Histórico semanal ISHO',
      'Score NexoPerform integrado',
      'Link de convite personalizado',
      'Diagnóstico Gemini AI semanal',
    ],
    economia: 'R$ 19,90/colab/mês — menos que 1 sessão de terapia',
    cor: '#A855F7',
  },
  {
    id: 'scale',
    nome: 'Scale',
    preco: 'R$ 5.000/mês',
    limite: '100+ colaboradores',
    features: [
      'Tudo do Growth',
      'Colaboradores ilimitados',
      'API de integração',
      'Onboarding personalizado',
      'Suporte prioritário',
      'Relatório jurídico NR-1 mensal',
    ],
    economia: 'Menos de R$ 50/colab — autuação NR-1 custa muito mais',
    cor: '#EC4899',
  },
  {
    id: 'bundle',
    nome: 'Bundle',
    preco: 'R$ 8.000/m��s',
    limite: 'Sense AI + NexoPerform ilimitados',
    features: [
      'Tudo do Scale — Essencial Sense AI',
      'Tudo do Scale — NexoPerform',
      'DISC + Saúde + ISHO + Performance',
      'Relatório NR-1 mensal incluso',
      'Consultoria mensal com a equipe',
      'Economia de R$ 2.000/mês vs separado',
    ],
    economia: 'Separado: R$ 10.000/mês — Bundle: R$ 8.000 — você economiza R$ 2.000',
    cor: '#F59E0B',
  },
]

type Etapa = 'plano' | 'dados' | 'sucesso'

export default function CriarEmpresaSensePage() {
  const [etapa, setEtapa] = useState<Etapa>('plano')
  const [plano, setPlano] = useState('growth')
  const [form, setForm] = useState({ nome: '', email: '', setor: '', porte: '' })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [codigoConvite, setCodigoConvite] = useState('')

  async function criar() {
    if (!form.nome || !form.email) { setErro('Nome e e-mail são obrigatórios.'); return }
    setLoading(true); setErro('')
    try {
      const res = await fetch('/api/empresa/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plano, produto: 'sense' }),
      })
      const data = await res.json()
      if (!res.ok) { setErro(data.error || 'Erro ao criar empresa.'); setLoading(false); return }
      setCodigoConvite(data.empresa?.codigo_convite || '')
      setEtapa('sucesso')
    } catch { setErro('Erro de conexão. Tente novamente.') }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', color: '#F0F0FF', padding: '40px 20px 80px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <a href="/" style={{ fontSize: 11, color: 'rgba(240,240,255,.3)', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>← voltar</a>
          <div style={{ fontSize: 42, marginBottom: 10 }}>🧠</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg,#10B981,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sense AI para Empresas
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(240,240,255,.5)', maxWidth: 480, margin: '0 auto' }}>
            Saúde emocional, burnout e performance da equipe — monitorados com IA em tempo real
          </p>
        </div>

        {etapa === 'sucesso' ? (
          <Sucesso codigo={codigoConvite} email={form.email} plano={plano} />
        ) : etapa === 'plano' ? (
          <SelecionarPlano plano={plano} setPlano={setPlano} onAvancar={() => setEtapa('dados')} />
        ) : (
          <FormDados form={form} setForm={setForm} plano={plano} loading={loading} erro={erro} onVoltar={() => setEtapa('plano')} onCriar={criar} />
        )}
      </div>
    </div>
  )
}

function SelecionarPlano({ plano, setPlano, onAvancar }: { plano: string; setPlano: (p: string) => void; onAvancar: () => void }) {
  return (
    <div>
      {/* Comparação com mercado */}
      <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 14, padding: '14px 20px', marginBottom: 28, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Zenklub (saúde mental)', valor: 'R$ 22/colab/mês', obs: 'só saúde mental' },
          { label: 'Sólides (RH + DP + DISC)', valor: 'R$ 500–3.000/mês', obs: 'sem IA em tempo real' },
          { label: 'Essencial Sense AI', valor: 'R$ 800–5.000/empresa', obs: '✓ NR-1 + saúde + DISC + IA + ISHO' },
        ].map(c => (
          <div key={c.label} style={{ textAlign: 'center', minWidth: 160 }}>
            <div style={{ fontSize: 11, color: 'rgba(240,240,255,.4)', marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F0F0FF' }}>{c.valor}</div>
            <div style={{ fontSize: 10, color: 'rgba(240,240,255,.35)' }}>{c.obs}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginBottom: 28 }}>
        {PLANOS.map(p => (
          <div key={p.id} onClick={() => setPlano(p.id)}
            style={{ background: plano === p.id ? `rgba(${p.id === 'starter' ? '16,185,129' : p.id === 'growth' ? '168,85,247' : '236,72,153'},.1)` : '#0E0E1A', border: `2px solid ${plano === p.id ? p.cor : p.destaque ? 'rgba(168,85,247,.25)' : 'rgba(255,255,255,.07)'}`, borderRadius: 18, padding: '28px 22px', cursor: 'pointer', transition: '.2s', position: 'relative' }}>
            {p.destaque && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#A855F7,#EC4899)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 14px', borderRadius: '0 0 10px 10px', whiteSpace: 'nowrap' }}>MAIS POPULAR</div>}
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{p.nome}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: p.cor, marginBottom: 2 }}>{p.preco}</div>
            <div style={{ fontSize: 12, color: 'rgba(240,240,255,.4)', marginBottom: 6 }}>{p.limite}</div>
            <div style={{ fontSize: 11, color: '#10B981', marginBottom: 18 }}>{p.economia}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(240,240,255,.7)' }}>
                  <span style={{ color: p.cor, flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={onAvancar}
          style={{ background: 'linear-gradient(135deg,#10B981,#A855F7)', color: '#fff', border: 'none', borderRadius: 14, padding: '16px 52px', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
          Começar com {PLANOS.find(p => p.id === plano)?.nome} →
        </button>
        <p style={{ fontSize: 12, color: 'rgba(240,240,255,.3)', marginTop: 10 }}>7 dias gratuitos · Cancele quando quiser · Sem fidelidade</p>
      </div>
    </div>
  )
}

function FormDados({ form, setForm, plano, loading, erro, onVoltar, onCriar }: {
  form: { nome: string; email: string; setor: string; porte: string }
  setForm: (f: typeof form) => void
  plano: string; loading: boolean; erro: string
  onVoltar: () => void; onCriar: () => void
}) {
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })
  const planoInfo = PLANOS.find(p => p.id === plano)

  return (
    <div style={{ background: '#0E0E1A', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: 36, maxWidth: 520, margin: '0 auto' }}>
      <button onClick={onVoltar} style={{ background: 'none', border: 'none', color: 'rgba(240,240,255,.4)', fontSize: 13, cursor: 'pointer', marginBottom: 20, padding: 0 }}>← alterar plano</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, padding: '12px 16px', background: `rgba(${plano === 'starter' ? '16,185,129' : plano === 'growth' ? '168,85,247' : '236,72,153'},.08)`, borderRadius: 12, border: `1px solid ${planoInfo?.cor}33` }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#F0F0FF' }}>Plano {planoInfo?.nome}</div>
          <div style={{ fontSize: 11, color: 'rgba(240,240,255,.4)' }}>{planoInfo?.limite}</div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: planoInfo?.cor }}>{planoInfo?.preco}</div>
      </div>

      {[
        { label: 'Nome da empresa *', key: 'nome', type: 'text', placeholder: 'Ex: Acme Tecnologia' },
        { label: 'E-mail do gestor *', key: 'email', type: 'email', placeholder: 'voce@empresa.com.br' },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>{f.label}</label>
          <input type={f.type} value={form[f.key as keyof typeof form]} onChange={set(f.key as keyof typeof form)} placeholder={f.placeholder}
            style={{ width: '100%', background: '#13131F', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '12px 14px', color: '#F0F0FF', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>Setor</label>
          <select value={form.setor} onChange={set('setor')} style={{ width: '100%', background: '#13131F', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '12px 14px', color: form.setor ? '#F0F0FF' : 'rgba(240,240,255,.3)', fontSize: 14, outline: 'none' }}>
            <option value="">Selecionar...</option>
            {['Tecnologia', 'Saúde', 'Educação', 'Varejo', 'Financeiro', 'Indústria', 'Consultoria', 'Agronegócio', 'Outro'].map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>Porte</label>
          <select value={form.porte} onChange={set('porte')} style={{ width: '100%', background: '#13131F', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '12px 14px', color: form.porte ? '#F0F0FF' : 'rgba(240,240,255,.3)', fontSize: 14, outline: 'none' }}>
            <option value="">Selecionar...</option>
            {[['startup', 'Startup (1–10)'], ['pequena', 'Pequena (11–50)'], ['media', 'Média (51–200)'], ['grande', 'Grande (200+)']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {erro && <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444', marginBottom: 16 }}>{erro}</div>}

      <button onClick={onCriar} disabled={loading}
        style={{ width: '100%', background: 'linear-gradient(135deg,#10B981,#A855F7)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}>
        {loading ? '⏳ Criando painel...' : '🚀 Criar painel — 7 dias grátis →'}
      </button>
      <p style={{ fontSize: 11, color: 'rgba(240,240,255,.25)', textAlign: 'center', marginTop: 10 }}>
        Sem cartão de crédito agora · Você receberá o link de acesso por e-mail
      </p>
    </div>
  )
}

function Sucesso({ codigo, email, plano }: { codigo: string; email: string; plano: string }) {
  const planoInfo = PLANOS.find(p => p.id === plano)
  return (
    <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Painel criado com sucesso!</h2>
      <p style={{ fontSize: 14, color: 'rgba(240,240,255,.5)', marginBottom: 28 }}>
        Enviamos as instruções para <strong style={{ color: '#F0F0FF' }}>{email}</strong>
      </p>

      {codigo && (
        <div style={{ background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Link de convite para o time</div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '.15em', color: '#F0F0FF', marginBottom: 12 }}>{codigo}</div>
          <button onClick={() => navigator.clipboard.writeText(codigo).then(() => alert('Copiado!'))}
            style={{ background: 'rgba(16,185,129,.15)', border: '1px solid rgba(16,185,129,.3)', color: '#10B981', padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Copiar código
          </button>
        </div>
      )}

      <div style={{ background: '#0E0E1A', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 20, marginBottom: 24, textAlign: 'left' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF', marginBottom: 14 }}>Próximos passos:</div>
        {[
          { n: '1', texto: 'Acesse seu painel de gestor', sub: 'Veja o dashboard em tempo real' },
          { n: '2', texto: 'Convide sua equipe', sub: 'Compartilhe o código de convite' },
          { n: '3', texto: 'IA começa a monitorar', sub: 'Check-ins diários + ISHO semanal automático' },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#10B981,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F0FF' }}>{s.texto}</div>
              <div style={{ fontSize: 12, color: 'rgba(240,240,255,.4)' }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <a href="/dashboard" style={{ display: 'block', background: 'linear-gradient(135deg,#10B981,#A855F7)', color: '#fff', textDecoration: 'none', padding: '16px', borderRadius: 14, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
        Acessar meu painel →
      </a>
      <a href="/sense" style={{ display: 'block', color: 'rgba(240,240,255,.4)', fontSize: 13, textDecoration: 'none' }}>
        Ver demonstração do Sense AI
      </a>
    </div>
  )
}
