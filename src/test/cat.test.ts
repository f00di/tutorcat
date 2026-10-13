import { describe, expect, it } from "vitest";

import { pickPerch } from "@/lib/cat";

// Viewport tops: the search card ("home") and four section edges; a 900px-tall screen.
describe("pickPerch", () => {
  it("stays home while the search card is in view", () => {
    expect(pickPerch(300, [900, 1600, 2200, 2800], 900, 2)).toBe(-1);
  });

  it("moves to the first section edge inside the band", () => {
    expect(pickPerch(-400, [200, 900, 1500, 2100], 900, -1)).toBe(0);
    expect(pickPerch(-1200, [-600, 400, 1000, 1600], 900, 0)).toBe(1);
  });

  it("ignores edges too close to the top or bottom of the screen", () => {
    expect(pickPerch(-400, [100, 860, 1500, 2100], 900, 3)).toBe(3);
  });

  it("stays put when no section edge is in view", () => {
    expect(pickPerch(-3000, [-2400, -1600, -900, -100], 900, 2)).toBe(2);
  });
});
