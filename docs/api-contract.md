# API contract handoff

Status: **backend partner approved; account provisioned**. The user confirmed backend-partner approval on 2026-10-05 for [issue #1](https://github.com/k2htet/test-matt/issues/1). The approved contract is `packages/api-contract/openapi.json`; future contract changes require both owners to review. The user also confirmed account provisioning and private credential sharing on 2026-10-05.

The OpenAPI file is the source of truth for request/response schemas and statuses. Login and `/auth/me` return a `User` directly; todo creation and update return a `Todo` directly; listing returns `Todo[]`. There are no data envelopes or pagination at this stage. IDs are opaque strings. Listing returns only the current user's todos in creation order (oldest first). Empty lists return `[]`.

Creation accepts only `title` and always sets `completed=false`. The backend trims title whitespace and rejects empty results with 400 `VALIDATION_ERROR`. PATCH accepts `title`, `completed`, or both, and must contain at least one property. Missing fields keep their existing values. Unknown fields are rejected. There is no title length cap in this contract. No user/owner field can be supplied by the client.

| Operation                | Success                                                        | Expected errors                                                  |
| ------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| POST `/api/auth/login`   | 200 User, sets session cookie                                  | 400 validation; 401 invalid credentials; 403 rejected origin     |
| GET `/api/auth/me`       | 200 User                                                       | 401 missing/expired session                                      |
| POST `/api/auth/logout`  | 204, expires cookie and invalidates server session; idempotent | 403 rejected origin                                              |
| GET `/api/todos`         | 200 Todo[]                                                     | 401 missing/expired session                                      |
| POST `/api/todos`        | 201 Todo                                                       | 400 validation; 401 session; 403 origin                          |
| PATCH `/api/todos/{id}`  | 200 Todo                                                       | 400 validation; 401 session; 403 origin; 404 missing/not owned   |
| DELETE `/api/todos/{id}` | 204, no body                                                   | 400 malformed ID; 401 session; 403 origin; 404 missing/not owned |

All operations may return 500 `INTERNAL_ERROR`. Errors use `{ "error": { "code": "VALIDATION_ERROR", "message": "Title is required." } }`. Messages are safe to display; clients use `code` for behavior. Other codes are `INVALID_CREDENTIALS`, `UNAUTHENTICATED`, `FORBIDDEN`, and `NOT_FOUND`. A missing session takes precedence over looking up a todo. A foreign todo returns the same 404 as a nonexistent one; never leak another user's data.

## Sessions and CSRF

Frontend requests use `credentials: 'include'` with JSON `Content-Type` on bodies. The backend sets a `session` cookie with `HttpOnly`, `Path=/`, `SameSite=Lax`, and `Secure` in production; HTTP localhost may omit Secure. Session duration is a backend setting (example: 86400 seconds). Rotate the session on login; logout invalidates it and expires the cookie with matching attributes. Never expose session secrets in JSON or browser storage. Responses containing user/session data must use `Cache-Control: no-store`.

For **every mutation**, including login and logout, the backend must reject absent, null, or untrusted `Origin` with 403 `FORBIDDEN` before making changes. Allow only exact configured frontend origins; validate JSON content type for bodies. Credentialed CORS uses exact origins, never `*`. SameSite cookies alone are not the CSRF check. The same-origin Vite proxy preserves the frontend Origin header, so allow http://localhost:5173 locally. This contract assumes frontend and API share a site in production; cross-site deployment requires revisiting cookie/CSRF policy together.

## Provisioned account

Exactly one initial email/password account is provisioned by the backend partner outside the UI. There is no signup or password-reset UI. `apps/backend/.env.example` supplies the local-only suggested email `owner@example.test` and a blank password field. The partner is responsible for choosing a noncommitted password, hashing it in storage, provisioning the account, and sharing it privately with the frontend owner. The example is not a real account or working credential.

Account provisioning and private credential sharing are confirmed by the user; no credentials are recorded here. Keep passwords out of commits, issue comments, and frontend environment variables. Although only one initial account is provisioned, backend ownership checks must isolate every user's todos.
