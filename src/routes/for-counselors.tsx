import { createFileRoute } from "@tanstack/react-router";

import { JoinPage } from "@/components/join-page";
import { PageShell } from "@/components/page-shell";
import { staticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/for-counselors")({
  head: () => staticPageHead("/for-counselors/", "forCounselors"),
  component: () => (
    <PageShell>
      <JoinPage kind="counselor" />
    </PageShell>
  ),
});
