import { Siren } from "lucide-react";
import { useState } from "react";

import { Choices, Field, FormFooter, useValidatedSubmit } from "@/components/forms";
import { NOT_LISTED, REPORT_CATEGORIES, REPORT_CONTACT_TYPES, reportDraft, type ReportDraft } from "@/lib/drafts";
import { regions, useI18n, type Region } from "@/lib/i18n";
import type { Profile } from "@/lib/profiles";

/** Report a concern: who it's about (optional), category, date, how it happened, what happened, optional reporter details and a confirmation; onDraft receives an English email draft (URGENT for child safety). @category Forms */
export function ReportForm({ profiles, initialProfile = "", onDraft }: { profiles: Profile[]; initialProfile?: string; onDraft: (draft: ReportDraft) => void }) {
  const { t, langName } = useI18n();
  const [about, setAbout] = useState(initialProfile);
  const [category, setCategory] = useState("");
  const { status, onSubmit } = useValidatedSubmit((data) => {
    const profile = profiles.find((item) => item.id === data.get("about")) ?? null;
    onDraft(reportDraft(data, profile, langName));
  }, "contact.status.invalid");

  return (
    <form className="form-grid" noValidate onSubmit={onSubmit}>
      <Field label={t("report.about")}>
        <select name="about" value={about} onChange={(event) => setAbout(event.target.value)}>
          <option value="">{t("report.aboutNone")}</option>
          <Choices items={profiles.map((profile) => [profile.id, profile.name])} />
          <option value={NOT_LISTED}>{t("report.aboutNotListed")}</option>
        </select>
      </Field>
      {about === NOT_LISTED && (
        <Field label={t("report.aboutDetails")}>
          <input name="aboutDetails" />
        </Field>
      )}
      <Field label={t("report.category")}>
        <select required name="category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">{t("form.chooseOne")}</option>
          <Choices items={Object.entries(REPORT_CATEGORIES).map(([key, value]) => [value, t(`report.category.${key}`)])} />
        </select>
      </Field>
      {category === REPORT_CATEGORIES.childSafety && (
        <p className="safety-note" role="note">
          {t("report.childSafetyNote")}
        </p>
      )}
      <div className="form-pair">
        <Field label={t("report.date")}>
          <input name="date" type="date" />
        </Field>
        <Field label={t("report.contactType")}>
          <select name="contactType" defaultValue="">
            <option value="">{t("form.chooseOne")}</option>
            <Choices items={Object.entries(REPORT_CONTACT_TYPES).map(([key, value]) => [value, t(`report.contactType.${key}`)])} />
          </select>
        </Field>
      </div>
      <Field label={t("report.description")}>
        <textarea required name="description" rows={6} maxLength={2000} placeholder={t("report.descriptionPlaceholder")} />
      </Field>
      <fieldset className="choice-group">
        <legend className="field-label">{t("report.you")}</legend>
        <div className="form-pair">
          <Field label={t("report.name")}>
            <input name="reporterName" autoComplete="name" />
          </Field>
          <Field label={t("report.contact")}>
            <input name="reporterContact" dir="ltr" autoComplete="email" />
          </Field>
        </div>
        <p className="form-note">{t("report.anonymous")}</p>
      </fieldset>
      <p className="form-note">{t("report.screenshots")}</p>
      <label className="check-label">
        <input required name="consent" type="checkbox" />
        <span>{t("report.consent")}</span>
      </label>
      <FormFooter submit={t("report.submit")} status={status} />
    </form>
  );
}

/** "If someone is in danger right now": contact emergency services first. Lists only the numbers in data/regions.json marked confirmed (none until the owner checks them). @category Forms */
export function UrgentNotice({ countries = regions.countries }: { countries?: readonly Pick<Region, "name" | "emergencyNumbers">[] }) {
  const { t, label, lang } = useI18n();
  const confirmed = countries
    .map((country) => ({ name: country.name, numbers: (country.emergencyNumbers ?? []).filter((item) => item.confirmed === true) }))
    .filter((country) => country.numbers.length > 0);

  return (
    <div className="rule-box urgent-box" role="note">
      <Siren aria-hidden="true" />
      <div>
        <h2>{t("report.urgent.title")}</h2>
        <p>{t("report.urgent.body")}</p>
        {confirmed.length > 0 && (
          <dl className="emergency-list" aria-label={t("report.urgent.numbers")}>
            {confirmed.map((country) => (
              <div key={country.name}>
                <dt>{label("country", country.name)}</dt>
                {country.numbers.map((item) => (
                  <dd key={`${item.number}-${item.service}`}>
                    <span>{lang === "ar" ? item.serviceAr : item.service}</span>{" "}
                    <a href={`tel:${item.number}`} dir="ltr">
                      <bdi>{item.number}</bdi>
                    </a>
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
