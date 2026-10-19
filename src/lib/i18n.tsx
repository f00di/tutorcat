// Translations: same rules as the old i18n.js. Strings live in i18n/<lang>.json as flat keys;
// a plural string is an object keyed by Intl.PluralRules categories ({ one, other }, Arabic also
// zero/two/few/many). label(kind, value) shows data values (which stay English in tutors.json)
// in the current language. Never pass tutor- or reviewer-written text through here.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import en from "../../i18n/en.json";
import arUrl from "../../i18n/ar.json?url";
import regionsData from "../../data/regions.json";

export type Lang = "en" | "ar";
type Catalog = Record<string, string | Record<string, string> | unknown>;
type Params = Record<string, string | number>;

export const LANGS = {
  en: { locale: "en-GB", dir: "ltr", name: "English" },
  // UAE convention: Western digits (0-9) in Arabic text.
  ar: { locale: "ar-AE-u-nu-latn", dir: "rtl", name: "Arabic" },
} as const;
export const DEFAULT_LANG: Lang = "en";
export const LANG_STORAGE_KEY = "tutorcat.lang";

export type Region = (typeof regionsData.countries)[number];
export type Curriculum = { name: string; ar: string; aliases?: string[] };
export const regions = regionsData;
export const allKnownCurricula: Curriculum[] = [
  ...regionsData.curricula,
  ...regionsData.countries.flatMap((country) => (country.nationalCurricula ?? []) as Curriculum[]),
];

// label() lookups, built once. The first entry with a name wins, as with Array.find.
const byName = <T extends { name: string }>(items: T[]) => {
  const map = new Map<string, T>();
  for (const item of items) if (!map.has(item.name)) map.set(item.name, item);
  return map;
};
const countriesByName = byName(regionsData.countries);
const citiesByName = byName(regionsData.countries.flatMap((country) => country.cities));
const curriculaByName = byName(allKnownCurricula);

// English is bundled. Other languages are plain JSON files fetched when needed; on an Arabic visit
// the boot script (src/lib/theme.ts) starts that download before the app's code, and this fetch
// picks it up instead of waiting for the app to start.
export const CATALOG_URLS = { ar: arUrl } satisfies Partial<Record<Lang, string>>;
const catalogUrls: Partial<Record<Lang, string>> = CATALOG_URLS;
const catalogs: Partial<Record<Lang, Catalog>> = { en };
const loading: Partial<Record<Lang, Promise<Catalog>>> = {};
export const loadCatalog = async (lang: Lang): Promise<Catalog> => {
  const loaded = catalogs[lang];
  if (loaded) return loaded;
  const pending =
    loading[lang] ??
    fetch(catalogUrls[lang] ?? "").then((response) => {
      if (!response.ok) throw new Error(`${response.status} ${response.url}`);
      return response.json() as Promise<Catalog>;
    });
  loading[lang] = pending;
  try {
    return (catalogs[lang] = await pending);
  } finally {
    // Done or failed: a failed download is tried again on the next switch.
    delete loading[lang];
  }
};

export const slug = (value: string) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const isLang = (value: unknown): value is Lang => value === "en" || value === "ar";

