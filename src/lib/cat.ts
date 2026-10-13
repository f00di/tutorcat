// Lovable's peeking/roaming cat. It sits on the finder card, then hops to the top edge of each
// section as you scroll. Browser-only, and off for visitors who prefer reduced motion.
import { useEffect, type RefObject } from "react";

const PERCHES = ".catalogue, .pathway, .steps-section, .faq-section";
// Where along each section edge the cat sits (0 = start, 1 = end); mirrored in right-to-left pages.
const NOTCHES = [0.78, 0.22, 0.68, 0.36];

export function useCatPerches(wrapRef: RefObject<HTMLElement | null>, headRef: RefObject<HTMLElement | null>, pawsRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const head = headRef.current;
    const paws = pawsRef.current;
    if (!wrap || !head || !paws || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let lastY = window.scrollY;
    let pos = 0;
    let vel = 0;
    let tilt = 0;
    let perch = -1;
    const animations: Animation[] = [];
    const perches = Array.from(document.querySelectorAll<HTMLElement>(PERCHES));

    const tick = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      const home = wrap.getBoundingClientRect();
      const nextPerch =
        home.top >= 110
          ? -1
          : perches.findIndex((section) => {
              const rect = section.getBoundingClientRect();
              return rect.top >= 110 && rect.top < window.innerHeight - 60;
            });
      const destination = nextPerch >= 0 ? perches[nextPerch]?.getBoundingClientRect() : undefined;
      const previousHead = head.getBoundingClientRect();
      const previousPaws = paws.getBoundingClientRect();
      if (destination) {
        const notch = NOTCHES[nextPerch] ?? 0.5;
        const rtl = document.documentElement.dir === "rtl";
        const left = Math.max(20, Math.min(window.innerWidth - 96, home.left + home.width * (rtl ? 1 - notch : notch) - 38));
        head.dataset["roaming"] = "true";
        paws.dataset["roaming"] = "true";
        head.style.left = `${left}px`;
        head.style.top = `${destination.top - 48}px`;
        paws.style.left = `${left}px`;
        paws.style.top = `${destination.top}px`;
      } else {
        delete head.dataset["roaming"];
        delete paws.dataset["roaming"];
        head.style.left = "";
        head.style.top = "";
        paws.style.left = "";
        paws.style.top = "";
      }
      if (nextPerch !== perch) {
        animations.forEach((animation) => animation.cancel());
        animations.length = 0;
        const currentHead = head.getBoundingClientRect();
        const currentPaws = paws.getBoundingClientRect();
        for (const [element, before, after] of [
          [head, previousHead, currentHead],
          [paws, previousPaws, currentPaws],
        ] as const) {
          const dx = before.left - after.left;
          const jumpY = before.top - after.top;
          animations.push(
            element.animate(
              [
                { translate: `${dx}px ${jumpY}px` },
                { translate: `${dx * 0.45}px ${jumpY * 0.45 - 58}px`, offset: 0.5 },
                { translate: "0px 5px", offset: 0.85 },
                { translate: "0px 0px" },
              ],
              { duration: 650, easing: "cubic-bezier(.22,.61,.36,1)" }
            )
          );
        }
        perch = nextPerch;
      }
      const target = Math.max(-10, Math.min(18, dy * 0.9));
      vel = (vel + (target - pos) * 0.12) * 0.82;
      pos = Math.max(-10, Math.min(18, pos + vel));
      tilt += (Math.sign(dy) * Math.min(6, Math.abs(dy) * 0.4) - tilt) * 0.15;
      head.style.transform = `translateY(${pos.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;
      paws.style.transform = `translateY(${(pos * 0.3).toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      animations.forEach((animation) => animation.cancel());
    };
  }, [wrapRef, headRef, pawsRef]);
}
