import { ArrowRight, Check, Copy, Mail } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { isContactEmailSet } from "@/config";
import { applicationDraft, draftText, mailtoHref, requestDraft, reviewDraft, type Draft } from "@/lib/drafts";
import { regions, useI18n } from "@/lib/i18n";
import type { Profile } from "@/lib/profiles";

// The three forms from the previous site, in Lovable's dialog style. Each prepares an English
// draft for the team; nothing is sent from the page. Select values are English on purpose.

const Field = ({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) => (
  <label className={className}>
    <span className="field-label">{label}</span>
    {children}
  </label>
);

function FormFooter({ submit, status }: { submit: string; status: string }) {
  const { t } = useI18n();
  return (
    <>
      {status && (
        <p className="form-error" role="alert">
          {status}
        </p>
      )}
      <Button type="submit">
        {submit} <ArrowRight className="dir-icon" />
      </Button>
      <p className="form-note">{t(isContactEmailSet() ? "form.noteReady" : "form.notePending")}</p>
    </>
  );
}

// Native validation shows the field messages; the status line explains what is missing.
function useValidatedSubmit(onValid: (data: FormData, form: HTMLFormElement) => void, invalidKey: string) {
  const { t } = useI18n();
  const [status, setStatus] = useState("");
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus(t(invalidKey));
      return;
    }
    setStatus("");
    onValid(new FormData(form), form);
  };
  return { status, onSubmit };
}

const Choices = ({ items }: { items: [value: string, label: string][] }) => (
  <>
    {items.map(([value, text]) => (
      <option key={value} value={value}>
        {text}
      </option>
    ))}
  </>
);

export function RequestForm({ person, profiles, onDraft }: { person: Profile | null; profiles: Profile[]; onDraft: (draft: Draft) => void }) {
  const { t, langName } = useI18n();
  const { status, onSubmit } = useValidatedSubmit((data) => {
    const chosen = profiles.find((profile) => profile.id === data.get("specialist"));
    onDraft(requestDraft(data, chosen?.name ?? "", langName));
  }, "contact.status.invalid");

  return (
    <form className="form-grid" noValidate onSubmit={onSubmit}>
      <Field label={t("contact.name")}>
        <input required name="name" autoComplete="name" placeholder={t("contact.namePlaceholder")} />
      </Field>
      <Field label={t("form.email")}>
        <input required type="email" dir="ltr" name="email" autoComplete="email" placeholder={t("contact.emailPlaceholder")} />
      </Field>
      <div className="form-pair">
        <Field label={t("contact.level")}>
          <select required name="level" defaultValue="">
            <option value="">{t("form.chooseOne")}</option>
            <Choices
              items={[
                ["Middle school", t("contact.level.middleSchool")],
                ["High school", t("contact.level.highSchool")],
                ["A-levels/IB/AP", t("contact.level.advanced")],
                ["Undergraduate", t("contact.level.undergraduate")],
                ["Transfer student", t("contact.level.transfer")],
                ["Other", t("form.other")],
              ]}
            />
          </select>
        </Field>
        <Field label={t("contact.support")}>
          <select required name="support" defaultValue="">
            <option value="">{t("form.chooseOne")}</option>
            <Choices
              items={[
                ["Academic tutoring", t("contact.support.tutoring")],
                ["Test prep", t("contact.support.testPrep")],
                ["Country counseling", t("contact.support.counseling")],
                ["University pathway planning", t("contact.support.pathway")],
                ["Unsure", t("contact.support.unsure")],
              ]}
            />
          </select>
        </Field>
      </div>
      <Field label={t("contact.specialist")}>
        <select name="specialist" defaultValue={person?.id ?? ""}>
          <option value="">{t("contact.noPreference")}</option>
          <Choices items={profiles.map((profile) => [profile.id, profile.name])} />
        </select>
      </Field>
      <Field label={t("contact.message")}>
        <textarea name="message" placeholder={t("contact.messagePlaceholder")} />
      </Field>
      <FormFooter submit={t("request.submit")} status={status} />
    </form>
  );
}

