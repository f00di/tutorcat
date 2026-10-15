import { ArrowRight } from "lucide-react";

import { CatCard } from "@/components/cat-card";
import { DraftBanner, PageHeader } from "@/components/page-header";
import { SiteLink } from "@/components/site-link";
import { useI18n } from "@/lib/i18n";
import { pageMeta, usePageMeta } from "@/lib/seo";

// What each placeholder page will cover once it's written and checked by a lawyer.
// Placeholders only: no legal promises until then.
const TOPICS = {
  terms: ["service", "listing", "conduct", "payments", "liability", "changes"],
  reviewPolicy: ["who", "verify", "moderation", "remove", "respond"],
} as const;

export type PolicyName = keyof typeof TOPICS;

/** A legal page placeholder: "Draft, pending legal review", then the topics it will cover. Render it inside PageShell. @category Layout */
export function PolicyPlaceholder({ name }: { name: PolicyName }) {
  const translator = useI18n();
  const { t } = translator;
  usePageMeta(pageMeta(translator, name));
  return (
    <>
      <PageHeader eyebrow={t("policy.eyebrow")} title={t(`page.${name}.title`)} />
      <div className="shell page-body">
        <CatCard className="narrow">
          <div className="page-card prose">
            <DraftBanner>{t("policy.draft")}</DraftBanner>
            <p className="page-lead">{t(`policy.${name}.intro`)}</p>
            <h2>{t("policy.willCover")}</h2>
            <ul className="fact-list">
              {TOPICS[name].map((topic) => (
                <li key={topic}>{t(`policy.${name}.${topic}`)}</li>
              ))}
            </ul>
            {name === "reviewPolicy" && (
              <SiteLink to="/how-it-works/" hash="reviews" className="text-link">
                {t("howItWorks.reviews.title")} <ArrowRight className="dir-icon" />
              </SiteLink>
            )}
          </div>
        </CatCard>
      </div>
    </>
  );
}
