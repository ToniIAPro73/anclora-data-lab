import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { redirect } from 'next/navigation'
import { getDataLabUsers, type DataLabRole } from '@/lib/datalab-content'

const SESSION_COOKIE = 'anclora-datalab-session'

export type DataLabSession = {
  username: string
  displayName: string
  role: DataLabRole
}

function getSecret() {
  return process.env.ANCLORA_DATALAB_SESSION_SECRET?.trim() || 'anclora-datalab-local-dev-secret'
}

function encode(payload: DataLabSession) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', getSecret()).update(body).digest('base64url')
  return `${body}.${signature}`
}

function decode(token: string): DataLabSession | null {
  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = createHmac('sha256', getSecret()).update(body).digest()
  const received = Buffer.from(signature, 'base64url')
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as DataLabSession
  } catch {
    return null
  }
}

export async function getDataLabSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return decode(token)
}

export async function requireDataLabSession() {
  const session = await getDataLabSession()
  if (!session) redirect('/login')
  return session
}

export function authenticateDataLabUser(username: string, password: string): DataLabSession | null {
  const user = getDataLabUsers().find((candidate) => candidate.username === username && candidate.password === password)
  if (!user) return null

  return {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  }
}

export async function createDataLabSession(session: DataLabSession) {
  const store = await cookies()
  store.set(SESSION_COOKIE, encode(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export async function clearDataLabSession() {
  const store = await cookies()
  store.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
}
