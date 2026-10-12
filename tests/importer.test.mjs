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

test("template round-trips through the importer", () => {
  const original = profilesFromSheets(sheet([
    ["Status", "Name", "Profile Type", "Role", "Subjects", "Curriculum", "Countries", "Current Students", "Experience Years"],
    ["Published", "Test Person One", "Tutor + Counselor", "Math tutor and Canada counselor", "Math", "IGCSE, IB", "Canada", "3", "2"],
    ["Draft", "Test Person Two", "Tutor", "Physics tutor", "Physics", "AP", "", "", ""],
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
