import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

import { CatCard } from "@/components/cat-card";
import { PageHeader } from "@/components/page-header";
import { SiteLink } from "@/components/site-link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { usePageMeta } from "@/lib/seo";

/** The page-not-found content (published as 404.html). Render it inside PageShell. @category Layout */
export function NotFoundContent() {
  const { t } = useI18n();
  usePageMeta({ title: t("meta.pageTitle", { page: t("notFound.title") }), description: t("notFound.body") });
  // Put back the URL the visitor asked for (src/routes/$.tsx swaps it for /404/ while the page hydrates).
  useEffect(() => {
    const requested = (window as { __tutorcatNotFound?: string }).__tutorcatNotFound;
    if (!requested) return;
    delete (window as { __tutorcatNotFound?: string }).__tutorcatNotFound;
    window.history.replaceState(window.history.state, "", requested);
  }, []);
  return (
    <>
      <PageHeader eyebrow={t("notFound.eyebrow")} title={t("notFound.title")} intro={t("notFound.body")} />
      <div className="shell page-body">
        <CatCard className="narrow">
          <div className="page-card link-row">
            <Button asChild>
              <SiteLink to="/tutors/">
                {t("notFound.tutors")} <ArrowRight className="dir-icon" />
              </SiteLink>
            </Button>
            <Button asChild variant="outline">
              <SiteLink to="/">{t("notFound.home")}</SiteLink>
            </Button>
          </div>
        </CatCard>
      </div>
    </>
  );
}
