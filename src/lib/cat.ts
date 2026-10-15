// The Tutorcat cat. Near the top it peeks over the search card; as you scroll it ducks behind its
// edge and pops up over the top edge of the next section instead: paws first, then the head. Head
// and paws are positioned in page coordinates inside .finder-wrap, so they scroll with the page
// natively and the cat sits still on its edge. Script only runs to pick a perch and to move.
// Browser-only, and off for visitors who prefer reduced motion. (The running pixel cat is only on
// the loading screen.)
import { useEffect, type RefObject } from "react";

const PERCHES = ".catalogue, .pathway, .steps-section, .faq-section";
// Where along each section edge the cat peeks (0 = start, 1 = end); mirrored in right-to-left pages.
const NOTCHES = [0.78, 0.22, 0.68, 0.36];
// A section edge is "in view" between these distances from the top and bottom of the screen.
const BAND_TOP = 110;
const BAND_BOTTOM = 60;
const SETTLE_MS = 140; // the best perch must hold this long before the cat moves
const HEAD = 76; // .cat-peek box (px)
// The head hides by sliding this far down behind its ledge. Its clip-path moves with it, so the
// clip is animated too: only the part above the ledge ever shows.
const DUCK_PX = 34;
const SHOWN_CLIP = "inset(0 0 28px)";
const HIDDEN_CLIP = `inset(0 0 ${28 + DUCK_PX}px)`;

// Which perch the cat should sit on, from viewport tops: -1 is home (the search card).
// With no section edge in the band, the cat stays where it is.
export function pickPerch(homeTop: number, sectionTops: number[], viewportHeight: number, current: number) {
  if (homeTop >= BAND_TOP) return -1;
  const next = sectionTops.findIndex((top) => top >= BAND_TOP && top < viewportHeight - BAND_BOTTOM);
  return next === -1 ? current : next;
}

type Ref = RefObject<HTMLElement | null>;

// `perches` defaults to the home page sections; other pages pass their own (see CatCard).
export function useCat(wrapRef: Ref, headRef: Ref, pawsRef: Ref, perches = PERCHES) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const head = headRef.current;
    const paws = pawsRef.current;
    if (!wrap || !head || !paws || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(perches));
    const rtl = () => document.documentElement.dir === "rtl";

    // Layout cache. Section tops are relative to .finder-wrap, so they don't change while scrolling.
    let wrapTop = 0;
    let wrapLeft = 0;
    let wrapWidth = 0;
    let sectionTops: number[] = [];
    const measure = () => {
      const box = wrap.getBoundingClientRect();
      wrapTop = box.top + window.scrollY;
      wrapLeft = box.left;
      wrapWidth = box.width;
      sectionTops = sections.map((section) => section.getBoundingClientRect().top - box.top);
    };

    // The ledge the cat sits on and the left edge of its head, relative to .finder-wrap.
    const spot = (perch: number) => {
      if (perch < 0) return { ledge: 0, left: rtl() ? 56 : wrapWidth - 56 - HEAD };
      const notch = NOTCHES[perch % NOTCHES.length] ?? 0.5;
      const viewportLeft = wrapLeft + wrapWidth * (rtl() ? 1 - notch : notch) - HEAD / 2;
      const left = Math.max(20, Math.min(window.innerWidth - HEAD - 20, viewportLeft)) - wrapLeft;
      return { ledge: sectionTops[perch] ?? 0, left };
    };

    const place = (perch: number) => {
      if (perch < 0) {
        delete head.dataset["roaming"];
        delete paws.dataset["roaming"];
        head.style.left = head.style.top = paws.style.left = paws.style.top = "";
        return;
      }
      const { ledge, left } = spot(perch);
      head.dataset["roaming"] = paws.dataset["roaming"] = "true";
      head.style.left = paws.style.left = `${left}px`;
      head.style.top = `${ledge - 48}px`;
      paws.style.top = `${ledge}px`;
    };

    const running = new Set<Animation>();
    const play = (element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(keyframes, options);
      running.add(animation);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
      return animation;
    };

    // Leaving: the head sinks first, then the paws let go. Both stay hidden (fill forwards) until
    // the cat appears at its next perch.
    const hide = () => [
      play(head, [{ translate: "0 0", clipPath: SHOWN_CLIP }, { translate: `0 ${DUCK_PX}px`, clipPath: HIDDEN_CLIP }], {
        duration: 150,
        easing: "cubic-bezier(.5,0,.75,0)",
        fill: "forwards",
      }),
      play(paws, [{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: "0 4px" }], {
        duration: 110,
        delay: 60,
        easing: "ease-in",
        fill: "forwards",
      }),
    ];

    // Arriving: the paws land on the ledge first, then the head rises behind them.
    const show = () => [
      play(paws, [{ opacity: 0, translate: "0 4px" }, { opacity: 1, translate: "0 0" }], {
        duration: 160,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "backwards",
      }),
      play(head, [{ translate: `0 ${DUCK_PX}px`, clipPath: HIDDEN_CLIP }, { translate: "0 0", clipPath: SHOWN_CLIP }], {
        duration: 280,
        delay: 90,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "backwards",
      }),
    ];

    // `shown` is where the cat is; `target` is where it should be. One move at a time: a change of
    // mind mid-move waits for that move to finish instead of snapping.
    let shown = -1;
    let target = -1;
    let moving = false;
    let disposed = false;
    const move = async () => {
      if (moving) return;
      moving = true;
      try {
        while (shown !== target && !disposed) {
          const hidden = hide();
          await Promise.all(hidden.map((animation) => animation.finished));
          shown = target;
          place(shown);
          // Start the arrival before dropping the hidden state, in the same task, so no frame shows
          // the cat at its new perch before it pops up.
          const arriving = show();
          hidden.forEach((animation) => animation.cancel());
          await Promise.all(arriving.map((animation) => animation.finished));
        }
      } catch {
        // Cancelled by cleanup.
      } finally {
        moving = false;
      }
    };

    // Pick a perch on scroll; only move once the choice has held for SETTLE_MS.
    let frame = 0;
    let settleTimer = 0;
    let pending = -1;
    const check = () => {
      frame = 0;
      const homeTop = wrapTop - window.scrollY;
      const best = pickPerch(homeTop, sectionTops.map((top) => homeTop + top), window.innerHeight, target);
      if (best === target) {
        pending = target;
        window.clearTimeout(settleTimer);
        return;
      }
      if (best === pending) return;
      pending = best;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        target = pending;
        void move();
      }, SETTLE_MS);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    // Filters, fonts, language and window size all move the sections: re-measure and re-seat the cat.
    const relayout = () => {
      measure();
      place(shown);
      onScroll();
    };
    const resize = new ResizeObserver(relayout);
    resize.observe(document.body);
    const direction = new MutationObserver(relayout);
    direction.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      running.forEach((animation) => animation.cancel());
      resize.disconnect();
      direction.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [wrapRef, headRef, pawsRef, perches]);
}
