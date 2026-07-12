'use client'
import { useState, useEffect } from 'react'
import {
  constelacoes, getConstelacao, getCheckInAdaptado,
  PERFIS_LABELS, DISC_LABELS, PCD_INFO, getCheckInPcd,
  type NeuroPerfil, type DiscTipo, type ConstelacaoEmocional, type PcdPerfil
} from '@/lib/sense-neuro'

const PERFIS: NeuroPerfil[] = ['TDAH', 'TEA', 'Dislexia', 'AltasHabilidades', 'Descobrindo']
const DISCS: DiscTipo[] = ['D', 'I', 'S', 'C']
const PCD_PERFIS: PcdPerfil[] = ['Visual', 'Auditiva', 'Motora']

interface PcdCheckin { data: string; energia: number; fadiga: number; barreira: string }

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
  const [etapa, setEtapa] = useState<'intro' | 'perfil' | 'disc' | 'resultado' | 'checkin' | 'pcd-selecao' | 'pcd-resultado'>('intro')
  const [perfil, setPerfil] = useState<NeuroPerfil | null>(null)
  const [disc, setDisc] = useState<DiscTipo | null>(null)
  const [aba, setAba] = useState<'visao' | 'saude' | 'janela' | 'polivagal' | 'proposito' | 'gestor' | 'acomodacoes'>('visao')
  const [respostasCheckin, setRespostasCheckin] = useState<Record<number, string>>({})
  const [diagnosticoIA, setDiagnosticoIA] = useState<string | null>(null)
  const [loadingIA, setLoadingIA] = useState(false)
  const [pcdPerfil, setPcdPerfil] = useState<PcdPerfil | null>(null)
  const [pcdHistorico, setPcdHistorico] = useState<PcdCheckin[]>([])
  const [pcdForm, setPcdForm] = useState({ energia: 3, fadiga: 3, barreira: '' })
  const [pcdPredicao, setPcdPredicao] = useState<string | null>(null)
  const [pcdAnalisando, setPcdAnalisando] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('sense_pcd_checkins')
    if (s) setPcdHistorico(JSON.parse(s))
  }, [])

  function registrarPcdCheckin() {
    const novo: PcdCheckin = { data: new Date().toISOString(), ...pcdForm }
    const lista = [...pcdHistorico, novo]
    setPcdHistorico(lista)
    localStorage.setItem('sense_pcd_checkins', JSON.stringify(lista))
    setPcdForm({ energia: 3, fadiga: 3, barreira: '' })
  }

  async function gerarPredicaoPcd() {
    if (!pcdPerfil || pcdHistorico.length < 2) return
    setPcdAnalisando(true)
    try {
      const res = await fetch('/api/neuro-pcd-preditivo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pcdInfo: PCD_INFO[pcdPerfil], historico: pcdHistorico.slice(-10) }),
      })
      const d = await res.json()
      setPcdPredicao(d.texto)
    } catch {
      setPcdPredicao('Não foi possível gerar a análise agora. Tente novamente.')
    }
    setPcdAnalisando(false)
  }

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

            <div style={{ textAlign: 'center', margin: '24px 0 12px', fontSize: '12px', color: 'rgba(248,248,255,0.3)' }}>ou</div>
            <button
              onClick={() => setEtapa('pcd-selecao')}
              style={{ width: '100%', background: 'rgba(14,165,233,0.08)', border: '2px solid rgba(14,165,233,0.25)', borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}
            >
              <span style={{ fontSize: '26px' }}>♿</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8F8FF' }}>Sou PCD (deficiência visual, auditiva ou motora)</div>
                <div style={{ fontSize: '12px', color: 'rgba(248,248,255,0.4)' }}>Acesse acomodações e acompanhamento preditivo específico</div>
              </div>
            </button>
          </div>
        )}

        {/* SELEÇÃO DE PCD */}
        {etapa === 'pcd-selecao' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Qual sua condição?</h2>
              <p style={{ fontSize: '14px', color: 'rgba(248,248,255,0.5)' }}>A IA vai adaptar acomodações e acompanhamento preditivo pra você</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PCD_PERFIS.map(p => (
                <button key={p} onClick={() => { setPcdPerfil(p); setEtapa('pcd-resultado') }}
                  style={{ background: 'rgba(14,165,233,0.08)', border: `2px solid ${pcdPerfil === p ? '#0EA5E9' : 'rgba(14,165,233,0.2)'}`, borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                  <span style={{ fontSize: '32px' }}>{PCD_INFO[p].icone}</span>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#F8F8FF', marginBottom: '4px' }}>{PCD_INFO[p].label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(248,248,255,0.4)' }}>{PCD_INFO[p].desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'rgba(248,248,255,0.3)', fontSize: '20px' }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTADO PCD */}
        {etapa === 'pcd-resultado' && pcdPerfil && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 36 }}>{PCD_INFO[pcdPerfil].icone}</span>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>{PCD_INFO[pcdPerfil].label}</h2>
                <p style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)' }}>{PCD_INFO[pcdPerfil].desc}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: 8 }}>Pontos de força</div>
                {PCD_INFO[pcdPerfil].pontosForca.map((f, i) => <div key={i} style={{ fontSize: 12, marginBottom: 5, color: 'rgba(248,248,255,0.8)' }}>✓ {f}</div>)}
              </div>
              <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#F97316', textTransform: 'uppercase', marginBottom: 8 }}>Desafios no trabalho</div>
                {PCD_INFO[pcdPerfil].desafiosNoTrabalho.map((d, i) => <div key={i} style={{ fontSize: 12, marginBottom: 5, color: 'rgba(248,248,255,0.7)' }}>· {d}</div>)}
              </div>
              <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', marginBottom: 8 }}>Como comunicar com você</div>
                {PCD_INFO[pcdPerfil].comoComunicar.map((c, i) => <div key={i} style={{ fontSize: 12, marginBottom: 5, color: 'rgba(248,248,255,0.7)' }}>{i + 1}. {c}</div>)}
              </div>
              <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0EA5E9', textTransform: 'uppercase', marginBottom: 8 }}>Acomodações razoáveis</div>
                {PCD_INFO[pcdPerfil].acomodacoesRazoaveis.map((a, i) => <div key={i} style={{ fontSize: 12, marginBottom: 5, color: 'rgba(248,248,255,0.7)' }}>▸ {a}</div>)}
              </div>
            </div>

            {/* Check-in preditivo */}
            <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#A78BFA', marginBottom: 14 }}>✍️ Check-in de hoje</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(248,248,255,0.5)', display: 'block', marginBottom: 4 }}>Energia hoje: {pcdForm.energia}/5</label>
                  <input type="range" min={1} max={5} value={pcdForm.energia} onChange={e => setPcdForm(p => ({ ...p, energia: Number(e.target.value) }))} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(248,248,255,0.5)', display: 'block', marginBottom: 4 }}>Fadiga: {pcdForm.fadiga}/5</label>
                  <input type="range" min={1} max={5} value={pcdForm.fadiga} onChange={e => setPcdForm(p => ({ ...p, fadiga: Number(e.target.value) }))} style={{ width: '100%' }} />
                </div>
              </div>
              <input
                value={pcdForm.barreira}
                onChange={e => setPcdForm(p => ({ ...p, barreira: e.target.value }))}
                placeholder={getCheckInPcd(pcdPerfil)[1]}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)', color: '#F8F8FF', fontSize: 13, marginBottom: 14, boxSizing: 'border-box' }}
              />
              <button onClick={registrarPcdCheckin} style={{ width: '100%', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontWeight: 700, cursor: 'pointer' }}>
                Registrar check-in ({pcdHistorico.length} registrado{pcdHistorico.length === 1 ? '' : 's'})
              </button>
            </div>

            {pcdHistorico.length >= 2 && (
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 14, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: pcdPredicao ? 14 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#A78BFA' }}>🔮 Análise preditiva da IA</div>
                  <button onClick={gerarPredicaoPcd} disabled={pcdAnalisando} style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#A78BFA', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    {pcdAnalisando ? 'Analisando...' : pcdPredicao ? '🔄 Regerar' : 'Gerar análise'}
                  </button>
                </div>
                {pcdPredicao && <div style={{ fontSize: 13, color: 'rgba(248,248,255,0.85)', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{pcdPredicao}</div>}
              </div>
            )}
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
