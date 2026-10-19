import { render, screen, waitFor } from "@testing-library/react";
import type { ComponentType } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { CONTACT_EMAIL, LEGAL_STATUS } from "@/config";
import { I18nProvider } from "@/lib/i18n";
import { Markdown, parseMarkdown } from "@/lib/markdown";
import { Route } from "@/routes/privacy";

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

describe("/privacy", () => {
  it("shows sections 1–8 with anchors, a contents list linking to them, and the team's email", () => {
    const { container } = renderPage();
    for (let number = 1; number <= 8; number += 1) {
      expect(container.querySelector(`h2#section-${number}`)).not.toBeNull();
      expect(container.querySelector(`.legal-toc a[href="#section-${number}"]`)).not.toBeNull();
    }
    expect(container.querySelectorAll(`a[href="mailto:${CONTACT_EMAIL}"]`).length).toBeGreaterThanOrEqual(2);
  });

  it("while a draft, says so and keeps every [placeholder] visible", () => {
    const { container } = renderPage();
    if (LEGAL_STATUS.privacy === "final") return;
    expect(container.querySelector(".draft-banner")).not.toBeNull();
    expect(container.querySelector(".legal-doc.is-draft")).not.toBeNull();
    expect(screen.getByText("[website address]").tagName).toBe("MARK");
  });

  it("?lang=ar shows the Arabic policy", async () => {
    window.history.replaceState(null, "", "/?lang=ar");
    const { container } = renderPage();
    await waitFor(() => expect(container.querySelector("h2#section-1")?.textContent).toContain("من نحن"));
    expect(container.querySelector(".legal-doc")?.textContent).toContain("تُعتمد النسخة الإنجليزية");
  });
});

describe("the Markdown renderer", () => {
  const sample = "## 2. Data\n\nSome **bold** text, a [link](https://example.org/a), a [placeholder] and {EMAIL}.\n\n- one\n- two\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n";

  it("reads headings, paragraphs, lists and tables", () => {
    expect(parseMarkdown(sample).map((block) => block.type)).toEqual(["heading", "paragraph", "list", "table"]);
  });

  it("renders links, placeholders and variables, and never raw HTML", () => {
    const { container } = render(<Markdown source={`${sample}\n<script>alert(1)</script> <b>x</b>`} vars={{ EMAIL: <a href="mailto:x">mail</a> }} />);
    expect(container.querySelector("h2#section-2")).not.toBeNull();
    expect(container.querySelector('a[href="https://example.org/a"]')?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(container.querySelector("mark.placeholder")?.textContent).toBe("[placeholder]");
    expect(container.querySelector('a[href="mailto:x"]')).not.toBeNull();
    expect(container.querySelector("td[data-label='B']")?.textContent).toBe("2");
    expect(container.querySelector("script, b")).toBeNull();
    expect(container.textContent).toContain("<script>alert(1)</script>");
  });
});
