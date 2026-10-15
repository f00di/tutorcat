import { useI18n } from "@/lib/i18n";

// A preview of the planned monthly invoice (docs/roadmap Spec D layout): "INVOICE" at the top end,
// tutor block at the top start, solid header bar, light row dividers, a big total box. Obvious
// sample data only, always labelled "Example". Dates and money are formatted for the visitor's language.
const ROWS = [
  { date: "2026-03-07", hours: 1.5 },
  { date: "2026-03-14", hours: 1 },
  { date: "2026-03-21", hours: 1.5 },
];
const RATE = 200; // AED per hour

/** A static example of the planned tutor invoice, labelled "Example". @category Specialists */
export function SampleInvoice() {
  const { t, locale } = useI18n();
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: "AED", minimumFractionDigits: 2 });
  const day = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const hours = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const totalHours = ROWS.reduce((sum, row) => sum + row.hours, 0);

  return (
    <figure className="sample-invoice" aria-label={t("invoice.label")}>
      <span className="sample-badge">{t("invoice.example")}</span>
      <div className="invoice-top">
        <div>
          <strong>{t("invoice.tutorName")}</strong>
          <span>{t("invoice.tutorContact")}</span>
        </div>
        <div className="invoice-title">
          <strong>{t("invoice.title")}</strong>
          <span>{t("invoice.number")}</span>
        </div>
      </div>
      <dl className="invoice-details">
        <div>
          <dt>{t("invoice.billTo")}</dt>
          <dd>{t("invoice.student")}</dd>
        </div>
        <div>
          <dt>{t("invoice.service")}</dt>
          <dd>{t("invoice.serviceValue")}</dd>
        </div>
        <div>
          <dt>{t("invoice.rate")}</dt>
          <dd>{money.format(RATE)}</dd>
        </div>
      </dl>
      <table>
        <thead>
          <tr>
            <th scope="col">{t("invoice.date")}</th>
            <th scope="col">{t("invoice.hours")}</th>
            <th scope="col">{t("invoice.amount")}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.date}>
              <td>{day.format(new Date(row.date))}</td>
              <td>{hours.format(row.hours)}</td>
              <td>{money.format(row.hours * RATE)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="invoice-totals">
        <span>
          {t("invoice.totalHours")} {hours.format(totalHours)}
        </span>
        <div className="invoice-total">
          <span>{t("invoice.total")}</span>
          <strong>{money.format(totalHours * RATE)}</strong>
        </div>
      </div>
      <p className="invoice-payment">
        <strong>{t("invoice.paymentTitle")}</strong> {t("invoice.paymentBody")}
      </p>
      <p className="invoice-footer">{t("invoice.questions")}</p>
    </figure>
  );
}
