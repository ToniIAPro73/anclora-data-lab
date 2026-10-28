import assert from 'node:assert/strict'
import test from 'node:test'
import { buildIdentityCallbackErrorUrl } from '../src/lib/anclora-identity/callbackRedirect'

test('membership rejection returns to Data Lab with a user-facing access request state', () => {
  assert.equal(
    buildIdentityCallbackErrorUrl('https://data-lab.anclora.com/api/auth/anclora-identity/callback?code=secret', 'membership_required').toString(),
    'https://data-lab.anclora.com/login?identity_error=membership_required',
  )
})

test('token exchange errors return to the login retry state without leaking protocol details', () => {
  assert.equal(
    buildIdentityCallbackErrorUrl('https://data-lab.anclora.com/api/auth/anclora-identity/callback?code=secret', 'exchange').toString(),
    'https://data-lab.anclora.com/login?identity_error=exchange',
  )
})

test('expired or missing callback state returns to the login retry state', () => {
  assert.equal(
    buildIdentityCallbackErrorUrl('https://data-lab.anclora.com/api/auth/anclora-identity/callback?state=expired', 'retry').toString(),
    'https://data-lab.anclora.com/login?identity_error=retry',
  )
})

test('unavailable Identity configuration returns to the login recovery page', () => {
  assert.equal(
    buildIdentityCallbackErrorUrl('https://data-lab.anclora.com/api/auth/anclora-identity/callback', 'unavailable').toString(),
    'https://data-lab.anclora.com/login?identity_error=unavailable',
  )
})
