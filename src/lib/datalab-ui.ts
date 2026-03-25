export type DataLabLocale = 'es' | 'en' | 'de'
export type DataLabTheme = 'dark' | 'light' | 'system'

export const DATALAB_LOCALES: DataLabLocale[] = ['es', 'en', 'de']
export const DATALAB_THEMES: DataLabTheme[] = ['light', 'dark', 'system']

export function getDefaultLocale(): DataLabLocale {
  const value = process.env.NEXT_PUBLIC_DATALAB_DEFAULT_LOCALE?.trim().toLowerCase()
  return value === 'en' || value === 'de' ? value : 'es'
}

export function getDefaultTheme(): DataLabTheme {
  const value = process.env.NEXT_PUBLIC_DATALAB_DEFAULT_THEME?.trim().toLowerCase()
  return value === 'light' || value === 'system' ? value : 'dark'
}
