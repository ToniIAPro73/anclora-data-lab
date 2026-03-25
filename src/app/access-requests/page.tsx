import { DataLabAccessRequestsReviewPage } from '@/components/datalab/DataLabAccessRequestsReviewPage'
import { requireDataLabAdminSession } from '@/lib/datalab-auth'

export default async function DataLabAccessRequestsPage() {
  await requireDataLabAdminSession()
  return <DataLabAccessRequestsReviewPage />
}
