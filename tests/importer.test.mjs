import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { diffProfiles, profilesFromSheets, readWorkbook } from "../scripts/import-tutors-from-excel.mjs";
import { writeTemplate } from "../scripts/make-tutor-template.mjs";

// Fixture rows only; these people are not real and never reach data/tutors.json.
const sheet = (rows) => [{ name: "Profiles", rows: rows.map((cells, i) => ({ rowNumber: i + 1, cells })) }];
const HEADERS = ["Status", "Name", "Profile Type", "Role", "Subjects", "Private Phone (never published)"];

test("one row per person, private columns dropped", () => {
  const result = profilesFromSheets(sheet([
    HEADERS,
    ["Published", "Test Person One", "Tutor", "Math tutor", "Math, Physics", "+1 555 000 0000"],
    ["Published", "Test Person Two", "Counselor", "Canada counselor", "", ""],
  ]));
  assert.deepEqual(result.profiles.map((p) => p.name), ["Test Person One", "Test Person Two"]);
  assert.deepEqual(result.profiles[0].subjects, ["Math", "Physics"]);
  assert.deepEqual(result.excludedColumns, ["Private Phone (never published)"]);
  assert.ok(!JSON.stringify(result.profiles).includes("555"));
});

test("Draft and Hidden profiles are not published", () => {
  const result = profilesFromSheets(sheet([
    HEADERS,
    ["Published", "Test Person One", "Tutor", "Math tutor", "Math", ""],
    ["Draft", "Test Person Two", "Tutor", "Physics tutor", "Physics", ""],
    ["hidden", "Test Person Three", "Tutor", "Chemistry tutor", "Chemistry", ""],
  ]));
  assert.deepEqual(result.profiles.map((p) => p.name), ["Test Person One"]);
  assert.equal(result.unpublished.length, 2);
});

test("unapproved reviews are skipped", () => {
  const result = profilesFromSheets(sheet([
    ["Name", "Profile Type", "Review Rating", "Review Comment", "Verified By Tutor", "Approved By Admin", "Public Permission", "Review Status"],
    ["Test Person One", "Tutor", "5", "Great", "yes", "yes", "yes", "approved"],
    ["Test Person Two", "Tutor", "5", "Great", "yes", "no", "yes", "approved"],
  ]));
  assert.equal(result.profiles[0].reviews.length, 1);
  assert.equal(result.profiles[1].reviews.length, 0);
});

test("diffProfiles reports added, removed and changed fields", () => {
  const a = { id: "a", name: "A", subjects: ["Math"] };
  const b = { id: "b", name: "B", subjects: [] };
  const changes = diffProfiles([a, b], [{ ...a, subjects: ["Math", "Physics"] }, { id: "c", name: "C" }]);
  assert.deepEqual(changes.added.map((p) => p.id), ["c"]);
  assert.deepEqual(changes.removed.map((p) => p.id), ["b"]);
  assert.deepEqual(changes.changed, [{ id: "a", name: "A", fields: ["subjects"] }]);
});

const GULF_HEADERS = ["Name", "Profile Type", "Role", "Session Modes", "Base Country", "City", "Serves Countries", "Location"];
const gulf = (...rows) => profilesFromSheets(sheet([GULF_HEADERS, ...rows]));

test("Base Country, City and Serves Countries are matched to data/regions.json", () => {
  const result = gulf(
    ["Test Person One", "Tutor", "Math tutor", "Online", "uae", "dubai", "KSA, Qatar", ""],
    ["Test Person Two", "Tutor", "Math tutor", "In-person", "", "Al-Ain", "", ""],
  );
  const [one, two] = result.profiles;
  assert.equal(one.baseCountry, "United Arab Emirates");
  assert.equal(one.city, "Dubai");
  assert.deepEqual(one.servesCountries, ["Saudi Arabia", "Qatar"]);
  assert.equal(two.baseCountry, "United Arab Emirates", "a known city implies its country");
  assert.equal(two.city, "Al Ain");
});

test("a city outside the base country is left out with a warning", () => {
  const result = gulf(["Test Person One", "Tutor", "Math tutor", "In-person", "Qatar", "Dubai", "", ""]);
  assert.equal(result.profiles[0].baseCountry, "Qatar");
  assert.equal(result.profiles[0].city, "");
  assert.ok(result.warnings.some((w) => w.includes('City "Dubai" is not in Qatar')));
});

