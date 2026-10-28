# Data Lab isolated QA access plan

1. Select QA mode only from server configuration, never form fields or email; forward to Nexus with its QA-only key.
2. Bypass Data Lab's production-backed local request/account store in QA mode; preserve its existing normal path.
3. Provision the Identity `qa` role after Nexus approval. Map the role to the existing `investor-viewer` access level and keep Nexus review APIs behind the separate admin session.
4. Validate targeted authorization/delivery tests and type checks. Do not submit live requests until QA org, reviewer, secrets, and deployment are confirmed.

No local Data Lab database migration is required for the QA intake path.
