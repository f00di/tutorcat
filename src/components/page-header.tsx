import type { ReactNode } from "react";

/** The top band of every page except home: eyebrow, the page's h1, an intro line and anything that must come first (e.g. the urgent-safety notice on /report/). @category Layout */
export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: ReactNode; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-header">
      <div className="shell">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {intro && <p className="page-intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/** "Draft, pending legal review" (or another draft notice) at the top of a page. @category Layout */
export function DraftBanner({ children }: { children: ReactNode }) {
  return (
    <p className="draft-banner" role="note">
      {children}
    </p>
  );
}
