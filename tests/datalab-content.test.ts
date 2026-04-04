import test from 'node:test'
import assert from 'node:assert/strict'
import { roleLabels } from '@/lib/datalab-content'

test('roleLabels includes core datalab roles', () => {
  assert.equal(roleLabels['datalab-admin'], 'Administrador Data Lab')
  assert.equal(roleLabels['partner-intelligence'], 'Inteligencia de partners')
  assert.equal(roleLabels['investor-viewer'], 'Visor de inversor')
})
