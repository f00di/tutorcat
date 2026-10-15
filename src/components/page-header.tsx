import type { ReactNode } from "react";

/** The top band of every page except home: eyebrow, the page's h1 and an intro line. @category Layout */
export function PageHeader({ eyebrow, title, intro }: { eyebrow?: ReactNode; title: ReactNode; intro?: ReactNode }) {
  return (
    <section className="page-header">
      <div className="shell">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {intro && <p className="page-intro">{intro}</p>}
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
