/**
 * Anclora Intake Contract v1 — Nexus forward for Data Lab access requests.
 *
 * Fire-and-forget: errors are logged but do not block the access request response.
 */

const NEXUS_INTAKE_ENDPOINT = '/api/public/access-requests';

export interface DataLabAccessIntakePayload {
  product: 'data_lab';
  source: 'data_lab_app';
  source_system: 'data_lab_app';
  source_channel: 'in_app';
  source_detail: 'data_lab_access_modal';
  full_name: string;
  email: string;
  intended_use: string;
  company?: string | null;
  profile_type?: string | null;
  privacy_accepted: boolean;
  gdpr_consent: boolean;
  submission_language: string;
  external_id: string;
  captcha_provider: string;
  captcha_token: string;
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
    product: 'data_lab',
    source: 'data_lab_app',
    source_system: 'data_lab_app',
    source_channel: 'in_app',
    source_detail: 'data_lab_access_modal',
    full_name: input.fullName,
    email: input.email,
    intended_use: input.intendedUse,
    company: input.organization ?? null,
    profile_type: input.profileLabel ?? null,
    privacy_accepted: true,
    gdpr_consent: true,
    submission_language: input.requestedLocale || 'es',
    external_id: input.requestId,
    captcha_provider: 'turnstile',
    captcha_token: 'datalab-app-token',
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
  const { nexusBaseUrl, requestId } = options;
  const baseUrl = nexusBaseUrl || process.env.NEXUS_BASE_URL || 'https://nexus.anclora.group';

  const url = `${baseUrl.replace(/\/$/, '')}${NEXUS_INTAKE_ENDPOINT}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
