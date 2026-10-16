import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { CatCard } from "@/components/cat-card";
import { DraftReady } from "@/components/forms";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { ReportForm, UrgentNotice } from "@/components/report-form";
import { SiteLink } from "@/components/site-link";
import type { ReportDraft } from "@/lib/drafts";
import { useHydrated } from "@/lib/hydrated";
import { useI18n } from "@/lib/i18n";
import { profiles } from "@/lib/profiles";
import { pageMeta, staticPageHead, usePageMeta } from "@/lib/seo";

// Report a concern. Profile pages link here with ?profile=<id> so that person is already chosen.
// Nothing is stored or sent from the page: the report is an email draft the visitor sends.
export const Route = createFileRoute("/report")({
  validateSearch: (search: Record<string, unknown>): { profile?: string } =>
    typeof search["profile"] === "string" && profiles.some((profile) => profile.id === search["profile"]) ? { profile: search["profile"] } : {},
  head: () => staticPageHead("/report/", "report"),
  component: () => (
    <PageShell>
      <ReportPage />
    </PageShell>
  ),
});

const NEXT = ["send", "read", "followUp", "profile", "private"];

function ReportPage() {
  const translator = useI18n();
  const { t } = translator;
  usePageMeta(pageMeta(translator, "report"));
  // The prerendered page has no profile chosen; a link's ?profile= applies as soon as the page is live.
  const hydrated = useHydrated();
  const search = Route.useSearch();
  const initialProfile = hydrated ? (search.profile ?? "") : "";
  const [draft, setDraft] = useState<ReportDraft | null>(null);
  useEffect(() => {
    if (draft) document.getElementById("report-ready")?.focus();
  }, [draft]);

  return (
    <>
      <PageHeader eyebrow={t("report.eyebrow")} title={t("page.report.title")} intro={t("report.intro")}>
        <UrgentNotice />
      </PageHeader>
      <div className="shell page-body">
        <CatCard className="narrow">
          <div className="page-card">
            {draft ? (
              <DraftReady draft={draft} headingId="report-ready">
                <p className="report-reference">{t("report.reference", { reference: draft.reference })}</p>
                <p>{t("report.screenshots")}</p>
              </DraftReady>
            ) : (
              <>
                <h2>{t("report.formTitle")}</h2>
                <ReportForm key={initialProfile} profiles={profiles} initialProfile={initialProfile} onDraft={setDraft} />
              </>
            )}
          </div>
        </CatCard>
        <section className="report-next cat-perch">
          <h2 className="section-title">{t("report.next.title")}</h2>
          <ul className="fact-list">
            {NEXT.map((item) => (
              <li key={item}>{t(`report.next.${item}`)}</li>
            ))}
          </ul>
          <SiteLink to="/community-guidelines/" className="text-link">
            {t("report.guidelinesLink")} <ArrowRight className="dir-icon" />
          </SiteLink>
        </section>
      </div>
    </>
  );
}
