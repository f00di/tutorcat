import { Link, useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { useI18n } from "@/lib/i18n";

export type SitePath =
  | "/"
  | "/tutors/"
  | "/tutors/$slug/"
  | "/counseling/"
  | "/how-it-works/"
  | "/for-tutors/"
  | "/for-counselors/"
  | "/report/"
  | "/community-guidelines/"
  | "/terms/"
  | "/privacy/"
  | "/review-policy/";

type Props = Omit<ComponentProps<"a">, "href"> & {
  to: SitePath;
  params?: { slug: string };
  search?: Record<string, string | undefined>;
  hash?: string;
};

// An internal link that keeps the visitor's language (?lang=ar), the same way shared links do.
// Inside the site it's a router link (no page reload); without a router (tests, design previews)
// it falls back to a plain link to the prerendered page.
/** A link to another Tutorcat page that keeps the current language. @category Layout */
export function SiteLink({ to, params, search, hash, ...rest }: Props) {
  const router = useRouter({ warn: false });
  const { lang } = useI18n();
  const query = Object.fromEntries(Object.entries({ ...search, lang: lang === "ar" ? "ar" : undefined }).filter(([, value]) => value !== undefined)) as Record<string, string>;
  if (router) {
    const linkProps = { ...rest, to, params, search: query, hash };
    return <Link {...(linkProps as unknown as Parameters<typeof Link>[0])} />;
  }
  const path = to.replace("$slug", params?.slug ?? "").slice(1);
  const queryString = new URLSearchParams(query).toString();
  return <a {...rest} href={`${import.meta.env?.BASE_URL ?? "/"}${path}${queryString ? `?${queryString}` : ""}${hash ? `#${hash}` : ""}`} />;
}
