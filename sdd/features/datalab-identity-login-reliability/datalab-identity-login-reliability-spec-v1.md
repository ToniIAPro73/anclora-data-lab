# Data Lab Identity login reliability — Spec v1

## Status

Draft for review on `development`.

## Context

The production `/login` route enters the Anclora Identity OIDC flow. When
discovery does not complete, the request can remain pending and the browser
shows a blank page. The Identity flow must remain the only login path while it
is enabled.

## Acceptance criteria

- OIDC discovery has a bounded timeout.
- A discovery/configuration failure returns the user to a branded, actionable
  Data Lab error state instead of leaving the browser on a pending page.
- The error state offers a retry to the Identity login endpoint.
- Identity-enabled mode never falls back to local password authentication.
- Identity-disabled mode retains the existing local login flow.
