'use client'
import { useState, useRef } from 'react'

function fileParaBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve({ base64, mimeType: file.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function InstagramPage() {
  const [aba, setAba] = useState<'legenda' | 'imagem'>('legenda')

  // legenda
  const [tema, setTema] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [gerandoLegenda, setGerandoLegenda] = useState(false)
  const [legenda, setLegenda] = useState('')
  const [erroLegenda, setErroLegenda] = useState('')
  const [copiado, setCopiado] = useState(false)

  // imagem
  const [promptImagem, setPromptImagem] = useState('')
  const [imagemBase, setImagemBase] = useState<{ base64: string; mimeType: string; preview: string } | null>(null)
  const [gerandoImagem, setGerandoImagem] = useState(false)
  const [imagemResultado, setImagemResultado] = useState('')
  const [erroImagem, setErroImagem] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function gerarLegenda() {
    setErroLegenda('')
    setGerandoLegenda(true)
    setLegenda('')
    try {
      const res = await fetch('/api/eco-instagram-legenda', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, objetivo }),
      })
      const d = await res.json()
      if (d.error) { setErroLegenda(d.error); return }
      setLegenda(d.text)
    } catch {
      setErroLegenda('Não foi possível gerar agora. Tente novamente.')
    } finally {
      setGerandoLegenda(false)
    }
  }

  function copiarLegenda() {
    navigator.clipboard.writeText(legenda)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function onSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const { base64, mimeType } = await fileParaBase64(file)
    setImagemBase({ base64, mimeType, preview: URL.createObjectURL(file) })
  }

  async function gerarImagem() {
    setErroImagem('')
    setGerandoImagem(true)
    setImagemResultado('')
    try {
      const res = await fetch('/api/eco-instagram-imagem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptImagem,
          imagemBase64: imagemBase?.base64,
          imagemMimeType: imagemBase?.mimeType,
        }),
      })
      const d = await res.json()
      if (d.error) { setErroImagem(d.error); return }
      setImagemResultado(`data:${d.mimeType};base64,${d.imagemBase64}`)
    } catch {
      setErroImagem('Não foi possível gerar agora. Tente novamente.')
    } finally {
      setGerandoImagem(false)
    }
  }

  function limparImagemBase() {
    setImagemBase(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', color: '#fff', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px', color: '#F8F8FF', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Instagram</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Legendas e imagens com IA</h1>
        <p style={{ color: 'rgba(248,248,255,.55)', fontSize: 13 }}>Gere a legenda do post e a imagem (ou edite uma foto sua) para postar direto no Instagram.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setAba('legenda')} style={{
          flex: 1, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 700,
          border: `1.5px solid ${aba === 'legenda' ? '#A78BFA' : 'rgba(255,255,255,.12)'}`,
          background: aba === 'legenda' ? 'rgba(139,92,246,.12)' : 'transparent', color: aba === 'legenda' ? '#A78BFA' : '#fff',
        }}>✍️ Legenda</button>
        <button onClick={() => setAba('imagem')} style={{
          flex: 1, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 700,
          border: `1.5px solid ${aba === 'imagem' ? '#A78BFA' : 'rgba(255,255,255,.12)'}`,
          background: aba === 'imagem' ? 'rgba(139,92,246,.12)' : 'transparent', color: aba === 'imagem' ? '#A78BFA' : '#fff',
        }}>🖼️ Imagem</button>
      </div>

      {aba === 'legenda' && (
        <>
          <input value={tema} onChange={e => setTema(e.target.value)} placeholder="Tema do post (ex: lançamento do Agro Tech, dica sobre neurodiversidade...)" style={inputStyle} />
          <input value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder="Objetivo (ex: atrair escolas para o trial, engajamento...)" style={inputStyle} />

          {erroLegenda && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{erroLegenda}</p>}

          <button onClick={gerarLegenda} disabled={gerandoLegenda} style={{ width: '100%', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', border: 'none', borderRadius: 14, padding: 14, fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>
            {gerandoLegenda ? 'Gerando...' : '✨ Gerar legenda'}
          </button>

          {legenda && (
            <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 18 }}>
              <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 14 }}>{legenda}</p>
              <button onClick={copiarLegenda} style={{ background: 'rgba(139,92,246,.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,.3)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {copiado ? '✓ Copiado!' : '📋 Copiar legenda'}
              </button>
            </div>
          )}
        </>
      )}

      {aba === 'imagem' && (
        <>
          <p style={{ fontSize: 12, color: 'rgba(248,248,255,.5)', marginBottom: 10 }}>
            Envie uma foto pra editar (opcional) ou deixe em branco pra gerar uma imagem do zero.
          </p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onSelecionarArquivo} style={{ marginBottom: 12, fontSize: 13 }} />

          {imagemBase && (
            <div style={{ marginBottom: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagemBase.preview} alt="Original" style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 6 }} />
              <button onClick={limparImagemBase} style={{ background: 'transparent', color: '#f87171', border: 'none', fontSize: 12, cursor: 'pointer' }}>✕ Remover imagem</button>
            </div>
          )}

          <textarea value={promptImagem} onChange={e => setPromptImagem(e.target.value)}
            placeholder={imagemBase ? 'Descreva a edição desejada (ex: deixe o fundo verde, adicione o texto "trial grátis"...)' : 'Descreva a imagem que quer gerar (ex: post sobre agronegócio com IA, estilo minimalista, cores verdes...)'}
            rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />

          {erroImagem && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12 }}>{erroImagem}</p>}

          <button onClick={gerarImagem} disabled={gerandoImagem} style={{ width: '100%', background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', color: '#fff', border: 'none', borderRadius: 14, padding: 14, fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}>
            {gerandoImagem ? 'Gerando...' : imagemBase ? '🖌️ Editar imagem' : '🎨 Gerar imagem'}
          </button>

          {imagemResultado && (
            <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagemResultado} alt="Resultado" style={{ maxWidth: '100%', borderRadius: 12, marginBottom: 14 }} />
              <a href={imagemResultado} download="post-instagram.png" style={{ display: 'inline-block', background: 'rgba(139,92,246,.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,.3)', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                ⬇️ Baixar imagem
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
