import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Bookmark, BookOpen, Compass, GraduationCap, Globe2, MapPin, Monitor, Search, Users } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import sessionImage from "@/assets/tutorcat-session.jpg";
import { DialogShell } from "@/components/dialog-shell";
import { DraftReady, JoinForm, RequestForm, ReviewForm } from "@/components/forms";
import { ProfileView } from "@/components/profile-view";
import { logoStyle, SiteHeader } from "@/components/site-header";
import { SpecialistCard } from "@/components/specialist-card";
import { Button } from "@/components/ui/button";
import { isContactEmailSet } from "@/config";
import { useCatPerches } from "@/lib/cat";
import type { Draft } from "@/lib/drafts";
import { regions, useI18n } from "@/lib/i18n";
import {
  allCurricula,
  allDestinations,
  allSubjects,
  getUniversity,
  isCounselor,
  isTutor,
  matchesWhere,
  offersOnline,
  profiles,
  type Profile,
} from "@/lib/profiles";

export const Route = createFileRoute("/")({ component: Index });

type Mode = "tutoring" | "counseling" | "both";
type Sort = "featured" | "name" | "experience";
type Filters = { mode: Mode; topic: string; curriculum: string; where: string };
type DialogState =
  | { type: "profile"; person: Profile }
  | { type: "request"; person: Profile | null }
  | { type: "review"; person: Profile | null }
  | { type: "join" }
  | { type: "shortlist" }
  | { type: "draft"; draft: Draft }
  | null;

const TONES = ["sage", "peach", "lavender"];
const NO_FILTERS: Filters = { mode: "both", topic: "", curriculum: "", where: "" };
const toneOf = (profile: Profile) => TONES[profiles.indexOf(profile) % TONES.length] ?? "sage";
const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

