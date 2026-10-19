// @vitest-environment node
// (scripts/public-pages.mjs reads files from disk, which jsdom's URL doesn't allow.)
import { expect, it } from "vitest";

import { draftPages, legalStatus, LEGAL_PAGES } from "../../scripts/public-pages.mjs";
import { LEGAL_STATUS } from "@/config";

it("scripts/public-pages.mjs reads LEGAL_STATUS from src/config.ts exactly", () => {
  expect(legalStatus).toEqual(LEGAL_STATUS);
  expect(Object.keys(LEGAL_PAGES).sort()).toEqual(Object.keys(LEGAL_STATUS).sort());
  for (const [name, path] of Object.entries(LEGAL_PAGES)) {
    expect(draftPages().includes(path)).toBe(LEGAL_STATUS[name as keyof typeof LEGAL_STATUS] !== "final");
  }
});
