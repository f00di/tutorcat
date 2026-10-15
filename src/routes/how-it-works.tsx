import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CatCard } from "@/components/cat-card";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { StepsSection } from "@/components/sections";
import { SiteLink } from "@/components/site-link";
import { useI18n } from "@/lib/i18n";
import { pageMeta, staticPageHead, usePageMeta } from "@/lib/seo";

export const Route = createFileRoute("/how-it-works")({
  head: () => staticPageHead("/how-it-works/", "howItWorks"),
  component: () => (
    <PageShell page="howItWorks">
      <HowItWorksPage />
    </PageShell>
  ),
});

// "How reviews work" states the rules src/lib/profiles.ts applies (isVerifiedPublicReview, ratingInfo).
function HowItWorksPage() {
  const translator = useI18n();
  const { t } = translator;
  usePageMeta(pageMeta(translator, "howItWorks"));

  return (
    <>
      <PageHeader eyebrow={t("steps.eyebrow")} title={t("page.howItWorks.heading")} intro={t("page.howItWorks.intro")} />
      <div className="shell">
        <CatCard>
          <div className="page-card">
            <StepsSection />
          </div>
        </CatCard>
      </div>
      <section className="shell page-section cat-perch">
        <h2 className="section-title">{t("howItWorks.families.title")}</h2>
        <ul className="fact-list">
          {["direct", "free", "parents"].map((item) => (
            <li key={item}>{t(`howItWorks.families.${item}`)}</li>
          ))}
        </ul>
      </section>
      <section id="reviews" className="shell page-section cat-perch">
        <h2 className="section-title">{t("howItWorks.reviews.title")}</h2>
        <p className="page-lead">{t("howItWorks.reviews.intro")}</p>
        <ol className="numbered-list">
          {["session", "confirm", "approve", "permission"].map((item) => (
            <li key={item}>{t(`howItWorks.reviews.${item}`)}</li>
          ))}
        </ol>
        <p className="page-note">{t("howItWorks.reviews.records")}</p>
        <SiteLink to="/review-policy/" className="text-link">
          {t("howItWorks.reviews.policyLink")} <ArrowRight className="dir-icon" />
        </SiteLink>
      </section>
    </>
  );
}
