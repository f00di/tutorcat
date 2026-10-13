// Tutor/counselor profiles from data/tutors.json (built from source/tutors.xlsx by `npm run tutors:update`).
// Ported from the previous script.js: the same normalising, verified-review and privacy rules.
import tutorsData from "../../data/tutors.json";
import { allKnownCurricula, regions, type Translator } from "./i18n";

export type Review = {
  reviewerType: string;
  rating: number | null;
  comment: string;
  date: string;
  sessionType: string;
  verifiedByTutor: boolean;
  approvedByAdmin: boolean;
  publicPermission: boolean;
  status: string;
};

export type Profile = {
  id: string;
  name: string;
  initials: string;
  profileType: "Tutor" | "Counselor" | "Tutor + Counselor";
  role: string;
  subjects: string[];
  countries: string[];
  counselingTopics: string[];
  educationOrExperience: string;
  location: string;
  baseCountry: string;
  city: string;
  servesCountries: string[];
  sessionModes: string[];
  languages: string[];
  experience: string;
  experienceYears: number | null;
  availability: string;
  shortBio: string;
  shortBioAr: string;
  parentNote: string;
  outcomes: string[][];
  tags: string[];
  curricula: string[];
  permitCountry: string;
  permitVerified: boolean;
  imageUrl: string;
  imageAlt: string;
  photoApproved: boolean;
  rating: number | null;
  reviewCount: number | null;
  reviews: Review[];
  publicContactMethod: { type: string; value: string; approved: boolean };
};

type Raw = Record<string, unknown>;

const text = (value: unknown) => String(value ?? "").trim();
const unique = (items: string[]) => {
  const seen = new Set<string>();
  return items.filter((item) => item && !seen.has(item.toLowerCase()) && seen.add(item.toLowerCase()));
};
const list = (value: unknown) =>
  unique((Array.isArray(value) ? value : value ? String(value).split(/[\n,;|]+/) : []).map(text));
const number = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  if (Number.isFinite(parsed)) return parsed;
  const match = String(value).match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
};
const bool = (value: unknown) => {
  if (typeof value === "boolean") return value;
  const normalized = text(value).toLowerCase();
  if (["true", "yes", "y", "1", "approved", "verified", "public"].includes(normalized)) return true;
  return false;
};
const clampRating = (value: unknown) => {
  const rating = number(value);
  return rating === null ? null : Math.min(5, Math.max(1, rating));
};

// Only http(s) URLs or files in assets/ may be shown as photos.
export const isSafeImageUrl = (value: string) => /^(https?:\/\/|\.?\/?assets\/)/i.test(value);

const normalizeProfileType = (value: string, subjects: string[], countries: string[], topics: string[]): Profile["profileType"] => {
  const raw = value.toLowerCase();
  if (raw.includes("tutor") && (raw.includes("counselor") || raw.includes("counsellor"))) return "Tutor + Counselor";
  if (raw.includes("counsel")) return "Counselor";
  if (raw.includes("tutor")) return "Tutor";
  const counseling = countries.length > 0 || topics.length > 0;
  if (subjects.length && counseling) return "Tutor + Counselor";
  return counseling ? "Counselor" : "Tutor";
};

const normalizeReview = (raw: Raw): Review => ({
  reviewerType: text(raw["reviewerType"]) || "Student",
  rating: clampRating(raw["rating"]),
  comment: text(raw["comment"] ?? raw["review"]),
  date: text(raw["date"] ?? raw["submittedDate"]),
  sessionType: text(raw["sessionType"]),
  verifiedByTutor: bool(raw["verifiedByTutor"]),
  approvedByAdmin: bool(raw["approvedByAdmin"]),
  publicPermission: bool(raw["publicPermission"]),
  status: text(raw["status"]).toLowerCase() || "pending",
});

