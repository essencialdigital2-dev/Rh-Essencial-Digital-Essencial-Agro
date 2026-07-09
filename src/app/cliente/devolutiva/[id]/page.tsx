'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function getCookie(name: string) {
  if (typeof document === 'undefined') return ''
  return document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='))?.split('=')[1] || ''
}

export default function ClienteDevolutiva() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [dados, setDados] = useState<any>(null)
  const [insight, setInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const empresaId = getCookie('cliente_id')
    if (!empresaId) { router.push('/cliente/login'); return }

    async function carregar() {
      const { data: resp, error } = await sb
        .from('respostas')
        .select('*, colaborador:colaboradores(nome, cargo, setor), empresa:empresas(id, nome)')
        .eq('id', id)
        .eq('concluido', true)
        .single()

      if (error || !resp) { setErro('Devolutiva não encontrada.'); setLoading(false); return }
      if ((resp.empresa as any)?.id !== empresaId) { setErro('Acesso não autorizado.'); setLoading(false); return }

      setDados(resp)
      setLoading(false)
      gerarInsight(resp)
    }
    carregar()
  }, [id, router])

  async function gerarInsight(resp: any) {
    setLoadingInsight(true)
    const dados = {
      colaborador: resp.colaborador?.nome,
      cargo: resp.colaborador?.cargo,
      setor: resp.colaborador?.setor,
      formulario: resp.formulario_id,
      total_respostas: resp.respostas?.length || 0,
    }
    const res = await fetch('/api/cliente-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dados }),
    })
    const data = await res.json()
    if (data.text) setInsight(data.text)
    setLoadingInsight(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#06060F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center', color: 'rgba(248,248,255,0.4)' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🧠</div>
        <p>Carregando devolutiva...</p>
      </div>
    </div>
  )

  if (erro) return (
    <div style={{ minHeight: '100vh', background: '#06060F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ textAlign: 'center', color: '#F87171' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <p>{erro}</p>
        <Link href="/cliente" style={{ color: '#A78BFA', fontSize: 13, marginTop: 16, display: 'block' }}>Voltar ao portal</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#06060F', fontFamily: 'system-ui,sans-serif', color: '#F8F8FF' }}>

      {/* TOPO */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/cliente" style={{ fontSize: 13, color: 'rgba(248,248,255,0.5)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Voltar ao portal
        </Link>
        <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.25)' }}>Essencial Digital</div>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px' }}>

        {/* HEADER COLABORADOR */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Devolutiva Individual</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#F8F8FF', margin: '0 0 8px' }}>{dados?.colaborador?.nome}</h1>
          <p style={{ fontSize: 14, color: 'rgba(248,248,255,0.4)', margin: 0 }}>
            {dados?.colaborador?.cargo || 'Cargo não informado'} {dados?.colaborador?.setor ? `— ${dados.colaborador.setor}` : ''}
          </p>
        </div>

        {/* IA INSIGHT */}
        <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 28, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#A78BFA' }}>Análise da IA</div>
              <div style={{ fontSize: 11, color: 'rgba(248,248,255,0.3)' }}>Diagnóstico gerado automaticamente</div>
            </div>
          </div>
          {loadingInsight ? (
            <div style={{ color: 'rgba(248,248,255,0.4)', fontSize: 13 }}>Gerando análise...</div>
          ) : insight ? (
            <div style={{ fontSize: 13, color: 'rgba(248,248,255,0.75)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{insight}</div>
          ) : null}
        </div>

        {/* DADOS */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#F8F8FF', margin: '0 0 16px' }}>Informações do assessment</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { l: 'Data de conclusão', v: dados?.created_at ? new Date(dados.created_at).toLocaleDateString('pt-BR') : '-' },
              { l: 'Formulário', v: `Assessment ${dados?.formulario_id || '-'}` },
              { l: 'Status', v: 'Concluído' },
              { l: 'Empresa', v: dados?.empresa?.nome || '-' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(248,248,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{item.l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F8F8FF' }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, padding: '14px 20px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 14, fontSize: 12, color: 'rgba(248,248,255,0.4)' }}>
          Esta devolutiva foi gerada pela plataforma Essencial Digital com base nas respostas do assessment. Para informações mais detalhadas, entre em contato com a equipe Essencial.
        </div>

      </div>
    </div>
  )
}
