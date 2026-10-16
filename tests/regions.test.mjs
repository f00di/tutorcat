import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const json = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));

const regions = json("data/regions.json");
const profiles = json("data/tutors.json").profiles ?? [];
const ar = json("i18n/ar.json");
// Same slug as i18n.js uses for value.<kind>.<slug> keys.
const slug = (value) =>
  String(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const curricula = [...regions.curricula, ...regions.countries.flatMap((country) => country.nationalCurricula ?? [])];
const countryNames = new Set(regions.countries.map((country) => country.name));

test("every Gulf country, city and curriculum in data/regions.json has English and Arabic names", () => {
  for (const country of regions.countries) {
    for (const field of ["name", "ar", "short", "shortAr"]) assert.ok(country[field]?.trim(), `${country.name}: missing ${field}`);
    if (country.permitBadge) {
      assert.ok(country.permitName && country.permitNameAr, `${country.name}: permit badge needs permitName and permitNameAr`);
    }
    for (const city of country.cities) assert.ok(city.name?.trim() && city.ar?.trim(), `${country.name}: city ${city.name} needs both names`);
  }
  for (const curriculum of curricula) assert.ok(curriculum.name?.trim() && curriculum.ar?.trim(), `curriculum ${curriculum.name} needs both names`);
});

test("every emergency number has an official source, both languages and a confirmed flag", () => {
  for (const country of regions.countries) {
    for (const item of country.emergencyNumbers ?? []) {
      const where = `${country.name} ${item.number}`;
      assert.match(String(item.number), /^\d{3,6}$/, `${where}: number should be digits only`);
      assert.ok(item.service?.trim() && item.serviceAr?.trim(), `${where}: needs service and serviceAr`);
      assert.equal(typeof item.confirmed, "boolean", `${where}: "confirmed" must be true or false (false until the owner checks the source)`);
      assert.match(item.source ?? "", /^https:\/\//, `${where}: add the official https source`);
    }
  }
});

test("every location, curriculum and permit value in tutors.json is defined in data/regions.json", () => {
  const curriculumNames = new Set(curricula.map((curriculum) => curriculum.name));
  for (const profile of profiles) {
    const where = `${profile.id}`;
    for (const country of [profile.baseCountry, profile.permitCountry, ...(profile.servesCountries ?? [])].filter(Boolean)) {
      assert.ok(countryNames.has(country), `${where}: "${country}" is not a country in data/regions.json`);
    }
    if (profile.city) {
      const cities = regions.countries.find((country) => country.name === profile.baseCountry)?.cities ?? [];
      assert.ok(cities.some((city) => city.name === profile.city), `${where}: city "${profile.city}" is not in ${profile.baseCountry}`);
    }
    for (const curriculum of profile.curricula ?? []) {
      assert.ok(curriculumNames.has(curriculum), `${where}: curriculum "${curriculum}" is not in data/regions.json`);
    }
  }
});

test("every subject, destination, profile type, session mode and language in tutors.json has an Arabic label", () => {
  const needed = profiles.flatMap((profile) => [
    ...(profile.subjects ?? []).map((value) => ["subject", value]),
    ...(profile.countries ?? []).map((value) => ["destination", value]),
    ["profileType", profile.profileType],
    ...(profile.sessionModes ?? []).map((value) => ["sessionMode", value]),
    ...(profile.languages ?? []).map((value) => ["language", value]),
    ...(profile.reviews ?? []).flatMap((review) => [["reviewerType", review.reviewerType], ["reviewSessionType", review.sessionType]]),
  ]);
  for (const [kind, value] of needed.filter(([, value]) => value)) {
    const key = `value.${kind}.${slug(value)}`;
    assert.ok(ar[key], `add "${key}" to i18n/en.json and i18n/ar.json (Arabic label for "${value}")`);
  }
});
