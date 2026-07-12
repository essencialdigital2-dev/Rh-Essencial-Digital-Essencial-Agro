'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Valor { nome: string; descricao?: string }
interface Empresa { id: string; nome: string; valores_cultura: Valor[] }

export default function PulsoCulturaPage() {
  const params = useParams()
  const token = params.token as string
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [notas, setNotas] = useState<Record<string, number>>({})
  const [nome, setNome] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetch(`/api/pulso-cultura?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setErro(d.error); return }
        setEmpresa(d.empresa)
        const iniciais: Record<string, number> = {}
        ;(d.empresa.valores_cultura || []).forEach((v: Valor) => { iniciais[v.nome] = 3 })
        setNotas(iniciais)
      })
      .catch(() => setErro('Não foi possível carregar. Tente novamente.'))
  }, [token])

  async function enviar() {
    setEnviando(true)
    try {
      const respostas = Object.entries(notas).map(([valor_nome, nota]) => ({ valor_nome, nota }))
      await fetch('/api/pulso-cultura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, respostas, colaborador_nome: nome || undefined, origem_app: 'hub' }),
      })
      setEnviado(true)
    } finally {
      setEnviando(false)
    }
  }

  if (erro) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a15', color: '#fff', fontFamily: 'system-ui' }}>
      <p style={{ color: 'rgba(255,255,255,.6)' }}>{erro}</p>
    </div>
  }

  if (!empresa) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a15', color: 'rgba(255,255,255,.5)', fontFamily: 'system-ui' }}>Carregando...</div>
  }

  if (enviado) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a15', color: '#fff', fontFamily: 'system-ui', textAlign: 'center', padding: 24 }}>
        <div>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Obrigado pelo seu retorno!</h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>Suas respostas ajudam {empresa.nome} a entender e fortalecer a cultura da empresa.</p>
        </div>
      </div>
    )
  }

  const valores = empresa.valores_cultura || []

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0a15 0%,#0d0d1f 50%,#0a1020 100%)', color: '#F8F8FF', fontFamily: 'system-ui, sans-serif', padding: '48px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧭</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Pulso de Cultura — {empresa.nome}</h1>
          <p style={{ fontSize: 13, color: 'rgba(248,248,255,.5)' }}>Anônimo por padrão. Sua opinião ajuda a empresa a entender se os valores declarados estão sendo vividos de verdade no dia a dia.</p>
        </div>

        {valores.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(248,248,255,.5)', fontSize: 14 }}>Essa empresa ainda não cadastrou valores de cultura.</div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              {valores.map(v => (
                <div key={v.nome} style={{ background: 'rgba(139,92,246,.06)', border: '1px solid rgba(139,92,246,.2)', borderRadius: 14, padding: 18 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{v.nome}</div>
                  {v.descricao && <div style={{ fontSize: 12, color: 'rgba(248,248,255,.5)', marginBottom: 12 }}>{v.descricao}</div>}
                  <label style={{ fontSize: 11, color: 'rgba(248,248,255,.5)', display: 'block', marginBottom: 4 }}>
                    Isso é vivido de verdade na empresa? {notas[v.nome]}/5
                  </label>
                  <input type="range" min={1} max={5} value={notas[v.nome] || 3}
                    onChange={e => setNotas(prev => ({ ...prev, [v.nome]: Number(e.target.value) }))}
                    style={{ width: '100%' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(248,248,255,.3)' }}>
                    <span>Só discurso</span><span>Totalmente vivido</span>
                  </div>
                </div>
              ))}
            </div>

            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome (opcional)"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(139,92,246,.2)', color: '#fff', fontSize: 13, marginBottom: 16, boxSizing: 'border-box' }}
            />
            <button onClick={enviar} disabled={enviando} style={{ width: '100%', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {enviando ? 'Enviando...' : 'Enviar meu pulso'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
