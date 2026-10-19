// The privacy policy and the code must agree. /privacy shows src/content/legal/privacy.{en,ar}.md;
// docs/legal/privacy-policy.md is the source. If one of these tests fails because the site changed
// (a new cookie, storage key, outside service or form), update the policy and /privacy first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

import { legalStatus } from "../scripts/public-pages.mjs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const config = read("src/config.ts");
const contactEmail = config.match(/CONTACT_EMAIL = "([^"]+)"/)[1];
const siteUrl = config.match(/SITE_URL = "([^"]+)"/)[1];

const docs = read("docs/legal/privacy-policy.md");
const english = read("src/content/legal/privacy.en.md");
const arabic = read("src/content/legal/privacy.ar.md");
const tidy = (text) => text.replace(/\s+/g, " ").trim();
const sections = (text) => text.match(/^## .+$/gm) ?? [];
// [placeholder], but not the text of a [link](https://…).
const placeholders = (text) => text.match(/\[[^\]]+\](?!\()/g) ?? [];

// The site's own code: everything in src/ except tests.
const sourceFiles = readdirSync(new URL("src/", root), { recursive: true })
  .map(String)
  .filter((file) => /\.(ts|tsx)$/.test(file) && !/(^|\/)test\//.test(file))
  .map((file) => [file, read(`src/${file}`)]);

test("the site's English policy is sections 1–8 of docs/legal/privacy-policy.md, word for word", () => {
  const start = docs.indexOf("## 1. ");
  const end = docs.indexOf("## Before publishing");
  assert.ok(start > 0 && end > start, "docs/legal/privacy-policy.md lost its section 1 or its 'Before publishing' heading");
  assert.equal(tidy(english), tidy(docs.slice(start, end).replaceAll(contactEmail, "{CONTACT_EMAIL}")), "copy the changed sections into src/content/legal/privacy.en.md (and update the Arabic)");
});

test("the Arabic policy has the same sections, [placeholders] and email slots as the English", () => {
  assert.equal(sections(arabic).length, sections(english).length, "sections");
  assert.equal(placeholders(arabic).length, placeholders(english).length, "[placeholders]");
  assert.equal(arabic.split("{CONTACT_EMAIL}").length, english.split("{CONTACT_EMAIL}").length, "{CONTACT_EMAIL} slots");
  assert.ok(!arabic.includes(contactEmail) && !english.includes(contactEmail), "the email comes from CONTACT_EMAIL, never typed in");
});

test("a final policy has nothing left to confirm", { skip: legalStatus["privacy"] !== "final" }, () => {
  assert.deepEqual(placeholders(english), [], "English [placeholders]");
  assert.deepEqual(placeholders(arabic), [], "Arabic [placeholders]");
});

test("the policy's internal 'Before publishing' notes stay out of the site's code", () => {
  for (const [file, code] of [...sourceFiles, ["content/legal/privacy.en.md", english], ["content/legal/privacy.ar.md", arabic]]) {
    assert.doesNotMatch(code, /Before publishing|internal, never publish/, `src/${file}`);
  }
});

test("no email address in src/, i18n/ or data/ other than CONTACT_EMAIL (and the form's example placeholder)", () => {
  const allowed = new Set([contactEmail, "you@example.com"]);
  const texts = [...sourceFiles, ...["i18n/en.json", "i18n/ar.json", "data/tutors.json", "data/regions.json"].map((path) => [path, read(path)])];
  for (const [file, text] of texts) {
    for (const [address] of text.matchAll(/[\w.%+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}/gi)) assert.ok(allowed.has(address), `${file}: ${address}`);
  }
});

test("browser storage is only the language and theme choices, as the policy says (no cookies)", () => {
  const storageFiles = new Set(["lib/theme.ts", "lib/i18n.tsx"]);
  for (const [file, code] of sourceFiles) {
    assert.doesNotMatch(code, /document\.cookie|indexedDB|sessionStorage|navigator\.sendBeacon|XMLHttpRequest|new WebSocket/, `src/${file}: update the privacy policy before storing or sending anything new`);
    if (/localStorage/.test(code)) assert.ok(storageFiles.has(file), `src/${file} uses localStorage: update the privacy policy first`);
    for (const [, key] of code.matchAll(/["'`](tutorcat\.[\w.-]+)["'`]/g)) {
      assert.ok(["tutorcat.theme", "tutorcat.lang"].includes(key), `src/${file}: new storage key "${key}"`);
    }
  }
});

test("the site's code only fetches its own files (the Arabic text), and links out only to known places", () => {
  for (const [file, code] of sourceFiles) {
    if (/\bfetch\(/.test(code)) assert.equal(file, "lib/i18n.tsx", `src/${file} fetches something: update the privacy policy first`);
    for (const [url] of code.matchAll(/https?:\/\/[^\s"'`)]+/g)) {
      assert.ok([siteUrl, "https://wa.me/", "https://...", "https://…"].some((allowed) => url.startsWith(allowed)), `src/${file}: ${url}`);
    }
  }
});
