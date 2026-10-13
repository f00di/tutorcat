// The inbox that introduction requests, tutor applications and reviews go to.
// Leave it empty until a real address exists: while it is empty (or an example.com placeholder),
// forms only prepare a draft the visitor can copy or open in their email app without a recipient.
export const CONTACT_EMAIL = "";

export const SITE_URL = "https://f00di.github.io/tutorcat/";

export const isContactEmailSet = () =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL) && !/@example\.(com|org|net)$/i.test(CONTACT_EMAIL);