function Index() {
  const translator = useI18n();
  const { t, label, formatList } = translator;
  const [mode, setMode] = useState<Mode>("tutoring");
  const [topic, setTopic] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [where, setWhere] = useState("");
  const [applied, setApplied] = useState<Filters>(NO_FILTERS);
  const [chip, setChip] = useState("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [saved, setSaved] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const opener = useRef<HTMLElement | null>(null);
  const catWrapRef = useRef<HTMLDivElement>(null);
  const catHeadRef = useRef<HTMLDivElement>(null);
  const catPawsRef = useRef<HTMLDivElement>(null);
  useCatPerches(catWrapRef, catHeadRef, catPawsRef);

  // Every option below comes from data/tutors.json and data/regions.json.
  const subjects = useMemo(() => allSubjects(profiles), []);
  const destinations = useMemo(() => allDestinations(profiles), []);
  const curricula = useMemo(() => allCurricula(profiles), []);
  const counselingRows = useMemo(
    () => profiles.flatMap((person) => person.countries.map((country) => ({ person, country, university: getUniversity(person) }))),
    []
  );

  const open = (next: DialogState) => {
    if (!dialog) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDialog(next);
  };
  const close = useCallback(() => {
    setDialog(null);
    opener.current?.focus();
  }, []);
  const toggleSaved = (id: string) => setSaved((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const search = () => {
    setApplied({ mode, topic, curriculum, where });
    setChip("all");
    scrollToId("specialists");
  };
  const reset = () => {
    setTopic("");
    setCurriculum("");
    setWhere("");
    setApplied(NO_FILTERS);
    setChip("all");
  };

  const chips = [
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

  const matchesTopic = (person: Profile, filters: Filters) => {
    if (!filters.topic) return true;
    if (filters.mode === "tutoring") return person.subjects.includes(filters.topic);
    if (filters.mode === "counseling") return person.countries.includes(filters.topic);
    return person.subjects.includes(filters.topic) || person.countries.includes(filters.topic);
  };
  const activeChip = chips.find((item) => item.id === chip) ?? chips[0]!;
  const visible = profiles
    .filter(
      (person) =>
        matchesTopic(person, applied) &&
        (!applied.curriculum || person.curricula.includes(applied.curriculum)) &&
        matchesWhere(person, applied.where) &&
        activeChip.test(person)
    )
    .sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : sort === "experience" ? (b.experienceYears ?? -1) - (a.experienceYears ?? -1) : 0
    );

  const topicOptions = mode === "tutoring" ? subjects : mode === "counseling" ? destinations : [...subjects, ...destinations];
  const topicLabel = (value: string) => label(subjects.includes(value) ? "subject" : "destination", value);
  const whereLabel = (value: string) => {
    const [country = "", city = ""] = value.split("|");
    return city ? `${label("city", city)}${t("list.separator")}${label("countryShort", country)}` : label("country", country);
  };
  const appliedSummary = [
    applied.topic && topicLabel(applied.topic),
    applied.curriculum && label("curriculum", applied.curriculum),
    applied.where && whereLabel(applied.where),
  ].filter(Boolean);

  return (
    <>
      <SiteHeader savedCount={saved.length} onShortlist={() => open({ type: "shortlist" })} onJoin={() => open({ type: "join" })} />
      <main id="main">
        <section className="hero">
          <img src={sessionImage} className="hero-photo" alt={t("hero.imageAlt")} width={1536} height={1024} />
          <div className="shell hero-inner">
            <div className="eyebrow">
              <span>{t("hero.eyebrow")}</span>
            </div>
            <h1>
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")} <span>{t("hero.titleAccent")}</span>
            </h1>
            <p className="hero-copy">{t("hero.copy")}</p>
            <div className="hero-note">
              <Users size={16} aria-hidden="true" /> {t("hero.note")}
            </div>
          </div>
        </section>

        <div className="shell">
          <div className="finder-wrap" ref={catWrapRef}>
            <div className="cat-peek" ref={catHeadRef} aria-hidden="true">
              <span className="cat-ear cat-ear-l" />
              <span className="cat-ear cat-ear-r" />
              <span className="cat-head" />
              <span className="cat-eye cat-eye-l" />
              <span className="cat-eye cat-eye-r" />
            </div>
            <section className="finder" aria-label={t("finder.label")}>
              <div className="finder-tabs" role="group" aria-label={t("finder.supportType")}>
                {(["tutoring", "counseling", "both"] as Mode[]).map((item) => (
                  <Button
                    variant="ghost"
                    key={item}
                    aria-pressed={mode === item}
                    data-active={mode === item}
                    onClick={() => {
                      setMode(item);
                      setTopic("");
                    }}
                  >
                    {item === "tutoring" ? <BookOpen /> : item === "counseling" ? <Compass /> : <Users />}
                    <span className="tab-long">{t(`finder.${item}`)}</span>
                    <span className="tab-short">{t(`finder.${item}Short`)}</span>
                  </Button>
                ))}
              </div>
              <div className="search-fields">
                <label>
                  <span className="field-label">
                    {t(mode === "counseling" ? "finder.destinationLabel" : mode === "both" ? "finder.topicLabel" : "finder.subjectLabel")}
                  </span>
                  <span className="field-wrap">
                    <Search size={17} aria-hidden="true" />
                    <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                      <option value="">
                        {t(mode === "counseling" ? "finder.anyDestination" : mode === "both" ? "finder.anyTopic" : "finder.allSubjects")}
                      </option>
                      {topicOptions.map((item) => (
                        <option key={item} value={item}>
                          {topicLabel(item)}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <label>
                  <span className="field-label">{t("finder.curriculumLabel")}</span>
                  <span className="field-wrap">
                    <GraduationCap size={18} aria-hidden="true" />
                    <select value={curriculum} onChange={(event) => setCurriculum(event.target.value)}>
                      <option value="">{t("finder.anyCurriculum")}</option>
                      {curricula.map((item) => (
                        <option key={item} value={item}>
                          {label("curriculum", item)}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <label>
                  <span className="field-label">{t("finder.whereLabel")}</span>
                  <span className="field-wrap">
                    <MapPin size={17} aria-hidden="true" />
                    <select value={where} onChange={(event) => setWhere(event.target.value)}>
                      <option value="">{t("finder.anywhere")}</option>
                      {regions.countries.map((country) => (
                        <optgroup key={country.name} label={label("country", country.name)}>
                          <option value={country.name}>{t("finder.allOfCountry", { country: label("country", country.name) })}</option>
                          {country.cities.map((city) => (
                            <option key={city.name} value={`${country.name}|${city.name}`}>
                              {label("city", city.name)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </span>
                </label>
                <Button className="search-button" onClick={search}>
                  {t("finder.submit")} <ArrowRight className="dir-icon" />
                </Button>
              </div>
            </section>
            <div className="cat-paws" ref={catPawsRef} aria-hidden="true">
              <span className="cat-paw" style={{ insetInlineEnd: 62 }} />
              <span className="cat-paw" style={{ insetInlineEnd: 110 }} />
            </div>
          </div>
          <div className="reassurance">
            {profiles.some(offersOnline) && (
              <span>
                <Monitor aria-hidden="true" /> {t("reassure.online")}
              </span>
            )}
            {destinations.length > 0 && (
              <span>
                <GraduationCap aria-hidden="true" /> {t("reassure.destination")}
              </span>
            )}
            <span>
              <Users aria-hidden="true" /> {t("reassure.parents")}
            </span>
          </div>
        </div>

        <section id="specialists" className="shell catalogue">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t("catalogue.eyebrow")}</div>
              <h2>{t("catalogue.title")}</h2>
              <p>{t("catalogue.intro")}</p>
            </div>
            <span className="result-count" role="status">
              {t("catalogue.count", { count: visible.length })}
            </span>
          </div>
          <div className="catalogue-toolbar">
            <div className="filter-chips" role="group" aria-label={t("catalogue.filters")}>
              {chips.map((item) => (
                <Button
                  key={item.id}
                  variant={chip === item.id ? "default" : "outline"}
                  aria-pressed={chip === item.id}
                  onClick={() => (item.id === "all" ? reset() : setChip(item.id))}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <select className="sort-select" aria-label={t("sort.label")} value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="featured">{t("sort.featured")}</option>
              <option value="name">{t("sort.name")}</option>
              <option value="experience">{t("sort.experience")}</option>
            </select>
          </div>
          {appliedSummary.length > 0 && (
            <p className="applied-filters">
              {appliedSummary.join(" · ")}{" "}
              <Button variant="link" size="sm" onClick={reset}>
                {t("catalogue.clear")}
              </Button>
            </p>
          )}
          <div className="specialist-grid">
            {visible.map((person) => (
              <SpecialistCard
                key={person.id}
                profile={person}
                tone={toneOf(person)}
                saved={saved.includes(person.id)}
                onToggleSave={() => toggleSaved(person.id)}
                onOpen={() => open({ type: "profile", person })}
              />
            ))}
            {visible.length === 0 && (
              <div className="empty-state">
                <Search className="mx-auto" aria-hidden="true" />
                <h3>{t("empty.title")}</h3>
                <p>{t("empty.body")}</p>
                <Button variant="outline" onClick={reset}>
                  {t("empty.showAll")}
                </Button>
              </div>
            )}
          </div>
          <p className="help-line">
            {t("catalogue.helpText")}{" "}
            <Button variant="link" onClick={() => open({ type: "request", person: null })}>
              {t("catalogue.helpLink")} <ArrowRight className="dir-icon" />
            </Button>
          </p>
        </section>

        <section id="counseling" className="pathway">
          <div className="shell pathway-inner">
            <div>
              <div className="eyebrow">
                <Compass size={14} aria-hidden="true" /> {t("pathway.eyebrow")}
              </div>
              <h2 className="section-title">
                {t("pathway.titleLine1")}
                <br />
                {t("pathway.titleLine2")}
              </h2>
              <p>{t("pathway.body")}</p>
              {destinations.length > 0 && (
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => {
                    setMode("counseling");
                    setTopic("");
                    setApplied({ ...NO_FILTERS, mode: "counseling" });
                    setChip("counselors");
                    scrollToId("specialists");
                  }}
                >
                  {t("pathway.cta")} <ArrowRight className="dir-icon" />
                </Button>
              )}
            </div>
            {counselingRows.length > 0 && (
              <div className="destination-list">
                {counselingRows.map(({ person, country, university }) => (
                  <div className="destination-row" key={`${person.id}-${country}`}>
                    <div className="destination-main">
                      <span className="destination-icon" aria-hidden="true">
                        <Globe2 size={25} />
                      </span>
                      <div>
                        <strong>{label("destination", country)}</strong>
                        <p>
                          <bdi>{university || person.name}</bdi>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("pathway.explore", { country: label("destination", country) })}
                      onClick={() => open({ type: "profile", person })}
                    >
                      <ArrowUpRight className="dir-icon" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="how-it-works" className="shell steps-section">
          <div className="eyebrow">{t("steps.eyebrow")}</div>
          <h2 className="section-title">{t("steps.title")}</h2>
          <div className="steps-grid">
            {["find", "talk", "move"].map((step, index) => (
              <div key={step}>
                <div className="step-number">{`0${index + 1}`}</div>
                <h3>{t(`steps.${step}.title`)}</h3>
                <p>{t(`steps.${step}.body`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="shell faq-section">
          <div>
            <div className="eyebrow">{t("faq.eyebrow")}</div>
            <h2 className="section-title">
              {t("faq.titleLine1")}
              <br />
              {t("faq.titleLine2")}
            </h2>
          </div>
          <div>
            {["parents", "countries", "counseling", "booking"].map((item) => (
              <details key={item}>
                <summary>{t(`faq.${item}.q`)}</summary>
                <p>{t(item === "booking" && isContactEmailSet() ? "faq.booking.aReady" : `faq.${item}.a`)}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-inner">
          <span className="logo footer-logo" style={logoStyle} role="img" aria-label="Tutorcat" />
          <p>{t("footer.tagline")}</p>
          <p>{t("footer.legal", { year: new Date().getFullYear() })}</p>
        </div>
      </footer>

      {dialog && (
        <DialogShell onClose={close} contentKey={dialog.type === "profile" ? `profile-${dialog.person.id}` : dialog.type}>
          {dialog.type === "profile" && (
            <ProfileView
              profile={dialog.person}
              saved={saved.includes(dialog.person.id)}
              onToggleSave={() => toggleSaved(dialog.person.id)}
              onRequest={() => open({ type: "request", person: dialog.person })}
              onReview={() => open({ type: "review", person: dialog.person })}
            />
          )}
          {dialog.type === "shortlist" && (
            <>
              <div className="eyebrow">
                <Bookmark size={16} aria-hidden="true" /> {t("shortlist.eyebrow")}
              </div>
              <h2 id="dialog-title">{t("shortlist.title")}</h2>
              <p>{t(saved.length ? "shortlist.filled" : "shortlist.empty")}</p>
              <div className="mt-6 grid gap-4">
                {profiles
                  .filter((person) => saved.includes(person.id))
                  .map((person) => (
                    <div key={person.id} className="flex items-center justify-between gap-3 border-b pb-4">
                      <div>
                        <strong>
                          <bdi>{person.name}</bdi>
                        </strong>
                        <p>{formatList(person.subjects.map((subject) => label("subject", subject)))}</p>
                      </div>
                      <Button variant="outline" onClick={() => open({ type: "profile", person })}>
                        {t("shortlist.view")} <ArrowUpRight className="dir-icon" />
                      </Button>
                    </div>
                  ))}
              </div>
              {!saved.length && (
                <Button
                  className="mt-4"
                  onClick={() => {
                    close();
                    scrollToId("specialists");
                  }}
                >
                  {t("shortlist.explore")} <ArrowRight className="dir-icon" />
                </Button>
              )}
            </>
          )}
          {dialog.type === "request" && (
            <>
              <div className="eyebrow">{t("request.eyebrow")}</div>
              <h2 id="dialog-title">
                {dialog.person ? t("request.titlePerson", { name: dialog.person.name.split(" ")[0] ?? dialog.person.name }) : t("request.title")}
              </h2>
              <p>{t("request.intro")}</p>
              <RequestForm person={dialog.person} profiles={profiles} onDraft={(draft) => open({ type: "draft", draft })} />
            </>
          )}
          {dialog.type === "join" && (
            <>
              <div className="eyebrow">{t("join.eyebrow")}</div>
              <h2 id="dialog-title">{t("join.title")}</h2>
              <p>{t("join.intro")}</p>
              <JoinForm onDraft={(draft) => open({ type: "draft", draft })} />
            </>
          )}
          {dialog.type === "review" && (
            <>
              <div className="eyebrow">{t("reviewForm.eyebrow")}</div>
              <h2 id="dialog-title">{t("reviewForm.title")}</h2>
              <p>{t("review.policy")}</p>
              <ReviewForm person={dialog.person} profiles={profiles} onDraft={(draft) => open({ type: "draft", draft })} />
            </>
          )}
          {dialog.type === "draft" && <DraftReady draft={dialog.draft} />}
        </DialogShell>
      )}
    </>
  );
}
