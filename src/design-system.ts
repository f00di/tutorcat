// The Tutorcat design system: everything Claude Design builds with (synced by /design-sync; see
// .design-sync/). The site doesn't import this file. Components render inside <I18nProvider>,
// which also loads the Arabic text; tutor data comes from data/tutors.json via `profiles`.
export { Button, buttonVariants } from "@/components/ui/button";
export { Logo } from "@/components/logo";
export { CatPaws, CatPeek, CatSprite } from "@/components/cat";
export { LoadingBuffer } from "@/components/loading-buffer";
export { SiteHeader } from "@/components/site-header";
export { Avatar, PermitBadge, RatingSummary, SpecialistCard } from "@/components/specialist-card";
export type { Tone } from "@/components/specialist-card";
export { ProfileView } from "@/components/profile-view";
export { DialogShell } from "@/components/dialog-shell";
export { DraftReady, JoinForm, RequestForm, ReviewForm } from "@/components/forms";
export { I18nProvider, useI18n } from "@/lib/i18n";
export { profiles } from "@/lib/profiles";
export type { Profile, Review } from "@/lib/profiles";
export type { Draft } from "@/lib/drafts";
