import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { type ReactNode } from "react";

import dmSansLatin from "../assets/fonts/dm-sans-latin.woff2?url";
import manropeLatin from "../assets/fonts/manrope-latin.woff2?url";
import { LoadingBuffer } from "../components/loading-buffer";
import { NotFoundContent } from "../components/not-found";
import { PageShell } from "../components/page-shell";
import { SITE_URL } from "../config";
import { I18nProvider, createTranslator } from "../lib/i18n";
import { BOOT_SCRIPT } from "../lib/theme";
import appCss from "../styles.css?url";

// Pages are prerendered in English; each page switches its title and descriptions after load
// (usePageMeta). These are the home page's tags; other routes override them and add their own
// og:url and canonical (src/lib/seo.ts).
const { t } = createTranslator("en");
const base = import.meta.env.BASE_URL;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: t("meta.title") },
      { name: "description", content: t("meta.description") },
      { name: "theme-color", content: "#1f5a45" },
      { property: "og:title", content: t("meta.ogTitle") },
      { property: "og:description", content: t("meta.ogDescription") },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}social-card.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: t("hero.imageAlt") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Fonts are self-hosted (src/styles.css); the Latin body and heading files load alongside the CSS.
      { rel: "preload", href: dmSansLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: manropeLatin, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "icon", href: `${base}favicon.png`, type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  // Fallback only: unknown URLs normally match the catch-all route (src/routes/$.tsx).
  notFoundComponent: () => (
    <PageShell>
      <NotFoundContent />
    </PageShell>
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    // The boot script may set lang/dir/class before React hydrates.
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <I18nProvider>
      <LoadingBuffer />
      <Outlet />
    </I18nProvider>
  );
}
