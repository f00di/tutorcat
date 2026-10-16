import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ReportForm, UrgentNotice } from "@/components/report-form";
import { CONTACT_EMAIL } from "@/config";
import { NOT_LISTED, REPORT_CATEGORIES, mailtoHref, reportDraft, reportReference, type ReportDraft } from "@/lib/drafts";
import { I18nProvider, regions } from "@/lib/i18n";
import { profiles } from "@/lib/profiles";

const formData = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};
const report = (fields: Record<string, string>, profile: { id: string; name: string } | null = null) =>
  reportDraft(formData({ description: "What happened.", consent: "on", ...fields }), profile, "English", "TCR-261015-ABCD");

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  window.localStorage.clear();
});

describe("report drafts", () => {
  it("references look like TCR-<yymmdd>-<4 easy-to-read characters>", () => {
    expect(reportReference(new Date("2026-10-15T12:00:00Z"), (count) => new Uint32Array(count))).toBe("TCR-261015-2222");
    expect(reportReference()).toMatch(/^TCR-\d{6}-[2-9A-HJKMNP-Z]{4}$/);
  });

  it("marks only child-safety reports URGENT, with the reference in the subject", () => {
    for (const category of Object.values(REPORT_CATEGORIES)) {
      const { subject } = report({ category });
      expect(subject).toContain("TCR-261015-ABCD");
      expect(subject.startsWith("URGENT: ")).toBe(category === REPORT_CATEGORIES.childSafety);
    }
  });

  it("names the reported profile, or says who it is about otherwise", () => {
    const person = profiles[0]!;
    expect(report({ category: "Other" }, person).body).toContain(`About: ${person.name} (profile ID: ${person.id})`);
    expect(report({ category: "Other", about: NOT_LISTED, aboutDetails: "A tutor on Instagram" }).body).toContain("Someone not listed — A tutor on Instagram");
    expect(report({ category: "Other" }).body).toContain("About: No specific profile");
  });

  it("says when the reporter left their details blank", () => {
    expect(report({ category: "Other" }).body).toContain("Anonymous:");
    expect(report({ category: "Other", reporterContact: "+971 50 000 0000" }).body).not.toContain("Anonymous:");
  });

  it("opens addressed to the team inbox", () => {
    expect(mailtoHref(report({ category: "Other" }))).toMatch(new RegExp(`^mailto:${CONTACT_EMAIL}\\?subject=`));
  });
});

describe("ReportForm", () => {
  it("needs a category, a description and the confirmation, then builds the draft with the chosen profile", () => {
    const person = profiles[0]!;
    const onDraft = vi.fn<(draft: ReportDraft) => void>();
    render(
      <I18nProvider>
        <ReportForm profiles={profiles} initialProfile={person.id} onDraft={onDraft} />
      </I18nProvider>
    );
    const submit = screen.getByRole("button", { name: /Prepare report/ });
    fireEvent.click(submit);
    expect(onDraft).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("What is it about?"), { target: { value: REPORT_CATEGORIES.childSafety } });
    expect(screen.getByText(/mark this report URGENT/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("What happened?"), { target: { value: "Something worrying." } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(submit);

    expect(onDraft).toHaveBeenCalledTimes(1);
    const draft = onDraft.mock.calls[0]![0];
    expect(draft.subject).toMatch(/^URGENT: TutorCat concern report TCR-\d{6}-\w{4} — /);
    expect(draft.body).toContain(`About: ${person.name}`);
    expect(draft.body).toContain("Something worrying.");
  });
});

describe("UrgentNotice", () => {
  it("shows only the emergency numbers marked confirmed in data/regions.json", () => {
    const { container } = render(
      <I18nProvider>
        <UrgentNotice />
      </I18nProvider>
    );
    const shown = [...container.querySelectorAll("a[href^='tel:']")].map((link) => link.getAttribute("href"));
    const confirmed = regions.countries.flatMap((country) => country.emergencyNumbers.filter((item) => item.confirmed === true).map((item) => `tel:${item.number}`));
    expect(shown).toEqual(confirmed);
  });

  it("lists a number once it is confirmed, and never an unconfirmed one", () => {
    const fixture = [
      {
        name: "Qatar",
        emergencyNumbers: [
          { number: "111", service: "Checked line", serviceAr: "خط", confirmed: true, source: "https://example.org/checked" },
          { number: "222", service: "Unchecked line", serviceAr: "خط", confirmed: false, source: "https://example.org/unchecked" },
        ],
      },
    ];
    const { container } = render(
      <I18nProvider>
        <UrgentNotice countries={fixture} />
      </I18nProvider>
    );
    expect(container.querySelector("a[href='tel:111']")).toBeInTheDocument();
    expect(container.textContent).not.toContain("222");
  });
});
