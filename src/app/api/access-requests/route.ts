import { NextResponse } from 'next/server'
import { listDataLabAccessRequests } from '@/lib/datalab-access-store'
import { requireDataLabAdminSession } from '@/lib/datalab-auth'

export async function GET(request: Request) {
  try {
    await requireDataLabAdminSession()
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')?.trim() || ''
  const query = searchParams.get('q')?.trim() || ''

  try {
    const items = await listDataLabAccessRequests({
      status: status && status !== 'all' ? (status as 'submitted' | 'under_review' | 'accepted' | 'rejected') : undefined,
      query,
      limit: 120,
    })

    return NextResponse.json({ items, total: items.length })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se han podido cargar las solicitudes.' },
      { status: 500 }
    )
  }
}
