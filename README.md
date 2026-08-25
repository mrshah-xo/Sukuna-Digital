# Sukuna Digital

Sukuna Digital is a school-management web platform for students, teachers, parents, drivers, staff, principals, and administrators. The active production candidate in this workspace is the Next.js application at `sukuna-fixed/apps/web`.

## Current Architecture

- Frontend: Next.js App Router, React, TypeScript, Tailwind/shadcn-style components.
- Backend: Next.js route handlers under `sukuna-fixed/apps/web/app/api`.
- Authentication: Auth.js/NextAuth credentials provider using phone OTP.
- Authorization: centralized role checks in `src/lib/api-handler.ts` and `src/lib/api-guard.ts`.
- Database: MongoDB through Mongoose models in `src/models`.
- Experimental code: the root `backend/` Express app is a foundation scaffold and is not wired into the production UI.

## Prerequisites

- Node.js 18 or newer
- npm 11.x
- MongoDB connection string

## Setup

```bash
cd sukuna-fixed
npm install
```

Create `sukuna-fixed/apps/web/.env.local`:

```bash
MONGODB_URI=mongodb://localhost:27017/sukuna
NEXTAUTH_SECRET=replace-with-a-strong-secret
AUTH_SECRET=replace-with-the-same-strong-secret
```

## Commands

From `sukuna-fixed`:

```bash
npm run dev
npm run check-types
npm run lint
npm run test
npm run build
```

From `sukuna-fixed/apps/web`:

```bash
npm run dev
npm run check-types
npm run lint
npm run test
npm run build
```

## Project Structure

- `sukuna-fixed/apps/web/app`: Next.js pages, layouts, middleware, and API routes.
- `sukuna-fixed/apps/web/src/components`: dashboard, admin, auth, shared UI components.
- `sukuna-fixed/apps/web/src/lib`: database connection, Auth.js config, API guards, validation helpers.
- `sukuna-fixed/apps/web/src/models`: active Mongoose models.
- `sukuna-fixed/apps/web/src/services`: OTP and notification service layers.
- `sukuna-fixed/apps/web/tests`: unit and integration tests for active API/security behavior.
- `sukuna-fixed/packages`: shared Turborepo packages for UI, ESLint config, and TypeScript config.
- `backend`: experimental Express backend scaffold, not production.
- `premium-education-platform-nextjs`: imported/static prototype UI, not production.
- `docs`: repository audit, architecture, security, database, and test status.

## Documentation

Start with:

- `docs/ARCHITECTURE_DECISION.md`
- `docs/DEVELOPER_GUIDE.md`
- `docs/SECURITY_AUDIT_CURRENT.md`
- `docs/DATABASE_ARCHITECTURE.md`
- `docs/FINAL_REPOSITORY_AUDIT.md`
