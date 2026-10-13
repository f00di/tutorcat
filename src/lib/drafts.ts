// Email drafts for the TutorCat team. They stay in English with the visitor's answers exactly as typed,
// plus the site language. Select fields submit English values, so nothing here needs translating.
import { CONTACT_EMAIL, isContactEmailSet } from "../config";

export type Draft = { kind: "request" | "application" | "review"; subject: string; body: string };

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

export function applicationDraft(data: FormData, siteLanguage: string): Draft {
  const name = field(data, "fullName");
  const place = field(data, "place");
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

// No recipient until CONTACT_EMAIL is a real address, so nothing is ever sent to a placeholder.
export const mailtoHref = ({ subject, body }: Draft) =>
  `mailto:${isContactEmailSet() ? CONTACT_EMAIL : ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const draftText = ({ subject, body }: Draft) => `Subject: ${subject}\n\n${body}`;
