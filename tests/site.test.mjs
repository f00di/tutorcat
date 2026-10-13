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

test("the app bundles its data from data/ and i18n/", () => {
  for (const path of ["data/tutors.json", "data/regions.json", "i18n/en.json", "i18n/ar.json"]) {
    assert.ok(existsSync(new URL(path, root)), `missing ${path}`);
  }
  assert.match(read("src/lib/profiles.ts"), /from "\.\.\/\.\.\/data\/tutors\.json"/, "catalogue must come from data/tutors.json");
});

test("the deploy workflow tests, builds and publishes only the build output", () => {
  const workflow = read(".github/workflows/deploy-pages.yml");
  const steps = ["npm ci", "npm test", "npm run build", "npm run test:build", "path: dist/client"].map((step) => workflow.indexOf(step));
  for (const [index, at] of steps.entries()) assert.ok(at > 0, `workflow is missing step ${index + 1}`);
  assert.deepEqual([...steps].sort((a, b) => a - b), steps, "workflow must install, test, build, check, then publish");
  assert.doesNotMatch(workflow, /\b(source|scripts|docs|tests)\/?\s+_site|path:\s*\.\s*$/m, "never publish source/, scripts/, docs/ or tests/");
});

test("private workbooks are git-ignored", () => {
  const ignored = read(".gitignore").split("\n");
  for (const pattern of ["source/*.xlsx", "source/*.xls"]) assert.ok(ignored.includes(pattern), `${pattern} must be in .gitignore`);
});
