import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";

import { CatCard } from "@/components/cat-card";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { CounselingSection } from "@/components/sections";
import { SiteLink } from "@/components/site-link";
import { SpecialistCard, toneOf } from "@/components/specialist-card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { isCounselor, profiles } from "@/lib/profiles";
import { pageMeta, staticPageHead, usePageMeta } from "@/lib/seo";
import { useShortlist } from "@/lib/shortlist";

// The home page's counseling section as a full page, plus every counselor's card. All from data/tutors.json.
export const Route = createFileRoute("/counseling")({
  head: () => staticPageHead("/counseling/", "counseling"),
  component: () => (
    <PageShell page="counseling">
      <CounselingPage />
    </PageShell>
  ),
});

const counselors = profiles.filter(isCounselor);

function CounselingPage() {
  const translator = useI18n();
  const { t, label } = translator;
  usePageMeta(pageMeta(translator, "counseling"));
  const { saved, toggle } = useShortlist();

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <Compass size={14} aria-hidden="true" /> {t("pathway.eyebrow")}
          </>
        }
        title={t("page.counseling.heading")}
        intro={t("page.counseling.intro")}
      />
      <div className="shell">
        <CatCard>
          <div className="page-card">
            <h2>{t("page.counseling.whatTitle")}</h2>
            <p>{t("faq.counseling.a")}</p>
            <p>{t("faq.parents.a")}</p>
          </div>
        </CatCard>
      </div>
      <CounselingSection
        className="page-pathway cat-perch"
        cta={
          counselors.length > 0 && (
            <Button asChild variant="link" size="inline">
              <SiteLink to="/tutors/" search={{ chip: "counselors" }}>
                {t("pathway.cta")} <ArrowRight className="dir-icon" />
              </SiteLink>
            </Button>
          )
        }
        rowAction={({ person, country }) => (
          <Button asChild variant="ghost" size="icon">
            <SiteLink to="/tutors/$slug/" params={{ slug: person.id }} aria-label={t("pathway.explore", { country: label("destination", country) })}>
              <ArrowUpRight className="dir-icon" />
            </SiteLink>
          </Button>
        )}
      />
      {counselors.length > 0 && (
        <section className="shell page-section cat-perch">
          <h2 className="section-title">{t("page.counseling.counselorsTitle")}</h2>
          <div className="specialist-grid">
            {counselors.map((person) => (
              <SpecialistCard key={person.id} profile={person} tone={toneOf(person)} saved={saved.includes(person.id)} onToggleSave={toggle} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
