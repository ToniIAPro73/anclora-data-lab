import { NextResponse } from 'next/server'
import { createDataLabAccessRequest } from '@/lib/datalab-access-store'

export async function POST(request: Request) {
  let payload: {
    fullName?: string
    organization?: string
    email?: string
    profileLabel?: string
    intendedUse?: string
    requestedLocale?: string
    submissionSource?: string
  }

  try {
    payload = (await request.json()) as typeof payload
  } catch {
    return NextResponse.json({ error: 'JSON no válido.' }, { status: 400 })
  }

  const fullName = payload.fullName?.trim() || ''
  const email = payload.email?.trim().toLowerCase() || ''
  const intendedUse = payload.intendedUse?.trim() || ''

  if (!fullName || !email || !intendedUse) {
    return NextResponse.json({ error: 'Debes completar nombre, email e intención de uso.' }, { status: 400 })
  }

  try {
    const created = await createDataLabAccessRequest({
      fullName,
      organization: payload.organization,
      email,
      profileLabel: payload.profileLabel,
      intendedUse,
      requestedLocale: payload.requestedLocale?.trim() || 'es',
      submissionSource: payload.submissionSource?.trim() || 'private-estates',
    })

    return NextResponse.json({ ok: true, id: created?.id })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se ha podido registrar la solicitud.' },
      { status: 500 }
    )
  }
}