test("old free-text Location is mapped when the new columns are empty", () => {
  const result = gulf(
    ["Test Person One", "Tutor", "Math tutor", "In-person", "", "", "", "Dubai"],
    ["Test Person Two", "Tutor", "Math tutor", "In-person", "", "", "", "Riyadh, KSA"],
    ["Test Person Three", "Tutor", "Math tutor", "In-person", "", "", "", "KSA"],
    ["Test Person Four", "Tutor", "Math tutor", "In-person", "", "", "", "Atlantis / SA"],
  );
  const where = result.profiles.map((p) => [p.baseCountry, p.city]);
  assert.deepEqual(where, [
    ["United Arab Emirates", "Dubai"],
    ["Saudi Arabia", "Riyadh"],
    ["Saudi Arabia", ""],
    ["", ""],
  ]);
  assert.equal(result.profiles[3].location, "Atlantis / SA", "unmapped Location stays as written");
  assert.ok(
    result.warnings.some((w) => w.includes("Test Person Four") && w.includes("not recognised (Atlantis, SA)")),
    "bare SA is not guessed as Saudi Arabia (it means South Africa elsewhere)"
  );
});

test("online tutors with no Serves Countries are flagged", () => {
  const result = gulf(
    ["Test Person One", "Tutor", "Math tutor", "Online", "Oman", "", "", ""],
    ["Test Person Two", "Tutor", "Math tutor", "Online", "", "", "", ""],
  );
  assert.deepEqual(result.profiles[0].servesCountries, []);
  assert.ok(result.warnings.some((w) => w.includes("Test Person One") && w.includes("only show for Oman")));
  assert.ok(result.warnings.some((w) => w.includes("Test Person Two") && w.includes('only show under "Any"')));
});

test("permit columns: country and verified are public, the permit number never is", () => {
  const result = profilesFromSheets(sheet([
    ["Name", "Profile Type", "Role", "Permit Country", "Permit Verified", "Private Permit Number (never published)"],
    ["Test Person One", "Tutor", "Math tutor", "UAE", "Yes", "PT-000-TEST"],
    ["Test Person Two", "Tutor", "Math tutor", "", "Yes", ""],
  ]));
  const [one, two] = result.profiles;
  assert.equal(one.permitCountry, "United Arab Emirates");
  assert.equal(one.permitVerified, true);
  assert.deepEqual(result.excludedColumns, ["Private Permit Number (never published)"]);
  assert.ok(!JSON.stringify(result.profiles).includes("PT-000-TEST"));
  assert.equal(two.permitVerified, true);
  assert.ok(result.warnings.some((w) => w.includes("Test Person Two") && w.includes("Permit Country is empty")));
});

test("curricula are derived from the Curriculum column, and the Arabic bio is kept", () => {
  const result = profilesFromSheets(sheet([
    ["Name", "Profile Type", "Role", "Curriculum", "Short Bio (Arabic)"],
    ["Test Person One", "Tutor", "Math tutor", "A/AS-level, AP Calculus, IBDP, Calc I", "نص تجريبي"],
    ["Test Person Two", "Tutor", "Math tutor", "Calc I", ""],
  ]));
  assert.deepEqual(result.profiles[0].curricula, ["British (IGCSE/A-Level)", "American (AP/SAT)", "IB"]);
  assert.deepEqual(result.profiles[1].curricula, []);
  assert.equal(result.profiles[0].shortBioAr, "نص تجريبي");
});

test("template round-trips through the importer", () => {
  const original = profilesFromSheets(sheet([
    ["Status", "Name", "Profile Type", "Role", "Subjects", "Curriculum", "Countries", "Current Students", "Experience Years",
      "Session Modes", "Base Country", "City", "Serves Countries", "Permit Country", "Permit Verified", "Short Bio (Arabic)"],
    ["Published", "Test Person One", "Tutor + Counselor", "Math tutor and Canada counselor", "Math", "IGCSE, IB", "Canada", "3", "2",
      "Online, In-person", "United Arab Emirates", "Sharjah", "Oman, Bahrain", "United Arab Emirates", "Yes", "نص تجريبي"],
    ["Draft", "Test Person Two", "Tutor", "Physics tutor", "Physics", "AP", "", "", "", "", "", "", "", "", "", ""],
  ])).all;

  const dir = mkdtempSync(join(tmpdir(), "tutorcat-test-"));
  try {
    const file = join(dir, "template.xlsx");
    writeTemplate(file, original);
    const roundTrip = profilesFromSheets(readWorkbook(file));
    assert.equal(roundTrip.sheetName, "Profiles");
    assert.deepEqual(diffProfiles(original, roundTrip.all), { added: [], removed: [], changed: [] });
    assert.deepEqual(roundTrip.profiles.map((p) => p.name), ["Test Person One"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
