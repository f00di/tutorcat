import { lazy, useEffect } from "react";

// What goes inside the dialogs (forms, shortlist, profile) is only needed after a click, so it loads
// separately from the page's own code. usePreloadDialogs fetches it once the page is idle, so a
// dialog still opens at once. Render these inside DialogShell, which waits for them to arrive.
const siteDialogs = () => import("@/components/site-dialogs");
const forms = () => import("@/components/forms");
const profileView = () => import("@/components/profile-view");

export const ShortlistContent = lazy(() => siteDialogs().then((module) => ({ default: module.ShortlistContent })));
export const RequestContent = lazy(() => siteDialogs().then((module) => ({ default: module.RequestContent })));
export const JoinContent = lazy(() => siteDialogs().then((module) => ({ default: module.JoinContent })));
export const ReviewContent = lazy(() => siteDialogs().then((module) => ({ default: module.ReviewContent })));
export const DraftReady = lazy(() => forms().then((module) => ({ default: module.DraftReady })));
export const ProfileView = lazy(() => profileView().then((module) => ({ default: module.ProfileView })));

/** Fetches the dialog contents once the page is idle. `profile`: also the profile dialog (home page). */
export function usePreloadDialogs({ profile = false } = {}) {
  useEffect(() => {
    const preload = () => {
      void siteDialogs();
      void forms();
      if (profile) void profileView();
    };
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(preload, { timeout: 3000 });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(preload, 1500);
    return () => window.clearTimeout(timer);
  }, [profile]);
}
