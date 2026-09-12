/**
 * Data Lab's local mapping from Anclora Identity claims to an access
 * decision. Mirrors (but does not duplicate the storage of)
 * anclora-identity's own `resolveApplicationAccess` — see
 * docs/identity/ANCLORA_IDENTITY_APPLICATION_INTEGRATION.md §4.
 *
 * Deliberately NOT keyed by email. `GROUP_OWNER` grants full access without
 * requiring a Data Lab membership; anyone else needs `application_memberships`
 * to include `'data-lab'`.
 */

export const DATA_LAB_APPLICATION_ID = 'data-lab'

export interface AncloraIdentityClaims {
  sub: string
  name?: string
  email?: string
  platform_roles?: string[]
  application_memberships?: string[]
}

export type DataLabAccessDecision =
  | { allowed: true; reason: 'DATA_LAB_FULL_ACCESS' }
  | { allowed: true; reason: 'APPLICATION_MEMBERSHIP' }
  | { allowed: false; reason: 'NO_MEMBERSHIP' }

export function resolveDataLabAccess(claims: AncloraIdentityClaims): DataLabAccessDecision {
  const platformRoles = claims.platform_roles ?? []
  const memberships = claims.application_memberships ?? []

  if (platformRoles.includes('GROUP_OWNER')) {
    return { allowed: true, reason: 'DATA_LAB_FULL_ACCESS' }
  }

  if (memberships.includes(DATA_LAB_APPLICATION_ID)) {
    return { allowed: true, reason: 'APPLICATION_MEMBERSHIP' }
  }

  return { allowed: false, reason: 'NO_MEMBERSHIP' }
}
