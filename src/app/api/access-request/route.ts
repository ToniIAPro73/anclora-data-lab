import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { createDataLabAccessRequest, getDataLabAccessRequestById } from '@/lib/datalab-access-store'
import {
  buildDataLabAccessIntakePayload,
  forwardDataLabAccessToNexus,
} from '@/lib/nexus-intake-forward'

export async function POST(request: Request) {
  let payload: {
    fullName?: string
    organization?: string
    email?: string
    profileLabel?: string
    intendedUse?: string
    requestedLocale?: string
    submissionSource?: string
    requestId?: string
  }

  try {
    payload = (await request.json()) as typeof payload
  } catch {
    return NextResponse.json({ error: 'JSON no válido.' }, { status: 400 })
  }

  const fullName = payload.fullName?.trim() || ''
  const email = payload.email?.trim().toLowerCase() || ''
  const intendedUse = payload.intendedUse?.trim() || ''
  const qaRequestScope = process.env.DATA_LAB_ACCESS_REQUEST_SCOPE === 'qa'

  if (!fullName || !email || !intendedUse) {
    return NextResponse.json({ error: 'Debes completar nombre, email e intención de uso.' }, { status: 400 })
  }

  try {
    if (qaRequestScope) {
      const requestId = payload.requestId?.trim() || randomUUID()
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
        return NextResponse.json({ error: 'Identificador de reintento no válido.' }, { status: 400 })
      }
      const nexusBaseUrl = process.env.NEXUS_BASE_URL
      const nexusApiKey = process.env.NEXUS_QA_DATA_LAB_WEBHOOK_SECRET
      if (!nexusBaseUrl || !nexusApiKey) {
        return NextResponse.json({ error: 'Solicitud QA no disponible: configuración aislada incompleta.' }, { status: 503 })
      }
      const nexusPayload = buildDataLabAccessIntakePayload({
        requestId,
        fullName,
        email,
        organization: payload.organization,
        intendedUse,
        profileLabel: payload.profileLabel,
        requestedLocale: payload.requestedLocale?.trim() || 'es',
      })
      const nexusResult = await forwardDataLabAccessToNexus(nexusPayload, {
        nexusBaseUrl,
        nexusApiKey,
        requestId,
        endpointPath: '/api/internal/webhooks/data-lab-qa-access',
      })
      if (!nexusResult.ok) {
        return NextResponse.json(
          { error: 'No se pudo enviar la solicitud QA a Nexus. Puedes reintentar con el mismo identificador.', requestId },
          { status: 502 },
        )
      }
      return NextResponse.json({ ok: true, id: nexusResult.nexusRequestId ?? requestId, nexusRequestId: nexusResult.nexusRequestId, requestId })
    }

    let created
    if (payload.requestId?.trim()) {
      created = await getDataLabAccessRequestById(payload.requestId.trim())
      if (!created || created.email.toLowerCase() !== email || created.status !== 'submitted') {
        return NextResponse.json({ error: 'No se encuentra una solicitud pendiente que puedas reenviar.' }, { status: 404 })
      }
    } else {
      created = await createDataLabAccessRequest({
        fullName,
        organization: payload.organization,
        email,
        profileLabel: payload.profileLabel,
        intendedUse,
        requestedLocale: payload.requestedLocale?.trim() || 'es',
        submissionSource: payload.submissionSource?.trim() || 'private-estates',
      })
    }

    if (!created?.id) {
      throw new Error('No se ha podido guardar la solicitud de acceso.')
    }

    const nexusPayload = buildDataLabAccessIntakePayload({
      requestId: created.id,
      fullName: created.full_name,
      email: created.email,
      organization: created.organization,
      intendedUse: created.intended_use,
      profileLabel: created.profile_label,
      requestedLocale: created.requested_locale,
    })
    const nexusResult = await forwardDataLabAccessToNexus(nexusPayload, {
      nexusBaseUrl: process.env.NEXUS_BASE_URL,
      nexusApiKey: process.env.DATA_LAB_WEBHOOK_SECRET,
      requestId: created.id,
    })

    if (!nexusResult.ok) {
      return NextResponse.json(
        {
          error: 'La solicitud quedó guardada en Data Lab, pero no se pudo enviar a Nexus. Reintenta el envío con el mismo formulario; no se creará otra solicitud.',
          requestId: created.id,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true, id: created.id, nexusRequestId: nexusResult.nexusRequestId })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se ha podido registrar la solicitud.' },
      { status: 500 }
    )
  }
}
