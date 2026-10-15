import { ArrowRight, BookOpen, Compass, GraduationCap, MapPin, Search, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MODES, curricula, destinations, subjects, topicLabel, type Filters, type Mode } from "@/lib/catalogue";
import { regions, useI18n } from "@/lib/i18n";

type Props = {
  mode: Mode;
  topic: string;
  curriculum: string;
  where: string;
  onModeChange: (mode: Mode) => void;
  onTopicChange: (topic: string) => void;
  onCurriculumChange: (curriculum: string) => void;
  onWhereChange: (where: string) => void;
  onSearch: () => void;
};

/** The search card: tutoring / counseling / both tabs, then subject or destination, curriculum and where you're based, and Find my match. Used on the home page and /tutors/. @category Specialists */
export function Finder({ mode, topic, curriculum, where, onModeChange, onTopicChange, onCurriculumChange, onWhereChange, onSearch }: Props) {
  const translator = useI18n();
  const { t, label } = translator;
  const topicOptions = mode === "tutoring" ? subjects : mode === "counseling" ? destinations : [...subjects, ...destinations];

  return (
    <section className="finder" aria-label={t("finder.label")}>
      <div className="finder-tabs" role="group" aria-label={t("finder.supportType")}>
        {MODES.map((item) => (
          <Button
            variant="ghost"
            key={item}
            aria-pressed={mode === item}
            data-active={mode === item}
            onClick={() => {
              onModeChange(item);
              onTopicChange("");
            }}
          >
            {item === "tutoring" ? <BookOpen /> : item === "counseling" ? <Compass /> : <Users />}
            <span className="tab-long">{t(`finder.${item}`)}</span>
            <span className="tab-short">{t(`finder.${item}Short`)}</span>
          </Button>
        ))}
      </div>
      <div className="search-fields">
        <label>
          <span className="field-label">
            {t(mode === "counseling" ? "finder.destinationLabel" : mode === "both" ? "finder.topicLabel" : "finder.subjectLabel")}
          </span>
          <span className="field-wrap">
            <Search size={17} aria-hidden="true" />
            <select value={topic} onChange={(event) => onTopicChange(event.target.value)}>
              <option value="">
                {t(mode === "counseling" ? "finder.anyDestination" : mode === "both" ? "finder.anyTopic" : "finder.allSubjects")}
              </option>
              {topicOptions.map((item) => (
                <option key={item} value={item}>
                  {topicLabel(translator, item)}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label>
          <span className="field-label">{t("finder.curriculumLabel")}</span>
          <span className="field-wrap">
            <GraduationCap size={18} aria-hidden="true" />
            <select value={curriculum} onChange={(event) => onCurriculumChange(event.target.value)}>
              <option value="">{t("finder.anyCurriculum")}</option>
              {curricula.map((item) => (
                <option key={item} value={item}>
                  {label("curriculum", item)}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label>
          <span className="field-label">{t("finder.whereLabel")}</span>
          <span className="field-wrap">
            <MapPin size={17} aria-hidden="true" />
            <select value={where} onChange={(event) => onWhereChange(event.target.value)}>
              <option value="">{t("finder.anywhere")}</option>
              {regions.countries.map((country) => (
                <optgroup key={country.name} label={label("country", country.name)}>
                  <option value={country.name}>{t("finder.allOfCountry", { country: label("country", country.name) })}</option>
                  {country.cities.map((city) => (
                    <option key={city.name} value={`${country.name}|${city.name}`}>
                      {label("city", city.name)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </span>
        </label>
        <Button className="search-button" onClick={onSearch}>
          {t("finder.submit")} <ArrowRight className="dir-icon" />
        </Button>
      </div>
    </section>
  );
}

/** The Finder with its own fields, starting from `initial` (e.g. the filters in a /tutors/ link); Find my match hands them to onSearch. @category Specialists */
export function FinderForm({ initial, onSearch }: { initial: Filters; onSearch: (filters: Filters) => void }) {
  // Opens on the Tutoring tab, like the home page, unless the search was for a destination.
  const [mode, setMode] = useState<Mode>(initial.topic ? initial.mode : "tutoring");
  const [topic, setTopic] = useState(initial.topic);
  const [curriculum, setCurriculum] = useState(initial.curriculum);
  const [where, setWhere] = useState(initial.where);
  return (
    <Finder
      mode={mode}
      topic={topic}
      curriculum={curriculum}
      where={where}
      onModeChange={setMode}
      onTopicChange={setTopic}
      onCurriculumChange={setCurriculum}
      onWhereChange={setWhere}
      onSearch={() => onSearch({ mode, topic, curriculum, where })}
    />
  );
}