export function JoinForm({ onDraft }: { onDraft: (draft: Draft) => void }) {
  const { t, label, langName } = useI18n();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const region = regions.countries.find((item) => item.name === country);
  const showPlace = country === "Other" || city === "Other";
  const { status, onSubmit } = useValidatedSubmit((data) => onDraft(applicationDraft(data, langName)), "applyForm.status.invalid");

  // At least one subject or study destination, checked before the form's own validation runs.
  const requireSubjectOrCountry = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const subjects = form.elements.namedItem("subjects") as HTMLInputElement;
    const countries = form.elements.namedItem("countries") as HTMLInputElement;
    subjects.setCustomValidity(subjects.value.trim() || countries.value.trim() ? "" : t("applyForm.status.needSubjectOrCountry"));
    onSubmit(event);
  };

  return (
    <form className="form-grid" noValidate onSubmit={requireSubjectOrCountry}>
      <div className="form-pair">
        <Field label={t("applyForm.fullName")}>
          <input required name="fullName" autoComplete="name" />
        </Field>
        <Field label={t("form.email")}>
          <input required type="email" dir="ltr" name="email" autoComplete="email" />
        </Field>
        <Field label={t("applyForm.phone")}>
          <input type="tel" dir="ltr" name="phone" autoComplete="tel" />
        </Field>
        <Field label={t("applyForm.joinAs")}>
          <select required name="applicantType" defaultValue="">
            <option value="">{t("form.chooseOne")}</option>
            <Choices
              items={[
                ["Tutor", label("profileType", "Tutor")],
                ["Counselor", label("profileType", "Counselor")],
                ["Tutor + Counselor", label("profileType", "Tutor + Counselor")],
              ]}
            />
          </select>
        </Field>
        <Field label={t("applyForm.country")}>
          <select
            name="country"
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              setCity("");
            }}
          >
            <option value="">{t("form.chooseOne")}</option>
            <Choices items={regions.countries.map((item) => [item.name, label("country", item.name)])} />
            <option value="Other">{t("form.other")}</option>
          </select>
        </Field>
        {region && (
          <Field label={t("applyForm.city")}>
            <select name="city" value={city} onChange={(event) => setCity(event.target.value)}>
              <option value="">{t("form.chooseOne")}</option>
              <Choices items={region.cities.map((item) => [item.name, label("city", item.name)])} />
              <option value="Other">{t("form.otherNotListed")}</option>
            </select>
          </Field>
        )}
      </div>
      {showPlace && (
        <Field label={t("applyForm.place")}>
          <input name="place" autoComplete="address-level2" />
        </Field>
      )}
      <div className="form-pair">
        <Field label={t("applyForm.years")}>
          <input name="years" type="number" min={0} max={60} inputMode="numeric" dir="ltr" />
        </Field>
        <Field label={t("applyForm.sessionMode")}>
          <select name="sessionMode" defaultValue="">
            <option value="">{t("form.chooseOne")}</option>
            <Choices items={["Online", "In-person", "Hybrid"].map((mode) => [mode, label("sessionMode", mode)])} />
          </select>
        </Field>
      </div>
      <Field label={t("applyForm.subjects")}>
        <input name="subjects" placeholder={t("applyForm.subjectsPlaceholder")} />
      </Field>
      <Field label={t("applyForm.countries")}>
        <input name="countries" placeholder={t("applyForm.countriesPlaceholder")} />
      </Field>
      <div className="form-pair">
        <Field label={t("applyForm.languages")}>
          <input name="languages" placeholder={t("applyForm.languagesPlaceholder")} />
        </Field>
        <Field label={t("applyForm.availability")}>
          <input name="availability" placeholder={t("applyForm.availabilityPlaceholder")} />
        </Field>
        <Field label={t("applyForm.photoUrl")}>
          <input name="photoUrl" type="url" dir="ltr" placeholder="https://..." />
        </Field>
        <Field label={t("applyForm.profileLink")}>
          <input name="profileLink" type="url" dir="ltr" placeholder="https://..." />
        </Field>
      </div>
      <Field label={t("applyForm.experience")}>
        <textarea name="experience" placeholder={t("applyForm.experiencePlaceholder")} />
      </Field>
      <Field label={t("applyForm.bio")}>
        <textarea name="bio" placeholder={t("applyForm.bioPlaceholder")} />
      </Field>
      <label className="check-label">
        <input required name="consent" type="checkbox" />
        <span>{t("applyForm.consent")}</span>
      </label>
      <label className="check-label">
        <input name="photoConsent" type="checkbox" />
        <span>{t("applyForm.photoConsent")}</span>
      </label>
      <label className="check-label">
        <input required name="listingAgreement" type="checkbox" />
        <span>{t("applyForm.listingAgreement")}</span>
      </label>
      <FormFooter submit={t("join.submit")} status={status} />
    </form>
  );
}

