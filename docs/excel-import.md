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

`data/tutors.json` is public because GitHub Pages serves it. Only include fields that are safe to publish, such as names, public profile summaries, subjects, countries, session modes, languages, availability, and approved image URLs.

Do not publish private phone numbers, private emails, addresses, payment details, internal notes, student records, or sensitive personal information. The importer excludes columns with private-looking headers such as contact, email, phone, address, payment, private, and internal.

## Replacing The Excel File

When tutor information changes, replace the local file at:

`source/tutors.xlsx`

Then run:

```bash
npm run import:tutors
```

The website reads `data/tutors.json`, not the Excel file. Replacing the Excel file alone will not update GitHub Pages until the JSON is regenerated, committed, and pushed.

For fully automatic updates later, use GitHub Actions, Power Automate, or a secure backend that converts private workbook data into sanitized public JSON.
