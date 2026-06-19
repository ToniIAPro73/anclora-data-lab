import test from 'node:test'
import assert from 'node:assert/strict'
import fc from 'fast-check'

import {
  estimateMallorcaValue,
  isInsideMallorcaBoundary,
  type AvmComparable,
} from '@/lib/avm/mallorca-model'

function comparableArb(count: number) {
  return fc.array(
    fc.record({
      id: fc.uuid(),
      priceEur: fc.integer({ min: 150_000, max: 5_000_000 }),
      surfaceM2: fc.integer({ min: 40, max: 900 }),
      municipality: fc.constantFrom('Palma', 'Calvia', 'Andratx', 'Soller', 'Inca'),
      source: fc.constantFrom('source_observatory', 'deal_margin'),
    }),
    { minLength: count, maxLength: count }
  ) as fc.Arbitrary<AvmComparable[]>
}

test('Property 18: AVM confidence gating returns low confidence below 10 comparables', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 9 }).chain(comparableArb), (comparables) => {
      const result = estimateMallorcaValue({
        subject: { surfaceM2: 140, municipality: 'Palma' },
        comparables,
      })

      assert.equal(result.confidenceLevel, 'low')
      assert.equal(typeof result.explanation, 'string')
      assert.ok((result.explanation?.length ?? 0) > 0)
    }),
    { numRuns: 100 }
  )
})

test('Property 18: AVM uses medium/high confidence when enough comparables exist', () => {
  fc.assert(
    fc.property(fc.integer({ min: 10, max: 40 }).chain(comparableArb), (comparables) => {
      const result = estimateMallorcaValue({
        subject: { surfaceM2: 140, municipality: 'Palma' },
        comparables,
      })

      assert.notEqual(result.confidenceLevel, 'low')
      assert.equal(result.explanation, undefined)
    }),
    { numRuns: 100 }
  )
})

test('Property 19: AVM rejects locations outside Mallorca boundary', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1, maxLength: 40 }).filter((name) => !isInsideMallorcaBoundary({ municipality: name })),
      (municipality) => {
        assert.throws(
          () =>
            estimateMallorcaValue({
              subject: { surfaceM2: 120, municipality },
              comparables: [],
            }),
          /AVM_OUTSIDE_MALLORCA_BOUNDARY/
        )
      }
    ),
    { numRuns: 100 }
  )
})

test('Property 19: Mallorca municipalities and cadastral prefix 07 are accepted', () => {
  assert.equal(isInsideMallorcaBoundary({ municipality: 'Palma' }), true)
  assert.equal(isInsideMallorcaBoundary({ municipality: 'Sóller' }), true)
  assert.equal(isInsideMallorcaBoundary({ cadastralReference: '0704001DD7800S0001AB' }), true)
})
