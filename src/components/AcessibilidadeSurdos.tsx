'use client'
import { useEffect, useState } from 'react'

// Acessibilidade para surdos, com IA no centro:
// 1) VLibras (widget oficial do governo federal) traduz a tela pra Libras.
// 2) "Simplificar com IA" reescreve o texto da pagina em portugues direto e
//    sem girias/metaforas — util pra quem tem Libras como primeira lingua.
export default function AcessibilidadeSurdos() {
  const [painelAberto, setPainelAberto] = useState(false)
  const [simplificando, setSimplificando] = useState(false)
  const [textoSimplificado, setTextoSimplificado] = useState('')

  useEffect(() => {
    if (document.getElementById('vlibras-script')) return
    const script = document.createElement('script')
    script.id = 'vlibras-script'
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.onload = () => {
      // @ts-expect-error VLibras nao tem tipos
      if (window.VLibras) new window.VLibras.Widget('https://vlibras.gov.br/app')
    }
    document.body.appendChild(script)
  }, [])

  async function simplificarPagina() {
    setPainelAberto(true)
    setSimplificando(true)
    try {
      const texto = document.body.innerText.slice(0, 6000)
      const res = await fetch('/api/acessibilidade-simplificar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      })
      const d = await res.json()
      setTextoSimplificado(d.texto || 'Nao foi possivel simplificar agora.')
    } catch {
      setTextoSimplificado('Erro ao simplificar. Tente novamente.')
    }
    setSimplificando(false)
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: '<div vw class="enabled"><div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div></div>' }} />

      <button onClick={simplificarPagina} title="Simplificar texto desta pagina com IA (para leitores de Libras)"
        style={{ position: 'fixed', bottom: 20, right: 84, zIndex: 9998, width: 46, height: 46, borderRadius: '50%', background: '#0EA5E9', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', boxShadow: '0 4px 14px rgba(14,165,233,.4)' }}>
        🤟
      </button>

      {painelAberto && (
        <div style={{ position: 'fixed', bottom: 76, right: 84, zIndex: 9998, width: 320, maxWidth: 'calc(100vw - 40px)', maxHeight: 400, overflowY: 'auto', background: '#0D1526', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: 16, boxShadow: '0 12px 40px rgba(0,0,0,.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <b style={{ color: '#fff', fontSize: 13 }}>🤟 Texto simplificado</b>
            <button onClick={() => setPainelAberto(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
          {simplificando ? <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>Simplificando com IA...</div>
            : <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{textoSimplificado}</div>}
        </div>
      )}
    </>
  )
}
