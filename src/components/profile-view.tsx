import { ArrowRight, ArrowUpRight, Bookmark, Star } from "lucide-react";
import type { ReactNode } from "react";

import { SiteLink } from "@/components/site-link";
import { Avatar, PermitBadge, RatingSummary } from "@/components/specialist-card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  describeLocation,
  displayRole,
  formatExperience,
  getUniversity,
  hasVerifiedPermit,
  isTutor,
  isVerifiedPublicReview,
  publicContactHref,
  type Profile,
} from "@/lib/profiles";

type Props = {
  profile: Profile;
  saved: boolean;
  onToggleSave: () => void;
  onRequest: () => void;
  onReview: () => void;
  // "dialog" (home page): adds a View full profile link. "page" (/tutors/<id>/): the name is the page's h1.
  variant?: "dialog" | "page";
  after?: ReactNode;
};

// Everything here comes from the profile. Tutor-written text (bio, availability, notes, outcomes)
// is shown as written, never translated; Arabic mode shows the tutor's own Arabic bio if there is one.
/** A specialist's full profile: avatar, role, subjects, bio, details, verified reviews, Request an introduction and Shortlist. Inside DialogShell on the home page (with a View full profile link), or as the body of /tutors/<id>/. @category Specialists */
export function ProfileView({ profile, saved, onToggleSave, onRequest, onReview, variant = "dialog", after }: Props) {
  const translator = useI18n();
  const { t, label, lang, formatList, formatDate, formatRating } = translator;
  const useArabicBio = lang === "ar" && Boolean(profile.shortBioAr);
  const bio = useArabicBio ? profile.shortBioAr : profile.shortBio;
  const experience = formatExperience(profile, translator);
  const university = getUniversity(profile);
  const education = profile.educationOrExperience.split(";").map((part) => part.trim()).filter(Boolean);
  const contact = publicContactHref(profile);
  const reviews = profile.reviews.filter(isVerifiedPublicReview);
  const page = variant === "page";
  // On the page the name is the h1, so the sections are h2; in the dialog they stay h3.
  const H = page ? "h2" : "h3";

  return (
    <>
      <Avatar profile={profile} />
      {page ? (
        <h1>
          <bdi>{profile.name}</bdi>
        </h1>
      ) : (
        <h2 id="dialog-title">
          <bdi>{profile.name}</bdi>
        </h2>
      )}
      <p>
        <bdi>{displayRole(profile, translator)}</bdi>
      </p>
      <PermitBadge profile={profile} />
      <div className="subject-tags">
        {profile.subjects.map((subject) => (
          <span key={subject}>{label("subject", subject)}</span>
        ))}
      </div>

      {bio && (
        <>
          <H>{t("profile.about")}</H>
          <p lang={useArabicBio ? "ar" : "en"} dir="auto">
            {bio}
          </p>
        </>
      )}

      {isTutor(profile) && (
        <>
          <H>{t("profile.academic")}</H>
          <p>
            {profile.tags.length > 0 && (
              <>
                <bdi>{profile.tags.join(" · ")}</bdi>
                <br />
              </>
            )}
            {experience && (
              <>
                {experience}
                <br />
              </>
            )}
            {describeLocation(profile, translator)}
          </p>
        </>
      )}

      {profile.countries.length > 0 && (
        <>
          <H>{t("profile.destination")}</H>
          <p>
            {formatList(profile.countries.map((country) => label("destination", country)))}
            {university && (
              <>
                <br />
                {t("profile.studiedAt", { university })}
              </>
            )}
          </p>
        </>
      )}

      {education.length > 0 && (
        <>
          <H>{t("profile.education")}</H>
          <ul className="plain">
            {education.map((item) => (
              <li key={item}>
                <bdi>{item}</bdi>
              </li>
            ))}
          </ul>
        </>
      )}

      {profile.curricula.length > 0 && (
        <>
          <H>{t("profile.curricula")}</H>
          <p>{formatList(profile.curricula.map((curriculum) => label("curriculum", curriculum)))}</p>
        </>
      )}

      {profile.languages.length > 0 && (
        <>
          <H>{t("profile.languages")}</H>
          <p>{formatList(profile.languages.map((language) => label("language", language)))}</p>
        </>
      )}

      {profile.availability && (
        <>
          <H>{t("profile.availability")}</H>
          <p>
            <bdi>{profile.availability}</bdi>
          </p>
        </>
      )}

      {profile.parentNote && (
        <>
          <H>{t("profile.parentNote")}</H>
          <p dir="auto">{profile.parentNote}</p>
        </>
      )}

      {profile.outcomes.length > 0 && (
        <>
          <H>{t("profile.outcomes")}</H>
          <ul className="plain">
            {profile.outcomes.map((outcome) => (
              <li key={outcome.join("|")}>
                <bdi>{outcome.filter(Boolean).join(" → ")}</bdi>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasVerifiedPermit(profile) && (
        <>
          <H>{t("profile.permit")}</H>
          <p>{t("profile.permitDetail", { permit: label("permit", profile.permitCountry) })}</p>
        </>
      )}

      {contact && (
        <>
          <H>{t("publicContact.title")}</H>
          <p>
            <a className="text-primary underline-offset-4 hover:underline" href={contact.href} {...(contact.type === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
              {t(`publicContact.${contact.type}`)} <ArrowUpRight className="dir-icon inline size-3.5" />
            </a>
          </p>
        </>
      )}

      {(reviews.length > 0 || profile.rating !== null) && (
        <>
          <H>{t("profile.reviews")}</H>
          <RatingSummary profile={profile} />
          {reviews.map((review, index) => (
            <article className="review-card" key={`${review.date}-${index}`}>
              <div className="review-card-top">
                <strong>{label("reviewerType", review.reviewerType)}</strong>
                <span>{review.date ? formatDate(review.date) : t("review.dateNotListed")}</span>
              </div>
              <div className="rating-line" role="img" aria-label={t("review.rated", { rating: formatRating(review.rating ?? 0) })}>
                <Star aria-hidden="true" className="size-3.5" fill="currentColor" /> <span aria-hidden="true">{formatRating(review.rating ?? 0)}</span>
              </div>
              <p dir="auto">{review.comment}</p>
              {review.sessionType && <span className="text-xs">{label("reviewSessionType", review.sessionType)}</span>}
            </article>
          ))}
          <p className="form-note">{t("review.policy")}</p>
        </>
      )}

      <H>{t("profile.family")}</H>
      <p>{t("profile.familyBody")}</p>
      <div className="dialog-actions">
        <Button onClick={onRequest}>
          {t("profile.request")} <ArrowRight className="dir-icon" />
        </Button>
        <Button variant="outline" onClick={onToggleSave} aria-pressed={saved}>
          <Bookmark fill={saved ? "currentColor" : "none"} />
          {t(saved ? "profile.shortlisted" : "profile.shortlist")}
        </Button>
        <Button variant="link" className="px-0" onClick={onReview}>
          {t("profile.review")}
        </Button>
        {!page && (
          <Button asChild variant="link" className="px-0">
            <SiteLink to="/tutors/$slug/" params={{ slug: profile.id }}>
              {t("profile.fullProfile")} <ArrowUpRight className="dir-icon" />
            </SiteLink>
          </Button>
        )}
      </div>
      <p className="mt-4">{t("profile.disclaimer")}</p>
      {after}
    </>
  );
}
