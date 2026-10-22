# Build progress

Where the work stands, so a fresh session can continue. Steps 1–3 below are merged into `main` (PRs #4, #5, #6). The performance pass is committed locally on `perf-pass` (not pushed). Nothing is committed, pushed or deployed until the owner says so (see "Working rules" in CLAUDE.md).

## Ground rules
- The home page (`/`) must look and work exactly as before. Allowed additions only: header Join menu, footer links (+ contact email line), the "View full profile" link in the profile dialog, the privacy-policy link next to form consents, and (launch brief) the empty state, the "Match me" action and the language links.
- No new services, accounts, env vars or server code. Static prerendered files on GitHub Pages under `/tutorcat/` (and still with `BASE_PATH=/`).
- Files changed outside this work and kept as they are: `src/config.ts` (CONTACT_EMAIL, SITE_URL; the launch plan only adds `LEGAL_STATUS` and `PAID_PLANS_ENABLED`), `data/tutors.json` (never edit by hand), `docs/legal/privacy-policy.md` (only the changes the owner approved).

## Launch brief (approved plan, 2026-10-19)
Launch = the founding period: free listings, no payments, forms as email drafts to CONTACT_EMAIL, free hosting on GitHub Pages. One branch per topic; stop after each step; commit and merge into local `main` only when the owner says; go-live = push `main`.
- [x] **Step 0, working rules:** perf work committed on `perf-pass`; 5 merged local branches deleted; "Working rules" in CLAUDE.md; `perf-pass` merged into `main` by the owner (PR #7, deployed).
- [ ] **Step 1** (`finish-pages-privacy-contact`): steps 4–10 of the list below (QA moves to step 6 of this brief). Profiles to check: Muhammad Taha, Vidula Veerakumar, Syed Feras Jamshed. **1a–1b done, uncommitted** (see "Done in launch Step 1a–1b"); next: 1c–1f.
- [ ] **Then the Tutor planner (beta)** on its own branch `planner` (approved plan: `/planner/`, own week grid, strings in `i18n/planner.{en,ar}.json`, IndexedDB only), P1–P5; then launch Steps 2–9.
- [ ] **Step 2** (`matching`): honest coverage from the data (every coverage sentence listed for approval), "Online" label for online-only matches, the Match request form, and the new empty state ("Tell us what you need…", pre-filled).
- [ ] **Step 3** (`matching`): "Match me" as the main action on `/` and `/tutors/`; two placements shown with screenshots, owner chooses. No response-time promise.
- [ ] **Step 4** (`arabic-guides`): every public page prerendered at `/ar/…` (hreflang, canonicals, sitemap with both languages); `?lang=ar` and remembered Arabic go to the `/ar/` page; guides: studying abroad (overview), the UK, the US (outlines approved first).
- [ ] **Step 5** (`legal-gate`): `PAID_PLANS_ENABLED = false` ("Coming soon", no payment action, test); legal pages draft + noindex until marked final.
- [ ] **Step 6** (`launch-qa`): internal-link check in `test:build`, `BASE_PATH=/` in CI, `npm run qa` (Playwright + axe: screenshots, console errors, keyboard), Lighthouse mobile, audits.
- [ ] **Steps 7–8** (`launch-docs`): `docs/domain-switch.md`, `docs/launch-checklist.md` (three columns), `docs/roadmap/later.md`.
- [ ] **Step 9:** all checks, home-page safety net, screenshots, scores, proposed commits, go-live step.

## Order (approved plan)
1. [x] Step 1: back to green, plus the first new pages.
2. [x] Landing pages: `/for-tutors`, `/for-counselors` (role-preset join form; counselor services + commission disclosure; no visa line), the header Join menu and footer links. Footer year fixed ("2026", not "2,026").
3. [x] `/report` (Report a concern), with footer and profile-page links; emergency numbers stored unconfirmed and hidden.
4. [x] Contact email everywhere (footer "Email us", tests).
5. [x] `/privacy` from `docs/legal/privacy-policy.md` (English + Arabic, draft status). Self-hosted fonts: done in the performance pass below.
6. [ ] Check the new profiles (Muhammad Taha, Vidula Veerakumar, Syed Feras Jamshed).
7. [ ] `docs/inbox-templates.md`.
8. [ ] `docs/roadmap/` specs A–H (H = plans and billing).
9. [ ] QA (all checks, `BASE_PATH=/`, before/after screenshots), CLAUDE.md update.
10. [ ] Application intake tool (`npm run tutors:add`).
11. [ ] Proposed commits by topic; wait for the go-ahead.

## Done in Step 1
- Pages, all prerendered with their own title, description, Open Graph tags and canonical:
  - `/tutors/`: the home finder, chips and cards, with filters in the URL.
  - `/tutors/<id>/`: one per profile.
  - `/counseling/`, `/how-it-works/` (with "How reviews work").
  - `/community-guidelines/` (draft), plus `/terms/` and `/review-policy/` (placeholders).
  - `404.html` and `sitemap.xml`.
- The home page's pieces are shared components with the same markup:
  - `Finder`, `CatalogueResults`, `CounselingSection`, `StepsSection`, `SiteFooter`;
  - the dialog contents in `site-dialogs.tsx`.
- Every other page uses `PageShell`: header, footer and the same dialogs.
- One page list, `scripts/public-pages.mjs`, is used by the prerender, the sitemap and `npm run test:build`.
- Internal links go through `SiteLink`. It keeps `?lang=ar` and falls back to a plain link outside the router (tests, design previews).
- The cat is also on the new pages (`CatCard`); later sections marked `cat-perch` are its perches.
- The shortlist is shared between pages during a visit, still in memory only, as before.

## Done in launch Step 1a–1b (2026-10-19, uncommitted)
- **Contact email:** footer line "Email us: tutorcatsupport@gmail.com" on every page (from `CONTACT_EMAIL`, left-to-right inside Arabic), hidden if the email is ever unset.
- **/privacy:** sections 1–8 of the policy in English and Arabic (`src/content/legal/`), contents list with `#section-1…8` anchors, Draft note, highlighted [placeholders], noindex, not in the sitemap (`LEGAL_STATUS.privacy = "draft"`). Footer link; "How we use your details: Privacy policy" under every form (request, join, review, report).
- **Policy edits** (`docs/legal/privacy-policy.md`): Google Fonts removed (fonts are self-hosted). **For the owner's approval** (listed in its internal checklist): a "Report a concern" row in section 2, the reporting line in section 8, and whether to mention the scroll position the browser keeps for the Back button.
- **Tests:** `tests/privacy.test.mjs` (English copy = docs sections 1–8; Arabic has the same sections, placeholders and email slots; internal notes never in `src/`; only CONTACT_EMAIL; storage only theme/lang, no cookies; fetch only the Arabic text; known URLs only), `src/test/privacy.test.tsx` (page and renderer), `src/test/legal-status.test.ts`, and `test:build` (email on every page, no other email shipped, drafts noindex + not in the sitemap, internal notes never shipped, nothing loaded from other sites).
- **Not yet decided by the owner:** the Arabic policy needs a native-speaker and a legal review.

## Tutorcat Desk on the site (branch `tutorcat-desk`, 2026-10-19, uncommitted)
Tutorcat Desk is the separate planner app for tutors. It's invite-only: people apply through the join form, and approved ones get the Desk link by email. Its address never goes on this site, in its build or in this repo. Plan steps: 1 Desk section, 2 join-form checkbox, 3 inbox template, 4 tests, 5 docs.
- [x] **Step 1, Desk section** (`src/components/desk-section.tsx`):
  - It replaces the "Tools on the way" section on `/for-tutors` and `/for-counselors`, in the same place.
  - Contents: 5 feature cards, "Free for tutors/counselors listed on Tutorcat", "Your data stays on your device", an invite-only line, and the button "Apply to get Tutorcat Desk" → `#apply` (the join form, already preset to the role).
  - 4 screenshots per language, each tagged "Sample data": Today, Schedule, a lesson's notes, an invoice.
  - The example invoice (`sample-invoice.tsx`, its CSS and the `invoice.*` / `join.tools.*` strings) is gone. The real Desk invoice screenshot replaces it, and the "Sample data" tag reuses `.sample-badge`.
- **Screenshots** (`src/assets/desk/<screen>-<en|ar>-<640|1280>.avif` + `-1280.jpg`):
  - Taken from the Desk's `main` build with "Try it with sample data" (Sara A., Omar K., tutor name "Sample Tutor"), in Dubai time and light theme.
  - Today, Schedule and Notes are 1280×800; the invoice is 1680×1050, because narrower windows squeeze the Desk's invoice line inputs.
  - AVIF is 8–13 KB at 640 px and 25–42 KB at 1280 px. All are lazy, so the first load fetches none of them (checked).
  - Retake them when the Desk's look changes.
- Checked: npm test, typecheck, build, test:build.
  - Home `<main>` matches `main`, HTML and pixels, at 390/768/1440 × light/dark × EN/AR.
  - Both pages at 390/1440 × light/dark × EN/AR: no console errors, no horizontal overflow.
- [ ] Steps 2–5.

## Performance pass (2026-10-19, merged in PR #7, outside the numbered steps)
- Fonts self-hosted (Google Fonts removed); hero photo as responsive AVIF with JPEG fallback (phones: 24 KB instead of 164 KB).
- Arabic text is a plain JSON file the boot script starts downloading on Arabic visits, instead of after the app has started.
- Dialog contents load separately and are preloaded when idle; Button lost class-variance-authority, tailwind-merge and Radix Slot (removed from package.json). First-load JavaScript: 12–14 KB less (gzipped) on every page except `/report/` (8 KB).
- Cheaper re-renders: memoised catalogue cards and filtering, cached Intl formatters and region lookups.
- `/tutors/` links with filters no longer flash the full list first (`html.filters-pending`).
- Checked: npm test, typecheck, build, test:build; screenshots before/after (home, /tutors/, a profile, /for-tutors/ × 390/1440 px × light/dark × English/Arabic): English identical except AVIF compression in the desktop hero; Arabic identical except a sub-pixel difference in the finder dropdown text in fast-forwarded screenshots (real-time captures of the dropdown look the same); no console errors on 7 pages × 2 languages.

## Done in step 3 (Report a concern)
- `/report/` (`src/routes/report.tsx`, form in `src/components/report-form.tsx`). Linked from the footer on every page, from each profile page (`/report/?profile=<id>`, that person already chosen) and from the community guidelines.
- Form: who it's about (optional: a listed profile, "someone not listed" with an optional details field, or none), category (the 8 from the brief), date and how it happened (both optional), what happened (required), the reporter's name and contact (optional), a confirmation checkbox.
- On submit: an English email draft (`reportDraft` in `src/lib/drafts.ts`) addressed to CONTACT_EMAIL, with a reference such as `TCR-261015-7KQ4` in the subject. Child-safety reports start with `URGENT:`. The page shows the reference and reminds the visitor to attach screenshots in their email app (no uploads).
- Honesty note on the form: leaving name and contact blank means we can't follow up, but the email app still shows us the sender's address.
- Urgent notice at the top: contact emergency services first; the inbox isn't watched around the clock. Emergency numbers live in `data/regions.json` with their sources and `"confirmed": false`, so none is shown (checklist in `docs/gcc-rules-todo.md`).
- Nothing is stored: the form keeps its answers in memory only, and the draft is sent (or not) by the visitor.
- Tests: `src/test/report.test.tsx` (draft, URGENT rule, reference, form validation, only confirmed numbers shown), `tests/regions.test.mjs` (every number has a source, both languages and a confirmed flag), `npm run test:build` (footer and profile links, no unconfirmed number on the page).

## Decisions
- **Cat:** shown on the new pages too.
- **Emergency numbers:** stored with `confirmed: false`, none shown until confirmed.
- **Visa guidance:** left out until the wording is approved.
- **Counselor join fields** (services, commission disclosure): only on `/for-counselors`.
- **Report retention** (for the backend spec): closed reports 24 months, screenshots 90 days, child-safety reports never auto-deleted.
- **`/privacy`:** live now as a marked draft (noindex, out of the sitemap until "final"). English prevails over Arabic.
- **Fonts:** self-hosted, removing Google Fonts.
- **Unknown URLs:** GitHub Pages serves `404.html`, the catch-all route `src/routes/$.tsx` prerendered as `/404/`. Its saved route data only fits `/404/`, so a tiny inline script points the address at `/404/` while the page hydrates, and `NotFoundContent` restores the visitor's URL. Without it, React reports a hydration error on every unknown URL.
- **Trailing slashes:** links end in `/` (router `trailingSlash: "always"`) so they match `<path>/index.html` and GitHub Pages never redirects.
- **Tailwind:** it scans `src/` text, so words like "contents", "filter" or "static" in code comments create unused utility classes. Avoid them when they're cheap to reword; they don't change any existing style.

## Open questions and to-dos
- **Needs a real photo:** the landing-page heroes have an image slot (`HERO_PHOTO` in `src/components/join-page.tsx`). Until there is a real photo, with the consent of anyone shown, the hero shows a real profile card. Never use an AI-generated photo.
- **Landing-page wording to approve:** hero lines, founding offer, the $1/$3 pricing note, the tutor and counselor FAQs. The copy lives in `i18n/*.json` under `join.*`, `invoice.*` and `page.forTutors.*` / `page.forCounselors.*`.
- `/community-guidelines/` wording needs the owner's approval.
- **Report page wording to approve:** the urgent notice, the anonymity note, the consent line and "What happens next" (keys `report.*`). Two of the lines are promises: "The team reads every report" and "We may hide a profile while we look into a concern". Keep them only if they're true for you.
- **Emergency numbers:** check each against its source and set `"confirmed": true` in `data/regions.json` (see `docs/gcc-rules-todo.md`).
- Founding "spots left" count: no founding flag in the data, so no count is shown.

## How to check
- `npm test`, `npm run typecheck`, `npm run build`, `npm run test:build`.
- Home-page safety net: build `main` with the current `data/` and `src/config.ts`, then pixel- and HTML-compare `<main>` at 390/768/1440 px × light/dark × English/Arabic. Expected: identical. These scripts live in the session scratchpad, not in the repo.
