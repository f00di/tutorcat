import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages serves the site from /tutorcat/. For a custom domain, build with BASE_PATH=/
const base = process.env["BASE_PATH"] ?? "/tutorcat/";

export default defineConfig({
  base,
  resolve: { tsconfigPaths: true },
  plugins: [
    // Static output only: the home page is prerendered to real HTML at build time, no server.
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false },
      pages: [{ path: "/" }],
    }),
    viteReact(),
    tailwindcss(),
  ],
});