export function normalizeProfile(raw: Raw, index: number): Profile {
  const subjects = list(raw["subjects"]);
  const countries = list(raw["countries"]);
  const counselingTopics = list(raw["counselingTopics"]);
  const name = text(raw["name"]);
  const contact = (raw["publicContactMethod"] ?? {}) as Raw;
  const experience = text(raw["experience"]);
  const experienceYears = number(raw["experienceYears"]) ?? number(experience);
  const imageUrl = text(raw["imageUrl"]);
  return {
    id: text(raw["id"]) || `profile-${index + 1}`,
    name,
    initials:
      text(raw["initials"]) ||
      name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join(""),
    profileType: normalizeProfileType(text(raw["profileType"]), subjects, countries, counselingTopics),
    role: text(raw["role"]),
    subjects,
    countries,
    counselingTopics,
    educationOrExperience: text(raw["educationOrExperience"]),
    location: text(raw["location"]),
    baseCountry: text(raw["baseCountry"]),
    city: text(raw["city"]),
    servesCountries: list(raw["servesCountries"]),
    sessionModes: list(raw["sessionModes"]).length ? list(raw["sessionModes"]) : ["Online"],
    languages: list(raw["languages"]),
    experience,
    experienceYears,
    availability: text(raw["availability"]),
    shortBio: text(raw["shortBio"]),
    shortBioAr: text(raw["shortBioAr"]),
    parentNote: text(raw["parentNote"]),
    outcomes: Array.isArray(raw["outcomes"]) ? (raw["outcomes"] as unknown[]).map((item) => (Array.isArray(item) ? item.map(text) : [text(item)])) : [],
    tags: list(raw["tags"]),
    curricula: list(raw["curricula"]),
    permitCountry: text(raw["permitCountry"]),
    permitVerified: bool(raw["permitVerified"]),
    imageUrl: isSafeImageUrl(imageUrl) ? imageUrl : "",
    imageAlt: text(raw["imageAlt"]),
    photoApproved: bool(raw["photoApproved"]),
    rating: number(raw["rating"]),
    reviewCount: number(raw["reviewCount"]),
    reviews: Array.isArray(raw["reviews"]) ? (raw["reviews"] as Raw[]).map(normalizeReview) : [],
    publicContactMethod: { type: text(contact["type"]).toLowerCase(), value: text(contact["value"]), approved: bool(contact["approved"]) },
  };
}

export const normalizeProfiles = (raw: unknown): Profile[] => {
  const items = Array.isArray(raw) ? raw : Array.isArray((raw as Raw)?.["profiles"]) ? ((raw as Raw)["profiles"] as unknown[]) : [];
  return items.map((item, index) => normalizeProfile(item as Raw, index)).filter((profile) => profile.name);
};

export const profiles: Profile[] = normalizeProfiles(tutorsData);

// ---------------------------------------------------------------------------
// Catalogue facts, always derived from the data so nothing is invented.
// ---------------------------------------------------------------------------

const byCount = (values: string[]) => {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.keys()].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0));
};

export const allSubjects = (items: Profile[]) => byCount(items.flatMap((profile) => profile.subjects));
export const allDestinations = (items: Profile[]) => byCount(items.flatMap((profile) => profile.countries));
export const allCurricula = (items: Profile[]) => {
  const used = new Set(items.flatMap((profile) => profile.curricula));
  const known = allKnownCurricula.map((curriculum) => curriculum.name);
  return [...known.filter((name) => used.has(name)), ...[...used].filter((name) => !known.includes(name))];
};

export const isTutor = (profile: Profile) => profile.profileType.includes("Tutor");
export const isCounselor = (profile: Profile) => profile.profileType.includes("Counselor") || profile.countries.length > 0;

// ---------------------------------------------------------------------------
// Where: Gulf base country / city / online reach (data/regions.json).
// Separate from `countries`, which are study-abroad destinations.
// ---------------------------------------------------------------------------

export const findRegion = (name: string) => regions.countries.find((country) => country.name === name);
export const offersOnline = (profile: Profile) => profile.sessionModes.some((mode) => /online|hybrid/i.test(mode));
export const offersInPerson = (profile: Profile) => profile.sessionModes.some((mode) => /in.?person|hybrid|home|face/i.test(mode));
// Online tutors teach their base country plus any Serves Countries.
export const servedCountries = (profile: Profile) => unique([profile.baseCountry, ...profile.servesCountries].filter(Boolean));

