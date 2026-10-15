import { Compass, Globe2 } from "lucide-react";
import type { ReactNode } from "react";

import { useI18n } from "@/lib/i18n";
import { getUniversity, profiles } from "@/lib/profiles";

const classes = (...names: (string | undefined)[]) => names.filter(Boolean).join(" ");

// Every study destination with the counselor who covers it, from data/tutors.json.
export const counselingRows = profiles.flatMap((person) => person.countries.map((country) => ({ person, country, university: getUniversity(person) })));
export type CounselingRow = (typeof counselingRows)[number];

/** "A world of options": the counseling section with every study destination and its counselor. Used on the home page and /counseling/. @category Specialists */
export function CounselingSection({
  id,
  className,
  cta,
  rowAction,
}: {
  id?: string;
  className?: string;
  cta?: ReactNode;
  rowAction: (row: CounselingRow) => ReactNode;
}) {
  const { t, label } = useI18n();
  return (
    <section id={id} className={classes("pathway", className)}>
      <div className="shell pathway-inner">
        <div>
          <div className="eyebrow">
            <Compass size={14} aria-hidden="true" /> {t("pathway.eyebrow")}
          </div>
          <h2 className="section-title">
            {t("pathway.titleLine1")}
            <br />
            {t("pathway.titleLine2")}
          </h2>
          <p>{t("pathway.body")}</p>
          {cta}
        </div>
        {counselingRows.length > 0 && (
          <div className="destination-list">
            {counselingRows.map((row) => (
              <div className="destination-row" key={`${row.person.id}-${row.country}`}>
                <div className="destination-main">
                  <span className="destination-icon" aria-hidden="true">
                    <Globe2 size={25} />
                  </span>
                  <div>
                    <strong>{label("destination", row.country)}</strong>
                    <p>
                      <bdi>{row.university || row.person.name}</bdi>
                    </p>
                  </div>
                </div>
                {rowAction(row)}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** "Your next step starts here": find your person, have a conversation, move forward. Used on the home page and /how-it-works/. @category Layout */
export function StepsSection({ id, className, children }: { id?: string; className?: string; children?: ReactNode }) {
  const { t } = useI18n();
  return (
    <section id={id} className={classes("shell steps-section", className)}>
      <div className="eyebrow">{t("steps.eyebrow")}</div>
      <h2 className="section-title">{t("steps.title")}</h2>
      <div className="steps-grid">
        {["find", "talk", "move"].map((step, index) => (
          <div key={step}>
            <div className="step-number">{`0${index + 1}`}</div>
            <h3>{t(`steps.${step}.title`)}</h3>
            <p>{t(`steps.${step}.body`)}</p>
          </div>
        ))}
      </div>
      {children}
    </section>
  );
}
