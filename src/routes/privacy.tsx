import { createFileRoute } from "@tanstack/react-router";

import { CatCard } from "@/components/cat-card";
import { DraftBanner, PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { CONTACT_EMAIL, LEGAL_STATUS } from "@/config";
import privacyAr from "@/content/legal/privacy.ar.md?raw";
import privacyEn from "@/content/legal/privacy.en.md?raw";
import { useI18n } from "@/lib/i18n";
import { Markdown, markdownSections } from "@/lib/markdown";
import { pageMeta, staticPageHead, usePageMeta } from "@/lib/seo";

// The privacy policy: sections 1–8 of docs/legal/privacy-policy.md (English, kept in step by
// tests/privacy.test.mjs) and its Arabic translation, where the English prevails.
const draft = LEGAL_STATUS.privacy !== "final";

export const Route = createFileRoute("/privacy")({
  head: () => staticPageHead("/privacy/", "privacy", { noindex: draft }),
  component: () => (
    <PageShell>
      <PrivacyPage />
    </PageShell>
  ),
});

const email = (
  <bdi dir="ltr">
    <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
      {CONTACT_EMAIL}
    </a>
  </bdi>
);

function PrivacyPage() {
  const translator = useI18n();
  const { t, lang } = translator;
  usePageMeta(pageMeta(translator, "privacy"));
  const source = lang === "ar" ? privacyAr : privacyEn;
  return (
    <>
      <PageHeader eyebrow={t("policy.eyebrow")} title={t("page.privacy.title")} intro={t("page.privacy.intro")} />
      <div className="shell page-body">
        <CatCard className="narrow">
          <article className={draft ? "page-card prose legal-doc is-draft" : "page-card prose legal-doc"}>
            {draft && <DraftBanner>{t("privacy.draft")}</DraftBanner>}
            <nav className="legal-toc" aria-label={t("privacy.onThisPage")}>
              <h2>{t("privacy.onThisPage")}</h2>
              <ol>
                {markdownSections(source).map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.text.replace(/^\d+\.\s*/, "")}</a>
                  </li>
                ))}
              </ol>
            </nav>
            <Markdown source={source} vars={{ CONTACT_EMAIL: email }} />
          </article>
        </CatCard>
      </div>
    </>
  );
}
