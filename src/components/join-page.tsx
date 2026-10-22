import { useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Languages, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { CatCard } from "@/components/cat-card";
import { DeskSection } from "@/components/desk-section";
import { FinderForm } from "@/components/finder";
import { DraftReady, JoinForm } from "@/components/forms";
import { CounselingSection } from "@/components/sections";
import { SiteLink } from "@/components/site-link";
import { SpecialistCard, toneOf } from "@/components/specialist-card";
import { Button } from "@/components/ui/button";
import { NO_FILTERS, validateCatalogueSearch } from "@/lib/catalogue";
import { COUNSELOR_SERVICES, type Draft } from "@/lib/drafts";
import { slug, useI18n } from "@/lib/i18n";
import { findRegion, isCounselor, isTutor, profiles } from "@/lib/profiles";
import { pageMeta, usePageMeta } from "@/lib/seo";
import { useShortlist } from "@/lib/shortlist";

export type JoinKind = "tutor" | "counselor";

const FOUNDING_SPOTS: Record<JoinKind, number> = { tutor: 50, counselor: 25 };

// The hero's image slot: a real photo (with consent) goes here once there is one, e.g.
// { src: tutorPhoto, alt: "…" } imported from src/assets/. Never an AI-generated photo.
// Until then the hero shows a real profile card. See docs/build-progress.md ("needs a real photo").
const HERO_PHOTO: Partial<Record<JoinKind, { src: string; alt: string }>> = {};

const FAQ: Record<JoinKind, string[]> = {
  tutor: ["cost", "contact", "permit", "payments", "both", "review"],
  counselor: ["cost", "contact", "experience", "commission", "both", "review"],
};

const Section = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`shell page-section cat-perch ${className}`.trim()}>{children}</section>
);

