#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const SOURCE_FILE = join(ROOT_DIR, "source", "tutors.xlsx");
const OUTPUT_FILE = join(ROOT_DIR, "data", "tutors.json");

const PROFILE_TYPES = new Set(["Tutor", "Counselor", "Tutor + Counselor"]);

const ARRAY_FIELDS = new Set([
  "subjects",
  "countries",
  "counselingTopics",
  "sessionModes",
  "languages",
  "outcomes",
  "tags",
]);

const NUMBER_FIELDS = new Set(["currentStudents", "rating", "reviewCount", "experienceYears"]);

const PRIVATE_HEADER_PATTERNS = [
  /contact/,
  /email/,
  /e-mail/,
  /phone/,
  /mobile/,
  /whatsapp/,
  /address/,
  /payment/,
  /bank/,
  /salary/,
  /private/,
  /internal/,
  /student record/,
];

const HEADER_ALIASES = {
  id: ["id", "profile id", "slug"],
  name: ["name", "tutor name", "counselor name", "full name"],
  initials: ["initials"],
  profileType: ["profile type", "type", "category"],
  role: ["role", "title", "specialist role"],
  subjects: [
    "subjects",
    "subject",
    "subject 1",
    "subject1",
    "subject 2",
    "subject2",
    "subject 3",
    "subject3",
    "tutoring subjects",
  ],
  countries: [
    "countries",
    "country",
    "study destination",
    "study destinations",
    "destination countries",
  ],
  counselingTopics: [
    "counseling topics",
    "counselling topics",
    "guidance topics",
    "counseling focus",
    "counselling focus",
    "counseling",
    "counselling",
  ],
  educationOrExperience: [
    "education",
    "experience",
    "education / experience",
    "education or experience",
    "work/study",
    "work study",
    "graduate",
    "major",
    "degree",
  ],
  location: ["location", "city", "area"],
  sessionModes: ["session modes", "mode", "online/in-person", "online in person"],
  languages: ["languages", "language"],
  currentStudents: ["current students", "student load", "students"],
  improvement: ["improvement", "student improvement", "results"],
  experienceYears: ["experience years", "experienceyears", "experience(years)", "years experience"],
  availability: ["availability", "available"],
  rating: ["rating"],
  reviewCount: ["review count", "reviews"],
  shortBio: ["short bio", "bio", "about"],
  parentNote: ["parent note", "notes for parents", "parent/student note"],
  outcomes: ["outcomes", "achievements"],
  tags: ["tags", "keywords", "board", "curriculum", "level", "course", "courses"],
  imageUrl: [
    "image url",
    "photo",
    "photo url",
    "profile picture",
    "profile photo",
    "profile image",
    "image",
  ],
  imageAlt: ["image alt", "photo alt", "profile picture alt", "profile image alt", "alt text"],
  tutorFlag: ["tutor", "is tutor", "approved tutor", "tutor approved"],
  photoApproved: [
    "photo approved",
    "image approved",
    "profile photo approved",
    "profile picture approved",
  ],
  email: ["email", "e-mail", "tutor email", "counselor email", "counsellor email"],
  verificationContactEmail: [
    "verification contact email",
    "review verification email",
    "tutor verification email",
    "counselor verification email",
    "counsellor verification email",
  ],
  publicContactType: ["public contact type", "approved public contact type"],
  publicContactValue: [
    "public contact value",
    "public contact link",
    "public email",
    "public whatsapp",
    "public linkedin",
    "public website",
  ],
  publicContactApproved: [
    "public contact approved",
    "approved public contact",
    "public contact permission",
  ],
  applicationStatus: ["application status", "profile status", "approval status"],
  reviewReviewerType: ["reviewer type", "review type"],
  reviewRating: ["review rating", "student rating", "parent rating"],
  reviewComment: ["review comment", "review text", "student review", "parent review"],
  reviewDate: ["review date", "submitted date", "date submitted"],
  reviewSessionType: ["review session type", "session type"],
  reviewVerifiedByTutor: ["verified by tutor", "review verified by tutor"],
  reviewApprovedByAdmin: ["approved by admin", "review approved by admin", "tutorcat approved"],
  reviewPublicPermission: [
    "public permission",
    "review public permission",
    "permission to display",
  ],
  reviewStatus: ["review status"],
};

