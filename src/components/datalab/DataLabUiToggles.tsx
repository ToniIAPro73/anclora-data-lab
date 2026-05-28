'use client'

import { ChevronDown, Globe, Laptop2, MoonStar, SunMedium, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DATALAB_LOCALE_COOKIE, DATALAB_LOCALES, DATALAB_THEMES, type DataLabLocale, type DataLabTheme } from '@/lib/datalab-ui'

const STORAGE_LOCALE_KEY = 'anclora-datalab-locale'
const STORAGE_THEME_KEY = 'anclora-datalab-theme'

const localeLabels: Record<DataLabLocale, string> = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
}

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

const uiCopy: Record<DataLabLocale, {
  controls: string
  theme: string
  language: string
  preferences: string
  close: string
  save: string
  themeLabels: Record<DataLabTheme, string>
}> = {
  es: {
    controls: 'Controles de idioma y tema',
    theme: 'Tema',
    language: 'Idioma',
    preferences: 'Preferencias globales',
    close: 'Cerrar preferencias',
    save: 'Guardar y cerrar',
    themeLabels: {
      light: 'Tema claro',
      dark: 'Tema oscuro',
      system: 'Tema automático',
    },
  },
  en: {
    controls: 'Language and theme controls',
    theme: 'Theme',
    language: 'Language',
    preferences: 'Global preferences',
    close: 'Close preferences',
    save: 'Save and close',
    themeLabels: {
      light: 'Light theme',
      dark: 'Dark theme',
      system: 'System theme',
    },
  },
  de: {
    controls: 'Sprach- und Theme-Steuerung',
    theme: 'Theme',
    language: 'Sprache',
    preferences: 'Globale Einstellungen',
    close: 'Einstellungen schließen',
    save: 'Speichern und schließen',
    themeLabels: {
      light: 'Helles Theme',
      dark: 'Dunkles Theme',
      system: 'System-Theme',
    },
  },
}

function resolveTheme(theme: DataLabTheme) {
  if (theme !== 'system') return theme
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function DataLabUiToggles({ defaultLocale, defaultTheme, locale: controlledLocale, onLocaleChange }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
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
  const copy = uiCopy[locale]

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

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setPreferencesOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setPreferencesOpen(false)
    }
    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function selectLocale(nextLocale: DataLabLocale) {
    if (controlledLocale === undefined) setInternalLocale(nextLocale)
    onLocaleChange?.(nextLocale)
  }

  return (
    <div className="datalab-ui-toggles" aria-label={copy.controls}>
      <div className="datalab-toggle datalab-toggle-theme" role="group" aria-label={copy.theme}>
        {DATALAB_THEMES.map((option) => {
          const active = theme === option
          const Icon = themeIcons[option]
          const label = copy.themeLabels[option]
          return (
            <button
              key={option}
              type="button"
              className={`datalab-toggle-pill ${active ? 'is-active' : ''}`}
              onClick={() => setTheme(option)}
              aria-pressed={active}
              aria-label={label}
              title={label}
            >
              <Icon size={16} strokeWidth={1.8} />
            </button>
          )
        })}
      </div>

      <div className="datalab-preferences-wrap" ref={panelRef}>
        <button
          type="button"
          className="datalab-preferences-trigger"
          onClick={() => setPreferencesOpen((value) => !value)}
          aria-label={copy.preferences}
          aria-expanded={preferencesOpen}
          aria-haspopup="dialog"
        >
          <Globe size={16} strokeWidth={1.8} />
          <span className="datalab-preferences-language">{localeLabels[locale]}</span>
          <ChevronDown size={15} strokeWidth={1.8} className={preferencesOpen ? 'is-open' : ''} />
        </button>

        {preferencesOpen ? (
          <div className="datalab-preferences-panel" role="dialog" aria-label={copy.preferences}>
            <div className="datalab-preferences-panel-head">
              <div>
                <p>{copy.preferences}</p>
                <h2>{copy.language}</h2>
              </div>
              <button type="button" onClick={() => setPreferencesOpen(false)} aria-label={copy.close}>
                <X size={16} strokeWidth={1.8} />
              </button>
            </div>

            <label className="datalab-preferences-field">
              <span>{copy.language}</span>
              <select value={locale} onChange={(event) => selectLocale(event.target.value as DataLabLocale)}>
                {DATALAB_LOCALES.map((option) => (
                  <option key={option} value={option}>{localeLabels[option]}</option>
                ))}
              </select>
            </label>

            <button type="button" className="datalab-preferences-save" onClick={() => setPreferencesOpen(false)}>
              {copy.save}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
