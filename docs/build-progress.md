# Build progress

Where the multi-page work stands, so a fresh session can continue. Steps 1 and 2 are merged into `main` (PRs #4 and #5). The rest is on branch `finish-pages-privacy-contact`, uncommitted: nothing is committed, pushed or deployed until the owner says so.

## Ground rules
- The home page (`/`) must look and work exactly as before. Allowed additions only: header Join menu, footer links (+ contact email line), the "View full profile" link in the profile dialog, the privacy-policy link next to form consents.
- No new services, accounts, env vars or server code. Static prerendered files on GitHub Pages under `/tutorcat/` (and still with `BASE_PATH=/`).
- Files changed outside this work and kept as they are: `src/config.ts` (CONTACT_EMAIL), `CLAUDE.md`, `data/tutors.json` (never edit by hand), `docs/legal/privacy-policy.md`.

## Order (approved plan)
1. [x] Step 1: back to green, plus the first new pages.
2. [x] Landing pages: `/for-tutors`, `/for-counselors` (role-preset join form; counselor services + commission disclosure; no visa line), the header Join menu and footer links. Footer year fixed ("2026", not "2,026").
3. [x] `/report` (Report a concern), with footer and profile-page links; emergency numbers stored unconfirmed and hidden.
4. [ ] Contact email everywhere (footer "Email us", tests).
5. [ ] `/privacy` from `docs/legal/privacy-policy.md` (English + Arabic, draft status), self-hosted fonts.
6. [ ] Check the two new profiles (Muhammad Taha, Vidula Veerakumar).
7. [ ] `docs/inbox-templates.md`.
8. [ ] `docs/roadmap/` specs A–G.
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
