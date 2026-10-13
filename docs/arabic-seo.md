# Arabic and search engines

## How it works today
The site is prerendered at build time, so search engines and link previews get real **English** HTML (title, description, Open Graph tags and the full catalogue). The Arabic version is the same page switched in the browser: the "عربي" toggle, `?lang=ar` links, or a remembered choice. That is enough for visitors, but:

- **Search engines mostly index the English text.** The canonical tag points every URL, including `?lang=ar`, at the English page, so Google treats the Arabic view as a duplicate. Arabic searches ("مدرس خصوصي دبي") are unlikely to find Tutorcat.
- **Link previews are English.** WhatsApp, iMessage, X and LinkedIn read the prerendered `<title>` and Open Graph tags, so a shared `?lang=ar` link still shows the English title and description.

## Later option (not built): a prerendered Arabic page at /ar/
The build already prerenders `/` with TanStack Start. The same mechanism can prerender an Arabic copy:

1. Add a route `src/routes/ar.tsx` that renders the same page with the language fixed to Arabic (give `I18nProvider` an initial-language prop), with `lang="ar" dir="rtl"` and Arabic title/meta/Open Graph tags.
2. Add `{ path: "/ar" }` to `pages` in `vite.config.ts`, so the build writes `dist/client/ar/index.html`.
3. Give `/ar/` its own canonical URL and add `hreflang` links on both pages (`en` → `/`, `ar` → `/ar/`, `x-default` → `/`).
4. Make the header toggle link between `/` and `/ar/` (keeping `?lang=ar` working as a redirect-free fallback), and extend `npm run test:build` to check both pages.

- **Cost:** $0. It works on GitHub Pages, Cloudflare Pages or Netlify, with no server and no rewrites.
- **Effort:** roughly half a day including tests (estimate).
- **When:** once the Arabic copy has had a native-speaker review, and before marketing to Arabic-speaking parents.
