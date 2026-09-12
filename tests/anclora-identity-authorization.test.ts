import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveDataLabAccess } from '@/lib/anclora-identity/authorization'

test('GROUP_OWNER gets full Data Lab access with no membership required', () => {
  const decision = resolveDataLabAccess({ sub: 'owner-1', platform_roles: ['GROUP_OWNER'], application_memberships: [] })
  assert.deepEqual(decision, { allowed: true, reason: 'DATA_LAB_FULL_ACCESS' })
})

test('a user with a data-lab membership is allowed', () => {
  const decision = resolveDataLabAccess({ sub: 'user-1', platform_roles: ['USER'], application_memberships: ['data-lab'] })
  assert.deepEqual(decision, { allowed: true, reason: 'APPLICATION_MEMBERSHIP' })
})

test('an authenticated user with no data-lab membership and no platform override is denied', () => {
  const decision = resolveDataLabAccess({ sub: 'user-2', platform_roles: ['USER'], application_memberships: ['talent'] })
  assert.deepEqual(decision, { allowed: false, reason: 'NO_MEMBERSHIP' })
})

test('missing claims default to denied rather than throwing', () => {
  const decision = resolveDataLabAccess({ sub: 'user-3' })
  assert.deepEqual(decision, { allowed: false, reason: 'NO_MEMBERSHIP' })
})

test('PLATFORM_ADMIN alone (without GROUP_OWNER) does not grant the full-access override', () => {
  const decision = resolveDataLabAccess({ sub: 'user-4', platform_roles: ['PLATFORM_ADMIN'], application_memberships: [] })
  assert.deepEqual(decision, { allowed: false, reason: 'NO_MEMBERSHIP' })
})
