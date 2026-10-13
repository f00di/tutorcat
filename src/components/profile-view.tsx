import { ArrowRight, ArrowUpRight, Bookmark, Star } from "lucide-react";

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

type Props = { profile: Profile; saved: boolean; onToggleSave: () => void; onRequest: () => void; onReview: () => void };

// Everything here comes from the profile. Tutor-written text (bio, availability, notes, outcomes)
// is shown as written, never translated; Arabic mode shows the tutor's own Arabic bio if there is one.
export function ProfileView({ profile, saved, onToggleSave, onRequest, onReview }: Props) {
  const translator = useI18n();
  const { t, label, lang, formatList, formatDate, formatRating } = translator;
  const useArabicBio = lang === "ar" && Boolean(profile.shortBioAr);
  const bio = useArabicBio ? profile.shortBioAr : profile.shortBio;
  const experience = formatExperience(profile, translator);
  const university = getUniversity(profile);
  const education = profile.educationOrExperience.split(";").map((part) => part.trim()).filter(Boolean);
  const contact = publicContactHref(profile);
  const reviews = profile.reviews.filter(isVerifiedPublicReview);

  return (
    <>
      <Avatar profile={profile} />
      <h2 id="dialog-title">
        <bdi>{profile.name}</bdi>
      </h2>
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
          <h3>{t("profile.about")}</h3>
          <p lang={useArabicBio ? "ar" : "en"} dir="auto">
            {bio}
          </p>
        </>
      )}

      {isTutor(profile) && (
        <>
          <h3>{t("profile.academic")}</h3>
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
          <h3>{t("profile.destination")}</h3>
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
          <h3>{t("profile.education")}</h3>
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
          <h3>{t("profile.curricula")}</h3>
          <p>{formatList(profile.curricula.map((curriculum) => label("curriculum", curriculum)))}</p>
        </>
      )}

      {profile.languages.length > 0 && (
        <>
          <h3>{t("profile.languages")}</h3>
          <p>{formatList(profile.languages.map((language) => label("language", language)))}</p>
        </>
      )}

      {profile.availability && (
        <>
          <h3>{t("profile.availability")}</h3>
          <p>
            <bdi>{profile.availability}</bdi>
          </p>
        </>
      )}

      {profile.parentNote && (
        <>
          <h3>{t("profile.parentNote")}</h3>
          <p dir="auto">{profile.parentNote}</p>
        </>
      )}

      {profile.outcomes.length > 0 && (
        <>
          <h3>{t("profile.outcomes")}</h3>
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
          <h3>{t("profile.permit")}</h3>
          <p>{t("profile.permitDetail", { permit: label("permit", profile.permitCountry) })}</p>
        </>
      )}

      {contact && (
        <>
          <h3>{t("publicContact.title")}</h3>
          <p>
            <a className="text-primary underline-offset-4 hover:underline" href={contact.href} {...(contact.type === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
              {t(`publicContact.${contact.type}`)} <ArrowUpRight className="dir-icon inline size-3.5" />
            </a>
          </p>
        </>
      )}

      {(reviews.length > 0 || profile.rating !== null) && (
        <>
          <h3>{t("profile.reviews")}</h3>
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

      <h3>{t("profile.family")}</h3>
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
      </div>
      <p className="mt-4">{t("profile.disclaimer")}</p>
    </>
  );
}
