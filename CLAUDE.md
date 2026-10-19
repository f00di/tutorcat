# Tutorcat

Directory of tutors and study-destination counselors for Gulf families. The page is Lovable's redesign (React 19 + TanStack Start + Tailwind v4), prerendered to static HTML and deployed to GitHub Pages at https://f00di.github.io/tutorcat/. Tutor/counselor profiles come from `data/tutors.json`.

## Working rules
- One Claude Code session at a time on this repo.
- One branch per topic; merge it before starting the next.
- No commit, push or deploy until the owner says so. Pushing `main` deploys (`.github/workflows/deploy-pages.yml`).
- Keep `docs/build-progress.md` current: update it at the end of every step.

## Stack and commands
- `npm install`, then `npm run dev` (http://localhost:3000/tutorcat/). `npm run build` prerenders `/` into `dist/client/` (vite `base` + router `basepath` = `/tutorcat/`; set `BASE_PATH=/` for a custom domain, and update `SITE_URL` in `src/config.ts`). Preview a build by serving `dist/client` under a `/tutorcat/` folder.
- Page: `src/routes/index.tsx`. Pieces: `src/components/` (header, card, profile view, forms, dialog shell, `ui/button.tsx` is the only shadcn component kept), `src/lib/` (`profiles.ts` data rules, `i18n.tsx`, `drafts.ts` team emails, `theme.ts`, `cat.ts`), `src/styles.css` (all tokens and layout), `src/config.ts` (`CONTACT_EMAIL`, `SITE_URL`).
- Keep the first download small: every page ships React + the router (~100 KB gzipped) plus the shared code, so check `dist/client` sizes when adding a library.
  - `ui/button.tsx` has no helper libraries (no class-variance-authority, tailwind-merge or Radix Slot). Classes are joined, not merged, so never pass a `className` that repeats a utility its variant or size sets (`px-*`, `h-*`, `text-sm`…); add a size instead (`size="inline"` = a link with no side padding).
  - Dialog contents (forms, shortlist, profile) come from `src/components/lazy-dialogs.tsx`: loaded separately and preloaded once the page is idle. Render them inside `DialogShell` (it waits for them).
  - Catalogue grids use `MemoSpecialistCard` with stable `onToggleSave(id)` / `onOpen(profile)` callbacks, so a finder change or an open dialog doesn't re-render every card.
- Tests: `npm test` = Node tests (`tests/*.test.mjs`: tutors.json privacy, importer/template with fixture rows, i18n parity and no hard-coded English in `src/`, regions labels, deploy workflow shape) + vitest (`src/test/`: catalogue renders from tutors.json, Arabic sets `dir="rtl"`, /privacy and the Markdown renderer; a file starting with `// @vitest-environment node` runs without jsdom). `npm run typecheck`. After a build, `npm run test:build` checks the prerendered HTML, `/tutorcat/` asset paths, meta tags and that nothing private is published.
- Deploy: `.github/workflows/deploy-pages.yml` runs `npm ci` → `npm test` → typecheck → `npm run build` → `npm run test:build`, then publishes only `dist/client`. Never publish `source/`, `scripts/`, `docs/` or `tests/`.

## Data
- Update profiles: edit `source/tutors.xlsx` (one row per person, `Status` gates publishing), run `npm run tutors:update` (import + change summary + Node tests), commit `data/tutors.json`; the deploy rebuilds the site with it. `npm run tutors:check` = is the site behind the workbook? `npm run tutors:template` = clean prefilled workbook. Details: `docs/excel-import.md`.
- Everything on the page is built from `data/tutors.json` + `data/regions.json`: cards, finder options, chips, destinations, counts. No invented tutors, stats, reviews or coverage claims; card locations come from `baseCountry`/`city`/`servesCountries` or the session modes. Photos only when `photoApproved`; only tutor-verified, admin-approved reviews with public permission count (`src/lib/profiles.ts`).
- Gulf coverage: `data/regions.json` is the one place for Gulf countries, cities and curricula (English + Arabic names, aliases, `permitBadge`). `countries` on a profile means study-abroad destinations, not where the tutor lives.

## Translations and right-to-left
- `src/lib/i18n.tsx` + `i18n/en.json` / `i18n/ar.json` (flat keys; plurals are objects keyed one/other, Arabic also zero/two/few/many). Add a string: add the key to both files, use `t("key", { count })` from `useI18n()`. Data values stay English in the data and show through `label(kind, value)`. Never translate what tutors or reviewers wrote; emails to the team stay English.
- `?lang=ar` and the remembered choice (`localStorage["tutorcat.lang"]`); the boot script in `src/lib/theme.ts` sets `lang`/`dir` and the theme before first paint. Header toggle: عربي / English.
- English is bundled; `i18n/ar.json` is a plain JSON file (`CATALOG_URLS` in `i18n.tsx`, fetched by `loadCatalog`). On an Arabic visit the boot script starts that download before the app's code, and `loadCatalog` reuses it. Vitest serves it from `src/test/setup.ts`.
- The boot script also holds back the `/tutors/` finder and results (`html.filters-pending`) when the link has filters, until the page applies them, so a shared search never shows everyone first.
- Logical CSS only (`inset-inline-end`, `padding-inline`, `text-align: start`). Mirror direction-aware things with `.dir-icon` (arrows) and `[dir="rtl"]` rules (hero photo, wash angle); the cat mirrors its perches in `cat.ts`. Arabic uses IBM Plex Sans Arabic via `--font-arabic`; never letter-space or uppercase Arabic. Terms: `docs/i18n-glossary.md`; `i18n/ar.json` still needs native-speaker review (`_meta.lowConfidence`). SEO notes: `docs/arabic-seo.md`.

## Design (Lovable)
- Fonts are self-hosted, no Google Fonts: `src/assets/fonts/` (the files Google serves; SIL OFL, `OFL.txt`), `@font-face` at the top of `src/styles.css`, Latin DM Sans + Manrope preloaded in `__root.tsx`. DM Sans and Manrope are variable (one file for 400–700); IBM Plex Sans Arabic only covers Arabic letters.
- Hero photo: `src/assets/tutorcat-session*` as AVIF 768/1280/1536 + JPEG 768/1536 in a `<picture>` (phones get 768; it's faded there). New sizes for free on a Mac: `sips -s format avif -s formatOptions 55 --resampleWidth <width> in.jpg --out out.avif`.
- DM Sans (body) + Manrope (headings); colour tokens in `src/styles.css` with a full `.dark` set (system default, header toggle remembered in `localStorage["tutorcat.theme"]`). Card tones sage/peach/lavender; the logo is an inline SVG (`src/components/logo.tsx`: the peeking cat on its ledge plus the wordmark outlined from Manrope ExtraBold) coloured by `--logo`, so it follows the theme; `public/favicon.png` is the cat on a green tile. 8px cards/dialogs, 5px inputs, pill chips; the cat and all transitions switch off for reduced motion.
- The cat (`src/lib/cat.ts`): peeks over the search card; as you scroll it ducks behind its edge (head first, then paws) and pops up over the top edge of the next section (paws first, then head); no running, hopping or scroll bob. Head and paws are positioned relative to `.finder-wrap`, so they scroll natively and sit still; script only runs to pick a perch and to move, one move at a time. Off for reduced motion. The classic pixel-cat frames (`src/assets/cat-run.png`: 5 frames of 63×36, stored at 4×, used as a CSS mask so it takes `--cat`; eyes are holes) are only used by the loading screen.
- Loading screen (`src/components/loading-buffer.tsx`): a skeleton of the page with the pixel cat running along the search card. Shows only while the page isn't ready: an Arabic visit before the Arabic text loads (`html.i18n-pending`), a language switch slower than 150 ms (`html.is-buffering`), and `?loading` to preview it (click to close). Never an artificial delay.
- Forms (request, tutor application, review) build an English draft (`src/lib/drafts.ts`). `CONTACT_EMAIL` in `src/config.ts` is the team inbox (tutorcatsupport@gmail.com), so drafts open addressed to it. If it is ever emptied, drafts fall back to having no recipient and are copied or opened in the visitor's email app. Never send to a placeholder.

## Privacy
- `/privacy` shows `src/content/legal/privacy.{en,ar}.md`, rendered by `src/lib/markdown.tsx` (no raw HTML). The English copy is sections 1–8 of `docs/legal/privacy-policy.md` with the email as `{CONTACT_EMAIL}`: edit the docs file, copy the changed sections across, update the Arabic. `tests/privacy.test.mjs` fails if they drift, if the internal "Before publishing" notes leak, or if the code starts storing, sending or loading anything the policy doesn't describe (new storage key, cookie, fetch, outside URL).
- `LEGAL_STATUS` in `src/config.ts`: a "draft" legal page shows a Draft note and highlighted [placeholders], is noindex and is left out of the sitemap (`scripts/public-pages.mjs` reads the object as text). Set "final" only after legal review; the tests then require no [placeholders].
- The footer shows `CONTACT_EMAIL` on every page and every form links to `/privacy`; `npm run test:build` checks both, and that no other email address ships.
- `source/*.xlsx` / `*.xls` are private and git-ignored. Never commit them or copy their private fields.
- `data/tutors.json` is public (and bundled into the site). Only approved public fields; no private phones, emails, addresses or notes.
