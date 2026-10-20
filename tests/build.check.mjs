// Run after `npm run build`: checks the static output that GitHub Pages will serve.
// Base-path aware: `BASE_PATH=/ npm run build && BASE_PATH=/ npm run test:build` checks a root build.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

import { draftPages, profilePages, publicPages, sitemapPages } from "../scripts/public-pages.mjs";

const dist = new URL("../dist/client/", import.meta.url);
const read = (path) => readFileSync(new URL(path, dist), "utf8");
const base = process.env["BASE_PATH"] ?? "/tutorcat/";
const config = readFileSync(new URL("../src/config.ts", import.meta.url), "utf8");
const siteUrl = config.match(/SITE_URL = "([^"]+)"/)[1];
const contactEmail = config.match(/CONTACT_EMAIL = "([^"]+)"/)[1];
const profiles = JSON.parse(readFileSync(new URL("../data/tutors.json", import.meta.url), "utf8")).profiles;
const regions = JSON.parse(readFileSync(new URL("../data/regions.json", import.meta.url), "utf8"));
const files = readdirSync(dist, { recursive: true }).map(String);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
// "/tutors/" is served from tutors/index.html.
const pageFile = (path) => `${path.slice(1)}index.html`;
const html = read("index.html");
const attribute = (page, pattern) => page.match(pattern)?.[1];

test("the home page is prerendered with the real catalogue, not an empty app shell", () => {
  assert.match(html, /<h1>/);
  assert.equal((html.match(/class="specialist-card"/g) ?? []).length, profiles.length);
  for (const profile of profiles) assert.ok(html.includes(profile.name), `${profile.name} missing from the HTML`);
});

test("meta tags, canonical URL, social card and favicon", () => {
  assert.ok(html.includes(`<link rel="canonical" href="${siteUrl}"`), "home canonical");
  assert.ok(html.includes(`<meta property="og:image" content="${siteUrl}social-card.jpg"`), "social card");
  assert.match(html, /<meta name="description" content="[^"]{40,}"/);
  for (const file of ["social-card.jpg", "favicon.png"]) assert.ok(existsSync(new URL(file, dist)), `missing ${file}`);
});

test("every public page is prerendered under the base path with its own title, description, Open Graph tags and canonical", () => {
  const titles = new Set();
  for (const path of publicPages()) {
    assert.ok(existsSync(new URL(pageFile(path), dist)), `${path} was not prerendered`);
    const page = read(pageFile(path));
    const title = attribute(page, /<title>([^<]+)<\/title>/);
    assert.ok(title && !/\b[a-z]+\.[a-z]+[A-Za-z.]*\b/.test(title.replace("Tutorcat", "")), `${path}: missing or untranslated title "${title}"`);
    assert.ok(!titles.has(title), `${path}: title "${title}" is used by another page`);
    titles.add(title);
    assert.match(page, /<meta name="description" content="[^"]{40,}"/, `${path}: description`);
    assert.match(page, /<meta property="og:title" content="[^"]+"/, `${path}: og:title`);
    assert.match(page, /<meta property="og:description" content="[^"]{40,}"/, `${path}: og:description`);
    const url = new URL(path.slice(1), siteUrl).href;
    assert.ok(page.includes(`<meta property="og:url" content="${url}"`), `${path}: og:url should be ${url}`);
    assert.equal((page.match(/rel="canonical"/g) ?? []).length, 1, `${path}: exactly one canonical`);
    assert.ok(page.includes(`<link rel="canonical" href="${url}"`), `${path}: canonical should be ${url}`);
    assert.match(page, /<h1[\s>]/, `${path}: no h1`);
  }
});

test("every published profile has its own page with the person's name", () => {
  assert.equal(profilePages().length, profiles.length);
  for (const profile of profiles) {
    const page = read(pageFile(`/tutors/${profile.id}/`));
    assert.ok(page.includes(profile.name), `${profile.id}: name missing`);
  }
});

