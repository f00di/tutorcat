// The public pages: the build prerenders them (vite.config.ts), the sitemap lists them and
// `npm run test:build` checks them, so a page can't be built without being checked.
// Paths end in "/": GitHub Pages serves each page as <path>/index.html.
import { readFileSync } from "node:fs";

export const STATIC_PAGES = [
  "/",
  "/tutors/",
  "/counseling/",
  "/how-it-works/",
  "/for-tutors/",
  "/for-counselors/",
  "/community-guidelines/",
  "/report/",
  "/terms/",
  "/review-policy/",
  "/privacy/",
];

// Legal pages with a draft/final switch: LEGAL_STATUS in src/config.ts (read as text, since this
// file also runs in plain Node). A draft is prerendered with noindex but left out of the sitemap.
export const LEGAL_PAGES = { privacy: "/privacy/" };

const config = readFileSync(new URL("../src/config.ts", import.meta.url), "utf8");
export const legalStatus = Object.fromEntries(
  [...(config.match(/LEGAL_STATUS[^=]*=\s*\{([^}]*)\}/)?.[1] ?? "").matchAll(/(\w+):\s*"(draft|final)"/g)].map(([, name, status]) => [name, status])
);
export const draftPages = () => Object.entries(LEGAL_PAGES).filter(([name]) => legalStatus[name] !== "final").map(([, path]) => path);

const tutors = JSON.parse(readFileSync(new URL("../data/tutors.json", import.meta.url), "utf8"));

// One page per published profile. Same rule as src/lib/profiles.ts: a profile needs a name.
// Ids are URL-safe slugs (the importer makes them).
export const profilePages = () =>
  (tutors.profiles ?? []).filter((profile) => String(profile.name ?? "").trim() && profile.id).map((profile) => `/tutors/${profile.id}/`);

export const publicPages = () => [...STATIC_PAGES, ...profilePages()];

// What search engines are told about: every public page except drafts.
export const sitemapPages = () => publicPages().filter((path) => !draftPages().includes(path));