const NORMALIZED_HEADER_ALIASES = Object.fromEntries(
  Object.entries(HEADER_ALIASES).flatMap(([field, aliases]) =>
    aliases.map((alias) => [normalizeHeader(alias), field])
  )
);

const COUNTRY_ALIASES = new Map([
  ["us", "United States"],
  ["usa", "United States"],
  ["u s", "United States"],
  ["u.s.", "United States"],
  ["u.s.a.", "United States"],
  ["united states", "United States"],
  ["united states of america", "United States"],
  ["canada", "Canada"],
  ["germany", "Germany"],
  ["deutschland", "Germany"],
  ["netherlands", "Netherlands"],
  ["the netherlands", "Netherlands"],
  ["holland", "Netherlands"],
  ["czech republic", "Czech Republic"],
  ["czechia", "Czech Republic"],
  ["uk", "United Kingdom"],
  ["u k", "United Kingdom"],
  ["u.k.", "United Kingdom"],
  ["united kingdom", "United Kingdom"],
  ["england", "United Kingdom"],
  ["australia", "Australia"],
  ["south africa", "South Africa"],
  ["sa", "South Africa"],
  ["uae", "UAE"],
  ["u a e", "UAE"],
  ["u.a.e.", "UAE"],
  ["united arab emirates", "UAE"],
]);

function normalizeHeader(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9/ ]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeXml(value) {
  return String(value ?? "")
    .replace(/_x000D_/g, "\n")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/:/g, "\\:");
  const match = tag.match(new RegExp(`\\b${escapedName}="([^"]*)"`));
  return match ? decodeXml(match[1]) : "";
}

function readZipEntry(entryName, required = true) {
  try {
    return execFileSync("unzip", ["-p", SOURCE_FILE, entryName], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
    });
  } catch (error) {
    if (!required) return "";
    throw new Error(`Could not read ${entryName} from source/tutors.xlsx`);
  }
}

