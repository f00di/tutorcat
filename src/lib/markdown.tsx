// A tiny Markdown renderer for long pages kept as .md files in src/content/ (the privacy policy,
// later the guides). It knows only what those files use: ## and ### headings, paragraphs, - lists,
// | tables |, **bold**, [links](https://…), {VARIABLES} and [placeholders] (square brackets with no
// link after them), which stay visible so a draft can't hide what is still unconfirmed.
// It builds React elements, never raw HTML, so a content file can't inject markup.
import { Fragment, type ReactNode } from "react";

type Block =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

// "1. Who we are" -> "section-1"; other headings get a slug of their words.
const headingId = (text: string) => {
  const number = /^(\d+)\./.exec(text)?.[1];
  return number ? `section-${number}` : text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
};

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/<!--[\s\S]*?-->/g, "").split("\n");
  let index = 0;
  while (index < lines.length) {
    const line = lines[index]!.trim();
    if (!line) {
      index += 1;
    } else if (/^#{2,3} /.test(line)) {
      const level = line.startsWith("### ") ? 3 : 2;
      const text = line.replace(/^#{2,3} /, "");
      blocks.push({ type: "heading", level, text, id: headingId(text) });
      index += 1;
    } else if (line.startsWith("|")) {
      const table: string[] = [];
      while (index < lines.length && lines[index]!.trim().startsWith("|")) table.push(lines[index++]!);
      const [head = "", , ...rows] = table;
      blocks.push({ type: "table", head: cells(head), rows: rows.map(cells) });
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index]!.trim().startsWith("- ")) items.push(lines[index++]!.trim().slice(2));
      blocks.push({ type: "list", items });
    } else {
      const text: string[] = [];
      while (index < lines.length && lines[index]!.trim() && !/^(#{2,3} |\||- )/.test(lines[index]!.trim())) text.push(lines[index++]!.trim());
      blocks.push({ type: "paragraph", text: text.join(" ") });
    }
  }
  return blocks;
}

/** The ## headings, for a page's "On this page" list. */
export const markdownSections = (source: string) =>
  parseMarkdown(source).filter((block): block is Extract<Block, { type: "heading" }> => block.type === "heading" && block.level === 2);

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\[([^\]]+)\]|\{([A-Z_]+)\}/g;

function inline(text: string, vars: Record<string, ReactNode>): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const [whole, bold, linkText, href, placeholder, variable] = match;
    if (match.index > last) out.push(text.slice(last, match.index));
    const key = match.index;
    if (bold !== undefined) out.push(<strong key={key}>{inline(bold, vars)}</strong>);
    else if (linkText !== undefined)
      out.push(
        <a key={key} href={href} className="text-link" target="_blank" rel="noopener noreferrer">
          {linkText}
        </a>
      );
    else if (placeholder !== undefined) out.push(<mark key={key} className="placeholder">{`[${placeholder}]`}</mark>);
    else out.push(<Fragment key={key}>{vars[variable ?? ""] ?? whole}</Fragment>);
    last = match.index + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Renders a src/content/ Markdown file. `vars` fill {NAME} slots, e.g. the contact email link. */
export function Markdown({ source, vars = {} }: { source: string; vars?: Record<string, ReactNode> }) {
  return (
    <>
      {parseMarkdown(source).map((block, index) => {
        if (block.type === "heading") {
          const Heading = block.level === 2 ? "h2" : "h3";
          return (
            <Heading key={index} id={block.id}>
              {inline(block.text, vars)}
            </Heading>
          );
        }
        if (block.type === "paragraph") return <p key={index}>{inline(block.text, vars)}</p>;
        if (block.type === "list")
          return (
            <ul key={index} className="fact-list">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{inline(item, vars)}</li>
              ))}
            </ul>
          );
        // On phones each row stacks into "label: value" lines (data-label, see .md-table in styles.css).
        return (
          <div key={index} className="md-table">
            <table>
              <thead>
                <tr>
                  {block.head.map((cell, cellIndex) => (
                    <th key={cellIndex} scope="col">
                      {inline(cell, vars)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} data-label={block.head[cellIndex]?.replace(/\*\*/g, "")}>
                        {inline(cell, vars)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}
