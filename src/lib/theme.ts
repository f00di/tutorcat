// Light/dark theme: follows the system setting until the visitor picks one with the header toggle.
import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "tutorcat.theme";

const stored = (): Theme | null => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

const apply = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
};

export function useTheme() {
  // The prerendered page assumes light; the boot script has already applied the real theme.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = (event: MediaQueryListEvent) => {
      if (stored()) return;
      const next = event.matches ? "dark" : "light";
      apply(next);
      setTheme(next);
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      apply(next);
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Storage blocked: the choice lasts for this visit only.
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}

// Runs in <head> before first paint, so there is no flash of the wrong theme or direction.
// Theme: saved choice, else the system setting. Language: ?lang=ar or a remembered Arabic choice
// sets lang/dir and hides the page until the Arabic text is in (1.5 s safety net).
export const BOOT_SCRIPT = `(function(){var d=document.documentElement,t,l;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(t==="dark")d.classList.add("dark");d.style.colorScheme=t;l=new URLSearchParams(location.search).get("lang");try{l=l||localStorage.getItem("tutorcat.lang")}catch(e){}if(l==="ar"){d.lang="ar";d.dir="rtl";d.classList.add("i18n-pending");setTimeout(function(){d.classList.remove("i18n-pending")},1500)}})();`;
