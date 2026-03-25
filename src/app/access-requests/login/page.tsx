import { redirect } from 'next/navigation'
import { DataLabAdmissionsLoginPage } from '@/components/datalab/DataLabAdmissionsLoginPage'
import { getDataLabAdminSession } from '@/lib/datalab-auth'

export default async function DataLabAdmissionsLoginRoute() {
  const session = await getDataLabAdminSession()
  if (session) redirect('/access-requests')

  return <DataLabAdmissionsLoginPage />
}
