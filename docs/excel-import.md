# TutorCat Excel Import

Tutorcat is a static site (React, prerendered at build time) on GitHub Pages. The public website never loads the Excel workbook: the workbook is only used on your computer to generate clean public JSON, and the build bundles that JSON into the page.

## Update Tutor Profiles

1. Edit `source/tutors.xlsx` (one row per person; see "Workbook layout").
2. Run `npm run tutors:update`. It rebuilds `data/tutors.json`, prints exactly which profiles were added, removed or changed (and which fields), then runs the privacy tests.
3. Commit and push `data/tutors.json`. The `Deploy to GitHub Pages` workflow re-runs the tests, rebuilds the site with the new profiles and publishes it. To preview first: `npm run build`, then serve `dist/client` under a `/tutorcat/` folder (or `npm run dev`).

`npm run tutors:check` compares the workbook with the published JSON without writing anything. Use it to see whether the live site is behind your spreadsheet.

If nothing changed, the importer leaves `data/tutors.json` untouched, so there is nothing to commit.

## Workbook layout

Run `npm run tutors:template` to create `source/tutors-template.xlsx`: one row per tutor/counselor, prefilled from your current workbook, with dropdowns for Status, Profile Type and approvals, and a Guide sheet explaining every column. Check it, copy any private contacts across, then save it as `source/tutors.xlsx`. (`-- --blank` makes an empty one; `-- --force` overwrites an existing template.)

- **Status**: `Published` shows the profile. `Draft`, `Hidden`, `Pending`, `Paused` or `Inactive` keep the row in the workbook but off the site, so you never need to delete rows.
- Lists (subjects, curriculum, countries, languages) are comma separated.
- **Countries** means study-abroad destinations a counselor advises on. Where the tutor lives and teaches is separate: see "Gulf location" below.
- Columns with `private`, `internal`, `email`, `phone`, `contact`, `address` or `payment` in the header are never published.

The older compact layout (one person across several rows) still imports, but it relies on guessing where each person starts, so prefer one row per person.

## Gulf location

TutorCat covers the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman. Countries, cities and recognised curricula live in `data/regions.json`.

- **Base Country** (dropdown): the Gulf country they live and teach in.
- **City** (dropdown): a city in that country. A city not in the list is flagged; add it to `data/regions.json` and rerun.
- **Serves Countries**: online tutors only, the Gulf countries they teach online (comma separated). Left blank, an online tutor only shows for their base country. With no Base Country either, they only show when the family picks "Anywhere in the Gulf".
- **Location** (old free text) still works. When Base Country and City are empty, the importer maps it: "Dubai" becomes United Arab Emirates / Dubai, "Riyadh, KSA" becomes Saudi Arabia / Riyadh. Every mapping and every part it can't read is printed as a warning, so fill the new columns to confirm. A bare "SA" is never guessed as Saudi Arabia.

On the site, in-person tutors appear for their own country and city, and online tutors appear for every country they serve.

**Curriculum filter.** The importer reads the Curriculum (Board, tags) column and matches known boards to curricula: IGCSE, A/AS-level, Cambridge, Edexcel or AQA → British; AP or SAT → American; IB; CBSE or ICSE → Indian; French baccalaureate → French. Only curricula that tutors actually entered appear in the filter. National curricula are added per country in `data/regions.json` (`nationalCurricula`).

**Permits.**
- **Permit Country** (dropdown) and **Permit Verified** (Yes/No) are public. Set Yes only after your team has checked the permit. The "Permit verified" badge shows only for UAE permits for now (see `docs/gcc-rules-todo.md`).
- **Private Permit Number** is never published. Any header containing "private" is left out.

**Short Bio (Arabic).** This is optional: the tutor's own Arabic bio, shown when the site is in Arabic. Never machine-translate it.

Run `npm run tutors:template -- --force` to get a workbook with these columns and dropdowns. The country and city lists live on a hidden "Lists" sheet.

