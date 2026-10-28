# Data Lab isolated QA access tasks

- [x] Add server-only QA intake routing and direct Nexus delivery without a local production write.
- [x] Keep ordinary request persistence behavior unchanged outside QA mode.
- [x] Preserve and enforce the Identity `qa` role in callback/session authorization.
- [x] Add focused tests for idempotent delivery and role enforcement.
- [x] Verify the reusable Nexus QA organization and dedicated reviewer membership read-only.
- [x] Record deployment and provider gates without creating live requests.

Live production E2E, request creation, Nexus approval, and inbox verification remain blocked: Vercel environment access returned 403 and current Preview deployments predate these changes.
