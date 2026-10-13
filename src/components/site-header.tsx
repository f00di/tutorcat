import { ArrowUpRight, Bookmark, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { isLang, useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

type Props = { savedCount: number; onShortlist: () => void; onJoin: () => void };

/** The site header: logo, main nav, Shortlist with a saved count, Join as a specialist, the عربي/English and light/dark toggles; collapses to a menu on phones. @category Layout */
export function SiteHeader({ savedCount, onShortlist, onJoin }: Props) {
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
        <a href="#" aria-label={t("nav.home")}>
          <Logo className="logo" />
        </a>
        <nav id="main-nav" aria-label={t("nav.main")} className={`main-nav ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(false)}>
          <a href="#specialists">{t("nav.specialists")}</a>
          <a href="#counseling">{t("nav.counseling")}</a>
          <a href="#how-it-works">{t("nav.howItWorks")}</a>
          {menuOpen && (
            <Button variant="link" className="px-0" onClick={onJoin}>
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
