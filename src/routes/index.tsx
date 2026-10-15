import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, GraduationCap, Monitor, Users } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import sessionImage from "@/assets/tutorcat-session.jpg";
import { CatPaws, CatPeek } from "@/components/cat";
import { CatalogueResults } from "@/components/catalogue";
import { DialogShell } from "@/components/dialog-shell";
import { Finder } from "@/components/finder";
import { DraftReady } from "@/components/forms";
import { ProfileView } from "@/components/profile-view";
import { CounselingSection, StepsSection } from "@/components/sections";
import { JoinContent, RequestContent, ReviewContent, ShortlistContent } from "@/components/site-dialogs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SpecialistCard, toneOf } from "@/components/specialist-card";
import { Button } from "@/components/ui/button";
import { SITE_URL, isContactEmailSet } from "@/config";
import { useCat } from "@/lib/cat";
import { NO_FILTERS, appliedSummary, catalogueChips, destinations, visibleProfiles, type Filters, type Mode, type Sort } from "@/lib/catalogue";
import type { Draft } from "@/lib/drafts";
import { useI18n } from "@/lib/i18n";
import { offersOnline, profiles, type Profile } from "@/lib/profiles";
import { usePageMeta } from "@/lib/seo";
import { useShortlist } from "@/lib/shortlist";

// The home page. Title, description and Open Graph text come from the root route (src/routes/__root.tsx).
export const Route = createFileRoute("/")({
  head: () => ({ links: [{ rel: "canonical", href: SITE_URL }] }),
  component: Index,
});

type DialogState =
  | { type: "profile"; person: Profile }
  | { type: "request"; person: Profile | null }
  | { type: "review"; person: Profile | null }
  | { type: "join" }
  | { type: "shortlist" }
  | { type: "draft"; draft: Draft }
  | null;

const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

