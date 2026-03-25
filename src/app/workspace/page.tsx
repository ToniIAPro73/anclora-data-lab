import { DataLabWorkspaceShell } from '@/components/datalab/DataLabWorkspaceShell'
import { requireDataLabSession } from '@/lib/datalab-auth'

export default async function WorkspacePage() {
  const session = await requireDataLabSession()
  return <DataLabWorkspaceShell session={session} />
}
