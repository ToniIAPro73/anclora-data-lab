import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildDataLabAccessIntakePayload,
  forwardDataLabAccessToNexus,
} from '@/lib/nexus-intake-forward'

test('forwards a Data Lab request to the authenticated Nexus webhook', async () => {
  const originalFetch = globalThis.fetch
  let captured: { input: URL | RequestInfo; init?: RequestInit } | undefined
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    captured = { input, init }
    return Response.json({ status: 'accepted', request_id: 'nexus-456' })
  }) as typeof fetch

  try {
    const payload = buildDataLabAccessIntakePayload({
      requestId: 'datalab-123',
      fullName: 'QA Applicant',
      email: 'qa@example.test',
      organization: 'QA Org',
      intendedUse: 'Synthetic QA',
      profileLabel: 'analyst',
      requestedLocale: 'es',
    })
    const result = await forwardDataLabAccessToNexus(payload, {
      nexusBaseUrl: 'https://anclora-nexus.onrender.com/',
      nexusApiKey: 'dedicated-test-key',
      requestId: 'datalab-123',
    })

    assert.deepEqual(result, { ok: true, nexusRequestId: 'nexus-456' })
    assert.equal(
      String(captured?.input),
      'https://anclora-nexus.onrender.com/api/internal/webhooks/data-lab-access',
    )
    assert.equal(captured?.init?.method, 'POST')
    assert.equal(
      (captured?.init?.headers as Record<string, string>).Authorization,
      'Bearer dedicated-test-key',
    )
    assert.deepEqual(JSON.parse(String(captured?.init?.body)), {
      applicant: {
        email: 'qa@example.test',
        name: 'QA Applicant',
        organization_name: 'QA Org',
      },
      source: 'data_lab_app',
      request_type: 'access_request',
      idempotency_key: 'datalab-123',
      context: {
        request_metadata: {
          intended_use: 'Synthetic QA',
          profile_type: 'analyst',
          submission_language: 'es',
        },
      },
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('reports a rejected Nexus delivery so the caller can offer a retry', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => new Response(null, { status: 503 })) as typeof fetch

  try {
    const result = await forwardDataLabAccessToNexus(
      buildDataLabAccessIntakePayload({
        requestId: 'datalab-123',
        fullName: 'QA Applicant',
        email: 'qa@example.test',
        intendedUse: 'Synthetic QA',
        requestedLocale: 'es',
      }),
      {
        nexusBaseUrl: 'https://anclora-nexus.onrender.com',
        nexusApiKey: 'dedicated-test-key',
        requestId: 'datalab-123',
      },
    )

    assert.deepEqual(result, { ok: false, reason: 'request_failed', status: 503 })
  } finally {
    globalThis.fetch = originalFetch
  }
})
