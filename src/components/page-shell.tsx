import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

import { DialogShell } from "@/components/dialog-shell";
import { DraftReady } from "@/components/forms";
import { JoinContent, RequestContent, ReviewContent, ShortlistContent } from "@/components/site-dialogs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, type NavPage } from "@/components/site-header";
import type { Draft } from "@/lib/drafts";
import type { Profile } from "@/lib/profiles";
import { useShortlist } from "@/lib/shortlist";

export type DialogState =
  | { type: "request"; person: Profile | null }
  | { type: "review"; person: Profile | null }
  | { type: "join" }
  | { type: "shortlist" }
  | { type: "draft"; draft: Draft }
  | null;

const DialogContext = createContext<(dialog: DialogState) => void>(() => {});
/** Opens one of the site dialogs (request, review, join, shortlist) from inside a page. */
export const useOpenDialog = () => useContext(DialogContext);

/** Every page except the home page: the shared header and footer, plus the same dialogs as the home page (Shortlist, Join, Request, Review). @category Layout */
export function PageShell({ page = "other", children }: { page?: NavPage; children: ReactNode }) {
  const { saved } = useShortlist();
  const [dialog, setDialog] = useState<DialogState>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Same focus handling as the home page: focus returns to whatever opened the dialog.
  const open = useCallback((next: DialogState) => {
    setDialog((current) => {
      if (!current) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      return next;
    });
  }, []);
  const close = useCallback(() => {
    setDialog(null);
    opener.current?.focus();
  }, []);
  const onDraft = (draft: Draft) => open({ type: "draft", draft });

  return (
    <DialogContext.Provider value={open}>
      <SiteHeader page={page} savedCount={saved.length} onShortlist={() => open({ type: "shortlist" })} onJoin={() => open({ type: "join" })} />
      <main id="main">{children}</main>
      <SiteFooter />
      {dialog && (
        <DialogShell onClose={close} contentKey={dialog.type}>
          {dialog.type === "shortlist" && <ShortlistContent saved={saved} />}
          {dialog.type === "request" && <RequestContent person={dialog.person} onDraft={onDraft} />}
          {dialog.type === "join" && <JoinContent onDraft={onDraft} />}
          {dialog.type === "review" && <ReviewContent person={dialog.person} onDraft={onDraft} />}
          {dialog.type === "draft" && <DraftReady draft={dialog.draft} />}
        </DialogShell>
      )}
    </DialogContext.Provider>
  );
}
