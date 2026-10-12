import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

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

test("every key used in index.html exists in en.json", () => {
  const html = read("index.html");
  const used = [
    ...[...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map((match) => match[1]),
    ...[...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((match) =>
      match[1].split(";").map((pair) => pair.split(":")[1]?.trim())
    ),
  ];
  assert.ok(used.length > 50);
  for (const key of used) assert.ok(key in en, `index.html uses missing key "${key}"`);
});

test('every t("…") key in script.js exists in en.json', () => {
  const script = read("script.js");
  const used = [...script.matchAll(/\bt\(\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(used.length > 50);
  for (const key of used) assert.ok(key in en, `script.js uses missing key "${key}"`);
});

// Heuristic: after removing translated elements, scripts and tags, no English words should be left in index.html.
test("index.html has no visible English text outside data-i18n", () => {
  const html = read("index.html")
    .replace(/<head>[\s\S]*?<\/head>/, "")
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, "")
    .replace(/<(\w+)\b[^>]*\sdata-i18n(?:-html)?="[^"]*"[^>]*>[\s\S]*?<\/\1>/g, "")
    .replace(/<span lang="en">TutorCat<\/span>/g, "");
  const leftover = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[#\w]+;/g, " ")
    .match(/[A-Za-z]{2,}/g)
    ?.filter((word) => word !== "TC");
  assert.deepEqual(leftover ?? [], [], "untranslated text in index.html");
});

test("index.html attributes with English text are translated", () => {
  // Set by script.js with a plural count, so it can't be a static key.
  const scriptManaged = new Set(["shortlistButton"]);
  for (const tag of read("index.html").match(/<[a-z][^>]*>/g)) {
    const id = tag.match(/\sid="([^"]+)"/)?.[1];
    if (scriptManaged.has(id)) continue;
    const translated = tag.match(/data-i18n-attr="([^"]+)"/)?.[1] ?? "";
    for (const [, attribute, value] of tag.matchAll(/\s(placeholder|aria-label|alt|title|content)="([^"]*)"/g)) {
      if (!/[A-Za-z]{3,}/.test(value) || /^https?:/.test(value) || /^(width=|summary_|website|#)/.test(value)) continue;
      if (attribute === "content" && !/^<meta (name="description"|property="og:(title|description|image:alt)")/.test(tag.replace(/\s+/g, " "))) continue;
      assert.ok(translated.includes(`${attribute}:`), `untranslated ${attribute}="${value}"`);
    }
  }
});
