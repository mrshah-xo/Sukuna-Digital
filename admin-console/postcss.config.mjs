/**
 * PostCSS configuration for Next.js.
 *
 * The original Vite project processed Tailwind CSS v4 via the `@tailwindcss/vite`
 * plugin, bypassing PostCSS entirely. Next.js has no Vite plugin pipeline, so the
 * same CSS-first Tailwind v4 config (see src/styles/tailwind.css and theme.css,
 * both carried over unchanged) needs to be run through `@tailwindcss/postcss`
 * instead. No class names, tokens, or theme values are changed by this file —
 * it only wires up the same Tailwind v4 engine through a different entry point.
 *
 * If the destination project already has its own postcss.config with
 * `@tailwindcss/postcss` configured, merge this in rather than overwriting it.
 *
 * Requires: "@tailwindcss/postcss" and "tailwindcss" (v4) as devDependencies,
 * and "tw-animate-css" as a dependency (imported directly by tailwind.css).
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
