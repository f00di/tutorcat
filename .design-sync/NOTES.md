# design-sync notes (Tutorcat → Claude Design project "Tutorcat Design System")

## How this repo is wired
- Tutorcat is a website, not a published library. The design-system surface is `src/design-system.ts` (components + `I18nProvider`, `useI18n`, `profiles`). The site doesn't import it.
- `cfg.buildCmd` = `npm run build && node .design-sync/prepare.mjs`. ALWAYS run it before the converter: `prepare.mjs` regenerates the gitignored input package `.design-sync/.cache/pkg/`:
  - `index.ts` re-exports `src/design-system.ts` (`cfg.entry` points here; esbuild bundles the TS source),
  - `types/` = `tsc -p .design-sync/tsconfig.types.json` declarations, with `@/` imports rewritten to relative paths so the converter can read props,
  - `tutorcat.css` = the compiled `dist/client/assets/styles-*.css`, prefixed with the Google Fonts `@import` from `src/routes/__root.tsx`, with `/tutorcat/assets/...` URLs (the cat sprite) inlined as data URIs.
- Config paths (`srcDir`, `tsconfig`, `componentSrcMap`, `cssEntry`) are relative to that pkg dir, hence `../../../src/...`.
- Groups come from `@category` in each component's JSDoc (Brand, Actions, Layout, Specialists, Forms); the JSDoc first sentence is the `.prompt.md` summary.
- Converter deps live only in `.ds-sync/` (esbuild, ts-morph, @types/react, playwright@1.64.0). Playwright 1.64.0 matches the Chromium already cached at `~/Library/Caches/ms-playwright/chromium-1248`; npm's allowScripts skipped esbuild's postinstall and it still works.

## Preview gotchas
- `LoadingBuffer` and `DialogShell` are `position: fixed`. Their previews wrap them in a frame with `transform: translateZ(0)` so the fixed element is contained by the card; otherwise the capture is blank. Both are `cardMode: single` with a viewport.
- `SiteHeader`'s "Skip to content" link sits above the header (`top: -60px`). The preview wrapper needs `position: relative; overflow: hidden` (overflow alone doesn't clip it). Viewport 1280 so the desktop layout (with "Join as a specialist") shows; below 900px the site hides that button.
- `Avatar` is white; preview it on `profile-cover sage|peach|lavender` or inside `dialog-panel`.
- Dark variants: wrap in `className="dark"` with `background: var(--background); color: var(--foreground)`.
- `PermitBadge` and `RatingSummary` previews use modified COPIES of profile data (a permit; three sample verified reviews) to show the filled states. No real tutor has a permit or reviews today. Never present those as real.
- `CatPeek`, `CatSprite`, `SiteHeader`, `SpecialistCard`, `ProfileView` and the forms are `cardMode: column` (wider than a grid cell).

## Known render warns
- `[FONT_REMOTE]` DM Sans / Manrope / IBM Plex Sans Arabic / Geeza Pro: expected. Fonts load from Google Fonts at runtime; Geeza Pro is a macOS system fallback in `--font-arabic`.
- `[RENDER_THIN]` Logo: only appears without the authored preview (SVG paths, no text).

## Re-sync risks
- Previews use `profiles[0..2]` by position: adding, removing or reordering tutors in the workbook changes previews (they re-grade) and the "Meet Hassan." heading in the RequestForm preview.
- `prepare.mjs` expects exactly one `dist/client/assets/styles-*.css` and fonts in a `fonts.googleapis.com/css2?...` href in `__root.tsx`; a Vite/Tailwind output change or a font change there breaks it loudly. Asset inlining only matches `/tutorcat/assets/` URLs: a different `BASE_PATH` would leave them unresolved.
- Types come from `tsc` declaration emit; the `@/` rewrite is a regex. A new path alias in `tsconfig.json` would need adding there.
- `.design-sync/conventions.md` names tokens and classes from `src/styles.css`. Re-validate them against `_ds_bundle.css` after style changes.
- The Arabic catalog is bundled into `_ds_bundle.js` through `I18nProvider`'s dynamic import, so Arabic works in designs. Renaming `i18n/*.json` breaks that silently.
