# Repository Cleanup Plan

Audit date: 2026-08-25

## Safe To Delete Or Untrack

- `backend/node_modules/`: generated dependency folder.
- `sukuna-platform/node_modules/`: generated dependency folder.
- `sukuna-platform/apps/web/node_modules/`: generated dependency folder.
- `sukuna-platform/apps/web/.next/`: generated Next.js build output.
- `.idea/`: local IDE metadata.
- `git`: zero-byte accidental root file.
- `master)`: zero-byte accidental root file.
- `package-lock.json`: root lockfile without a root package manifest.

## Requires Review

- `admin-console/`: Sukuna Digital Admin Console / Admin Panel. Do not delete automatically.
- `backend/`: experimental backend scaffold. Do not delete until the team decides whether Express will ever be a production boundary.
- `final-audit-report.md`: historical root documentation. Keep or archive manually after comparing with current docs.

## Completed Cleanup

- Added root `.gitignore` for dependencies, build output, environment files, IDE metadata, logs, temp files, and TypeScript build info.
- Removed build-time suppression from `sukuna-platform/apps/web/next.config.js`.

## Remaining Cleanup

- Remove generated files from Git tracking with scoped `git rm --cached`.
- Delete accidental root files after docs record why they are safe.
- Decide whether to archive `backend/` under a clearly named `experiments/` directory in a later commit. Keep `admin-console/` separate as the Admin Console project.
