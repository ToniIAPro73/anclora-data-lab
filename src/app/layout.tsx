import type { Metadata } from 'next'
import { getDefaultLocale, getDefaultTheme } from '@/lib/datalab-ui'
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
  const defaultLocale = getDefaultLocale()
  const defaultTheme = getDefaultTheme()

  return (
    <html lang={defaultLocale} data-locale={defaultLocale} data-theme={defaultTheme === 'system' ? 'dark' : defaultTheme}>
      <body>{children}</body>
    </html>
  )
}
