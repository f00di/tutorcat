// Email drafts for the TutorCat team. They stay in English with the visitor's answers exactly as typed,
// plus the site language. Select fields submit English values, so nothing here needs translating.
import { CONTACT_EMAIL, isContactEmailSet } from "../config";

export type Draft = { kind: "request" | "application" | "review" | "report"; subject: string; body: string };

const field = (data: FormData, name: string) => String(data.get(name) ?? "").trim();
const or = (value: string) => value || "Not provided";

export function requestDraft(data: FormData, specialistName: string, siteLanguage: string): Draft {
  const level = field(data, "level");
  const support = field(data, "support");
  return {
    kind: "request",
    subject: specialistName ? `TutorCat intro request: ${specialistName}` : `TutorCat request: ${support} for ${level}`,
    body: [
      `Parent/student name: ${field(data, "name")}`,
      `Email: ${field(data, "email")}`,
      `Student level: ${level}`,
      `Support type: ${support}`,
      `Specialist: ${specialistName || "No preference"}`,
      `Site language: ${siteLanguage}`,
      "",
      "Message:",
      or(field(data, "message")),
    ].join("\n"),
  };
}

// Services a counselor can list on /for-counselors (English values for the team; labels are translated).
export const COUNSELOR_SERVICES = [
  "Choosing a country and university",
  "Applications and personal statements",
  "Test planning",
  "Scholarships",
  "Pre-departure help",
] as const;

export function applicationDraft(data: FormData, siteLanguage: string): Draft {
  const name = field(data, "fullName");
  const place = field(data, "place");
  const services = data.getAll("services").map(String);
  const commission = field(data, "commission");
  return {
    kind: "application",
    subject: `TutorCat Tutor/Counselor Application — ${name}`,
    body: [
      `Applicant wants to be listed as: ${field(data, "applicantType")}`,
      "",
      `Full name: ${name}`,
      `Email: ${field(data, "email")}`,
      `Phone or WhatsApp: ${or(field(data, "phone"))}`,
      `Country: ${or(field(data, "country"))}`,
      `City: ${or(field(data, "city"))}`,
      ...(place ? [`Location details: ${place}`] : []),
      `Subjects I can teach: ${or(field(data, "subjects"))}`,
      `Countries I can advise on: ${or(field(data, "countries"))}`,
      // Only the /for-counselors form has these, so the home form's draft is unchanged.
      ...(services.length ? [`Services offered: ${services.join(", ")}`] : []),
      ...(commission ? [`Commissions from universities or agents: ${commission === "Yes" ? `Yes. ${field(data, "commissionDetails")}` : "No"}`] : []),
      `Languages spoken: ${or(field(data, "languages"))}`,
      `Education/experience: ${or(field(data, "experience"))}`,
      `Years of experience: ${or(field(data, "years"))}`,
      `Session mode: ${or(field(data, "sessionMode"))}`,
      `Availability: ${or(field(data, "availability"))}`,
      "",
      "Short bio:",
      or(field(data, "bio")),
      "",
      `Profile picture URL: ${or(field(data, "photoUrl"))}`,
      `LinkedIn/portfolio/profile link: ${or(field(data, "profileLink"))}`,
      `Photo display consent: ${data.get("photoConsent") ? "Yes" : "No"}`,
      `Submitted date: ${new Date().toISOString()}`,
      `Site language: ${siteLanguage}`,
      "",
      "Note: TutorCat should review this application before adding any public profile.",
    ].join("\n"),
  };
}

