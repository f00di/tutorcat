#!/usr/bin/env node

// Writes source/tutors-template.xlsx: one row per tutor/counselor, with dropdowns and a Guide sheet.
// Prefilled from source/tutors.xlsx (or data/tutors.json) so switching layouts loses no public data.
// Private columns start empty; copy contacts across by hand. The file is git-ignored like all source/*.xlsx.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { OUTPUT_FILE, SOURCE_FILE, profilesFromSheets, readWorkbook } from "./import-tutors-from-excel.mjs";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE_FILE = join(ROOT_DIR, "source", "tutors-template.xlsx");

const list = (items) => (items || []).join(", ");
const yesNo = (value) => (value ? "Yes" : "No");
const outcome = ([area, , after]) => (after ? `${area} -> ${after}` : area);

// [header, width, guide text, value from a public profile]. Headers must match importer aliases.
export const TEMPLATE_COLUMNS = [
  ["Status", 12, "Published shows the profile on the site. Draft or Hidden keeps it here without publishing.", (p) => p.applicationStatus || "Published"],
  ["Name", 22, "Full name as it should appear on the site.", (p) => p.name],
  ["Profile Type", 18, "Tutor, Counselor, or Tutor + Counselor.", (p) => p.profileType],
  ["Role", 34, "One-line title, e.g. \"Math tutor and United States counselor\". Left blank, one is generated.", (p) => p.role],
  ["Subjects", 28, "Tutoring subjects, comma separated.", (p) => list(p.subjects)],
  ["Curriculum", 28, "Boards, levels and courses, comma separated (IGCSE, A/AS-level, IB, AP...).", (p) => list(p.tags)],
  ["Countries", 24, "Study destinations they counsel for, comma separated.", (p) => list(p.countries)],
  ["Counseling Topics", 28, "Counseling focus areas, comma separated.", (p) => list(p.counselingTopics)],
  ["Education / Experience", 40, "Schools, degrees, work. Separate items with a semicolon.", (p) => p.educationOrExperience],
  ["Location", 16, "City or area (public).", (p) => p.location],
  ["Session Modes", 18, "Online, In-person, Hybrid (comma separated).", (p) => list(p.sessionModes)],
  ["Languages", 18, "Comma separated.", (p) => list(p.languages)],
  ["Current Students", 10, "Number only.", (p) => p.currentStudents],
  ["Experience Years", 10, "Number only.", (p) => p.experienceYears],
  ["Availability", 22, "e.g. Weekday evenings.", (p) => p.availability],
  ["Short Bio", 44, "Two or three public sentences.", (p) => p.shortBio],
  ["Parent Note", 36, "Optional note for parents.", (p) => p.parentNote],
  ["Outcomes", 36, "Real results only, comma separated, as \"Area -> result\".", (p) => (p.outcomes || []).map(outcome).join(", ")],
  ["Photo URL", 28, "Public https:// link or assets/ path.", (p) => p.imageUrl],
  ["Photo Approved", 10, "Yes only when the person agreed to show the photo.", (p) => yesNo(p.photoApproved)],
  ["Image Alt", 28, "Short photo description.", (p) => p.imageAlt],
  ["Public Contact Type", 14, "email, whatsapp, linkedin or website.", (p) => p.publicContactMethod?.type],
  ["Public Contact Value", 28, "Shown publicly only when approved.", (p) => p.publicContactMethod?.value],
  ["Public Contact Approved", 10, "Yes only with the person's permission.", (p) => yesNo(p.publicContactMethod?.approved)],
  ["Private Email (never published)", 28, "For your records. Never written to the site.", () => ""],
  ["Private Phone (never published)", 20, "For your records. Never written to the site.", () => ""],
  ["Internal Notes (never published)", 36, "For your records. Never written to the site.", () => ""],
];

const DROPDOWNS = {
  Status: ["Published", "Draft", "Hidden"],
  "Profile Type": ["Tutor", "Counselor", "Tutor + Counselor"],
  "Photo Approved": ["Yes", "No"],
  "Public Contact Approved": ["Yes", "No"],
  "Public Contact Type": ["email", "whatsapp", "linkedin", "website"],
};

const escapeXml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const columnLetter = (index) => {
  let letters = "";
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    letters = String.fromCharCode(65 + ((n - 1) % 26)) + letters;
  }
  return letters;
};

