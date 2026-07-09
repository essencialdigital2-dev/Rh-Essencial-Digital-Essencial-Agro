'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Um unico banco central: login, empresas, ISHO e check-ins vivem
// todos no mesmo projeto Supabase (feivfp), o mesmo do Edu/Sense/RH/Nexo.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Analise = {
  nivel_risco: 'baixo' | 'medio' | 'alto'
  score_risco: number
  diagnostico: string
  fatores_identificados: string[]
  previsao_30_dias: string
  acoes_preventivas: string[]
  conformidade_nr1: string
}

const COR_NIVEL: Record<string, string> = { baixo: '#22c55e', medio: '#f59e0b', alto: '#ef4444' }

export default function SenseProativo() {
  const [carregando, setCarregando] = useState(true)
  const [analisando, setAnalisando] = useState(false)
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [analise, setAnalise] = useState<Analise | null>(null)
  const [erro, setErro] = useState('')
  const [semEmpresa, setSemEmpresa] = useState(false)

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/sense-login'; return }

      const { data: empresa } = await supabase.from('sense_empresas')
        .select('id, nome_empresa').eq('usuario_id', user.id).limit(1).single()
      if (!empresa) { setSemEmpresa(true); setCarregando(false); return }
      setNomeEmpresa(empresa.nome_empresa || '')

      const [{ data: ishoData }, { data: checkinsData }] = await Promise.all([
        supabase.from('sense_isho_historico').select('score, semana').eq('empresa_id', empresa.id).order('semana', { ascending: true }).limit(8),
        supabase.from('sense_checkins').select('humor, energia, estresse, created_at').eq('empresa_id', empresa.id).order('created_at', { ascending: false }).limit(200),
      ])

      ;(window as any).__senseProativoDados = {
        nomeEmpresa: empresa.nome_empresa,
        ishoHistorico: (ishoData || []).map((r: any) => r.score || 0),
        checkins: checkinsData || [],
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  async function gerarAnalise() {
    setAnalisando(true)
    setErro('')
    try {
      const dados = (window as any).__senseProativoDados || {}
      const res = await fetch('/api/sense-proativo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      })
      const d = await res.json()
      if (d.error) { setErro(d.error); return }
      setAnalise(d.analise)
    } finally {
      setAnalisando(false)
    }
  }

  if (carregando) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#08080F', color: '#9ca3af' }}>
      Carregando...
    </div>
  )

  if (semEmpresa) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#08080F', color: '#9ca3af', textAlign: 'center', padding: 20 }}>
      Nenhuma empresa vinculada a esta conta ainda.
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#08080F', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontSize: 11, color: '#a78bfa', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Sense AI Proativo</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>Conformidade Preventiva NR-1</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>
          {nomeEmpresa}: análise preditiva de riscos psicossociais, com IA no centro.
        </p>

        {erro && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '14px 16px', color: '#fca5a5', fontSize: 13, marginBottom: 20 }}>
            {erro}
          </div>
        )}

        {!analise ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🧠</div>
            <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 20 }}>
              A IA vai analisar o histórico de ISHO e check-ins da sua empresa e prever riscos psicossociais conforme a NR-1.
            </p>
            <button onClick={gerarAnalise} disabled={analisando} style={{
              padding: '14px 32px', borderRadius: 14, border: 'none', cursor: analisando ? 'not-allowed' : 'pointer',
              background: analisando ? '#4c1d95' : 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', fontWeight: 800, fontSize: 14,
            }}>
              {analisando ? 'A IA está analisando...' : '✨ Gerar Análise Preditiva'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: `${COR_NIVEL[analise.nivel_risco]}15`, border: `1px solid ${COR_NIVEL[analise.nivel_risco]}50`,
              borderRadius: 18, padding: 22, display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: COR_NIVEL[analise.nivel_risco] }}>{analise.score_risco}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: COR_NIVEL[analise.nivel_risco], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Risco {analise.nivel_risco}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', lineHeight: 1.5 }}>{analise.diagnostico}</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Fatores Identificados</div>
              {analise.fatores_identificados.map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>• {f}</div>
              ))}
            </div>

            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#f87171', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Previsão 30 Dias</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>{analise.previsao_30_dias}</p>
            </div>

            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#4ade80', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Ações Preventivas</div>
              {analise.acoes_preventivas.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 999, background: 'rgba(34,197,94,0.2)', color: '#4ade80', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{a}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Conformidade NR-1</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>{analise.conformidade_nr1}</p>
            </div>

            <button onClick={gerarAnalise} disabled={analisando} style={{
              alignSelf: 'center', marginTop: 8, padding: '10px 24px', borderRadius: 999, border: '1px solid rgba(167,139,250,0.4)',
              background: 'transparent', color: '#a78bfa', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              {analisando ? 'Atualizando...' : 'Atualizar Análise'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
