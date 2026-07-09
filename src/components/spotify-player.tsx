'use client'
import { useState, useEffect } from 'react'

export default function SpotifyPlayer() {
  const [aberto, setAberto] = useState(false)
  const [link, setLink] = useState('')
  const [input, setInput] = useState('')

  useEffect(() => {
    const salvo = localStorage.getItem('rh_spotify_link')
    if (salvo) setLink(salvo)
  }, [])

  function salvar() {
    const url = input.trim()
    if (!url.includes('spotify.com')) return
    localStorage.setItem('rh_spotify_link', url)
    setLink(url)
    setInput('')
  }

  function abrir() {
    if (link) window.open(link, '_blank', 'noopener')
  }

  function remover() {
    localStorage.removeItem('rh_spotify_link')
    setLink('')
    setAberto(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 9000, fontFamily: 'inherit' }}>
      {aberto && (
        <div style={{
          background: '#121212', border: '1px solid #282828', borderRadius: 16,
          padding: 16, marginBottom: 10, width: 280,
          boxShadow: '0 8px 32px rgba(0,0,0,.6)',
        }}>
          {link ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1DB954', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115.294.18.386.563.207.857zm1.223-2.723a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.519-.972c3.632-1.102 8.147-.568 11.234 1.328a.78.78 0 01.257 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.542-1.79c3.532-1.073 9.404-.866 13.115 1.337a.936.936 0 01-1.955 1.609z"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Minha playlist</div>
                  <div style={{ fontSize: 10, color: '#B3B3B3' }}>Spotify · salvo</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={abrir} style={{ flex: 1, background: '#1DB954', color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                  ▶ Abrir no Spotify
                </button>
                <button onClick={remover} style={{ background: '#282828', color: '#B3B3B3', border: 'none', borderRadius: 8, padding: '8px 10px', fontSize: 11, cursor: 'pointer' }}>
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8 }}>🎵 Adicionar playlist</div>
              <div style={{ fontSize: 11, color: '#B3B3B3', marginBottom: 10 }}>Cole o link do Spotify:</div>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && salvar()}
                placeholder="https://open.spotify.com/..."
                style={{ width: '100%', background: '#282828', border: '1px solid #535353', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: 11, boxSizing: 'border-box', marginBottom: 8 }}
              />
              <button onClick={salvar} style={{ width: '100%', background: '#1DB954', color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                Salvar
              </button>
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => setAberto(p => !p)}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: link ? '#1DB954' : '#282828',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,.4)',
          transition: 'background .2s',
        }}
        title="Spotify"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={link ? '#000' : '#1DB954'}>
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115.294.18.386.563.207.857zm1.223-2.723a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.519-.972c3.632-1.102 8.147-.568 11.234 1.328a.78.78 0 01.257 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 11-.542-1.79c3.532-1.073 9.404-.866 13.115 1.337a.936.936 0 01-1.955 1.609z"/>
        </svg>
      </button>
    </div>
  )
}
