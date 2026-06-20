/**
 * Anclora Intake Contract v1 — Nexus forward for Data Lab access requests.
 *
 * Fire-and-forget: errors are logged but do not block the access request response.
 */

const NEXUS_INTAKE_ENDPOINT = '/api/internal/webhooks/data-lab-access';

export interface DataLabAccessIntakePayload {
  schema_version: 'anclora-intake-v1';
  intake_domain: 'access_request';
  request_type: 'access_request';
  source: 'data_lab_app';
  target_product: 'data_lab';
  service_interest: null;
  idempotency_key: string;
  routing_target_domain: 'access_requests';

  applicant: {
    name: string;
    email: string;
    organization_name?: string | null;
    preferred_language?: string | null;
  };

  context: {
    request_metadata: {
      intended_use: string;
      profile_label?: string | null;
      datalab_request_id: string;
      submission_source: string;
    };
  };

  consent: {
    privacy_accepted: boolean;
    consent_timestamp: string;
  };
}

export function buildDataLabAccessIntakePayload(input: {
  requestId: string;
  fullName: string;
  email: string;
  organization?: string | null;
  intendedUse: string;
  profileLabel?: string | null;
  requestedLocale: string;
  submissionSource: string;
  submittedAt?: string;
}): DataLabAccessIntakePayload {
  return {
    schema_version: 'anclora-intake-v1',
    intake_domain: 'access_request',
    request_type: 'access_request',
    source: 'data_lab_app',
    target_product: 'data_lab',
    service_interest: null,
    idempotency_key: input.requestId,
    routing_target_domain: 'access_requests',
    applicant: {
      name: input.fullName,
      email: input.email,
      organization_name: input.organization ?? null,
      preferred_language: input.requestedLocale,
    },
    context: {
      request_metadata: {
        intended_use: input.intendedUse,
        profile_label: input.profileLabel ?? null,
        datalab_request_id: input.requestId,
        submission_source: input.submissionSource,
      },
    },
    consent: {
      privacy_accepted: true,
      consent_timestamp: input.submittedAt ?? new Date().toISOString(),
    },
  };
}

export async function forwardDataLabAccessToNexus(
  payload: DataLabAccessIntakePayload,
  options: {
    nexusBaseUrl?: string;
    nexusApiKey?: string;
    requestId: string;
  },
): Promise<void> {
  const { nexusBaseUrl, nexusApiKey, requestId } = options;

  if (!nexusBaseUrl || !nexusApiKey) {
    console.warn('[data-lab] Nexus webhook not configured — skipping forward', {
      requestId,
    });
    return;
  }

  const url = `${nexusBaseUrl.replace(/\/$/, '')}${NEXUS_INTAKE_ENDPOINT}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${nexusApiKey}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      console.warn('[data-lab] Nexus returned non-OK for access request forward', {
        requestId,
        status: response.status,
      });
    }
  } catch (err) {
    console.error('[data-lab] Failed to forward access request to Nexus', {
      requestId,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
