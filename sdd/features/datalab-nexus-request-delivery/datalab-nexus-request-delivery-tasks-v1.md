# Data Lab to Nexus Access Request Delivery — Tasks v1

- [x] Define synchronous delivery and idempotent retry behavior.
- [x] Add a dedicated authenticated Nexus delivery helper and remove the public CAPTCHA bypass.
- [x] Preserve and retrieve a submitted Data Lab request for a same-email retry.
- [x] Show success only after Nexus accepts; expose a retry action after forwarding failure.
- [x] Add focused delivery tests and document required environment variable names.
- [x] Validate both applications in development with the dedicated Data Lab service credential.
- [ ] Review the existing failed Data Lab request and retry it after development validation and deployment configuration are ready.
