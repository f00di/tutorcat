// The inbox that introduction requests, tutor applications and reviews go to.
// If it is ever emptied (or set to an example.com placeholder), forms fall back to a draft
// the visitor can copy or open in their email app without a recipient.
export const CONTACT_EMAIL = "tutorcatsupport@gmail.com";

export const SITE_URL = "https://f00di.github.io/tutorcat/";

export const isContactEmailSet = () =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL) && !/@example\.(com|org|net)$/i.test(CONTACT_EMAIL);
