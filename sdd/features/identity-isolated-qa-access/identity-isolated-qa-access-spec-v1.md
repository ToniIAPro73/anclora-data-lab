# Data Lab isolated QA access through Anclora Identity

## Goal

Allow the dedicated QA applicant to request Data Lab access through the normal form, with Nexus as the approval system and a least-privilege Identity membership.

## Requirements

1. QA scope is selected only by server-side deployment configuration; neither form data nor email selects it.
2. In QA mode, the request is sent directly to a dedicated Nexus QA intake. It must not first be inserted into the production-backed `datalab_access_requests` or `datalab_accounts` tables.
3. Missing QA configuration fails closed before any write to those operational tables.
4. Approval provisions only an Identity membership with the `qa` application role. Existing broader memberships are rejected without mutation.
5. The OIDC callback and session preserve the QA role. Data Lab’s QA view uses only non-user-specific curated examples; account/request review data remains unavailable to QA applicants.
6. The ordinary access request flow remains unchanged outside the server-configured QA deployment.

## Acceptance

- QA request creation has no write dependency on the production-backed local request store.
- The QA delivery credential and Nexus org namespace are mandatory and are never client-controlled.
- Authorization distinguishes `qa` from regular membership and rejects absent/incorrect roles.
- Focused tests cover no-write behavior, idempotency, fail-closed configuration, and role checks.
- No live request is created unless the deployment and QA namespace are proven isolated.
