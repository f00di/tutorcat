import type { Ref } from "react";

import { cn } from "@/lib/utils";

// The Tutorcat cat, in three parts so it can sit on any edge: CatPeek (head) goes behind the
// box it peeks over, CatPaws in front of it, both inside a `position: relative` wrapper whose top
// edge is the ledge. On the page, src/lib/cat.ts moves them from section to section, using
// CatSprite to run between perches. Decorative only (aria-hidden).

/** The flat cat head that peeks 48px above its wrapper's top edge, with blinking eyes. @category Brand */
export function CatPeek({ className, ref }: { className?: string; ref?: Ref<HTMLDivElement> }) {
  return (
    <div className={cn("cat-peek", className)} ref={ref} aria-hidden="true">
      <span className="cat-ear cat-ear-l" />
      <span className="cat-ear cat-ear-r" />
      <span className="cat-head" />
      <span className="cat-eye cat-eye-l" />
      <span className="cat-eye cat-eye-r" />
    </div>
  );
}

/** Two paws resting on the wrapper's top edge, in front of the box (pair it with CatPeek). @category Brand */
export function CatPaws({ className, ref }: { className?: string; ref?: Ref<HTMLDivElement> }) {
  return (
    <div className={cn("cat-paws", className)} ref={ref} aria-hidden="true">
      <span className="cat-paw" style={{ insetInlineEnd: 62 }} />
      <span className="cat-paw" style={{ insetInlineEnd: 110 }} />
    </div>
  );
}

/** The classic pixel cat running (5-frame cycle, 126×72px), facing right; it takes the --cat colour. @category Brand */
export function CatSprite({ className, ref }: { className?: string; ref?: Ref<HTMLSpanElement> }) {
  return <span className={cn("cat-sprite", className)} ref={ref} aria-hidden="true" />;
}
