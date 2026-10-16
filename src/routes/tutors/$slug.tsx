import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Flag } from "lucide-react";

import { CatCard } from "@/components/cat-card";
import { NotFoundContent } from "@/components/not-found";
import { PageShell, useOpenDialog } from "@/components/page-shell";
import { ProfileView } from "@/components/profile-view";
import { SiteLink } from "@/components/site-link";
import { useI18n } from "@/lib/i18n";
import { profiles, type Profile } from "@/lib/profiles";
import { profileHead, profileMeta, usePageMeta } from "@/lib/seo";
import { useShortlist } from "@/lib/shortlist";

// One prerendered page per published profile (scripts/public-pages.mjs); the profile id is the URL.
// The same data rules as everywhere: approved photos and verified, approved, public reviews only.
export const Route = createFileRoute("/tutors/$slug")({
  loader: ({ params }) => {
    if (!profiles.some((profile) => profile.id === params.slug)) throw notFound();
  },
  head: ({ params }) => profileHead(params.slug),
  component: ProfileRoute,
  notFoundComponent: () => (
    <PageShell>
      <NotFoundContent />
    </PageShell>
  ),
});

function ProfileRoute() {
  const { slug } = Route.useParams();
  const profile = profiles.find((item) => item.id === slug);
  return <PageShell page="tutors">{profile ? <ProfilePage profile={profile} /> : <NotFoundContent />}</PageShell>;
}

function ProfilePage({ profile }: { profile: Profile }) {
  const translator = useI18n();
  const { t } = translator;
  usePageMeta(profileMeta(profile, translator));
  const openDialog = useOpenDialog();
  const { saved, toggle } = useShortlist();

  return (
    <>
      <div className="page-top">
        <div className="shell">
          <SiteLink to="/tutors/" className="back-link">
            <ArrowLeft className="dir-icon" aria-hidden="true" /> {t("profile.back")}
          </SiteLink>
        </div>
      </div>
      <div className="shell page-body">
        <CatCard className="narrow">
          <article className="page-card profile-page">
            <ProfileView
              variant="page"
              profile={profile}
              saved={saved.includes(profile.id)}
              onToggleSave={() => toggle(profile.id)}
              onRequest={() => openDialog({ type: "request", person: profile })}
              onReview={() => openDialog({ type: "review", person: profile })}
              after={
                <p className="report-link">
                  <SiteLink to="/report/" search={{ profile: profile.id }} className="text-link">
                    <Flag aria-hidden="true" /> {t("profile.report")}
                  </SiteLink>
                </p>
              }
            />
          </article>
        </CatCard>
      </div>
    </>
  );
}
