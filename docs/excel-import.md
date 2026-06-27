# TutorCat Excel Import

TutorCat is a static GitHub Pages site. The public website does not load the Excel workbook. The workbook is only used during development to generate clean public JSON.

## Update Tutor Profiles

1. Put the latest Excel file at `source/tutors.xlsx`.
2. Run `npm run import:tutors`.
3. Confirm `data/tutors.json` updated.
4. Commit and push the updated `data/tutors.json`.
5. GitHub Pages will display the updated tutor/counselor profiles.

## Privacy

`source/tutors.xlsx` is ignored by git and should not be committed. It may contain private tutor information.

`data/tutors.json` is public because GitHub Pages serves it. Only include fields that are safe to publish, such as names, public profile summaries, subjects, countries, session modes, languages, availability, approved image URLs, approved public contact methods, and approved public reviews.

Do not publish private phone numbers, private emails, addresses, payment details, internal notes, student records, or sensitive personal information. The importer excludes unknown columns with private-looking headers such as contact, phone, address, payment, private, and internal. Specific allowlisted columns such as `Verification Contact Email` and `Public Contact Value` can be imported, but remember that anything written to `data/tutors.json` is publicly downloadable from GitHub Pages.

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

For a static GitHub Pages site, new review submissions and tutor applications should be collected through email or an external form service. They should not appear on the public site until verified and approved.

## Replacing The Excel File

When tutor information changes, replace the local file at:

`source/tutors.xlsx`

Then run:

```bash
npm run import:tutors
```

The website reads `data/tutors.json`, not the Excel file. Replacing the Excel file alone will not update GitHub Pages until the JSON is regenerated, committed, and pushed.

For fully automatic updates later, use GitHub Actions, Power Automate, or a secure backend that converts private workbook data into sanitized public JSON.
