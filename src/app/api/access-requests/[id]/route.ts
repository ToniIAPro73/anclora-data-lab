import { NextResponse } from 'next/server'
import { rejectDataLabAccessRequest, updateDataLabAccessRequestStatus } from '@/lib/datalab-access-store'
import { requireDataLabAdminSession } from '@/lib/datalab-auth'
import type { DataLabRole } from '@/lib/datalab-content'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  let session
  try {
    session = await requireDataLabAdminSession()
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  let payload: {
    status?: 'accepted' | 'rejected' | 'under_review'
    reviewNotes?: string
    decisionReason?: string
    role?: DataLabRole
  }

  try {
    payload = (await request.json()) as typeof payload
  } catch {
    return NextResponse.json({ error: 'JSON no válido.' }, { status: 400 })
  }

  const { id } = await context.params

  try {
    if (payload.status === 'accepted') {
      return NextResponse.json(
        {
          error: 'LOCAL_APPROVAL_DEPRECATED',
          message:
            'Admission decisions and credential provisioning are managed exclusively by Anclora Nexus and Anclora Identity. Review and approve this request in Anclora Nexus.',
        },
        { status: 409 }
      )
    }

    if (payload.status === 'under_review') {
      const updated = await updateDataLabAccessRequestStatus({
        id,
        status: 'under_review',
        reviewNotes: payload.reviewNotes,
        decisionReason: payload.decisionReason,
        reviewedBy: session.username,
      })

      if (!updated) {
        return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 })
      }

      return NextResponse.json(updated)
    }

    if (payload.status === 'rejected') {
      const updated = await rejectDataLabAccessRequest({
        id,
        reviewNotes: payload.reviewNotes,
        decisionReason: payload.decisionReason,
        reviewedBy: session.username,
      })

      if (!updated) {
        return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 })
      }

      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: 'Estado no soportado.' }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se ha podido actualizar la solicitud.' },
      { status: 500 }
    )
  }
}
