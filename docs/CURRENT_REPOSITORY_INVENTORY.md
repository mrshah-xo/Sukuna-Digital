# Current Repository Inventory

Audit date: 2026-08-25

## Top-Level Structure

- `.git/`: repository metadata.
- `.idea/`: JetBrains IDE metadata. Not application code; should not be tracked.
- `backend/`: Express/Passport/Mongoose scaffold. It has a health endpoint and middleware, but no mounted product API routes. Classified as experimental.
- `docs/`: current and historical audit documentation.
- `admin-console/`: Sukuna Digital Admin Console / Admin Panel project. No package manifest was found. Classified as prototype/experimental until wired into a supported build path.
- `sukuna-platform/`: main Sukuna Digital Platform, active Turborepo workspace, and production candidate.
- `final-audit-report.md`: historical report at root.
- `README.md`: current onboarding documentation.
- `git`, `master)`: zero-byte accidental files. Safe to delete.
- `package-lock.json`: root lockfile with no package entries and no root `package.json`. Safe to delete.

## Active Applications

- `sukuna-platform/apps/web`: active Next.js application.

## Production Candidate

`sukuna-platform/apps/web` is the only production candidate found. Evidence:

- Has `package.json` with Next.js scripts.
- Has App Router pages and API route handlers.
- Has active Mongoose models.
- Has Auth.js/NextAuth configuration.
- Has unit and integration tests.
- Is included in the Turborepo workspace.

## Duplicate Or Experimental Code

- `backend/`: duplicate backend direction. It uses Express, Passport, and JWT concepts, but it is not mounted by the active frontend and has no implemented API route tree.
- `admin-console/`: admin-console UI tree with no local package manifest or build/test scripts.
- Historical docs under `docs/phase-*` describe prior phases and must be verified before use.

## Generated Files And Directories

- Tracked `node_modules/` entries were found under `backend/` and `sukuna-platform/`.
- Local `.next/` exists under `sukuna-platform/apps/web`.
- These are reproducible generated artifacts and should be ignored/removed from Git tracking.

## Suspicious Files

- Root `README.md` previously contained only a warning string.
- Zero-byte root files named `git` and `master)` appear accidental.
- `.idea/` files are IDE metadata, not project source.

## Architecture Conflicts

- Active app uses Auth.js/NextAuth JWT sessions.
- Experimental `backend/` uses Passport/JWT and previously contained a fallback JWT secret.
- The two authentication systems are not production-compatible without explicit token/session design. Current production should use NextAuth only.

## Cleanup Recommendations

- Keep `sukuna-platform/apps/web` as production.
- Keep `backend/` only as `EXPERIMENTAL - NOT USED BY PRODUCTION` until real routes and auth are implemented.
- Remove tracked `node_modules`, `.next`, `.idea`, and accidental root files from Git.
- Keep generated folders ignored in root `.gitignore`.
- Do not remove `admin-console/` automatically because it is the Admin Console project.
