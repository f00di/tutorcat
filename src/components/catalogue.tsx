import { Search } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { Chip, Sort } from "@/lib/catalogue";
import { useI18n } from "@/lib/i18n";
import type { Profile } from "@/lib/profiles";

type Props = {
  chips: Chip[];
  chip: string;
  onChip: (id: string) => void;
  sort: Sort;
  onSort: (sort: Sort) => void;
  summary: string[];
  onReset: () => void;
  visible: Profile[];
  renderCard: (person: Profile) => ReactNode;
};

/** The catalogue below the section heading: chips, sort, the applied filters, then the cards (or "Your match is still out there"). Used on the home page and /tutors/. @category Specialists */
export function CatalogueResults({ chips, chip, onChip, sort, onSort, summary, onReset, visible, renderCard }: Props) {
  const { t } = useI18n();
  return (
    <>
      <div className="catalogue-toolbar">
        <div className="filter-chips" role="group" aria-label={t("catalogue.filters")}>
          {chips.map((item) => (
            <Button
              key={item.id}
              variant={chip === item.id ? "default" : "outline"}
              aria-pressed={chip === item.id}
              onClick={() => (item.id === "all" ? onReset() : onChip(item.id))}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <select className="sort-select" aria-label={t("sort.label")} value={sort} onChange={(event) => onSort(event.target.value as Sort)}>
          <option value="featured">{t("sort.featured")}</option>
          <option value="name">{t("sort.name")}</option>
          <option value="experience">{t("sort.experience")}</option>
        </select>
      </div>
      {summary.length > 0 && (
        <p className="applied-filters">
          {summary.join(" · ")}{" "}
          <Button variant="link" size="sm" onClick={onReset}>
            {t("catalogue.clear")}
          </Button>
        </p>
      )}
      <div className="specialist-grid">
        {visible.map(renderCard)}
        {visible.length === 0 && (
          <div className="empty-state">
            <Search className="mx-auto" aria-hidden="true" />
            <h3>{t("empty.title")}</h3>
            <p>{t("empty.body")}</p>
            <Button variant="outline" onClick={onReset}>
              {t("empty.showAll")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
