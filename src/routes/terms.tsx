import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import { PolicyPlaceholder } from "@/components/policy-page";
import { staticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => staticPageHead("/terms/", "terms"),
  component: () => (
    <PageShell>
      <PolicyPlaceholder name="terms" />
    </PageShell>
  ),
});
