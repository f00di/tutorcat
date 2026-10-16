# Gulf rules to check before relying on them

TutorCat lists tutors in the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman (`data/regions.json`). The "Permit verified" badge only appears for **UAE** permits (the MoHRE Private Teacher Work Permit) until the rules below are confirmed for each country. Turn the badge on for another country by setting `"permitBadge": true` and `"permitName"` for that country in `data/regions.json`.

Everything below is a question for you, a local adviser or a lawyer to answer. None of it is legal advice. Law names are starting points to verify, not conclusions.

## For every country
- [ ] Is private or freelance tutoring legal, and who needs a permit or licence (residents, visitors, online-only tutors teaching into the country)?
- [ ] Which authority issues it, what is it called (English and Arabic), and can a family or TutorCat verify it publicly (registry, QR code, number lookup)?
- [ ] Can a tutor advertise in-person lessons at a family's home, a centre, or only online?
- [ ] Data protection: what consent is needed to publish a tutor's name, photo and reviews, and to collect a parent's or student's details through the contact forms? Are there extra rules for minors?
- [ ] Advertising: does a paid "Boosted" listing need an "ad" or "sponsored" label in that country?
- [ ] Language: must consumer-facing information also be available in Arabic?
- [ ] Reviews and ratings: any defamation or cybercrime risk in publishing negative reviews?

## Per country
| Country | Permit or licence to confirm | Data-protection law to confirm |
|---|---|---|
| United Arab Emirates | MoHRE Private Teacher Work Permit: who qualifies, how to verify a permit, whether online-only tutors need one. Any extra rules in free zones or for Abu Dhabi and Dubai education regulators. | Federal Decree-Law 45/2021 (PDPL) |
| Saudi Arabia | Is there a private-tutoring licence or freelance permit (e.g. via the Ministry of Education or the freelance work programme)? | Personal Data Protection Law (2021, amended 2023) |
| Qatar | Is a licence from the Ministry of Education and Higher Education needed for private lessons? | Law No. 13 of 2016 |
| Kuwait | Is private tutoring permitted for non-teachers or residents on other visas? | CITRA data privacy regulation |
| Bahrain | Licensing for private tutors or training providers? | Law No. 30 of 2018 (PDPL) |
| Oman | Licensing for private tutors? | Royal Decree 6/2022 (PDPL) |

## Also decide
- [ ] National curricula names for each country (English and Arabic). Add them to `nationalCurricula` in `data/regions.json`; the filter picks them up with no code change.
- [ ] Whether the contact form should ask which Gulf country the family lives in (useful for matching in-person tutors).

## Counselors (/for-counselors)
- [ ] **Visa and immigration advice.** In some study destinations (for example the UK, Canada and Australia) only licensed advisers may give immigration advice. "Visa guidance" is left out of the counselor services and the /for-counselors page until the wording is approved. Decide whether to list it at all, and with what disclaimer.
- [ ] **Counselor licences or permits in the Gulf.** Unknown for all six countries. The site makes no claim about counselor permits until this is confirmed.
- [ ] **Commission disclosure.** Counselors who apply on /for-counselors must say whether universities or agents pay them commissions or referral fees. Counselors who apply through the home page's Join dialog aren't asked, so ask them by email before listing. Decide whether profiles should show it.

## Emergency numbers (/report/)
The Report a concern page tells visitors to contact emergency services first. The numbers are stored in `data/regions.json` (`emergencyNumbers` on each country), each with the official page it came from, and all start as `"confirmed": false`. **The page shows no number until you check its source and set `"confirmed": true`.** Once a number is confirmed it appears in the urgent notice at the top of /report/, under its country (`npm run test:build` checks that no unconfirmed number is shown).

| Country | Stored (unconfirmed) | Notes |
|---|---|---|
| United Arab Emirates | 999 police, 998 ambulance, 116111 child protection | u.ae (handling emergencies; children's safety). |
| Saudi Arabia | 911 unified number (Riyadh, Makkah, Madinah, Eastern Province), 999 police and 997 ambulance elsewhere, 116111 child helpline, 1919 domestic violence | 911 coverage keeps expanding; check which regions it covers now. 116111 is the least certain (one government page). |
| Qatar | 999 | Hamad Medical Corporation. No official child helpline found. 112 not verified, so left out. |
| Kuwait | 112 | Ministry of Interior. No official child helpline found; 147 not verified, so left out. |
| Bahrain | 999, 998 child protection helpline, 992 online child abuse reports | bahrain.bh emergency directory and service page. |
| Oman | 9999 Royal Oman Police, 1100 child protection | 1100 comes from a UNICEF Oman release, not a government page: the least certain. 1555 not verified, so left out. |

- [ ] Check each number against its `source` link (or a newer official page), then set `"confirmed": true`. Update the `source` if you used another page.
