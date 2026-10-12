import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

const data = JSON.parse(read("data/tutors.json"));

const PROFILE_KEYS = new Set([
  "id", "name", "initials", "profileType", "role", "subjects", "countries",
  "counselingTopics", "educationOrExperience", "location", "sessionModes",
  "languages", "currentStudents", "improvement", "experience", "experienceYears",
  "availability", "rating", "reviewCount", "shortBio", "parentNote", "outcomes",
  "tags", "imageUrl", "imageAlt", "photoApproved", "reviews", "email",
  "verificationContactEmail", "publicContactMethod", "applicationStatus",
  "baseCountry", "city", "servesCountries", "curricula", "permitCountry", "permitVerified", "shortBioAr",
]);
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
// 9+ digits in a phone-shaped run, so year ranges like "2019-2023" don't trip it.
const looksLikePhone = (text) =>
  (text.match(/\+?\d[\d\s().-]{7,}\d/g) ?? []).some((run) => run.replace(/\D/g, "").length >= 9);

// Collect every string inside a value, with its path, so nothing nested is missed.
const strings = (value, path = "") => {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => strings(item, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => strings(item, path ? `${path}.${key}` : key));
  }
  return [];
};

test("tutors.json has public profiles", () => {
  assert.ok(Array.isArray(data.profiles) && data.profiles.length > 0);
});

for (const profile of data.profiles ?? []) {
  test(`${profile.id}: only public fields`, () => {
    for (const key of Object.keys(profile)) {
      assert.ok(PROFILE_KEYS.has(key), `unexpected field "${key}" (add it to the importer allowlist and this test on purpose)`);
    }
    assert.equal(profile.email, "", "private tutor email must not be published");
    if (!profile.photoApproved) assert.equal(profile.imageUrl, "", "photo is published without approval");
    if (!profile.publicContactMethod?.approved) {
      assert.equal(profile.publicContactMethod?.value ?? "", "", "contact is published without approval");
    }
  });

  test(`${profile.id}: no emails or phone numbers in text`, () => {
    // These two are the only places an email may appear, and only when the importer allowlisted it.
    const allowed = new Set(["verificationContactEmail", "publicContactMethod.value"]);
    for (const [path, value] of strings(profile)) {
      if (allowed.has(path)) continue;
      assert.doesNotMatch(value, EMAIL, `email-like text in ${path}`);
      assert.ok(!looksLikePhone(value), `phone-like text in ${path}`);
    }
  });
}

test("index.html only references files that exist", () => {
  const html = read("index.html");
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => !/^(https?:|mailto:|data:)/.test(ref));
  assert.ok(refs.length > 0);
  for (const ref of refs) assert.ok(existsSync(new URL(ref, root)), `missing ${ref}`);
});

test("files script.js fetches exist", () => {
  const paths = [...read("script.js").matchAll(/"\.\/([^"]+\.json)"/g)].map((match) => match[1]);
  assert.ok(paths.length >= 2);
  for (const path of paths) assert.ok(existsSync(new URL(path, root)), `missing ${path}`);
});

test("the deploy workflow publishes every file the page needs", () => {
  const stage = read(".github/workflows/deploy-pages.yml").match(/- name: Stage site[\s\S]*?(?=\n\s*- name:)/)[0];
  const published = new Set(
    [...stage.matchAll(/^\s*cp (?:-R )?(.+?) _site\/$/gm)].flatMap((match) => match[1].split(/\s+/))
  );
  const html = read("index.html");
  const needed = [
    ...[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map((match) => match[1]).filter((ref) => !/^(https?:|mailto:|data:)/.test(ref)),
    ...[...read("script.js").matchAll(/"\.\/([^"]+\.json)"/g)].map((match) => match[1]),
    "i18n/en.json",
    "i18n/ar.json",
  ];
  for (const path of needed) assert.ok(published.has(path.split("/")[0]), `${path} is not copied to _site in the deploy workflow`);
});
