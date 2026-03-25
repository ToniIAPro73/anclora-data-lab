import { NextResponse } from 'next/server'
import {
  authenticateDataLabAdmin,
  clearDataLabAdminSession,
  createDataLabAdminSession,
  getDataLabAdminSession,
} from '@/lib/datalab-auth'

export async function POST(request: Request) {
  let payload: { username?: string; password?: string }

  try {
    payload = (await request.json()) as { username?: string; password?: string }
  } catch {
    return NextResponse.json({ error: 'JSON no válido.' }, { status: 400 })
  }

  const username = payload.username?.trim() || ''
  const password = payload.password?.trim() || ''
  const session = authenticateDataLabAdmin(username, password)

  if (!session) {
    return NextResponse.json({ error: 'Las credenciales internas no son válidas.' }, { status: 401 })
  }

  await createDataLabAdminSession(session)
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const session = await getDataLabAdminSession()
  if (!session) return NextResponse.json({ authenticated: false })
  return NextResponse.json({ authenticated: true, username: session.username, role: session.role })
}

export async function DELETE() {
  await clearDataLabAdminSession()
  return NextResponse.json({ ok: true })
}
