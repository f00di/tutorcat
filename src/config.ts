// The inbox that introduction requests, tutor applications and reviews go to.
// If it is ever emptied (or set to an example.com placeholder), forms fall back to a draft
// the visitor can copy or open in their email app without a recipient.
export const CONTACT_EMAIL = "tutorcatsupport@gmail.com";

export const SITE_URL = "https://f00di.github.io/tutorcat/";

// Legal pages stay a marked draft (Draft note, noindex, left out of the sitemap) until set to
// "final" after legal review. scripts/public-pages.mjs reads this object as text, so keep each entry
// as `name: "draft"` or `name: "final"`.
export const LEGAL_STATUS: Record<"privacy", "draft" | "final"> = { privacy: "draft" };

export const isContactEmailSet = () =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL) && !/@example\.(com|org|net)$/i.test(CONTACT_EMAIL);
