import { NextResponse } from 'next/server'
import { approveDataLabAccessRequest, rejectDataLabAccessRequest, updateDataLabAccessRequestStatus } from '@/lib/datalab-access-store'
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
      const approved = await approveDataLabAccessRequest({
        id,
        role: (payload.role as DataLabRole | undefined) || 'partner-intelligence',
        reviewNotes: payload.reviewNotes,
        decisionReason: payload.decisionReason,
        reviewedBy: session.username,
      })

      if (!approved?.request) {
        return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 })
      }

      return NextResponse.json({
        ...approved.request,
        temp_password: approved.temporaryPassword,
        launch_url: approved.launchUrl,
        account: approved.account,
      })
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
