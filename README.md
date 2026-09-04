# Sukuna Digital

<p align="center">
  <a href="https://github.com/user-attachments/assets/596fd2c7-7faa-4c19-8ebe-e5192fdcb713">
  </a>
</p>

Clone this repo at your own risk; it is still in development and not yet complete. When finished, it will release a .exe application. Sukuna Digital is a school-management workspace with separate platform and admin-console projects.

- `sukuna-platform`: the main Sukuna Digital Platform and active production candidate.
- `admin-console`: the Sukuna Digital Admin Console / Admin Panel project.
- `backend`: an experimental Express scaffold that is not wired into the production UI.

## Current Architecture

- Frontend: Next.js App Router, React, TypeScript, Tailwind/shadcn-style components.
- Backend: Next.js route handlers under `sukuna-platform/apps/web/app/api`.
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
cd sukuna-platform
npm install
```

Create `sukuna-platform/apps/web/.env.local`:

```bash
MONGODB_URI=mongodb://localhost:27017/sukuna
NEXTAUTH_SECRET=replace-with-a-strong-secret
AUTH_SECRET=replace-with-the-same-strong-secret
```

## Commands

From `sukuna-platform`:

```bash
npm run dev
npm run check-types
npm run lint
npm run test
npm run build
```

From `sukuna-platform/apps/web`:

```bash
npm run dev
npm run check-types
npm run lint
npm run test
npm run build
```

## Project Structure

- `sukuna-platform/apps/web/app`: Next.js pages, layouts, middleware, and API routes.
- `sukuna-platform/apps/web/src/components`: dashboard, admin, auth, shared UI components.
- `sukuna-platform/apps/web/src/lib`: database connection, Auth.js config, API guards, validation helpers.
- `sukuna-platform/apps/web/src/models`: active Mongoose models.
- `sukuna-platform/apps/web/src/services`: OTP and notification service layers.
- `sukuna-platform/apps/web/tests`: unit and integration tests for active API/security behavior.
- `sukuna-platform/packages`: shared Turborepo packages for UI, ESLint config, and TypeScript config.
- `backend`: experimental Express backend scaffold, not production.
- `admin-console`: Sukuna Digital Admin Console / Admin Panel.
- `docs`: repository audit, architecture, security, database, and test status.

## Documentation

Start with:

- `docs/ARCHITECTURE_DECISION.md`
- `docs/DEVELOPER_GUIDE.md`
- `docs/SECURITY_AUDIT_CURRENT.md`
- `docs/DATABASE_ARCHITECTURE.md`
- `docs/FINAL_REPOSITORY_AUDIT.md`
