import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const catalog = (lang) => JSON.parse(read(`i18n/${lang}.json`));
const LANGS = ["en", "ar"].filter((lang) => existsSync(new URL(`i18n/${lang}.json`, root)));
// Plural categories each language must spell out (Intl.PluralRules).
const PLURALS = { en: ["one", "other"], ar: ["zero", "one", "two", "few", "many", "other"] };

const en = catalog("en");
const keys = (strings) => Object.keys(strings).filter((key) => !key.startsWith("_"));
const params = (value) =>
  [...new Set(Object.values(typeof value === "object" ? value : { value }).flatMap((text) => text.match(/\{\w+\}/g) ?? []))].sort();

for (const lang of LANGS) {
  test(`i18n/${lang}.json: no empty strings, complete plurals`, () => {
    const strings = catalog(lang);
    for (const key of keys(strings)) {
      const value = strings[key];
      if (typeof value === "object") {
        for (const category of PLURALS[lang]) {
          assert.ok(value[category]?.trim(), `${key} is missing the "${category}" plural form`);
        }
      } else {
        assert.ok(typeof value === "string" && value.trim(), `${key} is empty`);
      }
    }
  });
}

if (LANGS.includes("ar")) {
  test("en.json and ar.json have the same keys and the same {params}", () => {
    const ar = catalog("ar");
    assert.deepEqual(keys(ar).sort(), keys(en).sort());
    for (const key of keys(en)) assert.deepEqual(params(ar[key]), params(en[key]), `{params} differ for ${key}`);
  });
}

// The React source: every key it uses exists, and no visible English is hard-coded in JSX.
const sourceFiles = readdirSync(new URL("src/", root), { recursive: true })
  .filter((file) => /\.(ts|tsx)$/.test(file) && !/\.test\.|routeTree\.gen|components\/ui\//.test(file))
  .map((file) => [file, read(`src/${file}`)]);
const NAMESPACES = [...new Set(Object.keys(en).map((key) => key.split(".")[0]))].join("|");
const KEY_LITERAL = new RegExp(`["'\`]((?:${NAMESPACES})\\.[A-Za-z0-9.-]*)(\\$\\{)?`, "g");

test("every translation key used in src/ exists in en.json", () => {
  let checked = 0;
  for (const [file, code] of sourceFiles) {
    for (const [, key, dynamic] of code.matchAll(KEY_LITERAL)) {
      checked += 1;
      if (dynamic) assert.ok(Object.keys(en).some((known) => known.startsWith(key)), `${file}: no keys start with "${key}"`);
      else assert.ok(key in en, `${file} uses missing key "${key}"`);
    }
  }
  assert.ok(checked > 100);
});

test("no hard-coded English text or attributes in the JSX", () => {
  const allowed = new Set(["Tutorcat", "https://..."]);
  for (const [file, code] of sourceFiles.filter(([file]) => file.endsWith(".tsx"))) {
    for (const [, text] of code.matchAll(/>\s*([^<>{}=;()]*[A-Za-z]{3,}[^<>{}=;()]*?)\s*<\//g)) {
      assert.fail(`${file}: hard-coded text "${text.trim()}"`);
    }
    for (const [, attribute, value] of code.matchAll(/\b(aria-label|placeholder|alt|title)="([^"]*)"/g)) {
      if (/[A-Za-z]{3,}/.test(value) && !allowed.has(value)) assert.fail(`${file}: hard-coded ${attribute}="${value}"`);
    }
  }
});