## Privacy

`source/tutors.xlsx` is ignored by git and should not be committed. It may contain private tutor information.

`data/tutors.json` is public: the build bundles it into the site's JavaScript and prerendered HTML. Only include fields that are safe to publish, such as names, public profile summaries, subjects, countries, session modes, languages, availability, approved image URLs, approved public contact methods, and approved public reviews.

Do not publish private phone numbers, private emails, addresses, payment details, internal notes, student records, or sensitive personal information. The importer excludes unknown columns with private-looking headers such as contact, phone, address, payment, private, and internal. Specific allowlisted columns such as `Verification Contact Email` and `Public Contact Value` can be imported, but remember that anything written to `data/tutors.json` is publicly visible on the site.

## Supported Columns

The importer recognizes public profile columns such as:

- `Name`
- `Profile Type`
- `Role`
- `Subjects`
- `Countries`
- `Counseling Topics`
- `Education / Experience`
- `Location`
- `Session Modes`
- `Languages`
- `Current Students`
- `Students`
- `Tutor`
- `Availability`
- `Experience(years)`
- `Rating`
- `Review Count`
- `Short Bio`
- `Parent Note`
- `Outcomes`
- `Tags`
- `Board`
- `Graduate`
- `Work/Study`
- `Major`
- `Counselling`
- `Image URL`, `Photo`, `Profile Picture`, `Profile Image`
- `Image Alt`
- `Photo Approved`
- `Email`
- `Verification Contact Email`
- `Public Contact Type`
- `Public Contact Value`
- `Public Contact Approved`
- `Application Status`

`Photo Approved` accepts values such as `yes`, `true`, or `approved`. If approval is missing, imported photos default to not approved unless the image is a local `assets/` URL.

## Compact Profile Blocks

The importer supports the compact workbook layout where one person can span several rows:

- The first row starts the profile and can include `Name`, `Tutor`, `Students`, `Counselling`, `Graduate`, `Work/Study`, `Major`, and `Experience(years)`.
- Following rows can add surname/name parts, extra `Subject` values, extra `Board` values, and additional private contact entries.
- Continuation rows are merged into the active profile instead of becoming separate tutor cards.

For example, a first row with `Hassan` and a following row with `Ansari` becomes one public profile named `Hassan Ansari`.

`Contact` is treated as private unless you use the explicit approved public-contact columns. Do not rely on the plain `Contact` column for public display.

## Reviews

Reviews can be managed manually in `data/tutors.json` with fields such as `reviewerType`, `rating`, `comment`, `date`, `sessionType`, `verifiedByTutor`, `approvedByAdmin`, `publicPermission`, and `status`.

If review columns are included in Excel, use:

- `Reviewer Type`
- `Review Rating`
- `Review Comment`
- `Review Date`
- `Review Session Type`
- `Verified By Tutor`
- `Approved By Admin`
- `Public Permission`
- `Review Status`

The importer only writes Excel reviews to public JSON when the review is tutor-verified, admin-approved, has public display permission, and has `Review Status` set to `approved`. Pending, rejected, unverified, or unapproved reviews are skipped from the imported public JSON.

The site's review, application and introduction forms prepare an English email draft for the team (`src/lib/drafts.ts`). Until `CONTACT_EMAIL` in `src/config.ts` is set to a real inbox, the draft has no recipient: visitors copy it or open it in their email app. Reviews only appear on the site after they are verified, approved and added to the workbook.

## Replacing The Excel File

When tutor information changes, replace the local file at `source/tutors.xlsx` and run `npm run tutors:update`.

The website is built from `data/tutors.json`, not the Excel file. Replacing the Excel file alone will not update the site until the JSON is regenerated, committed and pushed (which triggers a rebuild).

The workbook can't be built in GitHub Actions because it is private and the repository is public. Fully automatic updates need a private data store (see the recommendation in the project handoff: Supabase).
