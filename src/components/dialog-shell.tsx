import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary';

type Props = { onClose: () => void; contentKey: string; children: ReactNode };

// Lovable's dialog: focus moves into the panel, Tab stays inside, Escape and the backdrop close it.
// contentKey changes when the dialog switches view (profile -> request), so focus moves to the new view.
/** Centred dialog panel over a blurred backdrop: focus stays inside, Escape and the backdrop close it. Put a ProfileView or a form inside. @category Layout */
export function DialogShell({ onClose, contentKey, children }: Props) {
  const { t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    panel.current?.focus();
    panel.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((item) => item.offsetParent !== null);
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={panel} className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1}>
        <Button variant="ghost" size="icon" className="dialog-close" aria-label={t("dialog.close")} onClick={onClose}>
          <X />
        </Button>
        {children}
      </div>
    </div>
  );
}
