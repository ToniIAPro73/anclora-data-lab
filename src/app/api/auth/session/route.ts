import { NextResponse } from 'next/server'
import { authenticateDataLabUser, clearDataLabSession, createDataLabSession } from '@/lib/datalab-auth'

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData()
    if (formData.get('_method') === 'DELETE') {
      await clearDataLabSession()
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null
  const username = body?.username?.trim()
  const password = body?.password?.trim()

  if (!username || !password) {
    return NextResponse.json({ error: 'Debes introducir usuario y contraseña.' }, { status: 400 })
  }

  const session = authenticateDataLabUser(username, password)
  if (!session) {
    return NextResponse.json({ error: 'Las credenciales no son válidas para Data Lab.' }, { status: 401 })
  }

  await createDataLabSession(session)
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearDataLabSession()
  return NextResponse.json({ ok: true })
}
