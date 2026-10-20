import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

import { publicPages, sitemapPages } from "./scripts/public-pages.mjs";
import { SITE_URL } from "./src/config";

// GitHub Pages serves the site from /tutorcat/. For a custom domain, build with BASE_PATH=/
const base = process.env["BASE_PATH"] ?? "/tutorcat/";

// sitemap.xml with every public page except drafts, at SITE_URL (src/config.ts).
function sitemap(): Plugin {
  return {
    name: "tutorcat-sitemap",
    applyToEnvironment: (environment) => environment.name === "client",
    generateBundle() {
      const urls = sitemapPages().map((path) => `  <url><loc>${new URL(path.slice(1), SITE_URL).href}</loc></url>`);
      const source = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source });
    },
  };
}

export default defineConfig({
  base,
  resolve: { tsconfigPaths: true },
  plugins: [
    // Static output only: every public page (scripts/public-pages.mjs) is prerendered to real HTML at
    // build time, plus 404.html, which GitHub Pages serves for unknown URLs. No server.
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false, autoStaticPathsDiscovery: false },
      pages: [...publicPages().map((path) => ({ path })), { path: "/404/", prerender: { enabled: true, outputPath: "/404.html" } }],
    }),
    viteReact(),
    tailwindcss(),
    sitemap(),
  ],
});
