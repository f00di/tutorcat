import { ArrowUpRight, BookOpen, Bookmark, Globe2, GraduationCap, ShieldCheck } from "lucide-react";
import { memo, useState } from "react";

import { SiteLink } from "@/components/site-link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  describeLocation,
  displayRole,
  formatExperience,
  hasApprovedPhoto,
  hasVerifiedPermit,
  profiles,
  ratingInfo,
  type Profile,
} from "@/lib/profiles";

// Photos are shown only when approved; assets/ paths are served from the site's base path
// (import.meta.env only exists in the site's own build, so fall back to the root elsewhere).
const photoSrc = (url: string) => (/^https?:\/\//i.test(url) ? url : `${import.meta.env?.BASE_URL ?? "/"}${url.replace(/^\.?\//, "")}`);

/** Round avatar: the tutor's approved photo, otherwise their initials. @category Specialists */
export function Avatar({ profile }: { profile: Profile }) {
  const { t } = useI18n();
  const [broken, setBroken] = useState(false);
  return (
    <div className="avatar">
      {hasApprovedPhoto(profile) && !broken ? (
        <img
          src={photoSrc(profile.imageUrl)}
          alt={profile.imageAlt || t("avatar.photoOf", { name: profile.name })}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <span aria-hidden="true">{profile.initials}</span>
      )}
    </div>
  );
}

/** "Permit verified" pill; renders nothing unless the profile has a verified Gulf tutoring permit. @category Specialists */
export const PermitBadge = ({ profile }: { profile: Profile }) => {
  const { t } = useI18n();
  return hasVerifiedPermit(profile) ? (
    <p className="permit-badge">
      <ShieldCheck aria-hidden="true" />
      {t("card.permitVerified")}
    </p>
  ) : null;
};

const stars = (rating: number) => {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
};

// Average and count from verified reviews (or TutorCat records), never from unverified ones.
/** Stars, average and count from verified reviews only; otherwise "No verified public reviews yet". @category Specialists */
export function RatingSummary({ profile }: { profile: Profile }) {
  const { t, formatRating } = useI18n();
  const info = ratingInfo(profile);
  if (info.average === null) return <p>{t("rating.none")}</p>;
  const params = { rating: formatRating(info.average), count: info.count };
  const description = t(info.source === "manual" ? "rating.labelRecords" : "rating.labelVerified", params);
  const note = info.source === "manual" ? t("rating.records") : t("rating.verifiedCount", { count: info.count });
  return (
    <div className="rating-line" role="img" aria-label={description}>
      <span className="rating-stars" aria-hidden="true">
        {stars(info.average)}
      </span>
      <span aria-hidden="true">{formatRating(info.average)}</span>
      <span aria-hidden="true">{note}</span>
    </div>
  );
}

/** Card cover colours. */
export type Tone = "sage" | "peach" | "lavender";
const TONES: Tone[] = ["sage", "peach", "lavender"];
// The same colour for each person as on the home page (by position in data/tutors.json).
const positions = new Map(profiles.map((profile, index) => [profile.id, index]));
export const toneOf = (profile: Profile): Tone => TONES[(positions.get(profile.id) ?? 0) % TONES.length] ?? "sage";

// With onOpen (home page) View profile opens the profile dialog; without it, it links to the profile page.
// The callbacks get the person, so a page can pass one stable function for every card.
type CardProps = { profile: Profile; tone: Tone; saved: boolean; onToggleSave: (id: string) => void; onOpen?: (profile: Profile) => void };

/** A tutor or counselor card: tone-coloured cover with avatar and save button, then name, role, subjects, levels, study destination, experience, location and View profile. @category Specialists */
export function SpecialistCard({ profile, tone, saved, onToggleSave, onOpen }: CardProps) {
  const translator = useI18n();
  const { t, label, formatList } = translator;
  const experience = formatExperience(profile, translator);
  const levels = profile.tags.slice(0, 3).join(" · ");
  const destinations = profile.countries.map((country) => label("destination", country));

  return (
    <article className="specialist-card">
      <div className={`profile-cover ${tone}`}>
        <Avatar profile={profile} />
        <Button
          variant="ghost"
          size="icon"
          className="save-button"
          aria-label={t(saved ? "card.remove" : "card.save", { name: profile.name })}
          aria-pressed={saved}
          title={t(saved ? "card.removeTitle" : "card.saveTitle")}
          onClick={() => onToggleSave(profile.id)}
        >
          <Bookmark fill={saved ? "currentColor" : "none"} />
        </Button>
      </div>
      <div className="profile-body">
        <h3>
          <bdi>{profile.name}</bdi>
        </h3>
        <div className="profile-role">
          <bdi>{displayRole(profile, translator)}</bdi>
        </div>
        <PermitBadge profile={profile} />
        <div className="subject-tags">
          {profile.subjects.map((subject) => (
            <span key={subject}>{label("subject", subject)}</span>
          ))}
        </div>
        <div className="profile-details">
          {levels && (
            <div>
              <GraduationCap aria-hidden="true" />
              <bdi>{levels}</bdi>
            </div>
          )}
          {destinations.length > 0 && (
            <div>
              <Globe2 aria-hidden="true" /> {t("card.destinations", { list: formatList(destinations) })}
            </div>
          )}
          {experience && (
            <div>
              <BookOpen aria-hidden="true" /> {experience}
            </div>
          )}
        </div>
        {ratingInfo(profile).verified.length > 0 && <RatingSummary profile={profile} />}
        <div className="profile-footer">
          <span className="online">{describeLocation(profile, translator)}</span>
          {onOpen ? (
            <Button variant="outline" onClick={() => onOpen(profile)}>
              {t("card.view")} <ArrowUpRight className="dir-icon" />
            </Button>
          ) : (
            <Button asChild variant="outline">
              <SiteLink to="/tutors/$slug/" params={{ slug: profile.id }} aria-label={t("card.viewLabel", { name: profile.name })}>
                {t("card.view")} <ArrowUpRight className="dir-icon" />
              </SiteLink>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

// For the catalogue grids: a card only re-renders when its own props (or the language) change,
// not on every finder change or dialog open. Pass stable onToggleSave/onOpen functions.
export const MemoSpecialistCard = memo(SpecialistCard);
