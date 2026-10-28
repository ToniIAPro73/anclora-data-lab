# Data Lab Identity access recovery — Tasks v1

## Source

`datalab-identity-friendly-access-recovery-spec-v1.md`

## Tasks

- [x] Add focused tests for the safe recovery URLs used after membership denial, exchange failure, expired state and unavailable Identity.
- [x] Synchronize the Identity and Data Lab client secret in Production and redeploy both services.
- [x] Replace raw callback JSON with access-request and retry states.
- [x] Verify membership-required and exchange states with Visual QA, including the public access-request destination.
- [ ] Present the changes on `development` for Toni's validation before commit.

## Validation evidence

- `npx tsx --test tests/anclora-identity-callback-redirect.test.ts` — PASS, 4 tests.
- `npx tsc --noEmit` — PASS.
- ESLint on changed route, redirect helper, login page and test — PASS.
- `anclora-visual-qa check` — PASS for membership-required and exchange states.
- Production environment changed using one fresh secret injected into both
  Production-only variables; the secret value was not read back or printed.
- Identity and Data Lab Production redeployments reached READY.
