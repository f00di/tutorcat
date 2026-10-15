// The shortlist: saved profile ids, kept in memory for this visit (like before), and shared by
// every page so the header count follows you from page to page. Not stored: a reload clears it.
import { useCallback, useSyncExternalStore } from "react";

const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let saved: string[] = EMPTY;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};

export function useShortlist() {
  // Prerendered pages always start with an empty shortlist.
  const current = useSyncExternalStore(subscribe, () => saved, () => EMPTY);
  const toggle = useCallback((id: string) => {
    saved = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    listeners.forEach((listener) => listener());
  }, []);
  return { saved: current, toggle };
}
