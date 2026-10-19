import { Logo } from "@/components/logo";
import { SiteLink, type SitePath } from "@/components/site-link";
import { CONTACT_EMAIL, isContactEmailSet } from "@/config";
import { useI18n } from "@/lib/i18n";

const LINKS: { to: SitePath; label: string }[] = [
  { to: "/tutors/", label: "footer.tutors" },
  { to: "/counseling/", label: "footer.counseling" },
  { to: "/how-it-works/", label: "footer.howItWorks" },
  { to: "/for-tutors/", label: "nav.forTutors" },
  { to: "/for-counselors/", label: "nav.forCounselors" },
  { to: "/community-guidelines/", label: "footer.guidelines" },
  { to: "/report/", label: "footer.report" },
  { to: "/review-policy/", label: "footer.reviewPolicy" },
  { to: "/terms/", label: "footer.terms" },
  { to: "/privacy/", label: "footer.privacy" },
];

/** The site footer on every page: links to every page (including Report a concern and the privacy policy), then the logo, tagline, the team's email and copyright. @category Layout */
export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer>
      <nav className="shell footer-links" aria-label={t("footer.linksLabel")}>
        <ul>
          {LINKS.map((link) => (
            <li key={link.to}>
              <SiteLink to={link.to}>{t(link.label)}</SiteLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="shell footer-inner">
        <Logo className="logo footer-logo" label="Tutorcat" />
        <p>{t("footer.tagline")}</p>
        {/* The team inbox (CONTACT_EMAIL), left-to-right even on Arabic pages; hidden if it's ever unset. */}
        {isContactEmailSet() && (
          <p className="footer-email">
            {t("footer.email")}{" "}
            <bdi dir="ltr">
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </bdi>
          </p>
        )}
        {/* A year is text, not a quantity: "2026", never "2,026". */}
        <p>{t("footer.legal", { year: String(new Date().getFullYear()) })}</p>
      </div>
    </footer>
  );
}