// Reviews are only published after the tutor confirms the session and TutorCat approves them.
export function ReviewForm({ person, profiles, onDraft }: { person: Profile | null; profiles: Profile[]; onDraft: (draft: Draft) => void }) {
  const { t, label, langName } = useI18n();
  const { status, onSubmit } = useValidatedSubmit((data) => {
    const profile = profiles.find((item) => item.id === data.get("profileId"));
    if (profile) onDraft(reviewDraft(data, profile, langName));
  }, "reviewForm.status.invalid");

  return (
    <form className="form-grid" noValidate onSubmit={onSubmit}>
      <div className="form-pair">
        <Field label={t("reviewForm.name")}>
          <input required name="studentName" autoComplete="name" />
        </Field>
        <Field label={t("form.email")}>
          <input required type="email" dir="ltr" name="studentEmail" autoComplete="email" />
        </Field>
      </div>
      <Field label={t("reviewForm.profile")}>
        <select required name="profileId" defaultValue={person?.id ?? ""}>
          <option value="">{t("form.chooseOne")}</option>
          <Choices items={profiles.map((profile) => [profile.id, profile.name])} />
        </select>
      </Field>
      <div className="form-pair">
        <Field label={t("reviewForm.rating")}>
          <select required name="rating" defaultValue="">
            <option value="">{t("form.chooseOne")}</option>
            <Choices items={["5", "4", "3", "2", "1"].map((value) => [value, t(`reviewForm.rating.${value}`)])} />
          </select>
        </Field>
        <Field label={t("reviewForm.sessionType")}>
          <select required name="sessionType" defaultValue="">
            <option value="">{t("form.chooseOne")}</option>
            <Choices items={["Tutoring", "Counseling", "Test Prep", "Other"].map((type) => [type, label("reviewSessionType", type)])} />
          </select>
        </Field>
      </div>
      <Field label={t("reviewForm.comment")}>
        <textarea required name="comment" rows={5} maxLength={1200} placeholder={t("reviewForm.commentPlaceholder")} />
      </Field>
      <label className="check-label">
        <input name="publicPermission" type="checkbox" />
        <span>{t("reviewForm.permission")}</span>
      </label>
      <label className="check-label">
        <input required name="moderationAgreement" type="checkbox" />
        <span>{t("reviewForm.moderation")}</span>
      </label>
      <FormFooter submit={t("reviewForm.submit")} status={status} />
    </form>
  );
}

// Lovable's "draft is ready" step: copy it, or open it in the visitor's email app.
export function DraftReady({ draft }: { draft: Draft }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  return (
    <>
      <h2 id="dialog-title">{t(`draft.title.${draft.kind}`)}</h2>
      <p>{t(isContactEmailSet() ? "draft.ready" : "draft.pending")}</p>
      <pre className="draft-text" dir="ltr" lang="en">
        {draftText(draft)}
      </pre>
      <div className="dialog-actions">
        <Button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(draftText(draft));
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? <Check /> : <Copy />}
          <span role="status">{t(copied ? "draft.copied" : "draft.copy")}</span>
        </Button>
        <Button asChild variant="outline">
          <a href={mailtoHref(draft)}>
            <Mail />
            {t("draft.open")}
          </a>
        </Button>
      </div>
    </>
  );
}
