// Design-sync helper (cfg.buildCmd, after `npm run build`). Builds .design-sync/.cache/pkg, the
// package the converter reads (`--entry .design-sync/.cache/pkg/index.ts`):
// - index.ts re-exports src/design-system.ts (the converter bundles it with esbuild),
// - types/ is tsc's declaration output for it, with the `@/` alias made relative so the
//   converter can read each component's props,
// - tutorcat.css is the site's compiled stylesheet, starting with the Google Fonts import the
//   site loads via <link> in src/routes/__root.tsx, and with every asset it points at (the cat
//   sprite) inlined as a data URI, because /tutorcat/assets/... only exists on the deployed site.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";

const PKG = ".design-sync/.cache/pkg";
rmSync(PKG, { recursive: true, force: true });
mkdirSync(PKG, { recursive: true });

// Types: declarations for src/design-system.ts and everything it imports.
execFileSync("node_modules/.bin/tsc", ["-p", ".design-sync/tsconfig.types.json"], { stdio: "inherit" });
const typesSrc = join(PKG, "types/src");
const walk = (dir) => readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [join(dir, name)]));
let rewritten = 0;
for (const file of walk(typesSrc).filter((f) => f.endsWith(".d.ts"))) {
  const text = readFileSync(file, "utf8").replace(/(["'])@\/([^"']+)\1/g, (_, quote, target) => {
    rewritten++;
    const rel = relative(dirname(file), join(typesSrc, target)).split("\\").join("/");
    return `${quote}${rel.startsWith(".") ? rel : `./${rel}`}${quote}`;
  });
  writeFileSync(file, text);
}

writeFileSync(join(PKG, "index.ts"), 'export * from "../../../src/design-system";\n');
writeFileSync(
  join(PKG, "package.json"),
  JSON.stringify({ name: "tutorcat", version: "0.1.0", private: true, types: "types/src/design-system.d.ts" }, null, 2) + "\n"
);

// Stylesheet.
const assets = "dist/client/assets";
const sheets = readdirSync(assets).filter((name) => /^styles-.*\.css$/.test(name));
if (sheets.length !== 1) throw new Error(`expected one compiled styles-*.css in ${assets}, found ${sheets.length}; run npm run build`);
const fonts = /href:\s*"(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"/.exec(readFileSync("src/routes/__root.tsx", "utf8"))?.[1];
if (!fonts) throw new Error("Google Fonts URL not found in src/routes/__root.tsx");
const types = { ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
let inlined = 0;
const css = readFileSync(join(assets, sheets[0]), "utf8").replace(/url\((["']?)\/tutorcat\/assets\/([^)"']+)\1\)/g, (_, quote, file) => {
  const type = types[extname(file)];
  if (!type) throw new Error(`no MIME type for ${file}`);
  inlined++;
  return `url("data:${type};base64,${readFileSync(join(assets, file)).toString("base64")}")`;
});
writeFileSync(join(PKG, "tutorcat.css"), `@import url("${fonts}");\n${css}`);

console.log(`prepare: ${PKG} ready (types: ${rewritten} alias imports made relative; css: ${sheets[0]}, ${inlined} asset(s) inlined, fonts imported)`);
