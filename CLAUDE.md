# TutorCat

Static site for tutoring and study-destination counseling. Tutor/counselor profiles come from `data/tutors.json`.

- Static HTML/CSS/JS, no build step. Preview: `python3 -m http.server 4173` then open http://127.0.0.1:4173/.
- Update profiles: put the Excel at `source/tutors.xlsx`, run `npm run import:tutors`, commit `data/tutors.json`. Details: `docs/excel-import.md`.

## Privacy
- `source/*.xlsx` / `*.xls` are private and git-ignored. Never commit them or copy their private fields.
- `data/tutors.json` is public. Only approved public fields; no private phones, emails, addresses or notes.
