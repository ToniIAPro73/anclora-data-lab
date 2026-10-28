/**
 * Server-to-server delivery for Data Lab access requests.
 * Nexus is the approval system of record; this route uses a dedicated service
 * credential and an idempotency key derived from the persisted Data Lab row.
 */

const NEXUS_WEBHOOK_PATH = '/api/internal/webhooks/data-lab-access';

export interface DataLabAccessIntakePayload {
  requestId: string;
  fullName: string;
  email: string;
  organization?: string | null;
  intendedUse: string;
  profileLabel?: string | null;
  requestedLocale: string;
}

export type NexusForwardResult =
  | { ok: true; nexusRequestId?: string }
  | { ok: false; reason: 'configuration' | 'request_failed'; status?: number };

export function buildDataLabAccessIntakePayload(input: {
  requestId: string;
  fullName: string;
  email: string;
  organization?: string | null;
  intendedUse: string;
  profileLabel?: string | null;
  requestedLocale: string;
}): DataLabAccessIntakePayload {
  return {
    requestId: input.requestId,
    fullName: input.fullName,
    email: input.email,
    organization: input.organization ?? null,
    intendedUse: input.intendedUse,
    profileLabel: input.profileLabel ?? null,
    requestedLocale: input.requestedLocale || 'es',
  };
}

export async function forwardDataLabAccessToNexus(
  payload: DataLabAccessIntakePayload,
  options: {
    nexusBaseUrl?: string;
    nexusApiKey?: string;
    requestId: string;
    endpointPath?: string;
  },
): Promise<NexusForwardResult> {
  const baseUrl = (options.nexusBaseUrl || process.env.NEXUS_BASE_URL || '').trim();
  const apiKey = options.nexusApiKey || process.env.DATA_LAB_WEBHOOK_SECRET || '';

  if (!baseUrl || !apiKey) {
    console.error('[data-lab] Nexus access-request forwarding is not configured', {
      requestId: options.requestId,
      hasBaseUrl: Boolean(baseUrl),
      hasServiceSecret: Boolean(apiKey),
    });
    return { ok: false, reason: 'configuration' };
  }

  let endpoint: URL;
  try {
    endpoint = new URL(options.endpointPath || NEXUS_WEBHOOK_PATH, `${baseUrl.replace(/\/+$/, '')}/`);
  } catch {
    console.error('[data-lab] Nexus access-request base URL is invalid', { requestId: options.requestId });
    return { ok: false, reason: 'configuration' };
  }

  if (endpoint.protocol !== 'https:') {
    console.error('[data-lab] Nexus access-request endpoint must use HTTPS', { requestId: options.requestId });
    return { ok: false, reason: 'configuration' };
  }

  const nexusPayload = {
    applicant: {
      email: payload.email,
      name: payload.fullName,
      organization_name: payload.organization,
    },
    source: 'data_lab_app',
    request_type: 'access_request',
    idempotency_key: payload.requestId,
    context: {
      request_metadata: {
        intended_use: payload.intendedUse,
        profile_type: payload.profileLabel,
        submission_language: payload.requestedLocale,
      },
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(nexusPayload),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      console.warn('[data-lab] Nexus rejected access-request forwarding', {
        requestId: options.requestId,
        status: response.status,
      });
      return { ok: false, reason: 'request_failed', status: response.status };
    }

    const result = (await response.json().catch(() => null)) as { request_id?: unknown } | null;
    return {
      ok: true,
      nexusRequestId: typeof result?.request_id === 'string' ? result.request_id : undefined,
    };
  } catch (error) {
    console.error('[data-lab] Failed to forward access request to Nexus', {
      requestId: options.requestId,
      errorType: error instanceof Error ? error.name : 'UnknownError',
    });
    return { ok: false, reason: 'request_failed' };
  }
}
