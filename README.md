# Todo workspace

Shared React starter and backend-approved API contract for [issue #1](https://github.com/k2htet/test-matt/issues/1). The user confirmed backend-partner approval and account provisioning on 2026-10-05; see [the contract handoff](docs/api-contract.md).

## Fresh-clone setup

Install Node.js 24 and enable Corepack (install Corepack separately if your Node distribution omits it). The pinned pnpm version is in `package.json`.

```sh
git clone git@github.com:k2htet/test-matt.git
cd test-matt
corepack enable
pnpm install --frozen-lockfile
cp apps/frontend/.env.example apps/frontend/.env.local
pnpm dev
```

Open http://localhost:5173. The starter needs no running backend. Vite proxies `/api` to http://localhost:3000 when features start making requests. Restart Vite after changing environment settings.

## Workspace and commands

| Location                                                  | Ownership and purpose                                                 |
| --------------------------------------------------------- | --------------------------------------------------------------------- |
| `apps/frontend`                                           | Frontend owner: React, TypeScript, Vite, plain CSS, and UI tests      |
| `apps/backend`                                            | Backend partner: documented NestJS placeholder; no server implemented |
| `packages/api-contract`                                   | Both owners: OpenAPI source and generated TypeScript types            |
| `.agents`, `AGENTS.md`, `docs/agents`, `skills-lock.json` | Existing agent skills and configuration, preserved                    |

| Root command                        | Purpose                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm dev`                          | Start frontend                                                                     |
| `pnpm build`                        | Typecheck and build frontend                                                       |
| `pnpm typecheck`                    | Check all packages with TypeScript                                                 |
| `pnpm test`                         | Run all current tests; new feature tests join these package scripts                |
| `pnpm lint`                         | Lint authored JavaScript/TypeScript                                                |
| `pnpm format` / `pnpm format:check` | Format / check authored files; existing skills and publication drafts are excluded |
| `pnpm contract:generate`            | Regenerate API types after editing OpenAPI                                         |
| `pnpm contract:check`               | Validate OpenAPI and fail if generated types are stale                             |
| `pnpm check`                        | All PR checks, including production build                                          |

Targeted tests: `pnpm --filter @test-matt/frontend test src/App.test.tsx` and `pnpm --filter @test-matt/api-contract test src/contract.test.ts`.

Use generated types with `import type { components, paths } from '@test-matt/api-contract'`. Never edit `src/schema.d.ts` by hand. [openapi-typescript](https://openapi-ts.dev/cli) generates it and [Redocly](https://redocly.com/docs/cli/commands/lint) validates the source.

## Working together

Each owner works on a feature branch, opens a PR to `main`, and reviews changes to their area. Both owners review changes to the contract before either depends on them. Keep PRs scoped to a ticket and reference its issue. PR CI installs the frozen lockfile, then runs `pnpm check`; feature tests should extend the existing Vitest suites.

Real API configuration uses `VITE_API_BASE_URL=/api`, credentialed fetch, and `API_PROXY_TARGET=http://localhost:3000`. A direct cross-origin base URL requires backend CORS with an exact allowed frontend origin and credentials enabled. Never place passwords in `VITE_*` variables: they are public browser configuration.

Mock mode is reserved by `VITE_API_MODE=mock` for the authentication feature ticket. This starter does not include MSW or call APIs; it visibly identifies itself as a starter. That feature must enable mocks only in development, display a mock indicator, and reset fixtures. Production must always use the real API, regardless of the mode variable.
