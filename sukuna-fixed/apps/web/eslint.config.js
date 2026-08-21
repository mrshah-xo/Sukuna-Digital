import { nextJsConfig } from "@repo/eslint-config/next-js";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    // TypeScript's `declare global { var x: ... }` ambient declaration
    // pattern requires `var` — `let`/`const` are not valid there, so
    // `no-var` is a false positive for this exact pattern. Scoped to just
    // this one file (the Mongoose connection cache) rather than disabled
    // project-wide.
    files: ["src/lib/mongodb.ts"],
    rules: {
      "no-var": "off",
    },
  },
  {
    // This is a TypeScript codebase — prop shapes are declared and checked
    // via TS interfaces/types (see e.g. Calendar's
    // React.ComponentProps<typeof DayPicker>, ImageWithFallback's
    // React.ImgHTMLAttributes<HTMLImageElement>), which supersedes the
    // legacy runtime PropTypes mechanism this rule checks for. Disabling
    // repo-wide rather than annotating every already-typed component.
    files: ["**/*.{ts,tsx}"],
    rules: {
      "react/prop-types": "off",
    },
  },
  {
    // Standalone Node.js dev/debug scripts (run via `node script.mjs`),
    // not part of the Next.js app bundle. They legitimately use Node
    // globals like `process`, which the app's browser/serviceworker
    // global set doesn't include.
    files: ["*.mjs"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // ImageWithFallback is a generic, source-agnostic wrapper: callers
    // across the app (SukunaBook, TeachersView, ChatView, ProfileView,
    // MemoryWall — 15+ call sites) pass arbitrary `src` values sized
    // purely via CSS classes (size-9, size-10, size-12, ...), never
    // width/height. Its entire purpose is graceful onError fallback for
    // images whose source may be unpredictable at runtime. Swapping to
    // next/image would require every call site to supply explicit
    // dimensions (or a fill+relatively-positioned wrapper) and every
    // possible image domain to be allowlisted in next.config.js up
    // front — both contrary to this component's reason for existing.
    // Scoped to this one file.
    files: ["src/components/dashboard/figma/ImageWithFallback.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    // Test helper that invokes route handlers and returns the parsed
    // JSON response body for assertions. Response shapes vary per route
    // (students/teachers/dashboard each have different `data` shapes,
    // plus a shared but structurally different `error` shape), and
    // tests need to freely dot-chain into whatever the API actually
    // returned (body.data.students, body.error.code, ...). This is the
    // same deliberate choice testing libraries like supertest make for
    // response.body — strict typing here would mean casting at nearly
    // every assertion for no real safety benefit, since this is
    // test-only code that never ships.
    files: ["tests/setup/request.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
