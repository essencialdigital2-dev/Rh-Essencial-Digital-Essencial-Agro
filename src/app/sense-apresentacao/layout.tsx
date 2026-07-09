import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Essencial Sense AI - Psicologia + IA Preditiva para RH',
  description: 'Plataforma de saude mental, DISC, check-in emocional e People Analytics Preditivo. Antecipe riscos, reduza turnover e proteja sua equipe com IA.',
  openGraph: {
    title: 'Essencial Sense AI - Psicologia + IA Preditiva para RH',
    description: 'Plataforma de saude mental, DISC, check-in emocional e People Analytics Preditivo. Antecipe riscos, reduza turnover e proteja sua equipe com IA.',
    url: 'https://rhessencialdigital.com.br/sense-apresentacao',
    images: [{ url: '/api/og?page=sense', width: 1200, height: 630, alt: 'Essencial Sense AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essencial Sense AI - Psicologia + IA Preditiva para RH',
    description: 'Antecipe riscos, reduza turnover e proteja sua equipe com IA.',
    images: ['/api/og?page=sense'],
  },
}

export default function SenseApresentacaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
