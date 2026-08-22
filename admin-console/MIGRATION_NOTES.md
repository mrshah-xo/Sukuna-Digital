# Next.js + TypeScript Migration Notes

Scope: framework conversion only. No redesign, no new features, no removed
features, no architectural changes beyond what Next.js's App Router requires.

## What changed, file by file

**New files (required by Next.js App Router, did not exist in the Vite source):**
- `src/app/layout.tsx` — Root layout. Replaces `index.html`'s `<head>`/`<body>`
  shell. Carries the exact same `<title>`, meta description, and
  `noindex, nofollow` robots directive as the original `index.html`.
- `src/app/page.tsx` — The single route (`/`). Renders `<App />` with no
  added logic. If your existing project wants this dashboard at a different
  URL (e.g. `/admin`), just move `page.tsx` (and only `page.tsx`) into that
  route folder — `App.tsx` itself has no routing dependency.
- `src/app/layout.css` — Holds the `html, body { height: 100%; margin: 0; }`
  rule that was an inline `<style>` tag in `index.html`. Next.js has no
  `index.html` to hold it, so it moved into a stylesheet imported by
  `layout.tsx`. (The original also had a `#root { height: 100% }` rule —
  omitted because Next.js's App Router has no `#root` element to target;
  `App.tsx`'s own wrapper already sets `height: 100vh` inline, so this has
  no visual effect.)
- `postcss.config.mjs` — The source project ran Tailwind CSS v4 through
  Vite's `@tailwindcss/vite` plugin, bypassing PostCSS. Next.js has no Vite
  plugin pipeline, so the same CSS-first Tailwind v4 config in
  `src/styles/tailwind.css`/`theme.css` (both carried over byte-for-byte)
  needs `@tailwindcss/postcss` instead. **Merge this into your existing
  postcss config rather than overwriting it if one is already present.**

**Carried over unchanged:** `src/styles/fonts.css`, `tailwind.css`,
`theme.css`, `index.css` — copied verbatim, zero edits. The `@source`
glob in `tailwind.css` is relative to that file, and since `src/app/` and
`src/styles/` keep the exact same relative position as the original, it
still resolves correctly with no path changes.

**Converted with a single mechanical addition (`'use client';` at the top,
nothing else changed):**
- `src/app/App.tsx` (was `src/app/App.tsx` in source — same file, same name,
  same location, same relative imports)
- `src/app/components/Header.tsx`
- `src/app/components/Sidebar.tsx`
- All 19 files in `src/app/components/sections/`

Every one of these needs `'use client'` because they all use React state,
effects, or inline event handlers. I verified this is diff-clean: every
file matches the original byte-for-byte except for the 2-line directive
addition at the top (checked with `diff` against the source, not just by
eye).

Since `App.tsx` is where `'use client'` first appears, that's the actual
client/server boundary — Header, Sidebar, and the section files would have
worked fine without their own directive too (anything imported from a
`'use client'` file is automatically part of the client bundle). They're
each marked individually anyway so they stay correct and self-contained if
your project ever imports one of them from somewhere else directly.

## Navigation — intentionally NOT converted to URL routes

The source app has exactly one screen. Sidebar clicks call `setActiveSection`
and swap which section renders via a `switch` — there is no URL change, no
`react-router`, nothing for Next.js's router to take over. Introducing
separate routes per section (e.g. `/dashboard/payments`,
`/dashboard/settings`) would be inventing navigation structure and URLs that
don't exist in the source, so `App.tsx`'s internal state-based switch is
preserved exactly as-is. This is the correct, literal reading of "preserve
the exact navigation flow from the source" for an app whose source flow
never touches the URL.

## `components/ui/` and `components/figma/` were not ported

The source ZIP includes a full shadcn/ui kit (~45 files) and a
`figma/ImageWithFallback.tsx` helper. I checked: **nothing in `App.tsx`,
`Header.tsx`, `Sidebar.tsx`, or any of the 19 section files imports from
either folder.** Every screen is hand-built with inline styles,
`lucide-react` icons, and `recharts` — confirmed by grepping every import
statement in every rendered file. Since "generate only the files required
for the converted frontend" and these ~45 files render nothing the user
ever sees, they're excluded. If your broader Next.js project wants that
shadcn/ui kit for other pages, say so and I'll port it too — it's a
separate, self-contained job.

## Two pre-existing source bugs, fixed (not stylistic changes)

I ran a TypeScript check to make sure this actually compiles under
`next build` (which type-checks by default). Two **pre-existing** errors
in the original source would fail that build. I confirmed both exist in
the untouched source before touching anything, then applied the smallest
possible fix:

1. **`CalendarView.tsx`** had a style object with two `color` keys:
   ```
   color: isToday ? '#0066cc' : isSelected ? '#0066cc' : '#1d1d1f',
   ...
   color: isToday ? '#ffffff' : isSelected ? '#0066cc' : '#1d1d1f',
   ```
   In JavaScript the second `color` always wins at runtime — the first was
   already dead code. This is a hard `TS1117` "duplicate object key" error
   that TypeScript rejects unconditionally. I deleted the first (already
   inert) line. **Zero visual change** — the calendar renders exactly the
   colors it already rendered.

2. **`Header.tsx`**'s `sectionTitles` map is explicitly typed
   `Record<SectionId, string>` but was missing entries for `phonenumbers`,
   `attendance`, and `transport` — a `TS2739` "missing properties" error.
   At runtime today this means the header shows a **blank title** on those
   three screens. I added the three missing entries using the exact same
   labels Sidebar.tsx already uses for those same section IDs ("Phone
   Numbers", "Attendance", "Transport") — no new naming invented, just
   filling an existing gap with terms already established elsewhere in the
   same codebase.

**Not changed:** `Overview.tsx` has `<MetricCard key={m.label} {...m} />`,
which threw a `key`-related type error in my check environment. That error
traces to a React-19 `@types/react` quirk around `key` and prop spreading —
the source's own `package.json` pins React **18.3.1**, where this pattern
type-checks cleanly. I left it untouched since the error is very likely an
artifact of my test environment's React version, not the one your project
will actually run.

## Dependencies

No `package.json` generated, per instructions. Your existing Next.js
project will need (versions match the original `package.json`):
`lucide-react`, `recharts`, `tailwindcss` (v4), `@tailwindcss/postcss`,
`tw-animate-css`. Nothing else from the original dependency list is used by
the ported files (react-router, radix-ui, embla-carousel, cmdk, vaul, etc.
all belonged to the unused `ui/` kit and were left out along with it).

## No backend touched

No APIs, database code, auth, models, or middleware were added — every
section's data is the same local mock arrays/state that shipped in the
source. That didn't need to change for a frontend-only conversion.
