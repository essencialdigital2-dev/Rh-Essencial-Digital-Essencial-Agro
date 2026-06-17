import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RH Essencial Digital / Essencial Agro',
  description: 'Gestão de Pessoas & Diagnósticos Organizacionais',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
