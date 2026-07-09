'use client'

import { useState } from 'react'

type Etapa = 'form' | 'sucesso'

export default function SolicitarDemoPage() {
  const [etapa, setEtapa] = useState<Etapa>('form')
  const [form, setForm] = useState({ nome: '', email: '', empresa: '', telefone: '', setor: '', porte: '', mensagem: '' })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  async function enviar() {
    if (!form.nome || !form.email || !form.empresa) { setErro('Nome, e-mail e empresa são obrigatórios.'); return }
    setLoading(true); setErro('')
    try {
      await fetch('/api/empresa/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plano: 'demo', produto: 'sense' }),
      })
      setEtapa('sucesso')
    } catch { setErro('Erro de conexão. Tente novamente.') }
    setLoading(false)
  }

  if (etapa === 'sucesso') return (
    <div style={{ minHeight: '100vh', background: '#07070F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#F0F0FF', marginBottom: 8 }}>Solicitação recebida!</h2>
        <p style={{ fontSize: 14, color: 'rgba(240,240,255,.5)', marginBottom: 28 }}>
          Entraremos em contato com <strong style={{ color: '#F0F0FF' }}>{form.email}</strong> em até 24 horas para agendar sua demonstração.
        </p>
        <div style={{ background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
          {[
            '🧠 Saúde emocional e burnout em tempo real',
            '📊 ISHO - Índice de Saúde Organizacional',
            '🎯 DISC comportamental da equipe',
            '📋 Relatório de conformidade NR-1',
            '🤖 Diagnóstico semanal com Gemini AI',
          ].map(f => (
            <div key={f} style={{ fontSize: 13, color: 'rgba(240,240,255,.7)', marginBottom: 8, textAlign: 'left' }}>{f}</div>
          ))}
        </div>
        <a href="/" style={{ display: 'block', background: 'linear-gradient(135deg,#10B981,#A855F7)', color: '#fff', textDecoration: 'none', padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
          Voltar ao início →
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#07070F', color: '#F0F0FF', padding: '40px 20px 80px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <a href="/" style={{ fontSize: 11, color: 'rgba(240,240,255,.3)', textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>← voltar</a>
          <div style={{ fontSize: 42, marginBottom: 10 }}>🧠</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg,#10B981,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Essencial Sense AI para Empresas
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(240,240,255,.5)', maxWidth: 400, margin: '0 auto' }}>
            Solicite uma demonstração gratuita. Nossa equipe entrará em contato em até 24 horas.
          </p>
        </div>

        {/* Benefícios */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
          {[
            { emoji: '🧠', texto: 'Saúde emocional em tempo real' },
            { emoji: '📊', texto: 'ISHO organizacional semanal' },
            { emoji: '🎯', texto: 'DISC comportamental do time' },
            { emoji: '📋', texto: 'Conformidade NR-1 documentada' },
            { emoji: '🤖', texto: 'Diagnóstico Gemini AI' },
            { emoji: '⚡', texto: 'Alertas de burnout e saída' },
          ].map(b => (
            <div key={b.emoji} style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#0E0E1A', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px' }}>
              <span style={{ fontSize: 16 }}>{b.emoji}</span>
              <span style={{ fontSize: 12, color: 'rgba(240,240,255,.65)' }}>{b.texto}</span>
            </div>
          ))}
        </div>

        {/* Formulário */}
        <div style={{ background: '#0E0E1A', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: 32 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>Dados para contato</div>

          {[
            { label: 'Seu nome *', key: 'nome', type: 'text', placeholder: 'Ex: Ana Lima' },
            { label: 'E-mail corporativo *', key: 'email', type: 'email', placeholder: 'ana@empresa.com.br' },
            { label: 'Nome da empresa *', key: 'empresa', type: 'text', placeholder: 'Ex: Acme Tecnologia' },
            { label: 'Telefone / WhatsApp', key: 'telefone', type: 'text', placeholder: '(11) 99999-9999' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} value={form[f.key as keyof typeof form] as string} onChange={set(f.key as keyof typeof form)} placeholder={f.placeholder}
                style={{ width: '100%', background: '#13131F', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '12px 14px', color: '#F0F0FF', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
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

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'rgba(240,240,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>Mensagem (opcional)</label>
            <textarea value={form.mensagem} onChange={set('mensagem')} placeholder="Conte um pouco sobre sua empresa e o que procura..." rows={3}
              style={{ width: '100%', background: '#13131F', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '12px 14px', color: '#F0F0FF', fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

          {erro && <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#EF4444', marginBottom: 16 }}>{erro}</div>}

          <button onClick={enviar} disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg,#10B981,#A855F7)', color: '#fff', border: 'none', borderRadius: 12, padding: '16px', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1 }}>
            {loading ? '⏳ Enviando...' : '🚀 Solicitar demonstração gratuita →'}
          </button>
          <p style={{ fontSize: 11, color: 'rgba(240,240,255,.25)', textAlign: 'center', marginTop: 10 }}>
            Retorno em até 24 horas · Sem compromisso
          </p>
        </div>

      </div>
    </div>
  )
}
