import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { getAncloraIdentityConfig } from './env'
import type { DataLabAccessDecision } from './authorization'

const SESSION_COOKIE = 'anclora-identity-datalab-session'
const OIDC_STATE_COOKIE = 'anclora-identity-oidc-state'

export interface AncloraIdentityDataLabSession {
  sub: string
  name: string
  email: string
  decision: DataLabAccessDecision
}

interface OidcStateCookiePayload {
  state: string
  codeVerifier: string
}

function sign(secret: string, body: string): string {
  return createHmac('sha256', secret).update(body).digest('base64url')
}

function encode<T>(secret: string, payload: T): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(secret, body)}`
}

function decode<T>(secret: string, token: string): T | null {
  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expected = Buffer.from(sign(secret, body), 'base64url')
  const received = Buffer.from(signature, 'base64url')
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}

export async function getAncloraIdentityDataLabSession(): Promise<AncloraIdentityDataLabSession | null> {
  const { sessionSecret } = getAncloraIdentityConfig()
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return decode<AncloraIdentityDataLabSession>(sessionSecret, token)
}

export async function createAncloraIdentityDataLabSession(session: AncloraIdentityDataLabSession): Promise<void> {
  const { sessionSecret } = getAncloraIdentityConfig()
  const store = await cookies()
  store.set(SESSION_COOKIE, encode(sessionSecret, session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export async function clearAncloraIdentityDataLabSession(): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })
}

/** Short-lived (10 minute) cookie carrying the PKCE verifier + state between /login and /callback. */
export async function storeOidcStateCookie(payload: OidcStateCookiePayload): Promise<void> {
  const { sessionSecret } = getAncloraIdentityConfig()
  const store = await cookies()
  store.set(OIDC_STATE_COOKIE, encode(sessionSecret, payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  })
}

export async function consumeOidcStateCookie(): Promise<OidcStateCookiePayload | null> {
  const { sessionSecret } = getAncloraIdentityConfig()
  const store = await cookies()
  const token = store.get(OIDC_STATE_COOKIE)?.value
  store.set(OIDC_STATE_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', expires: new Date(0) })
  if (!token) return null
  return decode<OidcStateCookiePayload>(sessionSecret, token)
}
