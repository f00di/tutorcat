import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

// False while prerendered HTML hydrates (so the first browser render matches the prerendered HTML),
// true straight after, and true at once on client-side navigation. Use it for anything read from
// the URL that the prerender can't know, such as /tutors/ filters.
export const useHydrated = () =>
  useSyncExternalStore(
    noSubscription,
    () => true,
    () => false
  );