test("every local link and asset is served from the base path and exists", () => {
  for (const file of htmlFiles) {
    const refs = [...read(file).matchAll(/(?:src|href)="(\/[^"#?]*)/g)].map((match) => match[1]);
    assert.ok(refs.length > 3, `${file}: too few local references`);
    for (const ref of refs) {
      assert.ok(ref.startsWith(base), `${file}: ${ref} is outside the ${base} base path`);
      const target = ref.slice(base.length);
      assert.ok(existsSync(new URL(target === "" || target.endsWith("/") ? `${target}index.html` : target, dist)), `${file}: ${ref} does not exist`);
    }
  }
});

test("Report a concern is linked from every page, and each profile page links to it with that person chosen", () => {
  for (const path of publicPages()) assert.ok(read(pageFile(path)).includes(`href="${base}report/"`), `${path}: no link to ${base}report/`);
  for (const profile of profiles) {
    const link = `href="${base}report/?profile=${profile.id}"`;
    assert.ok(read(pageFile(`/tutors/${profile.id}/`)).includes(link), `${profile.id}: no ${link}`);
  }
});

test("the report page shows no emergency number until the owner confirms it in data/regions.json", () => {
  const page = read(pageFile("/report/"));
  const body = page.slice(page.indexOf("<body"));
  for (const country of regions.countries) {
    for (const item of (country.emergencyNumbers ?? []).filter((entry) => entry.confirmed !== true)) {
      const shown = body.includes(`tel:${item.number}"`) || new RegExp(`>\\s*${item.number}\\s*<`).test(body);
      assert.ok(!shown, `${country.name} ${item.number} is shown but not confirmed`);
    }
  }
});

test("sitemap.xml lists exactly the public pages that aren't drafts", () => {
  const urls = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
  assert.deepEqual(urls, sitemapPages().map((path) => new URL(path.slice(1), siteUrl).href).sort());
});

test("draft legal pages are prerendered with a Draft note and noindex, and kept out of the sitemap", () => {
  const sitemap = read("sitemap.xml");
  for (const path of draftPages()) {
    const page = read(pageFile(path));
    assert.match(page, /<meta name="robots" content="noindex"/, `${path}: noindex`);
    assert.match(page, /class="draft-banner"/, `${path}: Draft note`);
    assert.ok(!sitemap.includes(new URL(path.slice(1), siteUrl).href), `${path} is a draft but in the sitemap`);
  }
});

test("every page shows the team's email address", () => {
  for (const file of [...publicPages().map(pageFile), "404.html"]) {
    assert.ok(read(file).includes(`href="mailto:${contactEmail}"`), `${file}: no mailto:${contactEmail}`);
  }
});

test("no email address in the build other than the team's (and the form's example placeholder)", () => {
  const allowed = new Set([contactEmail, "you@example.com"]);
  for (const file of files.filter((name) => /\.(html|js|css|json|xml)$/.test(name))) {
    for (const [address] of read(file).matchAll(/[\w.%+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}/gi)) {
      assert.ok(allowed.has(address), `${file} contains ${address}`);
    }
  }
});

test("the privacy policy's internal notes are never published", () => {
  for (const file of files.filter((name) => /\.(html|js|json)$/.test(name))) {
    assert.doesNotMatch(read(file), /Before publishing|internal, never publish/, `${file} contains the policy's internal notes`);
  }
});

test("nothing is loaded from another site: scripts, styles, fonts, icons and images come from the base path", () => {
  const loaded = /<(?:script|img|source)\b[^>]*\b(?:src|srcset|srcSet)="([^"]+)"|<link\b(?=[^>]*\brel="(?:stylesheet|preload|modulepreload|icon)")[^>]*\bhref="([^"]+)"/g;
  for (const file of htmlFiles) {
    for (const match of read(file).matchAll(loaded)) {
      for (const url of (match[1] ?? match[2] ?? "").split(",").map((part) => part.trim().split(/\s+/)[0] ?? "")) {
        assert.ok(url.startsWith(base), `${file} loads ${url} from outside the site`);
      }
    }
  }
  for (const file of files.filter((name) => /\.(html|js)$/.test(name))) {
    assert.doesNotMatch(read(file), /googletagmanager|google-analytics|gtag\(|fonts\.googleapis|plausible\.io|clarity\.ms|hotjar|facebook\.net\/.*fbevents/, `${file} loads a tracker or third-party font`);
  }
});

test("unknown URLs get a noindex 404 page", () => {
  const page = read("404.html");
  assert.match(page, /<meta name="robots" content="noindex"/);
  assert.match(page, /<h1[\s>]/);
});

test("theme and language are applied before first paint", () => {
  const head = html.slice(0, html.indexOf("</head>"));
  // Inline in <head>, so it runs before the body is parsed or painted.
  assert.ok(head.includes("tutorcat.theme"), "boot script must be inline in <head>");
  assert.match(head, /i18n-pending/);
});

test("only the built site is published", () => {
  for (const file of files) {
    assert.doesNotMatch(file, /^(source|scripts|docs|tests|data)(\/|$)|\.xlsx?$/, `${file} must not be published`);
  }
});

test("no placeholder contact email anywhere in the build", () => {
  for (const file of files.filter((name) => /\.(html|js|css|json)$/.test(name))) {
    assert.ok(!read(file).includes("your-email@example.com"), `${file} contains the placeholder email`);
  }
});
