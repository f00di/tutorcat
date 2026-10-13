import { Logo } from "@/components/logo";
import { useI18n } from "@/lib/i18n";

// A skeleton of the page with the classic pixel cat running along the search card. It only shows
// while the page genuinely isn't ready: the Arabic text loading on an Arabic visit (html.i18n-pending,
// set by the boot script), a slow language switch (html.is-buffering) and ?loading for previewing
// it (html.buffer-preview; click to close). Never used as an artificial delay. `open` shows it
// regardless of those classes (e.g. to place it in a design or a test).
/** Full-screen loading skeleton of the page with the pixel cat running along the search card. Pass open to show it. @category Layout */
export function LoadingBuffer({ open = false }: { open?: boolean }) {
  const { t } = useI18n();
  const close = () => document.documentElement.classList.remove("buffer-preview");
  const bars = (count: number, className: string) =>
    Array.from({ length: count }, (_, i) => <span key={i} className={`sk ${className}`} />);

  return (
    <div className={open ? "buffer is-open" : "buffer"} role="status" onClick={close}>
      <span className="sr-only">{t("buffer.loading")}</span>
      <div aria-hidden="true">
        <div className="buffer-header">
          <div className="shell">
            <Logo className="logo" />
            <span className="buffer-nav">{bars(3, "sk-nav")}</span>
            <span className="sk sk-button" />
          </div>
        </div>
        <div className="buffer-hero">
          <div className="shell">
            <span className="sk sk-eyebrow" />
            {bars(2, "sk-title")}
            {bars(3, "sk-line")}
          </div>
        </div>
        <div className="shell">
          <div className="buffer-finder">
            <span className="buffer-track">
              <span className="cat-sprite" />
            </span>
            <span className="buffer-tabs">{bars(3, "sk-tab")}</span>
            <span className="buffer-fields">
              {bars(3, "sk-field")}
              <span className="sk sk-field sk-submit" />
            </span>
          </div>
          <div className="buffer-cards">
            {[0, 1, 2].map((card) => (
              <span key={card} className="buffer-card">
                <span className="sk sk-cover" />
                {bars(3, "sk-line")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
