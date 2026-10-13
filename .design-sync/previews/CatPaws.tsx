import { CatPaws, CatPeek } from "tutorcat";

// Paws rest on the wrapper's top edge in front of the box; they belong with CatPeek behind it.
const box = {
  position: "relative", zIndex: 1, height: 72, borderRadius: 8, border: "1px solid var(--border)",
  background: "var(--card)", boxShadow: "var(--shadow-soft)",
} as const;

export const WithCatPeek = () => (
  <div style={{ position: "relative", marginTop: 64, width: 420 }}>
    <CatPeek />
    <div style={box} />
    <CatPaws />
  </div>
);
