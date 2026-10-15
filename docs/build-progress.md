# Build progress

Where the multi-page work stands, so a fresh session can continue. Branch: `new-pages` (uncommitted; nothing is committed, pushed or deployed until the owner says so).

## Ground rules
- The home page (`/`) must look and work exactly as before. Allowed additions only: header Join menu, footer links (+ contact email line), the "View full profile" link in the profile dialog, the privacy-policy link next to form consents.
- No new services, accounts, env vars or server code. Static prerendered files on GitHub Pages under `/tutorcat/` (and still with `BASE_PATH=/`).
- Files changed outside this work and kept as they are: `src/config.ts` (CONTACT_EMAIL), `CLAUDE.md`, `data/tutors.json` (never edit by hand), `docs/legal/privacy-policy.md`.

## Order (approved plan)
1. [x] Step 1: back to green, plus the first new pages.
2. [x] Landing pages: `/for-tutors`, `/for-counselors` (role-preset join form; counselor services + commission disclosure; no visa line), the header Join menu and footer links. Footer year fixed ("2026", not "2,026").
3. [ ] `/report` (Report a concern), with footer and profile-page links; emergency numbers stored unconfirmed and hidden.
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
- Founding "spots left" count: no founding flag in the data, so no count is shown.

## How to check
- `npm test`, `npm run typecheck`, `npm run build`, `npm run test:build`.
- Home-page safety net: build `main` with the current `data/` and `src/config.ts`, then pixel- and HTML-compare `<main>` at 390/768/1440 px × light/dark × English/Arabic. Expected: identical. These scripts live in the session scratchpad, not in the repo.
