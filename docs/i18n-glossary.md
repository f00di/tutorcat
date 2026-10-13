# English–Arabic glossary

The Arabic version (`i18n/ar.json`) is written in Modern Standard Arabic for Gulf parents. It is **not yet reviewed by a native speaker**. The strings I am least sure about are listed under `_meta.lowConfidence` in `i18n/ar.json`. Use the same term everywhere; change it here and in `ar.json` together.

| English | Arabic | Why / alternatives |
|---|---|---|
| tutor | مدرّس (مدرّس خصوصي when it must be explicit) | Common Gulf usage for a private tutor. معلّم reads more like a school teacher. |
| counselor | مستشار (مستشار تعليمي) | Standard for an education adviser. مرشد leans towards school guidance or religious counselling. |
| study-destination counseling | استشارات الدراسة في الخارج | What parents search for. A literal "وجهة الدراسة" is used only for the "Destination" field (وجهة الدراسة). |
| specialist (TutorCat's word for tutors and counselors) | مختص | Neutral and covers both roles. |
| founding member | عضو مؤسس | Standard. Not on the site yet (planned billing feature). |
| boosted profile | ملف مميّز | "Featured" is how Gulf directories label paid placement. مُروَّج sounds like advertising jargon. Must still be clearly labelled as paid. Not on the site yet. |
| verified | موثّق | Used for "Permit verified" (تصريح موثّق) and "verified review" (مراجعة موثّقة). Alternative: تم التحقق منه. |
| review | مراجعة | A written review. Plural مراجعات. Alternative: رأي / آراء (more casual). |
| rating | تقييم | The 1–5 score. Kept distinct from مراجعة. |
| permit | تصريح | UAE: تصريح عمل المعلم الخصوصي (MoHRE), stored as `permitNameAr` in `data/regions.json`. |
| find my match (finder button) | ابحث عن الأنسب لي | Lovable's "Find my match". A literal مطابقتي sounds like a dating app. |
| request an introduction | اطلب التواصل | "Ask to be put in touch." A literal "تعريف" sounds odd. Used on the button, the drawer and the FAQ, which must match. |
| shortlist | قائمتي | "My list." Shorter than القائمة المختصرة and familiar from shopping apps. |
| online / in person / hybrid | عبر الإنترنت / حضوريًا / مدمج | مدمج (blended) is used by Gulf schools. Alternative for hybrid: حضوري وعن بُعد. |
| Where (filter) | الموقع | Short label. Alternative: أين تقيم؟ |
| curriculum | المنهج | Board names (IGCSE, A-Level, IB, AP, CBSE) stay in Latin letters, as Gulf parents write them. |

## Conventions
- Western digits (0-9), as on UAE sites (`ar-AE-u-nu-latn`). Gregorian month names (يناير، فبراير…).
- Arabic comma (،) and semicolon (؛) in Arabic text. Lists of Latin course codes keep the English comma.
- Plurals follow Arabic rules: zero, one, two, few (3–10), many (11–99), other (100+). Every plural string in `ar.json` has all six forms.
- The brand stays "Tutorcat" in Latin letters (Lovable's spelling; emails to the team still say "TutorCat").
- Tutors' and reviewers' own words are never machine-translated. Tutors can add their own Arabic bio in the workbook ("Short Bio (Arabic)").
- Emails sent to the TutorCat team stay in English, with a "Site language" line.

## Before launch
A native Arabic speaker (ideally a Gulf parent or teacher) should read all of `ar.json`, starting with the `_meta.lowConfidence` keys. Freelance proofreading of about 2,000–2,500 words costs roughly $50–150 (estimate), or nothing if an Arabic-speaking tutor on TutorCat reviews it.