export function createTranslator(lang: Lang, catalog: Catalog = catalogs[lang] ?? en) {
  const { locale, dir, name } = LANGS[lang];
  const lookup = (key: string) => catalog[key] ?? (en as Catalog)[key];
  // Intl formatters are slow to create, so each translator makes its own once.
  const plurals = new Intl.PluralRules(locale);
  const numbers = new Intl.NumberFormat(locale);
  const ratings = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const lists = new Intl.ListFormat(locale, { type: "conjunction" });
  const dates = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" });
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => (options ? new Intl.NumberFormat(locale, options) : numbers).format(value);

  const t = (key: string, params: Params = {}) => {
    let value = lookup(key);
    if (value && typeof value === "object") {
      const forms = value as Record<string, string>;
      value = forms[plurals.select(Number(params["count"]) || 0)] ?? forms["other"];
    }
    if (typeof value !== "string") return key;
    // In right-to-left text, names and lists are isolated so Latin words and punctuation keep their order.
    return value.replace(/\{(\w+)\}/g, (match, param: string) => {
      const replacement = params[param];
      if (replacement === undefined) return match;
      if (typeof replacement === "number") return formatNumber(replacement);
      return dir === "rtl" ? `⁨${replacement}⁩` : replacement;
    });
  };

  const label = (kind: string, value: string | undefined | null): string => {
    if (!value) return "";
    const ar = lang === "ar";
    const country = countriesByName.get(value);
    if ((kind === "country" || kind === "countryShort") && country) {
      return kind === "countryShort" ? (ar ? country.shortAr : country.short) || country.name : (ar && country.ar) || country.name;
    }
    if (kind === "city") {
      const city = citiesByName.get(value);
      if (city) return (ar && city.ar) || city.name;
    }
    if (kind === "curriculum") {
      const curriculum = curriculaByName.get(value);
      if (curriculum) return (ar && curriculum.ar) || curriculum.name;
    }
    if (kind === "permit") {
      const permitCountry = country as (Region & { permitNameAr?: string }) | undefined;
      return (ar && permitCountry?.permitNameAr) || permitCountry?.permitName || "";
    }
    const text = lookup(`value.${kind}.${slug(value)}`);
    return typeof text === "string" ? text : String(value);
  };

  return {
    lang,
    dir,
    locale,
    langName: name,
    t,
    label,
    formatNumber,
    formatRating: (value: number) => ratings.format(value),
    // "a, b and c" in the current language.
    formatList: (items: string[]) => lists.format(items),
    formatDate: (value: string) => {
      const date = new Date(value);
      return value && !Number.isNaN(date.getTime()) ? dates.format(date) : value;
    },
  };
}

export type Translator = ReturnType<typeof createTranslator>;

// ?lang=ar wins, then the remembered choice, then English. Mirrors the inline script in __root.tsx.
export function detectLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (isLang(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    // Storage blocked: fall back to English.
  }
  return DEFAULT_LANG;
}

// Sets <html lang/dir> and keeps ?lang in the address bar so a copied link opens in that language.
export function applyDocumentLang(lang: Lang, { remember = false } = {}) {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = LANGS[lang].dir;
  root.classList.remove("i18n-pending");
  if (!remember) return;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Private mode or blocked storage: the choice just isn't remembered.
  }
  const url = new URL(window.location.href);
  if (lang === DEFAULT_LANG) url.searchParams.delete("lang");
  else url.searchParams.set("lang", lang);
  window.history.replaceState(window.history.state, "", url);
}

type I18nValue = Translator & { setLang: (lang: Lang) => void };
const I18nContext = createContext<I18nValue | null>(null);

// The page is prerendered in English; the visitor's language is applied right after hydration.
// Arabic visitors don't see the English flash: the head script shows the loading screen until then.
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [catalog, setCatalog] = useState<Catalog>(en);

  const switchTo = useCallback(async (next: Lang, remember: boolean) => {
    // A slow switch shows the loading screen; a quick one never flashes it.
    const buffering = window.setTimeout(() => document.documentElement.classList.add("is-buffering"), 150);
    try {
      setCatalog(await loadCatalog(next));
      setLangState(next);
      applyDocumentLang(next, { remember });
    } catch {
      setCatalog(en);
      setLangState(DEFAULT_LANG);
      applyDocumentLang(DEFAULT_LANG);
    } finally {
      window.clearTimeout(buffering);
      document.documentElement.classList.remove("is-buffering");
    }
  }, []);

  useEffect(() => {
    void switchTo(detectLang(), false);
  }, [switchTo]);

  const value = useMemo<I18nValue>(
    () => ({ ...createTranslator(lang, catalog), setLang: (next) => void switchTo(next, true) }),
    [lang, catalog, switchTo]
  );

  // Each page keeps its own title and meta tags in the current language: usePageMeta (src/lib/seo.ts).
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