function parseSharedStrings() {
  const xml = readZipEntry("xl/sharedStrings.xml", false);
  if (!xml) return [];

  return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((match) => {
    const textParts = [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(
      (part) => decodeXml(part[1])
    );
    return textParts.join("");
  });
}

function columnIndex(cellReference) {
  const letters = String(cellReference).match(/[A-Z]+/i)?.[0]?.toUpperCase() || "";
  return [...letters].reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function parseCellValue(cellXml, sharedStrings) {
  const openTag = cellXml.match(/<c\b[^>]*>/)?.[0] || "";
  const type = getAttribute(openTag, "t");

  if (type === "inlineStr") {
    return [...cellXml.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
      .map((match) => decodeXml(match[1]))
      .join("");
  }

  const value = cellXml.match(/<v>([\s\S]*?)<\/v>/)?.[1];
  if (value === undefined) return "";

  if (type === "s") {
    return sharedStrings[Number(value)] ?? "";
  }

  return decodeXml(value);
}

function parseWorksheetRows(entryName, sharedStrings) {
  const xml = readZipEntry(entryName);
  return [...xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map((rowMatch) => {
    const rowTag = rowMatch[0].match(/<row\b[^>]*>/)?.[0] || "";
    const rowNumber = Number(getAttribute(rowTag, "r")) || null;
    const cells = [];

    for (const cellMatch of rowMatch[1].matchAll(/<c\b[^>]*\/>|<c\b[^>]*>[\s\S]*?<\/c>/g)) {
      const cellXml = cellMatch[0];
      const cellTag = cellXml.match(/<c\b[^>]*\/?>/)?.[0] || "";
      const ref = getAttribute(cellTag, "r");
      const index = columnIndex(ref);
      if (index >= 0) cells[index] = cleanText(parseCellValue(cellXml, sharedStrings));
    }

    return { rowNumber, cells };
  });
}

function parseSheets() {
  const workbookXml = readZipEntry("xl/workbook.xml");
  const relsXml = readZipEntry("xl/_rels/workbook.xml.rels");
  const rels = new Map(
    [...relsXml.matchAll(/<Relationship\b[^>]*\/>/g)].map((match) => {
      const id = getAttribute(match[0], "Id");
      const target = getAttribute(match[0], "Target");
      return [id, target.startsWith("xl/") ? target : `xl/${target}`];
    })
  );

  return [...workbookXml.matchAll(/<sheet\b[^>]*\/>/g)]
    .map((match) => {
      const name = getAttribute(match[0], "name");
      const relationshipId = getAttribute(match[0], "r:id");
      const entryName = rels.get(relationshipId);
      return entryName ? { name, entryName } : null;
    })
    .filter(Boolean);
}

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function toTitleCase(value) {
  const text = cleanText(value);
  if (!text) return "";
  if (text !== text.toLowerCase() && text !== text.toUpperCase()) return text;

  return text
    .split(" ")
    .map((word) => {
      if (/^(AP|IB|IGCSE|IELTS|TOEFL|SAT|ACT|UAE|USA|UK)$/i.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function normalizeSubject(value) {
  const text = cleanText(value).replace(/[.]+$/g, "");
  const key = text.toLowerCase();
  const subjectAliases = new Map([
    ["math", "Math"],
    ["mathematics", "Math"],
    ["computer science", "Computer Science"],
    ["computer sciences", "Computer Science"],
    ["english", "English"],
    ["english language", "English Language"],
    ["physical education", "Physical Education"],
    ["science", "Science"],
    ["physics", "Physics"],
    ["chemistry", "Chemistry"],
    ["biology", "Biology"],
  ]);

  return subjectAliases.get(key) || toTitleCase(text);
}

function splitList(value) {
  return unique(
    String(value ?? "")
      .split(/[\n,;|]+/)
      .map(cleanText)
      .filter(Boolean)
  );
}

function unique(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = String(item).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

function normalizeCountry(value) {
  const key = cleanText(value).toLowerCase();
  return COUNTRY_ALIASES.get(key) || cleanText(value);
}

function looksLikeCountry(value) {
  const key = cleanText(value).toLowerCase();
  return COUNTRY_ALIASES.has(key);
}

function normalizeProfileType(value, profile) {
  const raw = cleanText(value).toLowerCase();

  if (raw.includes("tutor") && (raw.includes("counselor") || raw.includes("counsellor"))) {
    return "Tutor + Counselor";
  }

  if (raw.includes("counselor") || raw.includes("counsellor") || raw.includes("counsel")) {
    return "Counselor";
  }

  if (raw.includes("tutor")) return "Tutor";

  const hasTutoring = profile.subjects.length > 0;
  const hasCounseling = profile.countries.length > 0 || profile.counselingTopics.length > 0;

  if (hasTutoring && hasCounseling) return "Tutor + Counselor";
  if (hasCounseling) return "Counselor";
  return "Tutor";
}

function generateInitials(name) {
  return cleanText(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateRole(profile) {
  const subject = profile.subjects[0] || "Academic";
  const country = profile.countries[0] || "study-destination";

  if (profile.profileType === "Tutor + Counselor") {
    return `${subject} tutor and ${country} counselor`;
  }

  if (profile.profileType === "Counselor") {
    return `${country} education counselor`;
  }

  return `${subject} tutor`;
}

function parseNumber(value) {
  const match = String(value ?? "").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function parseBoolean(value) {
  const text = cleanText(value).toLowerCase();
  if (!text) return null;
  if (["yes", "y", "true", "1", "approved", "verified", "public"].includes(text)) {
    return true;
  }
  if (["no", "n", "false", "0", "rejected", "private", "unapproved"].includes(text)) {
    return false;
  }
  return null;
}

function parseOutcomes(value) {
  return splitList(value).map((item) => {
    const parts = item.split(/\s*(?:->|→|>)\s*/).map(cleanText).filter(Boolean);
    if (parts.length >= 2) return [parts[0], "", parts.slice(1).join(" "), ""];
    return [item, "", "", ""];
  });
}

function isPublicImageUrl(value) {
  const url = cleanText(value);
  return /^(https?:\/\/|\.?\/?assets\/)/i.test(url);
}

function isClearlyPublicImageUrl(value) {
  const url = cleanText(value);
  return /^\.?\/?assets\//i.test(url);
}

function emptyProfile() {
  return {
    id: "",
    name: "",
    initials: "",
    profileType: "",
    role: "",
    subjects: [],
    countries: [],
    counselingTopics: [],
    educationOrExperience: "",
    location: "",
    sessionModes: [],
    languages: [],
    currentStudents: null,
    improvement: "",
    experience: "",
    experienceYears: null,
    availability: "",
    rating: null,
    reviewCount: null,
    shortBio: "",
    parentNote: "",
    outcomes: [],
    tags: [],
    imageUrl: "",
    imageAlt: "",
    photoApproved: null,
    email: "",
    verificationContactEmail: "",
    publicContactMethod: {
      type: "",
      value: "",
      approved: false,
    },
    applicationStatus: "",
    reviews: [],
    tutorFlag: "",
  };
}

function buildHeaderMap(headerCells) {
  return headerCells.map((header) => {
    const cleaned = cleanText(header);
    const normalized = normalizeHeader(cleaned);
    if (!normalized) return null;

    const field = NORMALIZED_HEADER_ALIASES[normalized] || "";
    if (field) return { field, header: cleaned };

    if (PRIVATE_HEADER_PATTERNS.some((pattern) => pattern.test(normalized))) {
      return { field: "private", header: cleaned };
    }

    return { field: "", header: cleaned };
  });
}

function scoreHeaderRow(cells) {
  return cells.reduce((score, cell) => {
    const normalized = normalizeHeader(cell);
    if (!normalized) return score;
    if (NORMALIZED_HEADER_ALIASES[normalized]) return score + 2;
    if (PRIVATE_HEADER_PATTERNS.some((pattern) => pattern.test(normalized))) return score + 1;
    return score;
  }, 0);
}

function selectDataSheet(sheets, sharedStrings) {
  let best = null;

  for (const sheet of sheets) {
    const rows = parseWorksheetRows(sheet.entryName, sharedStrings);
    const headerCandidate = rows.slice(0, 20).reduce(
      (currentBest, row, index) => {
        const score = scoreHeaderRow(row.cells);
        if (score > currentBest.score) return { score, row, index };
        return currentBest;
      },
      { score: 0, row: null, index: -1 }
    );

    if (!best || headerCandidate.score > best.score) {
      best = { ...sheet, rows, ...headerCandidate };
    }
  }

  if (!best || best.score < 4) {
    throw new Error("Could not find a worksheet with recognizable tutor/counselor headers.");
  }

  return best;
}

function normalizeReviewStatus(value) {
  const status = cleanText(value).toLowerCase() || "pending";
  return [
    "pending",
    "awaiting_tutor_verification",
    "verified_by_tutor",
    "approved",
    "rejected",
  ].includes(status)
    ? status
    : "pending";
}

function ensureReviewDraft(profile) {
  if (!profile._reviewDraft) {
    profile._reviewDraft = {
      reviewerType: "Student",
      rating: null,
      comment: "",
      date: "",
      sessionType: "",
      verifiedByTutor: false,
      approvedByAdmin: false,
      publicPermission: false,
      status: "pending",
    };
  }

  return profile._reviewDraft;
}

function applyReviewValue(profile, field, value) {
  const review = ensureReviewDraft(profile);

  if (field === "reviewReviewerType") review.reviewerType = cleanText(value);
  if (field === "reviewRating") review.rating = parseNumber(value);
  if (field === "reviewComment") review.comment = cleanText(value);
  if (field === "reviewDate") review.date = cleanText(value);
  if (field === "reviewSessionType") review.sessionType = cleanText(value);
  if (field === "reviewVerifiedByTutor") review.verifiedByTutor = parseBoolean(value) === true;
  if (field === "reviewApprovedByAdmin") review.approvedByAdmin = parseBoolean(value) === true;
  if (field === "reviewPublicPermission") review.publicPermission = parseBoolean(value) === true;
  if (field === "reviewStatus") review.status = normalizeReviewStatus(value);
}

function finalizeReviewDraft(profile, warnings, rowNumber) {
  const review = profile._reviewDraft;
  delete profile._reviewDraft;

  if (!review || (review.rating === null && !review.comment)) return;

  const isApprovedPublicReview =
    review.rating !== null &&
    review.comment &&
    review.verifiedByTutor === true &&
    review.approvedByAdmin === true &&
    review.publicPermission === true &&
    review.status === "approved";

  if (!isApprovedPublicReview) {
    warnings.push(
      `Row ${rowNumber}: did not import review because it is not tutor-verified, admin-approved, public, and approved.`
    );
    return;
  }

  profile.reviews.push({
    reviewerType: review.reviewerType || "Student",
    rating: Math.min(5, Math.max(1, review.rating)),
    comment: review.comment,
    date: review.date,
    sessionType: review.sessionType || "Tutoring",
    verifiedByTutor: true,
    approvedByAdmin: true,
    publicPermission: true,
    status: "approved",
  });
}

function applyValue(profile, field, value, warnings, rowNumber, header) {
  if (!field || !value) return;

  if (field === "private") return;

  if (field.startsWith("review")) {
    applyReviewValue(profile, field, value);
    return;
  }

  if (field === "profileType") {
    profile.profileType = cleanText(value);
    return;
  }

  if (field === "tutorFlag") {
    if (parseBoolean(value) === true) profile.tutorFlag = "yes";
    return;
  }

  if (field === "imageUrl") {
    if (isPublicImageUrl(value)) {
      profile.imageUrl = cleanText(value);
    } else {
      warnings.push(`Row ${rowNumber}: ignored non-public image value from "${header}".`);
    }
    return;
  }

  if (field === "imageAlt") {
    profile.imageAlt = cleanText(value);
    return;
  }

  if (field === "photoApproved") {
    profile.photoApproved = parseBoolean(value);
    return;
  }

  if (field === "publicContactType") {
    profile.publicContactMethod.type = cleanText(value).toLowerCase();
    return;
  }

  if (field === "publicContactValue") {
    profile.publicContactMethod.value = cleanText(value);
    return;
  }

  if (field === "publicContactApproved") {
    profile.publicContactMethod.approved = parseBoolean(value) === true;
    return;
  }

  if (NUMBER_FIELDS.has(field)) {
    profile[field] = parseNumber(value);
    return;
  }

  if (field === "outcomes") {
    profile.outcomes = [...profile.outcomes, ...parseOutcomes(value)];
    return;
  }

  if (ARRAY_FIELDS.has(field)) {
    const items = splitList(value);

    if (field === "countries") {
      profile.countries = unique([...profile.countries, ...items.map(normalizeCountry)]);
      return;
    }

    if (field === "counselingTopics") {
      const countryItems = items.filter(looksLikeCountry).map(normalizeCountry);
      const topicItems = items.filter((item) => !looksLikeCountry(item));
      profile.countries = unique([...profile.countries, ...countryItems]);
      profile.counselingTopics = unique([...profile.counselingTopics, ...topicItems]);
      return;
    }

    profile[field] = unique([...profile[field], ...items]);
    return;
  }

  if (field === "educationOrExperience") {
    profile.educationOrExperience = unique(
      [profile.educationOrExperience, cleanText(value)].filter(Boolean).join("; ").split("; ")
    ).join("; ");
    return;
  }

  profile[field] = cleanText(value);
}

function extractRow(row, headerMap, warnings, excludedColumns) {
  const profile = emptyProfile();
  let publicValueCount = 0;

  row.cells.forEach((value, index) => {
    const cellValue = cleanText(value);
    if (!cellValue) return;

    const mapping = headerMap[index];
    if (!mapping) return;

    if (mapping.field === "private") {
      excludedColumns.add(mapping.header);
      return;
    }

    if (!mapping.field) {
      return;
    }

    publicValueCount += 1;
    applyValue(profile, mapping.field, cellValue, warnings, row.rowNumber, mapping.header);
  });

  finalizeReviewDraft(profile, warnings, row.rowNumber);

  return { profile, publicValueCount };
}

function isProfileStart(profile, currentDraft) {
  if (!currentDraft) return true;
  if (!profile.name) return false;

  return Boolean(
    profile.tutorFlag ||
      profile.currentStudents !== null ||
      profile.countries.length ||
      profile.counselingTopics.length ||
      profile.educationOrExperience ||
      profile.experienceYears !== null ||
      profile.profileType
  );
}

function appendContinuationName(target, addition) {
  if (!addition.name) return;

  const currentParts = cleanText(target.name).split(/\s+/).map((part) => part.toLowerCase());
  const nextParts = cleanText(addition.name)
    .split(/\s+/)
    .filter(Boolean)
    .filter((part) => !currentParts.includes(part.toLowerCase()));

  if (nextParts.length) {
    target.name = cleanText(`${target.name} ${nextParts.join(" ")}`);
  }
}

function mergeContinuation(target, addition, options = {}) {
  if (options.mergeName) {
    appendContinuationName(target, addition);
  }

  for (const field of ARRAY_FIELDS) {
    target[field] = unique([...(target[field] || []), ...(addition[field] || [])]);
  }

  for (const field of ["educationOrExperience", "improvement", "experience", "availability", "shortBio", "parentNote"]) {
    if (!addition[field]) continue;
    target[field] = target[field]
      ? unique(`${target[field]}; ${addition[field]}`.split("; ").map(cleanText)).join("; ")
      : addition[field];
  }

  for (const field of ["location", "imageUrl"]) {
    if (!target[field] && addition[field]) target[field] = addition[field];
  }

  for (const field of ["imageAlt", "email", "verificationContactEmail", "applicationStatus"]) {
    if (!target[field] && addition[field]) target[field] = addition[field];
  }

  if (target.photoApproved === null && addition.photoApproved !== null) {
    target.photoApproved = addition.photoApproved;
  }

  if (!target.publicContactMethod.type && addition.publicContactMethod.type) {
    target.publicContactMethod.type = addition.publicContactMethod.type;
  }

  if (!target.publicContactMethod.value && addition.publicContactMethod.value) {
    target.publicContactMethod.value = addition.publicContactMethod.value;
  }

  if (addition.publicContactMethod.approved === true) {
    target.publicContactMethod.approved = true;
  }

  target.reviews = [...(target.reviews || []), ...(addition.reviews || [])];

  for (const field of NUMBER_FIELDS) {
    if (target[field] === null && addition[field] !== null) target[field] = addition[field];
  }
}

function finalizeProfiles(drafts, warnings) {
  const usedIds = new Map();

  return drafts.map((profile) => {
    profile.name = toTitleCase(profile.name);
    profile.subjects = unique((profile.subjects || []).map(normalizeSubject));

    const originalProfileType = profile.profileType;
    profile.profileType = normalizeProfileType(profile.profileType, profile);
    if (!originalProfileType) {
      warnings.push(`Row for "${profile.name}": profileType missing, inferred "${profile.profileType}".`);
    }

    if (!PROFILE_TYPES.has(profile.profileType)) {
      warnings.push(`Row for "${profile.name}": unsupported profileType, defaulted to "Tutor".`);
      profile.profileType = "Tutor";
    }

    if (!profile.role) {
      profile.role = generateRole(profile);
      warnings.push(`Row for "${profile.name}": role missing, generated "${profile.role}".`);
    }

    if (!profile.initials) {
      profile.initials = generateInitials(profile.name);
    }

    const baseId = slugify(profile.id || `${profile.name} ${profile.profileType}`) || "profile";
    const count = usedIds.get(baseId) || 0;
    usedIds.set(baseId, count + 1);
    profile.id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    for (const field of ARRAY_FIELDS) {
      profile[field] = unique(profile[field] || []);
    }

    if (!profile.sessionModes.length) profile.sessionModes = ["Online"];
    if (!profile.experience && profile.experienceYears !== null) {
      profile.experience = `${profile.experienceYears} yr${profile.experienceYears === 1 ? "" : "s"}`;
    }

    if (profile.photoApproved === null) {
      profile.photoApproved = Boolean(profile.imageUrl && isClearlyPublicImageUrl(profile.imageUrl));
    }

    profile.publicContactMethod = {
      type: cleanText(profile.publicContactMethod.type).toLowerCase(),
      value: cleanText(profile.publicContactMethod.value),
      approved: profile.publicContactMethod.approved === true,
    };

    return {
      id: profile.id,
      name: profile.name,
      initials: profile.initials,
      profileType: profile.profileType,
      role: profile.role,
      subjects: profile.subjects,
      countries: profile.countries,
      counselingTopics: profile.counselingTopics,
      educationOrExperience: profile.educationOrExperience,
      location: profile.location,
      sessionModes: profile.sessionModes,
      languages: profile.languages,
      currentStudents: profile.currentStudents,
      improvement: profile.improvement,
      experience: profile.experience,
      experienceYears: profile.experienceYears,
      availability: profile.availability,
      rating: profile.rating,
      reviewCount: profile.reviewCount,
      shortBio: profile.shortBio,
      parentNote: profile.parentNote,
      outcomes: profile.outcomes,
      tags: profile.tags,
      imageUrl: profile.imageUrl,
      imageAlt: profile.imageAlt,
      photoApproved: profile.photoApproved,
      reviews: profile.reviews,
      email: profile.email,
      verificationContactEmail: profile.verificationContactEmail,
      publicContactMethod: profile.publicContactMethod,
      applicationStatus: profile.applicationStatus,
    };
  });
}

function importProfiles() {
  if (!existsSync(SOURCE_FILE)) {
    throw new Error("Missing source/tutors.xlsx. Put the latest Excel file there and rerun npm run import:tutors.");
  }

  const sharedStrings = parseSharedStrings();
  const selected = selectDataSheet(parseSheets(), sharedStrings);
  const headerMap = buildHeaderMap(selected.row.cells);
  const warnings = [];
  const skipped = [];
  const excludedColumns = new Set();
  const drafts = [];
  let currentDraft = null;

  for (const row of selected.rows.slice(selected.index + 1)) {
    const { profile, publicValueCount } = extractRow(row, headerMap, warnings, excludedColumns);

    if (publicValueCount === 0) continue;

    if (currentDraft && (!profile.name || !isProfileStart(profile, currentDraft))) {
      mergeContinuation(currentDraft, profile, { mergeName: Boolean(profile.name) });
      warnings.push(`Row ${row.rowNumber}: merged public continuation values into "${currentDraft.name}".`);
      continue;
    }

    if (!profile.name) {
      skipped.push(`Row ${row.rowNumber}: skipped because name is missing.`);
      continue;
    }

    drafts.push(profile);
    currentDraft = profile;
  }

  const profiles = finalizeProfiles(drafts, warnings);

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(
    OUTPUT_FILE,
    `${JSON.stringify(
      {
        lastUpdated: new Date().toISOString(),
        sourceSheet: selected.name,
        profiles,
      },
      null,
      2
    )}\n`
  );

  console.log(`Imported ${profiles.length} profile${profiles.length === 1 ? "" : "s"} from ${selected.name}.`);
  console.log("Wrote data/tutors.json.");

  if (excludedColumns.size) {
    console.warn(`Excluded private columns from public JSON: ${[...excludedColumns].join(", ")}.`);
  }

  for (const warning of warnings) console.warn(`Warning: ${warning}`);
  for (const row of skipped) console.warn(`Skipped: ${row}`);
}

try {
  importProfiles();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
