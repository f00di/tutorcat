import { render, screen, waitFor } from "@testing-library/react";
import type { ComponentType } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import tutors from "../../data/tutors.json";
import { I18nProvider } from "@/lib/i18n";
import { Route } from "@/routes/index";

const Page = Route.options.component as ComponentType;
const renderPage = () =>
  render(
    <I18nProvider>
      <Page />
    </I18nProvider>
  );

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  window.localStorage.clear();
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
});

describe("catalogue", () => {
  it("renders one card per profile in data/tutors.json, with chips built from their subjects", () => {
    const { container } = renderPage();
    expect(container.querySelectorAll(".specialist-card")).toHaveLength(tutors.profiles.length);
    for (const profile of tutors.profiles) expect(screen.getAllByText(profile.name).length).toBeGreaterThan(0);
    for (const subject of new Set(tutors.profiles.flatMap((profile) => profile.subjects))) {
      expect(screen.getByRole("button", { name: subject })).toBeInTheDocument();
    }
    expect(screen.getByRole("status").textContent).toContain(String(tutors.profiles.length));
  });

  it("never claims Gulf-wide online coverage that the data does not state", () => {
    const { container } = renderPage();
    expect(container.textContent).not.toMatch(/Online across the Gulf/i);
  });
});

describe("Arabic", () => {
  it("?lang=ar switches the page to Arabic and right-to-left", async () => {
    window.history.replaceState(null, "", "/?lang=ar");
    renderPage();
    await waitFor(() => expect(document.documentElement.dir).toBe("rtl"));
    expect(document.documentElement.lang).toBe("ar");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("اعثر على");
  });

  it("a remembered choice in localStorage also opens in Arabic", async () => {
    window.localStorage.setItem("tutorcat.lang", "ar");
    renderPage();
    await waitFor(() => expect(document.documentElement.dir).toBe("rtl"));
  });
});
