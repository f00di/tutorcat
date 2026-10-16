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
];

const tutors = JSON.parse(readFileSync(new URL("../data/tutors.json", import.meta.url), "utf8"));

// One page per published profile. Same rule as src/lib/profiles.ts: a profile needs a name.
// Ids are URL-safe slugs (the importer makes them).
export const profilePages = () =>
  (tutors.profiles ?? []).filter((profile) => String(profile.name ?? "").trim() && profile.id).map((profile) => `/tutors/${profile.id}/`);

export const publicPages = () => [...STATIC_PAGES, ...profilePages()];
