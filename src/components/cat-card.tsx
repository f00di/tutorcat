import { useRef, type ReactNode } from "react";

import { CatPaws, CatPeek } from "@/components/cat";
import { useCat } from "@/lib/cat";

const PAGE_PERCHES = ".cat-perch";

/** The cat on a page other than home: it peeks over this card and, as you scroll, pops up over the top edge of each later section marked `cat-perch`. Off for reduced motion. @category Brand */
export function CatCard({ className, children }: { className?: string; children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const pawsRef = useRef<HTMLDivElement>(null);
  useCat(wrapRef, headRef, pawsRef, PAGE_PERCHES);
  return (
    <div className={["cat-wrap", className].filter(Boolean).join(" ")} ref={wrapRef}>
      <CatPeek ref={headRef} />
      <div className="cat-box">{children}</div>
      <CatPaws ref={pawsRef} />
    </div>
  );
}
