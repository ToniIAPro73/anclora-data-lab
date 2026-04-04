import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { DATALAB_BRAND } from '@/lib/datalab-brand'
import { getDefaultTheme, DATALAB_LOCALE_COOKIE, resolveDataLabLocale } from '@/lib/datalab-ui'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: DATALAB_BRAND.name,
  description: DATALAB_BRAND.description,
  icons: {
    icon: [
      { url: DATALAB_BRAND.logoPath, type: 'image/png' },
      { url: DATALAB_BRAND.faviconPath, type: 'image/x-icon' },
    ],
    apple: DATALAB_BRAND.logoPath,
    shortcut: DATALAB_BRAND.faviconPath,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultLocale = resolveDataLabLocale(cookieStore.get(DATALAB_LOCALE_COOKIE)?.value)
  const defaultTheme = getDefaultTheme()

  return (
    <html
      lang={defaultLocale}
      data-locale={defaultLocale}
      data-theme={defaultTheme === 'system' ? 'dark' : defaultTheme}
      className={dmSans.variable}
    >
      <body>{children}</body>
    </html>
  )
}
