import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { redirect } from 'next/navigation'
import type { DataLabRole } from '@/lib/datalab-content'
import { getDataLabAccountByEmail, markDataLabLogin } from '@/lib/datalab-access-store'
import { verifySecret } from '@/lib/passwords'
import { isAncloraIdentityEnabled } from '@/lib/anclora-identity/env'
import { getAncloraIdentityDataLabSession } from '@/lib/anclora-identity/session'

const SESSION_COOKIE = 'anclora-datalab-session'
const ADMIN_SESSION_COOKIE = 'anclora-datalab-admin-session'

export type DataLabSession = {
  username: string
  displayName: string
  role: DataLabRole
}

export type DataLabAdminRole = 'reviewer' | 'admin'

export type DataLabAdminSession = {
  username: string
  displayName: string
  role: DataLabAdminRole
}

function buildSigner(secret: string) {
  return (body: string) => createHmac('sha256', secret).update(body).digest('base64url')
}

function buildEncoder<T>(secret: string) {
  const sign = buildSigner(secret)
  return (payload: T) => {
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
    return `${body}.${sign(body)}`
  }
}

function buildDecoder<T>(secret: string) {
  const sign = buildSigner(secret)
  return (token: string): T | null => {
    const [body, signature] = token.split('.')
    if (!body || !signature) return null

    const expected = Buffer.from(sign(body), 'base64url')
    const received = Buffer.from(signature, 'base64url')
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

    try {
      return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T
    } catch {
      return null
    }
  }
}

function getSecret() {
  return (
    process.env.DATALAB_USER_SESSION_SECRET?.trim() ||
    process.env.DATALAB_SESSION_SECRET?.trim() ||
    'anclora-datalab-local-dev-secret'
  )
}

function getAdminSecret() {
  return process.env.DATALAB_ADMIN_SESSION_SECRET?.trim() || 'anclora-datalab-admin-local-dev-secret'
}

const encodeSession = buildEncoder<DataLabSession>(getSecret())
const decodeSession = buildDecoder<DataLabSession>(getSecret())
const encodeAdminSession = buildEncoder<DataLabAdminSession>(getAdminSecret())
const decodeAdminSession = buildDecoder<DataLabAdminSession>(getAdminSecret())

/**
 * Anclora Identity pilot integration (ANCLORA_IDENTITY_ENABLED, see
 * src/lib/anclora-identity/). When the flag is not exactly `'true'` these
 * functions are byte-for-byte the pre-pilot legacy behavior. When it IS
 * `'true'`, session resolution goes ONLY through Anclora Identity — there is
 * no per-request fallback to the legacy cookie, by design (a request that
 * could authenticate via either path depending on transient state would be
 * an unreviewable, silent bypass).
 */
async function getEffectiveDataLabSession(): Promise<DataLabSession | null> {
  if (!isAncloraIdentityEnabled()) {
    return getLegacyDataLabSession()
  }

  const identitySession = await getAncloraIdentityDataLabSession()
  if (!identitySession) return null

  return {
    username: identitySession.email || identitySession.sub,
    displayName: identitySession.name,
    // GROUP_OWNER maps to the full-access local role. Anclora Identity has no
    // concept of Data Lab's finer-grained roles (market-analyst,
    // investment-advisory, ...) — that authorization stays local to Data
    // Lab, so a member (non-owner) SSO login gets the most restrictive
    // non-admin role by default. Assigning a richer local role for a given
    // Anclora Identity member is local Data Lab admin work, out of scope for
    // this pilot — tracked as a gap, not silently decided here.
    role: identitySession.decision.reason === 'DATA_LAB_FULL_ACCESS' ? 'datalab-admin' : 'investor-viewer',
  }
}

async function getLegacyDataLabSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return decodeSession(token)
}

export async function getDataLabSession() {
  return getEffectiveDataLabSession()
}

export async function requireDataLabSession() {
  const session = await getEffectiveDataLabSession()
  if (!session) {
    redirect(isAncloraIdentityEnabled() ? '/api/auth/anclora-identity/login' : '/login')
  }
  return session
}

export async function getDataLabAdminSession() {
  const store = await cookies()
  const token = store.get(ADMIN_SESSION_COOKIE)?.value
  if (!token) return null
  return decodeAdminSession(token)
}

export async function requireDataLabAdminSession() {
  const session = await getDataLabAdminSession()
  if (!session) redirect('/access-requests/login')
  return session
}

export async function authenticateDataLabUser(username: string, password: string): Promise<DataLabSession | null> {
  const normalizedUsername = username.trim()
  const normalizedPassword = password.trim()

  if (!normalizedUsername.includes('@')) {
    return null
  }

  const account = await getDataLabAccountByEmail(normalizedUsername).catch(() => null)
  if (account && account.account_status === 'active' && verifySecret(normalizedPassword, account.password_hash)) {
    await markDataLabLogin(account.id).catch(() => null)
    return {
      username: account.email,
      displayName: account.full_name,
      role: account.role,
    }
  }

  return null
}

export function authenticateDataLabAdmin(username: string, password: string): DataLabAdminSession | null {
  const configuredUsername = process.env.DATALAB_ADMIN_USERNAME?.trim()
  const configuredPassword = process.env.DATALAB_ADMIN_PASSWORD?.trim()
  const configuredRole = (process.env.DATALAB_ADMIN_ROLE?.trim() as DataLabAdminRole | undefined) || 'reviewer'
  const configuredDisplayName = process.env.DATALAB_ADMIN_DISPLAY_NAME?.trim() || 'Data Lab Admissions'
  const allowUserText = process.env.UTILIZAR_USER_TEXT === 'true'
  const fallbackUsername = process.env.USER_TEXT?.trim()
  const fallbackPassword = process.env.PASS_TEXT?.trim()
  const normalizedUsername = username.trim()
  const normalizedPassword = password.trim()

  if (
    allowUserText &&
    fallbackUsername &&
    fallbackPassword &&
    fallbackUsername === normalizedUsername &&
    fallbackPassword === normalizedPassword
  ) {
    return {
      username: fallbackUsername,
      displayName: configuredDisplayName,
      role: configuredRole,
    }
  }

  if (!configuredUsername || !configuredPassword) return null
  if (configuredUsername !== normalizedUsername || configuredPassword !== normalizedPassword) return null

  return {
    username: configuredUsername,
    displayName: configuredDisplayName,
    role: configuredRole,
  }
}

export async function createDataLabSession(session: DataLabSession) {
  const store = await cookies()
  store.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export async function createDataLabAdminSession(session: DataLabAdminSession) {
  const store = await cookies()
  store.set(ADMIN_SESSION_COOKIE, encodeAdminSession(session), {
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

export async function clearDataLabAdminSession() {
  const store = await cookies()
  store.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
}
