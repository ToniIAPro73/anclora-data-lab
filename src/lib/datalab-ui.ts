export type DataLabLocale = 'es' | 'en' | 'de'
export type DataLabTheme = 'dark' | 'light' | 'system'

export const DATALAB_LOCALES: DataLabLocale[] = ['es', 'en', 'de']
export const DATALAB_THEMES: DataLabTheme[] = ['light', 'dark', 'system']
export const DATALAB_LOCALE_COOKIE = 'anclora-datalab-locale'
const DEFAULT_PRIVATE_ESTATES_URL = 'https://anclora-private-estates.vercel.app/?open=private-area'
const DEFAULT_ANCLORA_GROUP_URL = 'https://anclora-group.vercel.app/workspace'

export function getDefaultLocale(): DataLabLocale {
  const value = process.env.NEXT_PUBLIC_DATALAB_DEFAULT_LOCALE?.trim().toLowerCase()
  return value === 'en' || value === 'de' ? value : 'es'
}

export function resolveDataLabLocale(value?: string | null): DataLabLocale {
  return value === 'en' || value === 'de' || value === 'es' ? value : getDefaultLocale()
}

export function getDefaultTheme(): DataLabTheme {
  const value = process.env.NEXT_PUBLIC_DATALAB_DEFAULT_THEME?.trim().toLowerCase()
  return value === 'light' || value === 'system' ? value : 'dark'
}

export function buildPrivateEstatesHref(locale: DataLabLocale): string {
  const explicitEntry = process.env.NEXT_PUBLIC_PRIVATE_ESTATES_DATALAB_ENTRY_URL?.trim()
  const url = new URL(explicitEntry || DEFAULT_PRIVATE_ESTATES_URL)
  url.searchParams.set('lang', locale)
  return url.toString()
}

export function buildAncloraGroupHref(): string {
  return process.env.NEXT_PUBLIC_ANCLORA_GROUP_URL?.trim() || DEFAULT_ANCLORA_GROUP_URL
}
