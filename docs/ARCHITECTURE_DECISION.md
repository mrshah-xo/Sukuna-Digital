# Architecture Decision

Audit date: 2026-08-25

## Decision

The current production architecture is the Next.js application in `sukuna-fixed/apps/web`.

## Frontend

- Framework: Next.js App Router.
- Language: TypeScript and React.
- UI system: Tailwind CSS plus local shadcn/Radix-style components in `src/components/admin/ui`.
- Active surfaces: login/OTP flow, student dashboard, admin dashboard, profile, teachers, bus tracking, Sukuna Book, notes, memory, library, evaluation, calendar, and settings.

## Backend

- Active backend: Next.js route handlers in `sukuna-fixed/apps/web/app/api`.
- API wrapper: `src/lib/api-handler.ts`.
- Authorization primitives: `src/lib/api-guard.ts`.
- Experimental backend: root `backend/` Express app. It is not production because no product routes are mounted and the active frontend does not call it.

## Database

- Database: MongoDB.
- ODM: Mongoose.
- Connection: `sukuna-fixed/apps/web/src/lib/mongodb.ts`.
- Active models: `sukuna-fixed/apps/web/src/models`.

## Authentication

- Active flow: Auth.js/NextAuth credentials provider.
- Login factor: phone plus OTP.
- OTP storage: hashed OTP records in MongoDB.
- Session strategy: JWT session managed by NextAuth.
- Required secrets: `NEXTAUTH_SECRET` or `AUTH_SECRET`; missing secrets fail closed in middleware.

## Authorization

- API route role checks are centralized through `apiHandler`.
- Page route checks are enforced in `middleware.ts` with a route/role matrix.
- School/tenant identity is derived from the authenticated session, not request bodies.

## Request Flow

User -> Next.js page/component -> Auth.js session -> middleware/API guard -> route handler -> Zod validation -> service/model logic -> MongoDB -> standardized JSON response.

## Experimental - Not Used By Production

- `backend/`: Express/Passport scaffold.
- `premium-education-platform-nextjs/`: prototype/imported UI tree.

