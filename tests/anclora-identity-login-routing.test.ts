import test from 'node:test'
import assert from 'node:assert/strict'
import { POST as legacySessionPost } from '@/app/api/auth/session/route'
import { getDataLabLoginPath } from '@/lib/anclora-identity/loginRouting'

test('enabled Data Lab login routes to the Anclora Identity authorization endpoint', () => {
  assert.equal(getDataLabLoginPath(true), '/api/auth/anclora-identity/login')
})

test('disabled Data Lab login keeps the legacy login page', () => {
  assert.equal(getDataLabLoginPath(false), '/login')
})

test('legacy credential session endpoint is fail-closed when Identity is enabled', async () => {
  const previous = process.env.ANCLORA_IDENTITY_ENABLED
  process.env.ANCLORA_IDENTITY_ENABLED = 'true'

  try {
    const response = await legacySessionPost(new Request('https://data-lab.anclora.com/api/auth/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'qa-admission@anclora.com', password: 'redacted' }),
    }))

    assert.equal(response.status, 404)
    assert.deepEqual(await response.json(), { error: 'ANCLORA_IDENTITY_ENABLED' })
  } finally {
    if (previous === undefined) delete process.env.ANCLORA_IDENTITY_ENABLED
    else process.env.ANCLORA_IDENTITY_ENABLED = previous
  }
})