const cell = (ref, value, style = 0) => {
  if (value === null || value === undefined || value === "") return "";
  const s = style ? ` s="${style}"` : "";
  if (typeof value === "number") return `<c r="${ref}"${s}><v>${value}</v></c>`;
  return `<c r="${ref}" t="inlineStr"${s}><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
};

const sheetXml = (rows, widths, extra = "") => {
  const cols = widths.map((width, i) => `<col min="${i + 1}" max="${i + 1}" width="${width}" customWidth="1"/>`).join("");
  const body = rows
    .map((values, r) => {
      const style = r === 0 ? 1 : 2;
      return `<row r="${r + 1}">${values.map((v, c) => cell(`${columnLetter(c)}${r + 1}`, v, style)).join("")}</row>`;
    })
    .join("");
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
    `<cols>${cols}</cols><sheetData>${body}</sheetData>${extra}</worksheet>`
  );
};

const dataValidations = () => {
  const items = TEMPLATE_COLUMNS.map(([header], i) => [header, columnLetter(i)])
    .filter(([header]) => DROPDOWNS[header])
    .map(
      ([header, letter]) =>
        `<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="${letter}2:${letter}500">` +
        `<formula1>"${DROPDOWNS[header].join(",")}"</formula1></dataValidation>`
    );
  return `<dataValidations count="${items.length}">${items.join("")}</dataValidations>`;
};

const STATIC_PARTS = {
  "[Content_Types].xml":
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
  "_rels/.rels":
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  "xl/workbook.xml":
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheets><sheet name="Profiles" sheetId="1" r:id="rId1"/><sheet name="Guide" sheetId="2" r:id="rId2"/></sheets></workbook>`,
  "xl/_rels/workbook.xml.rels":
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
    `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>` +
    `<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  "xl/styles.xml":
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>` +
    `<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>` +
    `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
    `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
    `<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
    `<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>` +
    `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs></styleSheet>`,
};

export function writeTemplate(file, profiles) {
  const headers = TEMPLATE_COLUMNS.map(([header]) => header);
  const profileRows = profiles.map((profile) => TEMPLATE_COLUMNS.map(([, , , get]) => get(profile) ?? ""));
  const guideRows = [
    ["Column", "What to enter"],
    ...TEMPLATE_COLUMNS.map(([header, , guide]) => [header, guide]),
    ["", ""],
    ["Updating the site", "Save this file as source/tutors.xlsx, then run: npm run tutors:update"],
  ];

  const dir = mkdtempSync(join(tmpdir(), "tutorcat-template-"));
  try {
    const parts = {
      ...STATIC_PARTS,
      "xl/worksheets/sheet1.xml": sheetXml([headers, ...profileRows], TEMPLATE_COLUMNS.map(([, width]) => width), dataValidations()),
      "xl/worksheets/sheet2.xml": sheetXml(guideRows, [32, 90]),
    };
    for (const [name, content] of Object.entries(parts)) {
      mkdirSync(dirname(join(dir, name)), { recursive: true });
      writeFileSync(join(dir, name), content);
    }
    mkdirSync(dirname(file), { recursive: true });
    rmSync(file, { force: true });
    execFileSync("zip", ["-q", "-X", "-r", file, "[Content_Types].xml", "_rels", "xl"], { cwd: dir });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function currentProfiles(blank) {
  if (blank) return { profiles: [], from: "nothing (blank template)" };
  if (existsSync(SOURCE_FILE)) {
    return { profiles: profilesFromSheets(readWorkbook(SOURCE_FILE)).all, from: "source/tutors.xlsx" };
  }
  if (existsSync(OUTPUT_FILE)) {
    return { profiles: JSON.parse(readFileSync(OUTPUT_FILE, "utf8")).profiles ?? [], from: "data/tutors.json" };
  }
  return { profiles: [], from: "nothing (no existing data)" };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  try {
    if (existsSync(TEMPLATE_FILE) && !args.includes("--force")) {
      throw new Error(
        `${relative(process.cwd(), TEMPLATE_FILE)} already exists. Rename it or rerun with -- --force to overwrite it.`
      );
    }
    const { profiles, from } = currentProfiles(args.includes("--blank"));
    writeTemplate(TEMPLATE_FILE, profiles);
    console.log(`Wrote ${relative(process.cwd(), TEMPLATE_FILE)} with ${profiles.length} profile${profiles.length === 1 ? "" : "s"} from ${from}.`);
    console.log("Private columns are empty: copy contacts across from your old workbook if you keep them there.");
    console.log("When it looks right, save it as source/tutors.xlsx and run: npm run tutors:update");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
