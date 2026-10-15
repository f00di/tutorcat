import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CatCard } from "@/components/cat-card";
import { CatalogueResults } from "@/components/catalogue";
import { FinderForm } from "@/components/finder";
import { PageHeader } from "@/components/page-header";
import { PageShell, useOpenDialog } from "@/components/page-shell";
import { SpecialistCard, toneOf } from "@/components/specialist-card";
import { Button } from "@/components/ui/button";
import {
  NO_FILTERS,
  appliedSummary,
  catalogueChips,
  validateCatalogueSearch,
  visibleProfiles,
  type CatalogueSearch,
  type Filters,
} from "@/lib/catalogue";
import { useHydrated } from "@/lib/hydrated";
import { useI18n } from "@/lib/i18n";
import { pageMeta, staticPageHead, usePageMeta } from "@/lib/seo";
import { useShortlist } from "@/lib/shortlist";

// The full catalogue. Same finder, chips and cards as the home page; the filters live in the URL
// (?topic=Math&curriculum=IB&chip=tutors&sort=name) so a search can be shared.
export const Route = createFileRoute("/tutors/")({
  validateSearch: validateCatalogueSearch,
  head: () => staticPageHead("/tutors/", "tutors"),
  component: () => (
    <PageShell page="tutors">
      <TutorsPage />
    </PageShell>
  ),
});

const NO_SEARCH: CatalogueSearch = {};

function TutorsPage() {
  const translator = useI18n();
  const { t, lang } = translator;
  usePageMeta(pageMeta(translator, "tutors"));
  const openDialog = useOpenDialog();
  const navigate = useNavigate();
  const { saved, toggle } = useShortlist();
  // The prerendered page lists everyone; a shared link's filters apply as soon as the page is live.
  const hydrated = useHydrated();
  const urlSearch = Route.useSearch();
  const search = hydrated ? urlSearch : NO_SEARCH;
  const applied: Filters = { mode: search.mode ?? NO_FILTERS.mode, topic: search.topic ?? "", curriculum: search.curriculum ?? "", where: search.where ?? "" };
  const chips = catalogueChips(translator, saved);
  const activeChip = chips.find((item) => item.id === search.chip) ?? chips[0]!;
  const sort = search.sort ?? "featured";
  const visible = visibleProfiles(applied, activeChip, sort);

  // Replace (not push) the URL, so Back leaves the page instead of undoing each filter.
  const go = (next: CatalogueSearch) =>
    void navigate({
      to: "/tutors/",
      search: { ...next, ...(lang === "ar" ? { lang: "ar" } : {}) } as never,
      replace: true,
      resetScroll: false,
    });
  const withoutDefaults = (next: CatalogueSearch) => validateCatalogueSearch(next);

  return (
    <>
      <PageHeader eyebrow={t("catalogue.eyebrow")} title={t("page.tutors.heading")} intro={t("page.tutors.intro")} />
      <div className="shell">
        <CatCard>
          <FinderForm
            key={`${hydrated}|${applied.mode}|${applied.topic}|${applied.curriculum}|${applied.where}`}
            initial={applied}
            onSearch={(filters) => go(withoutDefaults({ ...filters, mode: filters.topic ? filters.mode : undefined, sort: search.sort }))}
          />
        </CatCard>
      </div>
      <section id="specialists" className="shell catalogue cat-perch">
        <div className="section-head">
          <div>
            <h2>{t("catalogue.title")}</h2>
            <p>{t("catalogue.intro")}</p>
          </div>
          <span className="result-count" role="status">
            {t("catalogue.count", { count: visible.length })}
          </span>
        </div>
        <CatalogueResults
          chips={chips}
          chip={activeChip.id}
          onChip={(id) => go(withoutDefaults({ ...search, chip: id }))}
          sort={sort}
          onSort={(next) => go(withoutDefaults({ ...search, sort: next }))}
          summary={appliedSummary(translator, applied)}
          onReset={() => go(withoutDefaults({ sort: search.sort }))}
          visible={visible}
          renderCard={(person) => (
            <SpecialistCard key={person.id} profile={person} tone={toneOf(person)} saved={saved.includes(person.id)} onToggleSave={() => toggle(person.id)} />
          )}
        />
        <p className="help-line">
          {t("catalogue.helpText")}{" "}
          <Button variant="link" onClick={() => openDialog({ type: "request", person: null })}>
            {t("catalogue.helpLink")} <ArrowRight className="dir-icon" />
          </Button>
        </p>
      </section>
    </>
  );
}
