/**
 * Anclora Identity pilot integration — configuration.
 *
 * `ANCLORA_IDENTITY_ENABLED` is the fail-closed switch described in
 * docs/identity/ANCLORA_IDENTITY_APPLICATION_INTEGRATION.md: when it is not
 * exactly `'true'`, Data Lab behaves exactly as before this integration
 * (legacy auth in `datalab-auth.ts`, untouched). When it IS `'true'`, every
 * required variable below must also be present — a partially-configured
 * "enabled" state throws at read time rather than silently falling back to
 * legacy auth, which would otherwise be an insecure, unnoticed bypass.
 */
export function isAncloraIdentityEnabled(): boolean {
  return process.env.ANCLORA_IDENTITY_ENABLED === 'true'
}

export interface AncloraIdentityConfig {
  issuerUrl: string
  clientId: string
  clientSecret: string
  redirectUri: string
  sessionSecret: string
}

export function getAncloraIdentityConfig(): AncloraIdentityConfig {
  const issuerUrl = process.env.ANCLORA_IDENTITY_ISSUER_URL?.trim()
  const clientId = process.env.ANCLORA_IDENTITY_CLIENT_ID?.trim()
  const clientSecret = process.env.ANCLORA_IDENTITY_CLIENT_SECRET?.trim()
  const redirectUri = process.env.ANCLORA_IDENTITY_REDIRECT_URI?.trim()
  const sessionSecret = process.env.ANCLORA_IDENTITY_SESSION_SECRET?.trim()

  const missing = Object.entries({ issuerUrl, clientId, clientSecret, redirectUri, sessionSecret })
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `ANCLORA_IDENTITY_ENABLED=true but missing required configuration: ${missing.join(', ')}. Refusing to start with a partially-configured Anclora Identity integration.`,
    )
  }

  return { issuerUrl: issuerUrl!, clientId: clientId!, clientSecret: clientSecret!, redirectUri: redirectUri!, sessionSecret: sessionSecret! }
}