function Index() {
  const translator = useI18n();
  const { t, label } = translator;
  usePageMeta({ title: t("meta.title"), description: t("meta.description"), ogTitle: t("meta.ogTitle"), ogDescription: t("meta.ogDescription") });
  const [mode, setMode] = useState<Mode>("tutoring");
  const [topic, setTopic] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [where, setWhere] = useState("");
  const [applied, setApplied] = useState<Filters>(NO_FILTERS);
  const [chip, setChip] = useState("all");
  const [sort, setSort] = useState<Sort>("featured");
  const { saved, toggle: toggleSaved } = useShortlist();
  const [dialog, setDialog] = useState<DialogState>(null);
  const opener = useRef<HTMLElement | null>(null);
  const catWrapRef = useRef<HTMLDivElement>(null);
  const catHeadRef = useRef<HTMLDivElement>(null);
  const catPawsRef = useRef<HTMLDivElement>(null);
  useCat(catWrapRef, catHeadRef, catPawsRef);

  const open = (next: DialogState) => {
    if (!dialog) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDialog(next);
  };
  const close = useCallback(() => {
    setDialog(null);
    opener.current?.focus();
  }, []);
  const onDraft = (draft: Draft) => open({ type: "draft", draft });
  const search = () => {
    setApplied({ mode, topic, curriculum, where });
    setChip("all");
    scrollToId("specialists");
  };
  const reset = () => {
    setTopic("");
    setCurriculum("");
    setWhere("");
    setApplied(NO_FILTERS);
    setChip("all");
  };

  // Every option and card comes from data/tutors.json and data/regions.json (src/lib/catalogue.ts).
  const chips = catalogueChips(translator, saved);
  const activeChip = chips.find((item) => item.id === chip) ?? chips[0]!;
  const visible = visibleProfiles(applied, activeChip, sort);

  return (
    <>
      <SiteHeader savedCount={saved.length} onShortlist={() => open({ type: "shortlist" })} onJoin={() => open({ type: "join" })} />
      <main id="main">
        <section className="hero">
          <img src={sessionImage} className="hero-photo" alt={t("hero.imageAlt")} width={1536} height={1024} />
          <div className="shell hero-inner">
            <div className="eyebrow">
              <span>{t("hero.eyebrow")}</span>
            </div>
            <h1>
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")} <span>{t("hero.titleAccent")}</span>
            </h1>
            <p className="hero-copy">{t("hero.copy")}</p>
            <div className="hero-note">
              <Users size={16} aria-hidden="true" /> {t("hero.note")}
            </div>
          </div>
        </section>

        <div className="shell">
          <div className="finder-wrap" ref={catWrapRef}>
            <CatPeek ref={catHeadRef} />
            <Finder
              mode={mode}
              topic={topic}
              curriculum={curriculum}
              where={where}
              onModeChange={setMode}
              onTopicChange={setTopic}
              onCurriculumChange={setCurriculum}
              onWhereChange={setWhere}
              onSearch={search}
            />
            <CatPaws ref={catPawsRef} />
          </div>
          <div className="reassurance">
            {profiles.some(offersOnline) && (
              <span>
                <Monitor aria-hidden="true" /> {t("reassure.online")}
              </span>
            )}
            {destinations.length > 0 && (
              <span>
                <GraduationCap aria-hidden="true" /> {t("reassure.destination")}
              </span>
            )}
            <span>
              <Users aria-hidden="true" /> {t("reassure.parents")}
            </span>
          </div>
        </div>

        <section id="specialists" className="shell catalogue">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t("catalogue.eyebrow")}</div>
              <h2>{t("catalogue.title")}</h2>
              <p>{t("catalogue.intro")}</p>
            </div>
            <span className="result-count" role="status">
              {t("catalogue.count", { count: visible.length })}
            </span>
          </div>
          <CatalogueResults
            chips={chips}
            chip={chip}
            onChip={setChip}
            sort={sort}
            onSort={setSort}
            summary={appliedSummary(translator, applied)}
            onReset={reset}
            visible={visible}
            renderCard={(person) => (
              <SpecialistCard
                key={person.id}
                profile={person}
                tone={toneOf(person)}
                saved={saved.includes(person.id)}
                onToggleSave={() => toggleSaved(person.id)}
                onOpen={() => open({ type: "profile", person })}
              />
            )}
          />
          <p className="help-line">
            {t("catalogue.helpText")}{" "}
            <Button variant="link" onClick={() => open({ type: "request", person: null })}>
              {t("catalogue.helpLink")} <ArrowRight className="dir-icon" />
            </Button>
          </p>
        </section>

        <CounselingSection
          id="counseling"
          cta={
            destinations.length > 0 && (
              <Button
                variant="link"
                className="px-0"
                onClick={() => {
                  setMode("counseling");
                  setTopic("");
                  setApplied({ ...NO_FILTERS, mode: "counseling" });
                  setChip("counselors");
                  scrollToId("specialists");
                }}
              >
                {t("pathway.cta")} <ArrowRight className="dir-icon" />
              </Button>
            )
          }
          rowAction={({ person, country }) => (
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("pathway.explore", { country: label("destination", country) })}
              onClick={() => open({ type: "profile", person })}
            >
              <ArrowUpRight className="dir-icon" />
            </Button>
          )}
        />

        <StepsSection id="how-it-works" />

        <section className="shell faq-section">
          <div>
            <div className="eyebrow">{t("faq.eyebrow")}</div>
            <h2 className="section-title">
              {t("faq.titleLine1")}
              <br />
              {t("faq.titleLine2")}
            </h2>
          </div>
          <div>
            {["parents", "countries", "counseling", "booking"].map((item) => (
              <details key={item}>
                <summary>{t(`faq.${item}.q`)}</summary>
                <p>{t(item === "booking" && isContactEmailSet() ? "faq.booking.aReady" : `faq.${item}.a`)}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />

      {dialog && (
        <DialogShell onClose={close} contentKey={dialog.type === "profile" ? `profile-${dialog.person.id}` : dialog.type}>
          {dialog.type === "profile" && (
            <ProfileView
              profile={dialog.person}
              saved={saved.includes(dialog.person.id)}
              onToggleSave={() => toggleSaved(dialog.person.id)}
              onRequest={() => open({ type: "request", person: dialog.person })}
              onReview={() => open({ type: "review", person: dialog.person })}
            />
          )}
          {dialog.type === "shortlist" && (
            <ShortlistContent
              saved={saved}
              onView={(person) => open({ type: "profile", person })}
              onExplore={() => {
                close();
                scrollToId("specialists");
              }}
            />
          )}
          {dialog.type === "request" && <RequestContent person={dialog.person} onDraft={onDraft} />}
          {dialog.type === "join" && <JoinContent onDraft={onDraft} />}
          {dialog.type === "review" && <ReviewContent person={dialog.person} onDraft={onDraft} />}
          {dialog.type === "draft" && <DraftReady draft={dialog.draft} />}
        </DialogShell>
      )}
    </>
  );
}
