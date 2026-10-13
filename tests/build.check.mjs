// Run after `npm run build`: checks the static output that GitHub Pages will serve.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const dist = new URL("../dist/client/", import.meta.url);
const read = (path) => readFileSync(new URL(path, dist), "utf8");
const html = read("index.html");
const profiles = JSON.parse(readFileSync(new URL("../data/tutors.json", import.meta.url), "utf8")).profiles;
const files = readdirSync(dist, { recursive: true });

test("the home page is prerendered with the real catalogue, not an empty app shell", () => {
  assert.match(html, /<h1>/);
  assert.equal((html.match(/class="specialist-card"/g) ?? []).length, profiles.length);
  for (const profile of profiles) assert.ok(html.includes(profile.name), `${profile.name} missing from the HTML`);
});

test("meta tags, canonical URL, social card and favicon", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/f00di\.github\.io\/tutorcat\/"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/f00di\.github\.io\/tutorcat\/social-card\.jpg"/);
  assert.match(html, /<meta name="description" content="[^"]{40,}"/);
  for (const file of ["social-card.jpg", "favicon.png"]) assert.ok(existsSync(new URL(file, dist)), `missing ${file}`);
});

test("every local asset is served from /tutorcat/ and exists", () => {
  const refs = [...html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)].map((match) => match[1]);
  assert.ok(refs.length > 3);
  for (const ref of refs) {
    assert.ok(ref.startsWith("/tutorcat/"), `${ref} is outside the /tutorcat/ base path`);
    assert.ok(existsSync(new URL(ref.slice("/tutorcat/".length), dist)), `missing ${ref}`);
  }
});

test("theme and language are applied before first paint", () => {
  const head = html.slice(0, html.indexOf("</head>"));
  // Inline in <head>, so it runs before the body is parsed or painted.
  assert.ok(head.includes("tutorcat.theme"), "boot script must be inline in <head>");
  assert.match(head, /i18n-pending/);
});

test("only the built site is published", () => {
  for (const file of files) {
    assert.doesNotMatch(String(file), /^(source|scripts|docs|tests|data)(\/|$)|\.xlsx?$/, `${file} must not be published`);
  }
});

test("no placeholder contact email anywhere in the build", () => {
  for (const file of files.filter((name) => /\.(html|js|css|json)$/.test(name))) {
    assert.ok(!read(file).includes("your-email@example.com"), `${file} contains the placeholder email`);
  }
});
