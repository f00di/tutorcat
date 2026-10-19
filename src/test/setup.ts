import "@testing-library/jest-dom/vitest";

import ar from "../../i18n/ar.json";
import arUrl from "../../i18n/ar.json?url";

// jsdom can't fetch the site's own files: the Arabic text (fetched from its URL by loadCatalog in
// src/lib/i18n.tsx) comes straight from i18n/ar.json.
const networkFetch = globalThis.fetch;
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) =>
  String(input) === arUrl ? Promise.resolve(new Response(JSON.stringify(ar))) : networkFetch(input, init)) as typeof fetch;

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// jsdom has no ResizeObserver (the cat uses one to re-measure the page).
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Node 25 ships an experimental global localStorage that shadows jsdom's; use a plain
// in-memory Storage so tests behave the same on every Node version.
const memoryStorage = (): Storage => {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, String(value)),
    removeItem: (key) => void data.delete(key),
    clear: () => data.clear(),
    key: (index) => [...data.keys()][index] ?? null,
    get length() {
      return data.size;
    },
  };
};
const storage = memoryStorage();
Object.defineProperty(window, "localStorage", { configurable: true, value: storage });
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
