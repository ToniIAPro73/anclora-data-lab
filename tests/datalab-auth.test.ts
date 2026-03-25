import test from 'node:test'
import assert from 'node:assert/strict'
import { getDataLabUsers } from '@/lib/datalab-content'

test('getDataLabUsers returns bootstrap user by default', () => {
  delete process.env.ANCLORA_DATALAB_USERS_JSON
  process.env.ANCLORA_DATALAB_BOOTSTRAP_USERNAME = 'antonio'
  process.env.ANCLORA_DATALAB_BOOTSTRAP_PASSWORD = 'secret'
  process.env.ANCLORA_DATALAB_BOOTSTRAP_DISPLAY_NAME = 'Antonio'
  process.env.ANCLORA_DATALAB_BOOTSTRAP_ROLE = 'datalab-admin'

  const users = getDataLabUsers()

  assert.equal(users.length, 1)
  assert.equal(users[0]?.username, 'antonio')
  assert.equal(users[0]?.role, 'datalab-admin')
})

test('getDataLabUsers honors JSON override', () => {
  process.env.ANCLORA_DATALAB_USERS_JSON = JSON.stringify([
    {
      username: 'viewer',
      password: 'pw',
      displayName: 'Viewer',
      role: 'investor-viewer',
    },
  ])

  const users = getDataLabUsers()

  assert.equal(users.length, 1)
  assert.equal(users[0]?.username, 'viewer')
  assert.equal(users[0]?.role, 'investor-viewer')
})