/** where = "" (anywhere), a Gulf country name, or "Country|City". */
export function matchesWhere(profile: Profile, where: string) {
  if (!where) return true;
  const [country = "", city = ""] = where.split("|");
  const inPerson = offersInPerson(profile) && profile.baseCountry === country && (!city || profile.city === city);
  return inPerson || (offersOnline(profile) && servedCountries(profile).includes(country));
}

export const hasVerifiedPermit = (profile: Profile) => profile.permitVerified && Boolean(findRegion(profile.permitCountry)?.permitBadge);

export const hasApprovedPhoto = (profile: Profile) => profile.photoApproved && Boolean(profile.imageUrl);

// First school/university mentioned in "Education / Experience" (the importer joins items with "; ").
export const getUniversity = (profile: Profile) =>
  profile.educationOrExperience
    .split(";")
    .map((part) => part.trim().replace(/\.$/, ""))
    .find((part) => /universit|college|institut/i.test(part)) ?? "";

// ---------------------------------------------------------------------------
// Reviews: only tutor-verified, admin-approved reviews with public permission count.
// ---------------------------------------------------------------------------

export const isVerifiedPublicReview = (review: Review) =>
  review.rating !== null && review.verifiedByTutor && review.approvedByAdmin && review.publicPermission && review.status === "approved";

export function ratingInfo(profile: Profile) {
  const verified = profile.reviews.filter(isVerifiedPublicReview);
  if (profile.reviews.length) {
    const average = verified.length ? verified.reduce((sum, review) => sum + (review.rating ?? 0), 0) / verified.length : null;
    return { source: "verified" as const, average: average === null ? null : Math.round(average * 10) / 10, count: verified.length, verified };
  }
  if (profile.rating !== null && profile.reviewCount !== null) {
    return { source: "manual" as const, average: clampRating(profile.rating), count: profile.reviewCount, verified: [] };
  }
  return { source: "none" as const, average: null, count: 0, verified: [] as Review[] };
}

// ---------------------------------------------------------------------------
// Public contact: shown only when approved, and only as a safe link.
// ---------------------------------------------------------------------------

export function publicContactHref(profile: Profile) {
  const { type, value, approved } = profile.publicContactMethod;
  if (!approved || !value || !["email", "whatsapp", "linkedin", "website"].includes(type)) return null;
  if (type === "email") return { type, href: `mailto:${value.replace(/[\r\n?&]/g, "")}` };
  let url = "";
  try {
    const parsed = new URL(value);
    url = ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    url = "";
  }
  if (type === "whatsapp" && !/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(url)) {
    const digits = value.replace(/\D/g, "");
    url = digits ? `https://wa.me/${digits}` : "";
  }
  return url ? { type, href: url } : null;
}

// ---------------------------------------------------------------------------
// Display helpers that need the translator.
// ---------------------------------------------------------------------------

// Roles typed in the workbook are shown as written; otherwise the profile type in the visitor's language.
export const displayRole = (profile: Profile, { t }: Translator) =>
  profile.role ||
  t(profile.profileType === "Tutor + Counselor" ? "role.both" : profile.profileType === "Counselor" ? "role.counselor" : "role.tutor");

export function formatExperience(profile: Profile, { t }: Translator) {
  // A recorded "0 yrs" reads as under a year; unknown values return "" so the line is hidden.
  if (!profile.experience && profile.experienceYears === null) return "";
  if (profile.experienceYears === 0) return t("experience.underOne");
  if (profile.experienceYears !== null) return t("experience.years", { count: profile.experienceYears });
  return profile.experience;
}

// "Dubai, UAE" for in-person tutors, "Online in UAE and Oman" for online ones, else their session modes.
export function describeLocation(profile: Profile, { t, label, formatList }: Translator) {
  const base = [label("city", profile.city), label("countryShort", profile.baseCountry)].filter(Boolean).join(t("list.separator"));
  const online = offersOnline(profile) ? servedCountries(profile).map((country) => label("countryShort", country)) : [];
  if (base && offersInPerson(profile)) return base;
  if (online.length) return t("card.onlineIn", { list: formatList(online) });
  return base || formatList(profile.sessionModes.map((mode) => label("sessionMode", mode)));
}
