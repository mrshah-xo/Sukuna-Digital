# SOS & Safety — Frontend Integration: Implementation Instructions

This document explains how to apply the completed SOS & Safety frontend integration
(built and verified in a Claude working environment) to your actual local
**Sukuna-Digital** repository.

Scope: **frontend only.** No API routes, Mongoose models, or backend infrastructure
are included or required by this package.

---

## Prerequisites

- Start from your `master` branch (or whichever branch currently matches
  `https://github.com/mrshah-xo/Sukuna-Digital.git` at the commit this work was
  based on — the repo's `SOS front-end design` commit, i.e. the state that already
  contains `SOS Frontend/` and `sukuna-platform/`).
- Working tree should be **clean** (no uncommitted changes) before you start, so the
  patch/copy applies predictably and any conflicts are obvious.
- Node.js + npm available (`packageManager: npm@11.6.2` per the repo's `package.json`).
- Run everything from your repository root (the folder containing `sukuna-platform/`).

## Backup (create a rollback point first)

Before touching anything, create a safety branch and/or commit:

```bash
git checkout -b sos-frontend-integration
git status                 # confirm working tree is clean
git add -A && git commit -m "checkpoint before SOS frontend integration" --allow-empty
```

This gives you a commit to `git reset --hard` back to if anything goes wrong, and
keeps the change isolated on its own branch rather than `master`.

## Extraction

Two transfer artifacts are provided — use **one** of them, not both:

### Option A — ZIP (primary, recommended)

Extract `sukuna-sos-frontend-integration.zip` **directly into your repository root**
(the same folder that contains `sukuna-platform/`, `SOS Frontend/`, `docs/`, etc.).
The archive already contains the `sukuna-platform/...` path prefix, so extracting it
there reproduces the exact paths in place — no manual file moving required.

```bash
cd /path/to/your/Sukuna-Digital        # repo root
unzip -o /path/to/sukuna-sos-frontend-integration.zip
```

`-o` overwrites the 4 existing files listed below with their updated versions; all
other files in the ZIP are new and will simply be created.

### Option B — Patch file

If you prefer a single reviewable diff instead of extracting a ZIP:

```bash
cd /path/to/your/Sukuna-Digital        # repo root
git apply --check SOS-FRONTEND.patch   # dry run first — should report nothing
git apply SOS-FRONTEND.patch
```

This has already been verified (see Verification section below) to apply cleanly
against a fresh clone of the repository. If `--check` reports conflicts, your local
`master` has diverged from the commit this work was based on — resolve those first,
or fall back to Option A and merge manually.

## File Replacement

**4 existing files will be modified** (extracted/patched in place, overwriting):

| File | What happens |
|---|---|
| `sukuna-platform/apps/web/app/dashboard/layout.tsx` | Replaced — adds the SOS session provider around the dashboard shell |
| `sukuna-platform/apps/web/app/globals.css` | Replaced — original content preserved, SOS design tokens appended |
| `sukuna-platform/apps/web/src/components/dashboard/DashboardLayout.tsx` | Replaced — adds SOS nav entries + the persistent indicator |
| `sukuna-platform/apps/web/src/components/dashboard/HomePage.tsx` | Replaced — adds one Quick Action tile |

See the **Diff Summary** below for the exact, line-level explanation of each.

**24 new files are added** — all under two new folders:
- `sukuna-platform/apps/web/app/dashboard/sos/` (7 route files)
- `sukuna-platform/apps/web/src/components/dashboard/sos/` (17 component files)

Nothing outside these paths is touched. No file is deleted or renamed.

## Dependencies

**No new npm packages are required.** Everything the SOS integration uses
(`lucide-react`'s `ShieldAlert` icon, `next/navigation`, `next/link`, React hooks) is
already a dependency of `apps/web`. Do **not** run `npm install <package>` for this —
just reinstall existing dependencies if your `node_modules` isn't already present:

```bash
cd sukuna-platform
npm install
```

## Verification

Run these from your repository's `sukuna-platform/` folder, using the scripts already
defined in the repo (`turbo` fans them out to `apps/web` automatically):

```bash
cd sukuna-platform

# TypeScript
npm run check-types

# ESLint
npm run lint

# Tests
npm run test

# Production build
npm run build
```

Equivalent direct commands, if you want to run them from `apps/web/` instead:

```bash
cd sukuna-platform/apps/web
npx tsc --noEmit
npx eslint --max-warnings 0
npx vitest run
npx next build
```

All four passed cleanly in the Claude working environment, both on the working copy
and on an independent fresh clone with the patch applied (see the chat response for
full results). Your `npm run build` needs your real `MONGODB_URI` / `NEXTAUTH_SECRET`
/ `NEXTAUTH_URL` in `.env.local` to complete — that's an existing repo requirement
unrelated to SOS (the auth API routes need it to prerender), not something this
integration adds.

## Manual Verification Checklist

After the automated checks pass, click through the app itself:

**SOS feature**
- [ ] `/dashboard/sos` loads — shows the SOS Home screen with the hold-to-activate button
- [ ] Holding the SOS button 2.5s triggers the 3-2-1 countdown, then goes active
- [ ] Countdown screen's "Cancel" button correctly aborts back to idle
- [ ] Active SOS screen shows status tiles, map placeholder, responder timeline
- [ ] "Cancel SOS" on the active screen opens the confirmation modal, and confirming returns to idle
- [ ] The persistent **active-SOS indicator** appears in `DashboardLayout` once SOS is active
- [ ] Navigating to another dashboard section (e.g. `/dashboard/library`) while SOS is active keeps the indicator visible
- [ ] Tapping the indicator returns you to `/dashboard/sos` with the session still active (not reset)
- [ ] The indicator disappears once SOS is cancelled or resolved, and never appears while already on `/dashboard/sos`
- [ ] `/dashboard/sos/history` loads, shows the empty state (no fabricated events)
- [ ] `/dashboard/sos/history/[eventId]` shows a graceful "couldn't be found" state for any id (expected — no backend yet)
- [ ] `/dashboard/sos/safety` — tapping "I'm Safe" shows the confirmation panel; "Done" returns to the explainer
- [ ] `/dashboard/sos/location` — toggling sharing on/off updates the status card and map
- [ ] `/dashboard/sos/location/privacy` loads and its back button returns to the location screen

**Layout / responsiveness**
- [ ] Desktop (≥1280px): sidebar shows "SOS & Safety" entry; SOS content is capped at a reasonable width, not stretched edge-to-edge
- [ ] Tablet (~834–1024px): SOS Active screen's map + responder timeline show side by side
- [ ] Mobile (≤430px): sub-nav tabs (SOS/History/Safety Check/Location) scroll horizontally without breaking layout; no horizontal page overflow anywhere

**Existing app — confirm nothing regressed**
- [ ] Existing dashboard navigation (Home, Sukuna Book, Calendar, Memory, Profile, Teachers, Settings, Library, Bus Track, Evaluation, Notes Mandir) all still load normally
- [ ] **Mobile bottom navigation is unchanged** — still exactly 5 slots, same items, same order as before this integration
- [ ] SOS is reachable on mobile only via the hamburger/overflow menu, not the bottom nav
- [ ] Login/auth flow unaffected
- [ ] No new console errors/warnings on any existing page

## Rollback

If anything goes wrong at any point:

```bash
git checkout master
git branch -D sos-frontend-integration
```

Since all work happened on the `sos-frontend-integration` branch and your `master`
was never touched, this fully and immediately reverts you to the pre-integration
state — no partial state to clean up.

If you applied changes directly on `master` instead of a branch (not recommended),
use the checkpoint commit created in the Backup step:

```bash
git reset --hard <checkpoint-commit-sha>
```

---

*Package generated from a Claude working environment. Frontend only — see the chat
response for the list of backend work intentionally left for a later stage.*
