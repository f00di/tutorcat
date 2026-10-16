import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CatCard } from "@/components/cat-card";
import { DraftBanner, PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { SiteLink } from "@/components/site-link";
import { useI18n } from "@/lib/i18n";
import { pageMeta, staticPageHead, usePageMeta } from "@/lib/seo";

export const Route = createFileRoute("/community-guidelines")({
  head: () => staticPageHead("/community-guidelines/", "guidelines"),
  component: () => (
    <PageShell>
      <GuidelinesPage />
    </PageShell>
  ),
});

const SECTIONS = [
  { key: "specialists", items: ["honest", "punctual", "professional", "parents", "boundaries", "privacy", "promises", "reviews"] },
  { key: "families", items: ["respect", "honest", "arrange", "safety"] },
  { key: "unprofessional", items: ["contact", "harassment", "pressure", "credentials", "reviews", "payments"] },
] as const;

// Draft wording for the owner's approval: plain expectations, not legal terms.
function GuidelinesPage() {
  const translator = useI18n();
  const { t } = translator;
  usePageMeta(pageMeta(translator, "guidelines"));
  return (
    <>
      <PageHeader eyebrow={t("guidelines.eyebrow")} title={t("page.guidelines.title")} intro={t("guidelines.intro")} />
      <div className="shell page-body">
        <CatCard className="narrow">
          <div className="page-card prose">
            <DraftBanner>{t("guidelines.draft")}</DraftBanner>
            {SECTIONS.map((section) => (
              <section key={section.key}>
                <h2>{t(`guidelines.${section.key}.title`)}</h2>
                <ul className="fact-list">
                  {section.items.map((item) => (
                    <li key={item}>{t(`guidelines.${section.key}.${item}`)}</li>
                  ))}
                </ul>
              </section>
            ))}
            <section>
              <h2>{t("guidelines.concern.title")}</h2>
              <p>{t("guidelines.concern.body")}</p>
              <SiteLink to="/report/" className="text-link">
                {t("footer.report")} <ArrowRight className="dir-icon" />
              </SiteLink>
            </section>
          </div>
        </CatCard>
      </div>
    </>
  );
}
