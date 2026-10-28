# Data Lab Identity access recovery — Spec v1

## Status

Draft for review on `development`.

## Context

Data Lab delegates authentication to Anclora Identity and separately requires
an active `data-lab` application membership. The current production callback
also exposed raw `TOKEN_EXCHANGE_FAILED` JSON. Production configuration
metadata showed the Data Lab client secret and Identity's registered Data Lab
client secret had different update histories; the pair was rotated together
and applied to Production.

## Requirements

- Keep Data Lab's membership authorization unchanged.
- Return users without active membership to the public access request form at
  `/#request-access`.
- Return temporary OIDC failures to a retry page without exposing protocol
  details.
- Log only an allowlisted OAuth error category for token exchange failures.
- Preserve the existing Data Lab visual system and normal successful login.

## Acceptance criteria

- A user without Data Lab membership sees an approval explanation and an
  access-request action, not JSON.
- A token-exchange failure shows a retry action, not protocol codes.
- Callback redirects remove the authorization code and state from the URL.
- The production client secret pair is configured consistently in Identity
  and Data Lab, scoped to Production.
- Active-member sign-in continues to redirect to `/workspace`.
