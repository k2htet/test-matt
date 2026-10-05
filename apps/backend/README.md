# NestJS backend placeholder

The backend partner owns future NestJS implementation here. No NestJS runtime, database, or server is created by issue #1, so there is intentionally no backend package script yet.

Use port 3000 locally and implement the [shared OpenAPI contract](../../packages/api-contract/openapi.json). Read [the handoff](../../docs/api-contract.md) for cookie sessions, CSRF, user isolation, and account provisioning. Copy `.env.example` to an ignored local environment file when the server exists. These values are planned configuration names; the partner will wire them into NestJS.
