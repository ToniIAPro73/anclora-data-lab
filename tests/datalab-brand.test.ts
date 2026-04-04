import test from 'node:test'
import assert from 'node:assert/strict'
import { DATALAB_BRAND } from '@/lib/datalab-brand'

test('datalab brand constants stay aligned with the premium contract', () => {
  assert.equal(DATALAB_BRAND.name, 'Anclora Data Lab')
  assert.equal(DATALAB_BRAND.logoPath, '/brand/logo-anclora-datalab.png')
  assert.equal(DATALAB_BRAND.faviconPath, '/favicon.ico')
  assert.equal(DATALAB_BRAND.premiumAccent, '#2DA078')
  assert.equal(DATALAB_BRAND.premiumCopper, '#C07860')
})
