// Catalogue filtering, shared by the home page and /tutors/. Every option comes from
// data/tutors.json and data/regions.json, so nothing is invented.
import { regions, type Translator } from "./i18n";
import { allCurricula, allDestinations, allSubjects, isCounselor, isTutor, matchesWhere, profiles, type Profile } from "./profiles";

export type Mode = "tutoring" | "counseling" | "both";
export type Sort = "featured" | "name" | "experience";
export type Filters = { mode: Mode; topic: string; curriculum: string; where: string };
export type Chip = { id: string; label: string; test: (person: Profile) => boolean };

export const MODES: Mode[] = ["tutoring", "counseling", "both"];
export const SORTS: Sort[] = ["featured", "name", "experience"];
export const NO_FILTERS: Filters = { mode: "both", topic: "", curriculum: "", where: "" };

export const subjects = allSubjects(profiles);
export const destinations = allDestinations(profiles);
export const curricula = allCurricula(profiles);

export const matchesTopic = (person: Profile, filters: Filters) => {
  if (!filters.topic) return true;
  if (filters.mode === "tutoring") return person.subjects.includes(filters.topic);
  if (filters.mode === "counseling") return person.countries.includes(filters.topic);
  return person.subjects.includes(filters.topic) || person.countries.includes(filters.topic);
};

export function catalogueChips({ t, label }: Pick<Translator, "t" | "label">, saved: string[]): Chip[] {
  return [
    { id: "all", label: t("chip.all"), test: () => true },
    ...(profiles.some(isTutor) ? [{ id: "tutors", label: t("chip.tutors"), test: isTutor }] : []),
    ...(profiles.some(isCounselor) ? [{ id: "counselors", label: t("chip.counselors"), test: isCounselor }] : []),
    ...subjects.map((subject) => ({ id: `subject:${subject}`, label: label("subject", subject), test: (person: Profile) => person.subjects.includes(subject) })),
    {
      id: "shortlisted",
      label: saved.length ? t("chip.shortlistedCount", { count: saved.length }) : t("chip.shortlisted"),
      test: (person: Profile) => saved.includes(person.id),
    },
  ];
}

export const visibleProfiles = (applied: Filters, chip: Chip, sort: Sort) =>
  profiles
    .filter(
      (person) =>
        matchesTopic(person, applied) &&
        (!applied.curriculum || person.curricula.includes(applied.curriculum)) &&
        matchesWhere(person, applied.where) &&
        chip.test(person)
    )
    .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "experience" ? (b.experienceYears ?? -1) - (a.experienceYears ?? -1) : 0));

export const topicLabel = ({ label }: Pick<Translator, "label">, value: string) => label(subjects.includes(value) ? "subject" : "destination", value);

export function appliedSummary(translator: Pick<Translator, "t" | "label">, applied: Filters) {
  const { t, label } = translator;
  const whereLabel = (value: string) => {
    const [country = "", city = ""] = value.split("|");
    return city ? `${label("city", city)}${t("list.separator")}${label("countryShort", country)}` : label("country", country);
  };
  return [applied.topic && topicLabel(translator, applied.topic), applied.curriculum && label("curriculum", applied.curriculum), applied.where && whereLabel(applied.where)].filter(
    Boolean
  ) as string[];
}

// /tutors/ keeps its filters in the URL so a search can be shared. Unknown values are dropped.
export type CatalogueSearch = {
  mode?: Mode | undefined;
  topic?: string | undefined;
  curriculum?: string | undefined;
  where?: string | undefined;
  chip?: string | undefined;
  sort?: Sort | undefined;
};

const places = new Set(regions.countries.flatMap((country) => [country.name, ...country.cities.map((city) => `${country.name}|${city.name}`)]));
const chipIds = () => ["tutors", "counselors", "shortlisted", ...subjects.map((subject) => `subject:${subject}`)];
const pick = <T extends string>(value: unknown, allowed: readonly T[]) => (allowed.includes(value as T) ? (value as T) : undefined);

export function validateCatalogueSearch(search: Record<string, unknown>): CatalogueSearch {
  const result: CatalogueSearch = {
    mode: pick(search["mode"], MODES),
    topic: pick(search["topic"], [...subjects, ...destinations]),
    curriculum: pick(search["curriculum"], curricula),
    where: typeof search["where"] === "string" && places.has(search["where"]) ? search["where"] : undefined,
    chip: pick(search["chip"], chipIds()),
    sort: pick(search["sort"], SORTS),
  };
  return Object.fromEntries(Object.entries(result).filter(([, value]) => value !== undefined && value !== "featured" && value !== "both"));
}
