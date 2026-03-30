import { cookies } from 'next/headers'
import { DataLabAccessRequestsReviewPage } from '@/components/datalab/DataLabAccessRequestsReviewPage'
import { requireDataLabAdminSession } from '@/lib/datalab-auth'
import { DATALAB_LOCALE_COOKIE, resolveDataLabLocale } from '@/lib/datalab-ui'

export default async function DataLabAccessRequestsPage() {
  await requireDataLabAdminSession()
  const cookieStore = await cookies()
  const defaultLocale = resolveDataLabLocale(cookieStore.get(DATALAB_LOCALE_COOKIE)?.value)
  return <DataLabAccessRequestsReviewPage defaultLocale={defaultLocale} />
}
