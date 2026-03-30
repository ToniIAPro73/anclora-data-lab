import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DataLabAdmissionsLoginPage } from '@/components/datalab/DataLabAdmissionsLoginPage'
import { getDataLabAdminSession } from '@/lib/datalab-auth'
import { DATALAB_LOCALE_COOKIE, resolveDataLabLocale } from '@/lib/datalab-ui'

export default async function DataLabAdmissionsLoginRoute() {
  const session = await getDataLabAdminSession()
  if (session) redirect('/access-requests')

  const shouldAutofill = process.env.UTILIZAR_USER_TEXT === 'true'
  const cookieStore = await cookies()
  const defaultLocale = resolveDataLabLocale(cookieStore.get(DATALAB_LOCALE_COOKIE)?.value)

  return (
    <DataLabAdmissionsLoginPage
      defaultLocale={defaultLocale}
      defaultUsername={shouldAutofill ? process.env.USER_TEXT ?? '' : ''}
      defaultPassword={shouldAutofill ? process.env.PASS_TEXT ?? '' : ''}
    />
  )
}
