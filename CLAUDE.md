# Tutorcat

Directory of tutors and study-destination counselors for Gulf families. The page is Lovable's redesign (React 19 + TanStack Start + Tailwind v4), prerendered to static HTML and deployed to GitHub Pages at https://f00di.github.io/tutorcat/. Tutor/counselor profiles come from `data/tutors.json`.

## Stack and commands
- `npm install`, then `npm run dev` (http://localhost:3000/tutorcat/). `npm run build` prerenders `/` into `dist/client/` (vite `base` + router `basepath` = `/tutorcat/`; set `BASE_PATH=/` for a custom domain, and update `SITE_URL` in `src/config.ts`). Preview a build by serving `dist/client` under a `/tutorcat/` folder.
- Page: `src/routes/index.tsx`. Pieces: `src/components/` (header, card, profile view, forms, dialog shell, `ui/button.tsx` is the only shadcn component kept), `src/lib/` (`profiles.ts` data rules, `i18n.tsx`, `drafts.ts` team emails, `theme.ts`, `cat.ts`), `src/styles.css` (all tokens and layout), `src/config.ts` (`CONTACT_EMAIL`, `SITE_URL`).
- Tests: `npm test` = Node tests (`tests/*.test.mjs`: tutors.json privacy, importer/template with fixture rows, i18n parity and no hard-coded English in `src/`, regions labels, deploy workflow shape) + vitest (`src/test/`: catalogue renders from tutors.json, Arabic sets `dir="rtl"`). `npm run typecheck`. After a build, `npm run test:build` checks the prerendered HTML, `/tutorcat/` asset paths, meta tags and that nothing private is published.
- Deploy: `.github/workflows/deploy-pages.yml` runs `npm ci` → `npm test` → typecheck → `npm run build` → `npm run test:build`, then publishes only `dist/client`. Never publish `source/`, `scripts/`, `docs/` or `tests/`.

## Data
- Update profiles: edit `source/tutors.xlsx` (one row per person, `Status` gates publishing), run `npm run tutors:update` (import + change summary + Node tests), commit `data/tutors.json`; the deploy rebuilds the site with it. `npm run tutors:check` = is the site behind the workbook? `npm run tutors:template` = clean prefilled workbook. Details: `docs/excel-import.md`.
- Everything on the page is built from `data/tutors.json` + `data/regions.json`: cards, finder options, chips, destinations, counts. No invented tutors, stats, reviews or coverage claims; card locations come from `baseCountry`/`city`/`servesCountries` or the session modes. Photos only when `photoApproved`; only tutor-verified, admin-approved reviews with public permission count (`src/lib/profiles.ts`).
- Gulf coverage: `data/regions.json` is the one place for Gulf countries, cities and curricula (English + Arabic names, aliases, `permitBadge`). `countries` on a profile means study-abroad destinations, not where the tutor lives.

## Translations and right-to-left
- `src/lib/i18n.tsx` + `i18n/en.json` / `i18n/ar.json` (flat keys; plurals are objects keyed one/other, Arabic also zero/two/few/many). Add a string: add the key to both files, use `t("key", { count })` from `useI18n()`. Data values stay English in the data and show through `label(kind, value)`. Never translate what tutors or reviewers wrote; emails to the team stay English.
- `?lang=ar` and the remembered choice (`localStorage["tutorcat.lang"]`); the boot script in `src/lib/theme.ts` sets `lang`/`dir` and the theme before first paint. Header toggle: عربي / English.
- Logical CSS only (`inset-inline-end`, `padding-inline`, `text-align: start`). Mirror direction-aware things with `.dir-icon` (arrows) and `[dir="rtl"]` rules (hero photo, wash angle); the cat mirrors its perches in `cat.ts`. Arabic uses IBM Plex Sans Arabic via `--font-arabic`; never letter-space or uppercase Arabic. Terms: `docs/i18n-glossary.md`; `i18n/ar.json` still needs native-speaker review (`_meta.lowConfidence`). SEO notes: `docs/arabic-seo.md`.

## Design (Lovable)
- DM Sans (body) + Manrope (headings); colour tokens in `src/styles.css` with a full `.dark` set (system default, header toggle remembered in `localStorage["tutorcat.theme"]`). Card tones sage/peach/lavender; the logo is a one-colour PNG used as a CSS mask (`--logo`), so it follows the theme. 8px cards/dialogs, 5px inputs, pill chips; the cat and all transitions switch off for reduced motion.
- Forms (request, tutor application, review) build an English draft (`src/lib/drafts.ts`). `CONTACT_EMAIL` in `src/config.ts` is empty until a real inbox exists: until then the draft has no recipient and is copied or opened in the visitor's email app. Never send to a placeholder.

## Privacy
- `source/*.xlsx` / `*.xls` are private and git-ignored. Never commit them or copy their private fields.
- `data/tutors.json` is public (and bundled into the site). Only approved public fields; no private phones, emails, addresses or notes.
