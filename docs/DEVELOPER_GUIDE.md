# Developer Guide

## Where To Start

Use `sukuna-platform/apps/web` for active platform application work. Treat `admin-console/` as the Sukuna Digital Admin Console project and `backend/` as experimental/reference code unless a new architecture decision changes that.

## Request Flow

1. Pages/components call active API routes under `app/api`.
2. Route handlers use `apiHandler` when authentication, authorization, or validation is needed.
3. `apiHandler` calls Auth.js `auth()` and derives `user.id`, `user.role`, and `user.schoolId`.
4. Zod schemas validate body/query payloads.
5. Handlers call Mongoose models through `connectDB()`.
6. Responses use `{ success: true, data }` or `{ success: false, error: { code, message } }`.

## Authentication

Auth is configured in `src/lib/auth.ts`. The active credentials provider verifies phone OTPs through `otpService`, loads the active user, and stores `id`, `role`, `phone`, and `schoolId` in the JWT/session.

## Authorization

Use `apiHandler(..., { roles: [...], requireSchoolId: true })` for protected API routes. Use `requireRole`, `requireSchoolTenant`, and `assertSchoolOwnership` from `src/lib/api-guard.ts` for finer checks.

## School Isolation

Never trust `schoolId` from client input. Query tenant-owned records using `user.schoolId` from `apiHandler` context. Cross-school records should usually return 404 to avoid leaking existence.

## Validation

Use Zod schemas. Keep schemas strict for create/update operations to prevent mass assignment. Shared admin schemas live in `src/lib/admin-schemas.ts`.

## Adding Models

Add new schemas under `src/models`, export them from `src/models/index.ts`, include `schoolId` when the data belongs to a school, and define tenant-aware indexes.

## Tests

Unit and integration tests live under `sukuna-platform/apps/web/tests`. Use `callRoute` to invoke App Router handlers directly and `mockAuthFn` to simulate sessions.

## Coding Conventions

- Prefer centralized API guards over route-local auth logic.
- Keep secrets out of logs.
- Use TypeScript types instead of `any`.
- Keep database access school-scoped.
- Add tests for auth, RBAC, school isolation, IDOR, validation, and payment/upload security as those endpoints are implemented.
