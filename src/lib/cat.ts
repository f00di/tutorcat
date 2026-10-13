// The Tutorcat cat. Near the top it peeks over the search card; as you scroll it runs (the classic
// pixel-cat frames in src/assets/cat-run.png) to the top edge of the next section and peeks over that
// instead. Head, paws and runner are positioned in page coordinates inside .finder-wrap, so they
// scroll with the page natively: script only works while the cat bobs, runs or picks a perch.
// Browser-only, and off for visitors who prefer reduced motion.
import { useEffect, type RefObject } from "react";

const PERCHES = ".catalogue, .pathway, .steps-section, .faq-section";
// Where along each section edge the cat peeks (0 = start, 1 = end); mirrored in right-to-left pages.
const NOTCHES = [0.78, 0.22, 0.68, 0.36];
// A section edge is "in view" between these distances from the top and bottom of the screen.
const BAND_TOP = 110;
const BAND_BOTTOM = 60;
const SETTLE_MS = 140; // the best perch must hold this long before the cat sets off
const HEAD = 76; // .cat-peek box (px)
const RUNNER_W = 126; // .cat-sprite box: the 63×36 frames at 2×
const RUNNER_H = 72;
const RUN_SPEED = 1.4; // px per ms
const RUN_MS = [450, 1100] as const; // shortest and longest run
const HOP = 40; // height of the run's arc (px)

// Which perch the cat should sit on, from viewport tops: -1 is home (the search card).
// With no section edge in the band, the cat stays where it is.
export function pickPerch(homeTop: number, sectionTops: number[], viewportHeight: number, current: number) {
  if (homeTop >= BAND_TOP) return -1;
  const next = sectionTops.findIndex((top) => top >= BAND_TOP && top < viewportHeight - BAND_BOTTOM);
  return next === -1 ? current : next;
}

type Ref = RefObject<HTMLElement | null>;

export function useCat(wrapRef: Ref, headRef: Ref, pawsRef: Ref, runnerRef: Ref) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const head = headRef.current;
    const paws = pawsRef.current;
    const runner = runnerRef.current;
    if (!wrap || !head || !paws || !runner || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(PERCHES));
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
      const notch = NOTCHES[perch] ?? 0.5;
      const viewportLeft = wrapLeft + wrapWidth * (rtl() ? 1 - notch : notch) - HEAD / 2;
      const left = Math.max(20, Math.min(window.innerWidth - HEAD - 20, viewportLeft)) - wrapLeft;
      return { ledge: sectionTops[perch] ?? 0, left };
    };
    const runnerAt = (perch: number) => {
      const { ledge, left } = spot(perch);
      return { x: left + HEAD / 2 - RUNNER_W / 2, y: ledge - RUNNER_H + 2 };
    };

    let perch = -1; // where the cat is, or is running to
    let pending = -1;
    let pendingSince = 0;
    let run: Animation | null = null;

    const place = (target: number) => {
      if (target < 0) {
        delete head.dataset["roaming"];
        delete paws.dataset["roaming"];
        head.style.left = head.style.top = paws.style.left = paws.style.top = "";
        return;
      }
      const { ledge, left } = spot(target);
      head.dataset["roaming"] = paws.dataset["roaming"] = "true";
      head.style.left = paws.style.left = `${left}px`;
      head.style.top = `${ledge - 48}px`;
      paws.style.top = `${ledge}px`;
    };

    const arrive = () => {
      run?.cancel();
      run = null;
      delete runner.dataset["running"];
      place(perch);
      head.style.visibility = paws.style.visibility = "";
      // Pop up from behind the ledge: the clip moves down with the head, so only the part above shows.
      head.animate(
        [
          { translate: "0 34px", clipPath: "inset(0 0 62px)" },
          { translate: "0 0", clipPath: "inset(0 0 28px)" },
        ],
        { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
      paws.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: 90, fill: "backwards" });
    };

    const runTo = (target: number) => {
      // Start from wherever the cat visibly is, even mid-run, so a change of mind never snaps.
      let from = runnerAt(perch);
      if (run) {
        const box = runner.getBoundingClientRect();
        const origin = wrap.getBoundingClientRect();
        from = { x: box.left - origin.left, y: box.top - origin.top };
        run.cancel();
      }
      perch = pending = target;
      const to = runnerAt(target);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const facing = Math.abs(dx) > 4 ? Math.sign(dx) : rtl() ? -1 : 1;
      const duration = Math.min(RUN_MS[1], Math.max(RUN_MS[0], Math.hypot(dx, dy) / RUN_SPEED));
      // An eased path with a gentle arc, sampled so the browser can run it off the main thread.
      const keyframes = Array.from({ length: 17 }, (_, i) => {
        const t = i / 16;
        const p = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const x = from.x + dx * p;
        const y = from.y + dy * p - HOP * 4 * p * (1 - p);
        return { transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scaleX(${facing})` };
      });
      head.style.visibility = paws.style.visibility = "hidden";
      runner.dataset["running"] = "true";
      run = runner.animate(keyframes, { duration, fill: "forwards" });
      run.onfinish = arrive;
    };

    // Scroll speed drives a springy bob and a small tilt. Time-based, so 60 Hz and 120 Hz feel the same.
    let frame = 0;
    let last = 0;
    let lastY = window.scrollY;
    let speed = 0;
    let bob = 0;
    let bobVelocity = 0;
    let tilt = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const y = window.scrollY;
      speed += ((y - lastY) / dt - speed) * (1 - Math.exp(-dt / 0.08));
      lastY = y;
      bobVelocity += (180 * (14 * Math.tanh(speed / 1800) - bob) - 14 * bobVelocity) * dt;
      bob += bobVelocity * dt;
      tilt += (4 * Math.tanh(speed / 2400) - tilt) * (1 - Math.exp(-dt / 0.12));
      head.style.transform = `translateY(${bob.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;
      paws.style.transform = `translateY(${(bob * 0.3).toFixed(2)}px)`;

      const homeTop = wrapTop - y;
      const best = pickPerch(homeTop, sectionTops.map((top) => homeTop + top), window.innerHeight, perch);
      if (best === perch) pending = perch;
      else if (best !== pending) {
        pending = best;
        pendingSince = now;
      } else if (now - pendingSince >= SETTLE_MS) runTo(best);

      const still = Math.abs(speed) < 1 && Math.abs(bob) < 0.05 && Math.abs(bobVelocity) < 0.05 && Math.abs(tilt) < 0.02;
      if (still && pending === perch) {
        frame = last = 0;
        head.style.transform = paws.style.transform = "";
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Filters, fonts, language and window size all move the sections: re-measure and re-seat the cat.
    const relayout = () => {
      measure();
      if (!run) place(perch);
      wake();
    };
    const resize = new ResizeObserver(relayout);
    resize.observe(document.body);
    const direction = new MutationObserver(relayout);
    direction.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    window.addEventListener("scroll", wake, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      run?.cancel();
      resize.disconnect();
      direction.disconnect();
      window.removeEventListener("scroll", wake);
    };
  }, [wrapRef, headRef, pawsRef, runnerRef]);
}
