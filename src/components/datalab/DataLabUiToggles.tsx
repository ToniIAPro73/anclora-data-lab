'use client'

import { Laptop2, MoonStar, SunMedium } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DATALAB_LOCALE_COOKIE, DATALAB_LOCALES, DATALAB_THEMES, type DataLabLocale, type DataLabTheme } from '@/lib/datalab-ui'

const STORAGE_LOCALE_KEY = 'anclora-datalab-locale'
const STORAGE_THEME_KEY = 'anclora-datalab-theme'

type Props = {
  defaultLocale: DataLabLocale
  defaultTheme: DataLabTheme
  locale?: DataLabLocale
  onLocaleChange?: (locale: DataLabLocale) => void
}

const themeIcons = {
  light: SunMedium,
  dark: MoonStar,
  system: Laptop2,
} as const

function resolveTheme(theme: DataLabTheme) {
  if (theme !== 'system') return theme
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function DataLabUiToggles({ defaultLocale, defaultTheme, locale: controlledLocale, onLocaleChange }: Props) {
  const [internalLocale, setInternalLocale] = useState<DataLabLocale>(() => {
    if (typeof window === 'undefined') return defaultLocale
    const storedLocale = window.localStorage.getItem(STORAGE_LOCALE_KEY) as DataLabLocale | null
    return storedLocale && DATALAB_LOCALES.includes(storedLocale) ? storedLocale : defaultLocale
  })

  const [theme, setTheme] = useState<DataLabTheme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    const storedTheme = window.localStorage.getItem(STORAGE_THEME_KEY) as DataLabTheme | null
    return storedTheme && DATALAB_THEMES.includes(storedTheme) ? storedTheme : defaultTheme
  })

  const locale = controlledLocale ?? internalLocale

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dataset.locale = locale
    window.localStorage.setItem(STORAGE_LOCALE_KEY, locale)
    document.cookie = `${DATALAB_LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
  }, [locale])

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      root.dataset.theme = resolveTheme(theme)
    }

    apply()
    window.localStorage.setItem(STORAGE_THEME_KEY, theme)

    if (theme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: light)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  return (
    <div className="datalab-ui-toggles" aria-label="Controles de idioma y tema">
      <div className="datalab-toggle datalab-toggle-theme" role="group" aria-label="Tema">
        {DATALAB_THEMES.map((option) => {
          const active = theme === option
          const Icon = themeIcons[option]
          return (
            <button
              key={option}
              type="button"
              className={`datalab-toggle-pill ${active ? 'is-active' : ''}`}
              onClick={() => setTheme(option)}
              aria-pressed={active}
              aria-label={`Tema ${option}`}
              title={`Tema ${option}`}
            >
              <Icon size={16} strokeWidth={1.8} />
            </button>
          )
        })}
      </div>

      <div className="datalab-toggle datalab-toggle-locale" role="group" aria-label="Idioma">
        {DATALAB_LOCALES.map((option) => {
          const active = locale === option
          return (
            <button
              key={option}
              type="button"
              className={`datalab-toggle-pill datalab-toggle-pill-text ${active ? 'is-active' : ''}`}
              onClick={() => {
                if (controlledLocale === undefined) setInternalLocale(option)
                onLocaleChange?.(option)
              }}
              aria-pressed={active}
            >
              {option.toUpperCase()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
