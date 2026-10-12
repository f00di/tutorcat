// TutorCat translations: no build step, no dependencies. Any page can load this before its own script.
// Strings live in i18n/<lang>.json as flat keys ("hero.title"). A plural string is an object keyed by
// Intl.PluralRules categories: { "one": "...", "other": "..." } (Arabic also uses zero/two/few/many).
// Markup: data-i18n="key" (text), data-i18n-html="key" (our own strings; only <em>/<strong> kept),
// data-i18n-attr="placeholder:key;aria-label:key".
(() => {
  const LANGS = {
    en: { locale: "en-GB", dir: "ltr", name: "English" },
    // UAE convention: Western digits (0-9) in Arabic text.
    ar: { locale: "ar-AE-u-nu-latn", dir: "rtl", name: "Arabic" },
  };
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "tutorcat.lang";
  const BASE_URL = new URL("i18n/", document.currentScript?.src || window.location.href);

  const catalogs = {};
  const listeners = new Set();
  let lang = DEFAULT_LANG;
  let regions = { countries: [], curricula: [] };

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]);

  const slug = (value) =>
    String(value ?? "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const locale = () => LANGS[lang].locale;

  const formatNumber = (value, options) => new Intl.NumberFormat(locale(), options).format(value);
  const formatRating = (value) => formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  // "a, b and c" in the current language.
  const formatList = (items) => new Intl.ListFormat(locale(), { type: "conjunction" }).format(items.map(String));
  const formatDate = (value, options = { year: "numeric", month: "short", day: "numeric" }) => {
    const date = new Date(value);
    return value && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat(locale(), options).format(date) : String(value ?? "");
  };

  const lookup = (key) => catalogs[lang]?.[key] ?? catalogs[DEFAULT_LANG]?.[key];

  // t("catalog.shown", { count: 3 }) -> "3 specialists shown." Numbers are formatted for the locale.
  const t = (key, params = {}) => {
    let value = lookup(key);
    if (value && typeof value === "object") {
      const category = new Intl.PluralRules(locale()).select(Number(params.count) || 0);
      value = value[category] ?? value.other;
    }
    if (typeof value !== "string") return key;
    // In right-to-left text, names and lists are isolated so Latin words and punctuation keep their order.
    const isolate = LANGS[lang].dir === "rtl";
    return value.replace(/\{(\w+)\}/g, (match, name) => {
      if (!(name in params)) return match;
      if (typeof params[name] === "number") return formatNumber(params[name]);
      return isolate ? `\u2068${params[name]}\u2069` : String(params[name]);
    });
  };

  const findCountry = (name) => regions.countries.find((country) => country.name === name);

  // Data values stay as stored in tutors.json; this only changes what is shown.
  // Gulf countries, cities and curricula are named in data/regions.json, everything else in value.<kind>.<slug>.
  const label = (kind, value) => {
    if (!value) return "";
    const ar = lang === "ar";
    if (kind === "country" || kind === "countryShort") {
      const country = findCountry(value);
      if (country) return kind === "countryShort" ? (ar ? country.shortAr : country.short) || country.name : (ar && country.ar) || country.name;
    }
    if (kind === "city") {
      const city = regions.countries.flatMap((country) => country.cities ?? []).find((item) => item.name === value);
      if (city) return (ar && city.ar) || city.name;
    }
    if (kind === "curriculum") {
      const all = [...regions.curricula, ...regions.countries.flatMap((country) => country.nationalCurricula ?? [])];
      const curriculum = all.find((item) => item.name === value);
      if (curriculum) return (ar && curriculum.ar) || curriculum.name;
    }
    if (kind === "permit") {
      const country = findCountry(value);
      return (ar && country?.permitNameAr) || country?.permitName || "";
    }
    const text = lookup(`value.${kind}.${slug(value)}`);
    return typeof text === "string" ? text : String(value);
  };

  // Keep only <em> and <strong> from our own translation strings.
  const safeHtml = (text) => escapeHtml(text).replace(/&lt;(\/?)(em|strong)&gt;/g, "<$1$2>");

  const apply = (root = document) => {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-html]").forEach((element) => {
      element.innerHTML = safeHtml(t(element.dataset.i18nHtml));
    });
    root.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      for (const pair of element.dataset.i18nAttr.split(";")) {
        const [attribute, key] = pair.split(":").map((part) => part.trim());
        if (attribute && key) element.setAttribute(attribute, t(key));
      }
    });
  };

  const load = async (code) => {
    if (!catalogs[code]) {
      const response = await fetch(new URL(`${code}.json`, BASE_URL), { cache: "no-cache" });
      if (!response.ok) throw new Error(`Could not load i18n/${code}.json (HTTP ${response.status})`);
      catalogs[code] = await response.json();
    }
    return catalogs[code];
  };

  const readStored = () => {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  // Remember the visitor's choice and keep ?lang in the address bar so a copied link opens in that language.
  const store = (code) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch (error) {
      // Private mode or blocked storage: the choice just isn't remembered.
    }
    const url = new URL(window.location.href);
    if (code === DEFAULT_LANG) url.searchParams.delete("lang");
    else url.searchParams.set("lang", code);
    window.history.replaceState(window.history.state, "", url);
  };

  // ?lang=ar wins, then the remembered choice, then English.
  const detect = () => {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (LANGS[fromUrl]) return fromUrl;
    const stored = readStored();
    return LANGS[stored] ? stored : DEFAULT_LANG;
  };

  const setLocale = async (code, { remember = false } = {}) => {
    const next = LANGS[code] ? code : DEFAULT_LANG;
    await load(DEFAULT_LANG);
    try {
      await load(next);
      lang = next;
    } catch (error) {
      lang = DEFAULT_LANG;
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGS[lang].dir;
    apply(document);
    document.documentElement.classList.remove("i18n-pending");
    if (remember) store(lang);
    listeners.forEach((listener) => listener(lang));
    return lang;
  };

  window.TutorCatI18n = {
    t,
    label,
    apply,
    formatNumber,
    formatRating,
    formatList,
    formatDate,
    setLocale,
    getLang: () => lang,
    getLangName: () => LANGS[lang].name,
    setRegions: (data) => {
      regions = { countries: data?.countries ?? [], curricula: data?.curricula ?? [] };
    },
    onChange: (listener) => listeners.add(listener),
    ready: setLocale(detect()).catch(() => DEFAULT_LANG),
  };
})();
