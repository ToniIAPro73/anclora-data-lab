import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Anclora Data Lab',
  description: 'Plataforma de inteligencia, señales territoriales y activos analíticos de Anclora Private Estates.',
  icons: {
    icon: '/brand/logo-anclora-datalab.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
