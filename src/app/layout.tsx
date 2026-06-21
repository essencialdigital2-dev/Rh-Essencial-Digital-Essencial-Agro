import type { Metadata } from 'next'
import './globals.css'
import Monitor from '@/components/monitor'

export const metadata: Metadata = {
  title: 'RH Essencial Digital',
  description: 'Gestao de Pessoas, Psicologia Organizacional e IA Preditiva para empresas brasileiras.',
  metadataBase: new URL('https://rhessencialdigital.com.br'),
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Sense AI' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'RH Essencial Digital',
    title: 'RH Essencial Digital',
    description: 'Gestao de Pessoas, Psicologia Organizacional e IA Preditiva para empresas brasileiras.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'RH Essencial Digital' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RH Essencial Digital',
    description: 'Gestao de Pessoas, Psicologia Organizacional e IA Preditiva.',
    images: ['/api/og'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Monitor />
      </body>
    </html>
  )
}
