import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import { PolicyPlaceholder } from "@/components/policy-page";
import { staticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/review-policy")({
  head: () => staticPageHead("/review-policy/", "reviewPolicy"),
  component: () => (
    <PageShell>
      <PolicyPlaceholder name="reviewPolicy" />
    </PageShell>
  ),
});
