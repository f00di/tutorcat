import { ArrowUpRight, Bookmark, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/logo";
import { SiteLink } from "@/components/site-link";
import { Button } from "@/components/ui/button";
import { isLang, useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export type NavPage = "tutors" | "counseling" | "howItWorks" | "other";
type Props = { savedCount: number; onShortlist: () => void; onJoin: () => void; page?: NavPage };

// "Join" in the nav: For tutors / For counselors. A small dropdown on wider screens; inside the
// phone menu the two links are listed directly.
function JoinMenu({ inline }: { inline: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  if (inline) {
    return (
      <>
        <SiteLink to="/for-tutors/">{t("nav.forTutors")}</SiteLink>
        <SiteLink to="/for-counselors/">{t("nav.forCounselors")}</SiteLink>
      </>
    );
  }
  return (
    <div className="nav-menu" ref={menu}>
      <button ref={button} type="button" className="nav-menu-button" aria-expanded={open} aria-controls="join-menu" onClick={() => setOpen(!open)}>
        {t("nav.joinMenu")} <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <ul id="join-menu" className="nav-menu-list">
          <li>
            <SiteLink to="/for-tutors/" onClick={() => setOpen(false)}>
              {t("nav.forTutors")}
            </SiteLink>
          </li>
          <li>
            <SiteLink to="/for-counselors/" onClick={() => setOpen(false)}>
              {t("nav.forCounselors")}
            </SiteLink>
          </li>
        </ul>
      )}
    </div>
  );
}

/** The site header: logo, main nav (with the Join menu), Shortlist with a saved count, Join as a specialist, the عربي/English and light/dark toggles; collapses to a menu on phones. On the home page the nav scrolls to its sections; on other pages (`page`) it links to their own pages. @category Layout */
export function SiteHeader({ savedCount, onShortlist, onJoin, page }: Props) {
  const { t, formatNumber, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const switchTo = t("lang.switchToCode");

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        {t("nav.skip")}
      </a>
      <div className="shell header-inner">
        {page ? (
          <SiteLink to="/" aria-label={t("nav.home")}>
            <Logo className="logo" />
          </SiteLink>
        ) : (
          <a href="#" aria-label={t("nav.home")}>
            <Logo className="logo" />
          </a>
        )}
        <nav id="main-nav" aria-label={t("nav.main")} className={`main-nav ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(false)}>
          {page ? (
            <>
              <SiteLink to="/tutors/" aria-current={page === "tutors" ? "page" : undefined}>
                {t("nav.specialists")}
              </SiteLink>
              <SiteLink to="/counseling/" aria-current={page === "counseling" ? "page" : undefined}>
                {t("nav.counseling")}
              </SiteLink>
              <SiteLink to="/how-it-works/" aria-current={page === "howItWorks" ? "page" : undefined}>
                {t("nav.howItWorks")}
              </SiteLink>
            </>
          ) : (
            <>
              <a href="#specialists">{t("nav.specialists")}</a>
              <a href="#counseling">{t("nav.counseling")}</a>
              <a href="#how-it-works">{t("nav.howItWorks")}</a>
            </>
          )}
          <JoinMenu inline={menuOpen} />
          {menuOpen && (
            <Button variant="link" size="inline" onClick={onJoin}>
              {t("nav.join")} <ArrowUpRight className="dir-icon" />
            </Button>
          )}
        </nav>
        <div className="header-actions">
          <Button variant="ghost" aria-label={t("nav.shortlistLabel", { count: savedCount })} onClick={onShortlist}>
            <Bookmark />
            <span className="shortlist-label">{t("nav.shortlist")}</span>
            {savedCount > 0 && <span aria-hidden="true">{formatNumber(savedCount)}</span>}
          </Button>
          <Button variant="outline" className="join-button" onClick={onJoin}>
            {t("nav.join")} <ArrowUpRight className="dir-icon" />
          </Button>
          <Button variant="ghost" className="lang-toggle" lang={switchTo} onClick={() => isLang(switchTo) && setLang(switchTo)}>
            {t("lang.switchTo")}
          </Button>
          <Button variant="ghost" size="icon" aria-label={t(theme === "dark" ? "theme.toLight" : "theme.toDark")} onClick={toggle}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label={t(menuOpen ? "nav.closeMenu" : "nav.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
}
