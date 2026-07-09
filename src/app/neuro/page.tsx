'use client'
import { useState } from 'react'
import {
  constelacoes, getConstelacao, getCheckInAdaptado,
  PERFIS_LABELS, DISC_LABELS,
  type NeuroPerfil, type DiscTipo, type ConstelacaoEmocional
} from '@/lib/sense-neuro'

const PERFIS: NeuroPerfil[] = ['TDAH', 'TEA', 'Dislexia', 'AltasHabilidades', 'Descobrindo']
const DISCS: DiscTipo[] = ['D', 'I', 'S', 'C']

const PERFIL_ICONS: Record<NeuroPerfil, string> = {
  TDAH: '⚡',
  TEA: '🌐',
  Dislexia: '🎨',
  AltasHabilidades: '✨',
  Descobrindo: '🔍'
}

const DISC_ICONS: Record<DiscTipo, string> = {
  D: '🔥', I: '🌟', S: '🌿', C: '🔬'
}

const DISC_COLORS: Record<DiscTipo, string> = {
  D: '#EF4444', I: '#F59E0B', S: '#10B981', C: '#3B82F6'
}

export default function NeuroPage() {
  const [etapa, setEtapa] = useState<'intro' | 'perfil' | 'disc' | 'resultado' | 'checkin'>('intro')
  const [perfil, setPerfil] = useState<NeuroPerfil | null>(null)
  const [disc, setDisc] = useState<DiscTipo | null>(null)
  const [aba, setAba] = useState<'visao' | 'saude' | 'janela' | 'polivagal' | 'proposito' | 'gestor' | 'acomodacoes'>('visao')
  const [respostasCheckin, setRespostasCheckin] = useState<Record<number, string>>({})
  const [diagnosticoIA, setDiagnosticoIA] = useState<string | null>(null)
  const [loadingIA, setLoadingIA] = useState(false)

  const constelacao = perfil && disc ? getConstelacao(perfil, disc) : null
  const checkIns = perfil ? getCheckInAdaptado(perfil) : []

  async function gerarDiagnosticoIA() {
    if (!constelacao || Object.keys(respostasCheckin).length < checkIns.length) return
    setLoadingIA(true)
    try {
      const res = await fetch('/api/neuro-diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ constelacao, respostas: respostasCheckin, checkIns })
      })
      const data = await res.json()
      setDiagnosticoIA(data.diagnostico)
    } catch {
      setDiagnosticoIA('Não foi possível gerar o diagnóstico agora. Tente novamente.')
    }
    setLoadingIA(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a15 0%, #0d0d1f 50%, #0a1020 100%)', fontFamily: 'system-ui, sans-serif', color: '#F8F8FF' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(139,92,246,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(13,13,31,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <a href="/sense-app" style={{ color: '#A78BFA', textDecoration: 'none', fontSize: '20px' }}>←</a>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F8FF' }}>Sense Neuro</div>
          <div style={{ fontSize: '11px', color: 'rgba(248,248,255,0.4)' }}>Saúde emocional + Neurodiversidade + IA</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', padding: '4px 10px', borderRadius: '99px' }}>NOVO</div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* INTRO */}
        {etapa === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🧠</div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', background: 'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sense Neuro
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(248,248,255,0.6)', marginBottom: '8px', lineHeight: 1.7 }}>
              Seu perfil neurodivergente encontra seu DISC comportamental.<br />
              A IA cruza neurociência, psicologia organizacional e propósito<br />
              para gerar um diagnóstico emocional único - seu.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', margin: '32px 0', textAlign: 'left' }}>
              {[
                { icon: '🧬', label: 'Neurociência', desc: 'Como seu cérebro processa emoções, estresse e relações' },
                { icon: '🎯', label: 'DISC + Perfil', desc: '20 constelações únicas de perfil + comportamento' },
                { icon: '🤖', label: 'IA como núcleo', desc: 'Gemini gera diagnóstico personalizado com check-in adaptado' }
              ].map(item => (
                <div key={item.label} style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(248,248,255,0.5)' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '32px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', marginBottom: '6px' }}>🔒 Privacidade e LGPD</div>
              <div style={{ fontSize: '12px', color: 'rgba(248,248,255,0.5)' }}>
                Suas respostas são confidenciais. O gestor acessa apenas indicadores agregados - nunca dados individuais identificados. Em conformidade com a LGPD e Lei 8.213/91.
              </div>
            </div>

            <button
              onClick={() => setEtapa('perfil')}
              style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px 40px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
            >
              Iniciar minha jornada →
            </button>
          </div>
        )}

        {/* SELEÇÃO DE PERFIL */}
        {etapa === 'perfil' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#A78BFA', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Passo 1 de 2</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Qual é o seu perfil neurodivergente?</h2>
              <p style={{ fontSize: '14px', color: 'rgba(248,248,255,0.5)' }}>Se ainda não tem diagnóstico formal, escolha "Em Descoberta"</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PERFIS.map(p => (
                <button
                  key={p}
                  onClick={() => { setPerfil(p); setEtapa('disc') }}
                  style={{
                    background: 'rgba(139,92,246,0.08)',
                    border: `2px solid ${perfil === p ? '#8B5CF6' : 'rgba(139,92,246,0.2)'}`,
                    borderRadius: '12px', padding: '20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left',
                    transition: 'all .2s'
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{PERFIL_ICONS[p]}</span>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F8FF', marginBottom: '4px' }}>{PERFIS_LABELS[p]}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(248,248,255,0.4)' }}>
                      {p === 'TDAH' && 'Transtorno de Déficit de Atenção e Hiperatividade'}
                      {p === 'TEA' && 'Transtorno do Espectro Autista'}
                      {p === 'Dislexia' && 'Dificuldade de processamento fonológico e leitura'}
                      {p === 'AltasHabilidades' && 'Superdotação e sobredotação cognitiva'}
                      {p === 'Descobrindo' && 'Suspeita ou processo de investigação em andamento'}
                    </div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'rgba(248,248,255,0.3)', fontSize: '20px' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SELEÇÃO DE DISC */}
        {etapa === 'disc' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#A78BFA', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Passo 2 de 2</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Qual é o seu perfil DISC dominante?</h2>
              <p style={{ fontSize: '14px', color: 'rgba(248,248,255,0.5)' }}>Se realizou o DISC no Sense AI, use o resultado. Se não, escolha o que mais te representa.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {DISCS.map(d => (
                <button
                  key={d}
                  onClick={() => { setDisc(d); setEtapa('resultado') }}
                  style={{
                    background: `${DISC_COLORS[d]}12`,
                    border: `2px solid ${DISC_COLORS[d]}40`,
                    borderRadius: '12px', padding: '24px', cursor: 'pointer',
                    textAlign: 'center', transition: 'all .2s'
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{DISC_ICONS[d]}</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: DISC_COLORS[d], marginBottom: '4px' }}>{d}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(248,248,255,0.6)' }}>{DISC_LABELS[d]}</div>
                </button>
              ))}
            </div>

            <button onClick={() => setEtapa('perfil')} style={{ marginTop: '20px', background: 'transparent', border: 'none', color: 'rgba(248,248,255,0.4)', cursor: 'pointer', fontSize: '14px' }}>
              ← Voltar
            </button>
          </div>
        )}

        {/* RESULTADO */}
        {etapa === 'resultado' && constelacao && (
          <div>
            {/* Header da constelação */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#A78BFA', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                {PERFIS_LABELS[constelacao.perfil]} × DISC {constelacao.disc}
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', background: 'linear-gradient(135deg,#A78BFA,#EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {constelacao.nome}
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(248,248,255,0.6)', fontStyle: 'italic', marginBottom: '20px' }}>
                "{constelacao.frase}"
              </p>
              <button
                onClick={() => setEtapa('checkin')}
                style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginRight: '12px' }}
              >
                🤖 Diagnóstico com IA →
              </button>
              <button
                onClick={() => { setPerfil(null); setDisc(null); setEtapa('perfil') }}
                style={{ background: 'transparent', border: '1px solid rgba(248,248,255,0.2)', borderRadius: '10px', padding: '12px 20px', fontSize: '14px', color: 'rgba(248,248,255,0.5)', cursor: 'pointer' }}
              >
                Refazer
              </button>
            </div>

            {/* Abas */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {([
                { key: 'visao', label: '🧬 Neurociência' },
                { key: 'saude', label: '💚 Saúde Emocional' },
                { key: 'janela', label: '🕐 Janela Neuro' },
                { key: 'polivagal', label: '🌊 Polivagal' },
                { key: 'proposito', label: '🎯 Propósito' },
                { key: 'gestor', label: '👔 Para o Gestor' },
                { key: 'acomodacoes', label: '⚖️ Acomodações' }
              ] as { key: typeof aba; label: string }[]).map(item => (
                <button
                  key={item.key}
                  onClick={() => setAba(item.key)}
                  style={{
                    background: aba === item.key ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.08)',
                    border: `1px solid ${aba === item.key ? '#8B5CF6' : 'rgba(139,92,246,0.2)'}`,
                    borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 600,
                    color: aba === item.key ? '#C4B5FD' : 'rgba(248,248,255,0.5)',
                    cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Conteúdo das abas */}
            <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '16px', padding: '24px' }}>

              {aba === 'visao' && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#A78BFA' }}>🧬 Base Neurocientífica</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(248,248,255,0.75)', lineHeight: 1.8 }}>{constelacao.neurociencia}</p>
                </div>
              )}

              {aba === 'saude' && (
                <div>
                  <Section title="✨ Pontos de Força" color="#10B981" items={constelacao.saudeEmocional.pontosForca} />
                  <div style={{ marginTop: '20px' }}>
                    <Section title="⚠️ Vulnerabilidades" color="#F59E0B" items={constelacao.saudeEmocional.vulnerabilidades} />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <Section title="🚨 Sinais de Burnout" color="#EF4444" items={constelacao.saudeEmocional.sinaisBurnout} />
                  </div>
                </div>
              )}

              {aba === 'janela' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <InfoCard icon="⏰" label="Melhor Horário" value={constelacao.janelaNeuro.melhorHorario} />
                  <InfoCard icon="🏢" label="Ambiente Ideal" value={constelacao.janelaNeuro.ambienteIdeal} />
                  <InfoCard icon="🔄" label="Ritmo Ótimo" value={constelacao.janelaNeuro.ritmoOtimo} />
                </div>
              )}

              {aba === 'polivagal' && (
                <div>
                  <InfoCard icon="🌊" label="Estado Dominante do Sistema Nervoso" value={constelacao.polivagal.estadoDominante} />
                  <div style={{ marginTop: '20px' }}>
                    <Section title="⚡ Gatilhos Organizacionais" color="#EF4444" items={constelacao.polivagal.gatilhosOrganizacionais} />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <Section title="🌿 Estratégias de Regulação" color="#10B981" items={constelacao.polivagal.estrategiaRegulacao} />
                  </div>
                </div>
              )}

              {aba === 'proposito' && (
                <div>
                  <Section title="🔥 Motivadores" color="#F59E0B" items={constelacao.proposito.motivadores} />
                  <div style={{ marginTop: '20px' }}>
                    <InfoCard icon="⚡" label="Estado de Flow" value={constelacao.proposito.flow} />
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <InfoCard icon="💡" label="Sentido no Trabalho" value={constelacao.proposito.sentidoNoTrabalho} />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <Section title="🌱 Estratégias de Autocuidado" color="#A78BFA" items={constelacao.estrategiasCuidado} />
                  </div>
                </div>
              )}

              {aba === 'gestor' && (
                <div>
                  <InfoCard icon="💬" label="Como Comunicar" value={constelacao.paraOGestor.comunicação} />
                  <div style={{ marginTop: '16px' }}>
                    <InfoCard icon="🏢" label="Ambiente Ideal" value={constelacao.paraOGestor.ambiente} />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <Section title="🚫 O que Evitar" color="#EF4444" items={constelacao.paraOGestor.evitar} />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <Section title="🚀 Como Potencializar" color="#10B981" items={constelacao.paraOGestor.potencializar} />
                  </div>
                </div>
              )}

              {aba === 'acomodacoes' && (
                <div>
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>⚖️ Base Legal</div>
                    <div style={{ fontSize: '12px', color: 'rgba(248,248,255,0.6)' }}>
                      Lei 8.213/91 - Cotas para PcD · NR-1 (Portaria MTE 1.419/2024) · LGPD · Convenção ONU sobre Direitos das Pessoas com Deficiência
                    </div>
                  </div>
                  <Section title="Acomodações Razoáveis Recomendadas" color="#A78BFA" items={constelacao.acomodacoesRazoaveis} />
                  <div style={{ marginTop: '20px', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#A78BFA', marginBottom: '8px' }}>📊 ISHO-N - Índice de Saúde Organizacional Neurodiverso</div>
                    <div style={{ fontSize: '13px', color: 'rgba(248,248,255,0.7)', lineHeight: 1.7 }}>{constelacao.ishoN}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Mensagem de pertencimento */}
            <div style={{ marginTop: '24px', textAlign: 'center', background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#A78BFA', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Mensagem de Pertencimento</div>
              <p style={{ fontSize: '16px', color: 'rgba(248,248,255,0.9)', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
                "{constelacao.mensagemPertencimento}"
              </p>
            </div>
          </div>
        )}

        {/* CHECK-IN ADAPTADO */}
        {etapa === 'checkin' && constelacao && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#A78BFA', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Check-in Adaptado - {PERFIS_LABELS[constelacao.perfil]}</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Como você está hoje?</h2>
              <p style={{ fontSize: '14px', color: 'rgba(248,248,255,0.5)' }}>Perguntas adaptadas ao seu perfil neurodivergente</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {checkIns.map((pergunta, idx) => (
                <div key={idx} style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{idx + 1}. {pergunta}</div>
                  <textarea
                    value={respostasCheckin[idx] || ''}
                    onChange={e => setRespostasCheckin(prev => ({ ...prev, [idx]: e.target.value }))}
                    placeholder="Sua resposta..."
                    style={{
                      width: '100%', minHeight: '80px', background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px',
                      color: '#F8F8FF', fontSize: '14px', padding: '12px',
                      fontFamily: 'system-ui, sans-serif', resize: 'vertical', boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={gerarDiagnosticoIA}
                disabled={loadingIA || Object.keys(respostasCheckin).length < checkIns.length}
                style={{
                  flex: 1, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  padding: '16px', fontSize: '15px', fontWeight: 700,
                  cursor: loadingIA ? 'wait' : 'pointer', opacity: Object.keys(respostasCheckin).length < checkIns.length ? 0.5 : 1
                }}
              >
                {loadingIA ? '🤖 Gerando diagnóstico...' : '🤖 Gerar Diagnóstico com IA'}
              </button>
              <button
                onClick={() => setEtapa('resultado')}
                style={{ background: 'transparent', border: '1px solid rgba(248,248,255,0.2)', borderRadius: '12px', padding: '16px 20px', fontSize: '14px', color: 'rgba(248,248,255,0.5)', cursor: 'pointer' }}
              >
                ← Voltar
              </button>
            </div>

            {diagnosticoIA && (
              <div style={{ marginTop: '32px', background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1))', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#A78BFA', marginBottom: '16px' }}>🤖 Diagnóstico Emocional - Gerado pela IA</div>
                <div style={{ fontSize: '14px', color: 'rgba(248,248,255,0.85)', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{diagnosticoIA}</div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function Section({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div>
      <div style={{ fontSize: '13px', fontWeight: 700, color, marginBottom: '10px' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: 'rgba(248,248,255,0.75)', lineHeight: 1.6 }}>
            <span style={{ color, marginTop: '2px', flexShrink: 0 }}>•</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '14px 16px' }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(248,248,255,0.4)', marginBottom: '6px' }}>{icon} {label}</div>
      <div style={{ fontSize: '13px', color: 'rgba(248,248,255,0.8)', lineHeight: 1.7 }}>{value}</div>
    </div>
  )
}
