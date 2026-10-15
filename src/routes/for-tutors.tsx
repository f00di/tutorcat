import { createFileRoute } from "@tanstack/react-router";

import { JoinPage } from "@/components/join-page";
import { PageShell } from "@/components/page-shell";
import { staticPageHead } from "@/lib/seo";

export const Route = createFileRoute("/for-tutors")({
  head: () => staticPageHead("/for-tutors/", "forTutors"),
  component: () => (
    <PageShell>
      <JoinPage kind="tutor" />
    </PageShell>
  ),
});
