import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page') || 'default'
  const isSense = page === 'sense'
  const title = isSense ? 'Essencial Sense AI' : 'RH Essencial Digital'
  const subtitle = isSense
    ? 'Psicologia + IA Preditiva para RH'
    : 'Gestao de Pessoas e IA Preditiva'
  const tags = isSense
    ? ['DISC', 'Check-in', 'NR-1', 'Analytics', 'IA Preditiva']
    : ['Gestao', 'Diagnostico', 'Analytics', 'IA']

  // Neurônios: posicoes fixas ao redor do cerebro (compativel com satori)
  const neuronios = [
    { cx: 720, cy: 180, r: 6, color: '#A78BFA' },
    { cx: 800, cy: 240, r: 5, color: '#EC4899' },
    { cx: 850, cy: 330, r: 7, color: '#06B6D4' },
    { cx: 780, cy: 420, r: 5, color: '#A78BFA' },
    { cx: 680, cy: 460, r: 6, color: '#EC4899' },
    { cx: 620, cy: 380, r: 4, color: '#06B6D4' },
    { cx: 640, cy: 250, r: 5, color: '#A78BFA' },
    { cx: 760, cy: 150, r: 4, color: '#EC4899' },
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#08080F',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow roxo topo-esquerda */}
        <div style={{
          position: 'absolute', top: '-150px', left: '-100px',
          width: '550px', height: '550px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)',
          display: 'flex',
        }} />
        {/* Glow pink centro-baixo */}
        <div style={{
          position: 'absolute', bottom: '-180px', left: '400px',
          width: '480px', height: '480px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0.08) 50%, transparent 70%)',
          display: 'flex',
        }} />
        {/* Glow cyan direita */}
        <div style={{
          position: 'absolute', top: '50px', right: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(6,182,212,0.07) 50%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Faixa superior colorida */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #06B6D4)',
          display: 'flex',
        }} />

        {/* === LADO ESQUERDO: conteúdo === */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '64px 48px 64px 72px', width: '640px', zIndex: 2,
        }}>
          {/* Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '32px', width: 'auto',
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#8B5CF6', display: 'flex',
              boxShadow: '0 0 12px #8B5CF6',
            }} />
            <span style={{
              fontSize: '13px', color: '#C4B5FD',
              fontWeight: 700, letterSpacing: '3px',
            }}>
              {isSense ? 'ESSENCIAL SENSE AI' : 'RH ESSENCIAL DIGITAL'}
            </span>
          </div>

          {/* Titulo */}
          <div style={{
            fontSize: '76px', fontWeight: 900,
            color: '#F8F8FF', lineHeight: 1.0,
            marginBottom: '20px', display: 'flex', flexDirection: 'column',
          }}>
            <span>{title.split(' ')[0]}</span>
            <span style={{ color: '#A78BFA' }}>
              {title.split(' ').slice(1).join(' ')}
            </span>
          </div>

          {/* Subtitulo */}
          <div style={{
            fontSize: '22px', color: 'rgba(248,248,255,0.6)',
            lineHeight: 1.5, marginBottom: '40px',
          }}>
            {subtitle}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {tags.map((tag) => (
              <div key={tag} style={{
                background: 'rgba(139,92,246,0.18)',
                border: '1px solid rgba(139,92,246,0.45)',
                borderRadius: '8px', padding: '7px 16px',
                fontSize: '15px', color: '#C4B5FD', fontWeight: 600,
                display: 'flex',
              }}>
                {tag}
              </div>
            ))}
          </div>

          {/* URL */}
          <div style={{
            marginTop: '44px', fontSize: '15px',
            color: 'rgba(248,248,255,0.3)',
          }}>
            rhessencialdigital.com.br/sense-login
          </div>
        </div>

        {/* Divisor */}
        <div style={{
          position: 'absolute', left: '640px', top: '60px', bottom: '60px',
          width: '1px', background: 'rgba(139,92,246,0.3)', display: 'flex',
        }} />

        {/* === LADO DIREITO: cérebro === */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: '560px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1,
        }}>
          {/* Aneis */}
          <div style={{
            position: 'absolute', width: '380px', height: '380px',
            borderRadius: '50%', border: '1px solid rgba(139,92,246,0.12)',
            display: 'flex',
          }} />
          <div style={{
            position: 'absolute', width: '300px', height: '300px',
            borderRadius: '50%', border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex',
          }} />
          <div style={{
            position: 'absolute', width: '220px', height: '220px',
            borderRadius: '50%', border: '1px solid rgba(139,92,246,0.35)',
            background: 'rgba(139,92,246,0.06)',
            display: 'flex',
          }} />

          {/* Cerebro SVG simples (sem filtros) */}
          <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* hemisferio esquerdo */}
            <path
              d="M50 18 C30 18 14 31 14 48 C14 59 20 67 29 72 C29 78 33 84 40 86 C42 87 44 85 44 83 L44 74 C40 72 38 68 37 63 C33 60 30 55 30 48 C30 35 39 28 50 28 Z"
              fill="#8B5CF6" opacity="0.85"
            />
            {/* hemisferio direito */}
            <path
              d="M50 18 C70 18 86 31 86 48 C86 59 80 67 71 72 C71 78 67 84 60 86 C58 87 56 85 56 83 L56 74 C60 72 62 68 63 63 C67 60 70 55 70 48 C70 35 61 28 50 28 Z"
              fill="#EC4899" opacity="0.85"
            />
            {/* linha central */}
            <line x1="50" y1="20" x2="50" y2="82" stroke="#08080F" strokeWidth="2.5" />
            {/* circunvoluções esq */}
            <path d="M24 46 Q32 41 38 46 Q32 51 24 46Z" fill="rgba(255,255,255,0.2)" />
            <path d="M21 59 Q30 54 36 59 Q30 64 21 59Z" fill="rgba(255,255,255,0.15)" />
            <path d="M28 34 Q36 30 41 35 Q36 40 28 34Z" fill="rgba(255,255,255,0.15)" />
            {/* circunvoluções dir */}
            <path d="M76 46 Q68 41 62 46 Q68 51 76 46Z" fill="rgba(255,255,255,0.2)" />
            <path d="M79 59 Q70 54 64 59 Q70 64 79 59Z" fill="rgba(255,255,255,0.15)" />
            <path d="M72 34 Q64 30 59 35 Q64 40 72 34Z" fill="rgba(255,255,255,0.15)" />
            {/* neurônios */}
            <circle cx="31" cy="45" r="3" fill="#F8F8FF" opacity="0.9" />
            <circle cx="39" cy="59" r="2.5" fill="#06B6D4" opacity="0.9" />
            <circle cx="26" cy="60" r="2" fill="#A78BFA" opacity="0.9" />
            <circle cx="69" cy="45" r="3" fill="#F8F8FF" opacity="0.9" />
            <circle cx="61" cy="59" r="2.5" fill="#06B6D4" opacity="0.9" />
            <circle cx="74" cy="60" r="2" fill="#A78BFA" opacity="0.9" />
            <circle cx="50" cy="36" r="2.5" fill="#EC4899" opacity="0.9" />
            {/* sinapses */}
            <line x1="31" y1="45" x2="39" y2="59" stroke="#A78BFA" strokeWidth="1" opacity="0.6" />
            <line x1="39" y1="59" x2="26" y2="60" stroke="#06B6D4" strokeWidth="1" opacity="0.6" />
            <line x1="69" y1="45" x2="61" y2="59" stroke="#A78BFA" strokeWidth="1" opacity="0.6" />
            <line x1="61" y1="59" x2="74" y2="60" stroke="#06B6D4" strokeWidth="1" opacity="0.6" />
            <line x1="50" y1="36" x2="31" y2="45" stroke="#EC4899" strokeWidth="0.8" opacity="0.5" />
            <line x1="50" y1="36" x2="69" y2="45" stroke="#EC4899" strokeWidth="0.8" opacity="0.5" />
          </svg>

          {/* Particulas coloridas ao redor */}
          {neuronios.map((n, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: n.cx - 840 + 'px',
                top: n.cy - 315 + 'px',
                width: n.r * 2 + 'px',
                height: n.r * 2 + 'px',
                borderRadius: '50%',
                background: n.color,
                display: 'flex',
              }}
            />
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
