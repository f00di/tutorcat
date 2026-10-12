# Arabic and search engines

## How it works today
The Arabic version is the same page (`index.html`) switched by JavaScript: the "عربي" toggle, `?lang=ar` links, or a remembered choice. That is enough for visitors, but:

- **Search engines mostly index the English text.** The HTML they download is English. The canonical tag also points every URL, including `?lang=ar`, at the English page, so Google treats the Arabic view as a duplicate. Arabic searches ("مدرس خصوصي دبي") are unlikely to find TutorCat.
- **Link previews are English.** WhatsApp, iMessage, X and LinkedIn read the `<title>` and Open Graph tags without running JavaScript, so a shared `?lang=ar` link still shows the English title and description.

## Later option (not built): a pre-rendered Arabic page
This is the same idea as the Excel importer: a small Node script with no dependencies, e.g. `scripts/build-arabic-page.mjs`, that:

1. Reads `index.html` and `i18n/ar.json`.
2. Writes `ar/index.html` with:
   - `<html lang="ar" dir="rtl">`
   - every `data-i18n` text, attribute and the `<title>`/meta/OG tags already in Arabic
   - asset paths adjusted (`../styles.css`)
3. Adds `hreflang` links in both pages (`en` → `/`, `ar` → `/ar/`, `x-default` → `/`), and gives the Arabic page its own canonical URL (`/ar/`).
4. Runs in the deploy workflow before "Stage site" (or by hand before committing). A test checks that it is up to date.

The toggle would then link between `/` and `/ar/` instead of switching in place, and the existing scripts work unchanged on both pages.

- **Cost:** $0. It works on GitHub Pages, Cloudflare Pages or Netlify, with no server and no rewrites.
- **Effort:** roughly half a day including tests (estimate).
- **When:** worth doing once the Arabic copy has had a native-speaker review, and before marketing to Arabic-speaking parents.
