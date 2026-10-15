import { createFileRoute } from "@tanstack/react-router";

import { NotFoundContent } from "@/components/not-found";
import { PageShell } from "@/components/page-shell";
import { notFoundHead } from "@/lib/seo";

// GitHub Pages serves 404.html (this page, prerendered as /404/) for every unknown URL. Its saved route
// data only fits /404/, so before hydration the address briefly becomes /404/ (keeping ?lang and the
// hash); NotFoundContent puts the visitor's real URL back straight after.
const KEEP_URL = `(function(){var p=location.pathname,b=${JSON.stringify(`${import.meta.env.BASE_URL}404/`)};if(p!==b){window.__tutorcatNotFound=p+location.search+location.hash;history.replaceState(history.state,"",b+location.search+location.hash)}})();`;

// Every URL that matches no other page.
export const Route = createFileRoute("/$")({
  head: () => ({ ...notFoundHead(), scripts: [{ children: KEEP_URL }] }),
  component: () => (
    <PageShell>
      <NotFoundContent />
    </PageShell>
  ),
});
