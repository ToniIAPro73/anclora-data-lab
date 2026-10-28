# Data Lab to Nexus Access Request Delivery — Spec v1

## Problem

Data Lab reported access requests as submitted before confirming that Nexus, the system of record for review, had accepted them. The forwarding request used a public endpoint without a real CAPTCHA proof, and failures were hidden from the applicant. This made the Nexus review queue incomplete while Data Lab showed success.

## Decision

Data Lab persists the request locally, then synchronously forwards it to Nexus through the authenticated internal `data-lab-access` webhook. The stable Data Lab request UUID is the Nexus idempotency key. Data Lab reports success only after Nexus confirms acceptance; on delivery failure it preserves the request and offers a retry using the same UUID.

The Data Lab service credential is separate from GuestHub's credential and is accepted only by the Data Lab webhook. Nexus remains the sole approval system of record.

## Acceptance criteria

1. Forwarding uses `NEXUS_BASE_URL` and `DATA_LAB_WEBHOOK_SECRET`; no obsolete host fallback or fabricated CAPTCHA token is used.
2. A successful Nexus response is required before Data Lab displays submission success.
3. Failed delivery is communicated in plain language and retains a retryable request without creating a duplicate local or Nexus record.
4. Retry is limited to the same normalized applicant email and a still-submitted local request.
5. Nexus accepts the dedicated Data Lab credential on its Data Lab webhook and rejects it on the GuestHub webhook.
6. Logs do not contain applicant PII or service credentials.

## Verification

Focused helper tests cover the webhook URL, authorization, payload/idempotency contract, and rejected delivery. Nexus route tests cover the dedicated credential's endpoint scope. Development review confirms the applicant sees an accurate success or retry state.
