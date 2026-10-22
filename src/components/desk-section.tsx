import { ArrowDown, BadgeCheck, CalendarDays, CalendarOff, FileText, HardDrive, MonitorSmartphone, NotebookPen, WifiOff } from "lucide-react";

import type { JoinKind } from "@/components/join-page";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

// Real Tutorcat Desk screenshots of its made-up sample data (Sara A., Omar K., "Sample Tutor"), one set
// per language: <screen>-<en|ar>-<640|1280>.avif plus a 1280px JPEG for browsers without AVIF. They sit
// below the fold and load lazily, so they cost nothing on first load. Retake them when the Desk changes.
const FILES = import.meta.glob<string>("../assets/desk/*", { eager: true, import: "default" });
const file = (name: string) => FILES[`../assets/desk/${name}`] ?? "";

const FEATURES = [
  { key: "schedule", icon: CalendarDays },
  { key: "blackouts", icon: CalendarOff },
  { key: "notes", icon: NotebookPen },
  { key: "invoices", icon: FileText },
  { key: "offline", icon: WifiOff },
];

const SHOTS = ["today", "schedule", "notes", "invoice"];
// Two columns inside .shell (1184px less padding), one column on phones.
const SIZES = "(max-width: 640px) calc(100vw - 32px), (max-width: 1184px) calc(50vw - 44px), 548px";

/** /for-tutors and /for-counselors: what Tutorcat Desk does, free with a listing, data on the device, sample screenshots, and the button to the application form. Invite-only: the Desk's address is never on this site. @category Layout */
export function DeskSection({ kind }: { kind: JoinKind }) {
  const { t, lang } = useI18n();

  return (
    <section id="desk" className="shell page-section cat-perch">
      <div className="eyebrow">
        <MonitorSmartphone size={14} aria-hidden="true" /> {t("desk.eyebrow")}
      </div>
      <h2 className="section-title">{t(`desk.${kind}Title`)}</h2>
      <p className="page-lead">{t("desk.intro")}</p>
      <div className="desk-layout">
        <div className="tool-grid">
          {FEATURES.map(({ key, icon: Icon }) => (
            <div key={key} className="tool-card">
              <Icon aria-hidden="true" />
              <div>
                <h3>{t(`desk.feature.${key}.title`)}</h3>
                <p>{t(`desk.feature.${key}.body`)}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="rule-box">
            <BadgeCheck aria-hidden="true" />
            <div>
              <h3>{t(`desk.free.${kind}`)}</h3>
              <p>{t("desk.free.body")}</p>
            </div>
          </div>
          <div className="rule-box">
            <HardDrive aria-hidden="true" />
            <div>
              <h3>{t("desk.local.title")}</h3>
              <p>{t("desk.local.body")}</p>
            </div>
          </div>
          <p className="page-note">{t("desk.invite")}</p>
          <Button asChild>
            <a href="#apply">
              {t("desk.cta")} <ArrowDown />
            </a>
          </Button>
        </div>
      </div>
      <ul className="desk-shots">
        {SHOTS.map((name) => {
          const base = `${name}-${lang}`;
          return (
            <li key={name}>
              <figure className="desk-shot">
                <span className="sample-badge">{t("desk.sample")}</span>
                <picture>
                  <source type="image/avif" srcSet={`${file(`${base}-640.avif`)} 640w, ${file(`${base}-1280.avif`)} 1280w`} sizes={SIZES} />
                  <img src={file(`${base}-1280.jpg`)} alt={t(`desk.shot.${name}.alt`)} width={1280} height={800} loading="lazy" decoding="async" />
                </picture>
                <figcaption>{t(`desk.shot.${name}.caption`)}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
