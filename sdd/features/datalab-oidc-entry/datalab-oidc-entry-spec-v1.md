# Data Lab OIDC entry contract

## Scope

When `ANCLORA_IDENTITY_ENABLED=true`, Data Lab Production exposes Anclora Identity as the only end-user authentication entry point.

## Acceptance criteria

- `GET /login` redirects unauthenticated users to `/api/auth/anclora-identity/login`.
- The legacy credential endpoint cannot create a usable Data Lab session while Identity is enabled.
- The protected workspace resolves only the `anclora-identity-datalab-session` cookie in enabled mode.
- Logout clears the Identity session and returns the user to `/login`.
- Legacy password login remains available only when Identity is disabled.