export function reviewDraft(data: FormData, profile: { id: string; name: string }, siteLanguage: string): Draft {
  return {
    kind: "review",
    subject: `TutorCat Review Verification Needed — ${profile.name}`,
    body: [
      `Student/parent name: ${field(data, "studentName")}`,
      `Student/parent email: ${field(data, "studentEmail")}`,
      `Tutor/counselor name: ${profile.name}`,
      `Tutor/counselor profile ID: ${profile.id}`,
      `Rating: ${field(data, "rating")}`,
      `Session type: ${field(data, "sessionType")}`,
      "",
      "Review text:",
      field(data, "comment"),
      "",
      `Public display permission: ${data.get("publicPermission") ? "Yes" : "No"}`,
      `Date submitted: ${new Date().toISOString()}`,
      `Site language: ${siteLanguage}`,
      "",
      "Note: This review should not be published or added to the tutor's rating until the tutor verifies the session and TutorCat approves the review.",
    ].join("\n"),
  };
}

// Report a concern (/report/). Keys name the translated labels; the values are what the team reads.
export const REPORT_CATEGORIES = {
  conduct: "Unprofessional conduct",
  contact: "Inappropriate messages or contact",
  childSafety: "A concern about a child's safety",
  harassment: "Harassment or discrimination",
  credentials: "False credentials or misrepresentation",
  review: "Fake or abusive review",
  scam: "Scam or spam",
  other: "Other",
} as const;

export const REPORT_CONTACT_TYPES = { online: "Online", inPerson: "In person", messages: "Messages" } as const;

// The "about" field's value for someone who isn't on Tutorcat (profile ids are slugs, so it can't clash).
export const NOT_LISTED = "not-listed";

// Easy to read aloud or retype: no 0/O, 1/I/L.
const REFERENCE_CHARACTERS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** A reference for the subject line, e.g. TCR-261015-7KQ4 (date in UTC, then 4 random characters). */
export function reportReference(now = new Date(), random = (count: number) => crypto.getRandomValues(new Uint32Array(count))) {
  const day = now.toISOString().slice(2, 10).replace(/-/g, "");
  const code = Array.from(random(4), (value) => REFERENCE_CHARACTERS[value % REFERENCE_CHARACTERS.length]).join("");
  return `TCR-${day}-${code}`;
}

export type ReportDraft = Draft & { reference: string };

// Child-safety reports start with "URGENT:" so they stand out in the inbox. Blank reporter fields
// mean the reporter chose not to give them, so the team knows not to expect a follow-up.
export function reportDraft(data: FormData, profile: { id: string; name: string } | null, siteLanguage: string, reference = reportReference()): ReportDraft {
  const category = field(data, "category");
  const urgent = category === REPORT_CATEGORIES.childSafety;
  const about = field(data, "about");
  const name = field(data, "reporterName");
  const contact = field(data, "reporterContact");
  return {
    kind: "report",
    reference,
    subject: `${urgent ? "URGENT: " : ""}TutorCat concern report ${reference} — ${category}`,
    body: [
      `Reference: ${reference}`,
      `Category: ${category}`,
      `About: ${profile ? `${profile.name} (profile ID: ${profile.id})` : about === NOT_LISTED ? `Someone not listed — ${or(field(data, "aboutDetails"))}` : "No specific profile"}`,
      `Date it happened: ${or(field(data, "date"))}`,
      `How it happened: ${or(field(data, "contactType"))}`,
      `Reporter name: ${name || "Not provided"}`,
      `Reporter contact: ${contact || "Not provided"}`,
      ...(name || contact ? [] : ["Anonymous: the reporter left their details blank, so no follow-up was asked for."]),
      `Reporter confirmed it is true to the best of their knowledge: ${data.get("consent") ? "Yes" : "No"}`,
      `Date submitted: ${new Date().toISOString()}`,
      `Site language: ${siteLanguage}`,
      "",
      "What happened:",
      field(data, "description"),
      "",
      "Screenshots: attach any to this email before sending.",
      "",
      "Note: Reports are never published. Don't tell the person reported who made the report.",
    ].join("\n"),
  };
}

// No recipient until CONTACT_EMAIL is a real address, so nothing is ever sent to a placeholder.
export const mailtoHref = ({ subject, body }: Draft) =>
  `mailto:${isContactEmailSet() ? CONTACT_EMAIL : ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const draftText = ({ subject, body }: Draft) => `Subject: ${subject}\n\n${body}`;
