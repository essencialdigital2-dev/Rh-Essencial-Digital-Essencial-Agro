import type { Metadata } from 'next'
import './globals.css'
import Monitor from '@/components/monitor'
import SpotifyPlayer from '@/components/spotify-player'
import SecurityBadge from '@/components/security-badge'
import AcessibilidadeSurdos from '@/components/AcessibilidadeSurdos'

export const metadata: Metadata = {
  title: 'Essencial Sense AI',
  description: 'Saúde emocional, burnout, DISC comportamental e conformidade NR-1 com Inteligência Artificial. Por Alana Carvalho - Gestão de Pessoas e Psicologia Organizacional.',
  metadataBase: new URL('https://rh-essencial-digital-essencial-agro.vercel.app'),
  manifest: '/manifest.json',
  themeColor: '#10B981',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Essencial Sense AI' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Essencial Sense AI',
    title: 'Essencial Sense AI - Saúde Organizacional com IA',
    description: 'Saúde emocional, burnout, DISC e conformidade NR-1 com IA. Por Alana Carvalho.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Essencial Sense AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essencial Sense AI',
    description: 'Saúde emocional, burnout, DISC e conformidade NR-1 com IA.',
    images: ['/api/og'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Monitor />
        <SpotifyPlayer />
        <SecurityBadge />
        <AcessibilidadeSurdos />
      </body>
    </html>
  )
}
