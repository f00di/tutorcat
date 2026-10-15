import { ArrowRight, ArrowUpRight, Bookmark } from "lucide-react";

import { JoinForm, RequestForm, ReviewForm } from "@/components/forms";
import { SiteLink } from "@/components/site-link";
import { Button } from "@/components/ui/button";
import type { Draft } from "@/lib/drafts";
import { useI18n } from "@/lib/i18n";
import { profiles, type Profile } from "@/lib/profiles";

// What the home page dialogs have always shown, shared with the other pages. Each goes inside
// DialogShell. On the home page "View" opens the profile dialog; elsewhere it links to the profile page.

/** Shortlist dialog: the people saved during this visit. @category Layout */
export function ShortlistContent({ saved, onView, onExplore }: { saved: string[]; onView?: (person: Profile) => void; onExplore?: () => void }) {
  const { t, label, formatList } = useI18n();
  return (
    <>
      <div className="eyebrow">
        <Bookmark size={16} aria-hidden="true" /> {t("shortlist.eyebrow")}
      </div>
      <h2 id="dialog-title">{t("shortlist.title")}</h2>
      <p>{t(saved.length ? "shortlist.filled" : "shortlist.empty")}</p>
      <div className="mt-6 grid gap-4">
        {profiles
          .filter((person) => saved.includes(person.id))
          .map((person) => (
            <div key={person.id} className="flex items-center justify-between gap-3 border-b pb-4">
              <div>
                <strong>
                  <bdi>{person.name}</bdi>
                </strong>
                <p>{formatList(person.subjects.map((subject) => label("subject", subject)))}</p>
              </div>
              {onView ? (
                <Button variant="outline" onClick={() => onView(person)}>
                  {t("shortlist.view")} <ArrowUpRight className="dir-icon" />
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <SiteLink to="/tutors/$slug/" params={{ slug: person.id }}>
                    {t("shortlist.view")} <ArrowUpRight className="dir-icon" />
                  </SiteLink>
                </Button>
              )}
            </div>
          ))}
      </div>
      {!saved.length &&
        (onExplore ? (
          <Button className="mt-4" onClick={onExplore}>
            {t("shortlist.explore")} <ArrowRight className="dir-icon" />
          </Button>
        ) : (
          <Button asChild className="mt-4">
            <SiteLink to="/tutors/">
              {t("shortlist.explore")} <ArrowRight className="dir-icon" />
            </SiteLink>
          </Button>
        ))}
    </>
  );
}

/** Request an introduction dialog. @category Forms */
export function RequestContent({ person, onDraft }: { person: Profile | null; onDraft: (draft: Draft) => void }) {
  const { t } = useI18n();
  return (
    <>
      <div className="eyebrow">{t("request.eyebrow")}</div>
      <h2 id="dialog-title">{person ? t("request.titlePerson", { name: person.name.split(" ")[0] ?? person.name }) : t("request.title")}</h2>
      <p>{t("request.intro")}</p>
      <RequestForm person={person} profiles={profiles} onDraft={onDraft} />
    </>
  );
}

/** Join as a specialist dialog. @category Forms */
export function JoinContent({ onDraft }: { onDraft: (draft: Draft) => void }) {
  const { t } = useI18n();
  return (
    <>
      <div className="eyebrow">{t("join.eyebrow")}</div>
      <h2 id="dialog-title">{t("join.title")}</h2>
      <p>{t("join.intro")}</p>
      <JoinForm onDraft={onDraft} />
    </>
  );
}

/** Rate this tutor dialog. @category Forms */
export function ReviewContent({ person, onDraft }: { person: Profile | null; onDraft: (draft: Draft) => void }) {
  const { t } = useI18n();
  return (
    <>
      <div className="eyebrow">{t("reviewForm.eyebrow")}</div>
      <h2 id="dialog-title">{t("reviewForm.title")}</h2>
      <p>{t("review.policy")}</p>
      <ReviewForm person={person} profiles={profiles} onDraft={onDraft} />
    </>
  );
}