/** /for-tutors and /for-counselors: hero, founding offer and later pricing, what families see, Tutorcat Desk, FAQ and the application form preset to the role. Render it inside PageShell. @category Layout */
export function JoinPage({ kind }: { kind: JoinKind }) {
  const translator = useI18n();
  const { t, label } = translator;
  usePageMeta(pageMeta(translator, kind === "tutor" ? "forTutors" : "forCounselors"));
  const router = useRouter({ warn: false });
  const { saved, toggle } = useShortlist();
  const [draft, setDraft] = useState<Draft | null>(null);
  useEffect(() => {
    if (draft) document.getElementById("apply-ready")?.focus();
  }, [draft]);

  // The hero's real profile card: someone who is only a tutor (or only a counselor) if there is one.
  const fits = kind === "tutor" ? isTutor : isCounselor;
  const example = profiles.find((person) => person.profileType === (kind === "tutor" ? "Tutor" : "Counselor")) ?? profiles.find(fits);
  const uae = findRegion("United Arab Emirates");
  const photo = HERO_PHOTO[kind];
  const k = `join.${kind}`;

  return (
    <>
      <section className="join-hero">
        <div className="shell join-hero-inner">
          <div>
            <div className="eyebrow">{t(`${k}.eyebrow`)}</div>
            <h1>{t(`${k}.title`)}</h1>
            <p className="page-intro">{t(`${k}.intro`)}</p>
            <div className="link-row">
              <Button asChild>
                <a href="#apply">
                  {t(`${k}.cta`)} <ArrowDown />
                </a>
              </Button>
              <Button asChild variant="link">
                <SiteLink to={kind === "tutor" ? "/for-counselors/" : "/for-tutors/"}>
                  {t(`${k}.other`)} <ArrowRight className="dir-icon" />
                </SiteLink>
              </Button>
            </div>
          </div>
          <div className="join-hero-visual">
            {photo ? (
              <img src={photo.src} alt={photo.alt} className="join-hero-photo" />
            ) : (
              example && (
                <CatCard>
                  <SpecialistCard profile={example} tone={toneOf(example)} saved={saved.includes(example.id)} onToggleSave={() => toggle(example.id)} />
                </CatCard>
              )
            )}
          </div>
        </div>
      </section>

      <Section>
        <div className="founding-box">
          <div>
            <div className="eyebrow">
              <BadgeCheck size={14} aria-hidden="true" /> {t("join.founding.eyebrow")}
            </div>
            <h2 className="section-title">{t("join.founding.title")}</h2>
            <p>{t(`join.founding.${kind}`, { count: FOUNDING_SPOTS[kind] })}</p>
            {/* TODO: show "N of 50/25 spots left" once the data has a founding flag (docs/build-progress.md). Until then, no number. */}
          </div>
          <div className="pricing">
            <h3>{t("join.pricing.title")}</h3>
            <dl>
              <div>
                <dt>{t("join.pricing.standard")}</dt>
                <dd>{t("join.pricing.standardPrice")}</dd>
              </div>
              <div>
                <dt>{t("join.pricing.boosted")}</dt>
                <dd>{t("join.pricing.boostedPrice")}</dd>
              </div>
            </dl>
            <p>{t("join.pricing.note")}</p>
          </div>
        </div>
      </Section>

      {kind === "tutor" ? (
        <Section>
          <div className="eyebrow">{t("join.families.eyebrow")}</div>
          <h2 className="section-title">{t("join.families.tutorTitle")}</h2>
          <ul className="fact-list">
            {["card", "ratings", "filters"].map((item) => (
              <li key={item}>{t(`join.families.tutor.${item}`)}</li>
            ))}
          </ul>
          <div className="join-finder">
            <FinderForm
              initial={NO_FILTERS}
              onSearch={(filters) => {
                const search = { ...validateCatalogueSearch({ ...filters, mode: filters.topic ? filters.mode : undefined }), ...(translator.lang === "ar" ? { lang: "ar" } : {}) };
                if (router) void router.navigate({ to: "/tutors/", search } as never);
              }}
            />
          </div>
        </Section>
      ) : (
        <>
          <Section>
            <div className="eyebrow">{t("join.families.eyebrow")}</div>
            <h2 className="section-title">{t("join.families.counselorTitle")}</h2>
            <ul className="fact-list">
              {["destination", "experience", "services", "ratings"].map((item) => (
                <li key={item}>{t(`join.families.counselor.${item}`)}</li>
              ))}
            </ul>
          </Section>
          <CounselingSection
            className="page-pathway cat-perch"
            rowAction={({ person, country }) => (
              <Button asChild variant="ghost" size="icon">
                <SiteLink to="/tutors/$slug/" params={{ slug: person.id }} aria-label={t("pathway.explore", { country: label("destination", country) })}>
                  <ArrowUpRight className="dir-icon" />
                </SiteLink>
              </Button>
            )}
          />
          <Section>
            <h2 className="section-title">{t("join.services.title")}</h2>
            <p className="page-lead">{t("join.services.intro")}</p>
            <ul className="fact-list">
              {COUNSELOR_SERVICES.map((service) => (
                <li key={service}>{t(`applyForm.service.${slug(service)}`)}</li>
              ))}
            </ul>
            <div className="rule-box">
              <ShieldCheck aria-hidden="true" />
              <div>
                <h3>{t("join.commission.title")}</h3>
                <p>{t("join.commission.body")}</p>
              </div>
            </div>
          </Section>
        </>
      )}

      {kind === "tutor" && uae && (
        <Section>
          <h2 className="section-title">{t("join.permit.title")}</h2>
          <div className="rule-box">
            <ShieldCheck aria-hidden="true" />
            <div>
              <h3>{label("country", uae.name)}</h3>
              <p>{t("join.permit.uae", { permit: label("permit", uae.name) })}</p>
              <p>{t("join.permit.others")}</p>
            </div>
          </div>
        </Section>
      )}

      <DeskSection kind={kind} />

      <Section className="join-faq">
        <h2 className="section-title">{t("join.faq.title")}</h2>
        <div>
          {FAQ[kind].map((item) => (
            <details key={item}>
              <summary>{t(`join.faq.${kind}.${item}.q`)}</summary>
              <p>{t(`join.faq.${kind}.${item}.a`, { count: FOUNDING_SPOTS[kind] })}</p>
            </details>
          ))}
        </div>
      </Section>

      <section id="apply" className="shell page-section cat-perch">
        <div className="apply-layout">
          <div>
            <div className="eyebrow">
              <Languages size={14} aria-hidden="true" /> {t("join.eyebrow")}
            </div>
            <h2 className="section-title">{t(`${k}.applyTitle`)}</h2>
            <p className="page-lead">{t("join.intro")}</p>
            <p className="page-note">{t("join.bothNote")}</p>
          </div>
          <div className="page-card">
            {draft ? (
              <DraftReady draft={draft} headingId="apply-ready" />
            ) : (
              <JoinForm joinAs={kind === "tutor" ? "Tutor" : "Counselor"} counselorFields={kind === "counselor"} onDraft={setDraft} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
