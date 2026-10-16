import { Logo } from "@/components/logo";
import { SiteLink, type SitePath } from "@/components/site-link";
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
];

/** The site footer on every page: links to every page (including Report a concern), then the logo, tagline and copyright. @category Layout */
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
        {/* A year is text, not a quantity: "2026", never "2,026". */}
        <p>{t("footer.legal", { year: String(new Date().getFullYear()) })}</p>
      </div>
    </footer>
  );
}
