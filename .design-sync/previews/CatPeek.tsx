import { CatPaws, CatPeek } from "tutorcat";

// The cat peeks over the top edge of a box: CatPeek behind it, CatPaws in front, all inside a
// position: relative wrapper whose top edge is the ledge.
const box = {
  position: "relative", zIndex: 1, padding: "18px 20px", borderRadius: 8, border: "1px solid var(--border)",
  background: "var(--card)", boxShadow: "var(--shadow-soft)", color: "var(--muted-foreground)", fontSize: 13,
} as const;

export const OverASearchCard = () => (
  <div style={{ position: "relative", marginTop: 64, width: 460 }}>
    <CatPeek />
    <div style={box}>What do you need help with?</div>
    <CatPaws />
  </div>
);

export const DarkMode = () => (
  <div className="dark" style={{ background: "var(--background)", padding: "72px 24px 24px", borderRadius: 8, width: 508 }}>
    <div style={{ position: "relative" }}>
      <CatPeek />
      <div style={box}>Where are you based?</div>
      <CatPaws />
    </div>
  </div>
);
