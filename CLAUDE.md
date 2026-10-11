# TutorCat

Static site for tutoring and study-destination counseling. Tutor/counselor profiles come from `data/tutors.json`.

- Static HTML/CSS/JS, no build step. Preview: `python3 -m http.server 4173` then open http://127.0.0.1:4173/.
- Update profiles: put the Excel at `source/tutors.xlsx`, run `npm run import:tutors`, then `npm test`, commit `data/tutors.json`. Details: `docs/excel-import.md`.
- Tests: `npm test` (Node built-in runner, no dependencies): `data/tutors.json` privacy checks plus "every local file `index.html` links exists".
- Deploy: `.github/workflows/deploy-pages.yml` tests, then publishes only `index.html`, `styles.css`, `script.js`, `assets/`, `data/` to https://f00di.github.io/tutorcat/.
- No invented tutors, stats or testimonials. The catalog facts line, filter chips and country panels are all built from `data/tutors.json`.
- Design: TutorCat teal, Schibsted Grotesk + Figtree (Google Fonts), light and dark mode. Pills for controls, 16px cards, 10px inputs; motion uses custom ease-out curves and respects reduced motion.

## Privacy
- `source/*.xlsx` / `*.xls` are private and git-ignored. Never commit them or copy their private fields.
- `data/tutors.json` is public. Only approved public fields; no private phones, emails, addresses or notes.
