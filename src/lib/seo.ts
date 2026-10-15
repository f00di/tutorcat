// Per-page head tags. Pages are prerendered in English, so crawlers and link previews (WhatsApp,
// Facebook) read English; usePageMeta switches the title and descriptions to the visitor's language.
import { useEffect } from "react";

import { SITE_URL } from "../config";
import { createTranslator, type Translator } from "./i18n";
import { displayRole, profiles, type Profile } from "./profiles";

const en = createTranslator("en");

// "/tutors/" -> "https://…/tutorcat/tutors/"
export const pageUrl = (path: string) => new URL(path.replace(/^\//, ""), SITE_URL).href;

export type PageMeta = { title: string; description: string; ogTitle?: string; ogDescription?: string };

export function pageHead(path: string, { title, description, ogTitle, ogDescription }: PageMeta, { noindex = false } = {}) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: ogTitle ?? title },
      { property: "og:description", content: ogDescription ?? description },
      { property: "og:url", content: pageUrl(path) },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: pageUrl(path) }],
  };
}

// Title and description from page.<name>.title / page.<name>.description.
export const pageMeta = ({ t }: Pick<Translator, "t">, name: string): PageMeta => ({
  title: t("meta.pageTitle", { page: t(`page.${name}.title`) }),
  description: t(`page.${name}.description`),
});

export const staticPageHead = (path: string, name: string, options?: { noindex?: boolean }) => pageHead(path, pageMeta(en, name), options);

// A short description that ends on a whole word.
const clip = (text: string, max = 160) => (text.length <= max ? text : `${text.slice(0, text.lastIndexOf(" ", max - 1))}…`);

// Profile pages: the person's own bio when it's long enough, otherwise one built from their data.
export function profileMeta(profile: Profile, translator: Translator): PageMeta {
  const { t, label, formatList, lang } = translator;
  const role = displayRole(profile, translator);
  const bio = lang === "ar" && profile.shortBioAr ? profile.shortBioAr : profile.shortBio;
  const topics = formatList([...profile.subjects.map((item) => label("subject", item)), ...profile.countries.map((item) => label("destination", item))]);
  return {
    title: t("meta.pageTitle", { page: `${profile.name} · ${role}` }),
    description: bio.length >= 40 ? clip(bio) : t(topics ? "page.profile.description" : "page.profile.descriptionShort", { name: profile.name, role, topics }),
  };
}

// The not-found page's tags: used by the /404/ route (prerendered to 404.html) and by the root
// route when the browser shows that page at an unknown URL, so both render the same <head>.
export const notFoundHead = () => pageHead("/404/", { title: en.t("meta.pageTitle", { page: en.t("notFound.title") }), description: en.t("notFound.body") }, { noindex: true });

export function profileHead(id: string) {
  const profile = profiles.find((item) => item.id === id);
  return profile ? pageHead(`/tutors/${profile.id}/`, profileMeta(profile, en)) : {};
}

// Keeps the tab title and share text in the visitor's language (crawlers still get the English prerender).
export function usePageMeta({ title, description, ogTitle, ogDescription }: PageMeta) {
  useEffect(() => {
    document.title = title;
    const set = (selector: string, text: string) => document.querySelector(selector)?.setAttribute("content", text);
    set('meta[name="description"]', description);
    set('meta[property="og:title"]', ogTitle ?? title);
    set('meta[property="og:description"]', ogDescription ?? description);
  }, [title, description, ogTitle, ogDescription]);
}
