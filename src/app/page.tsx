import { cookies } from 'next/headers'
import { DataLabPublicPage } from '@/components/datalab/DataLabPublicPage'
import { DATALAB_LOCALE_COOKIE, resolveDataLabLocale } from '@/lib/datalab-ui'

export default async function Home() {
  const cookieStore = await cookies()
  const defaultLocale = resolveDataLabLocale(cookieStore.get(DATALAB_LOCALE_COOKIE)?.value)
  return <DataLabPublicPage defaultLocale={defaultLocale} />
}
