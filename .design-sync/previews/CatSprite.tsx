import { CatSprite } from "tutorcat";

// The pixel cat runs on the spot (5-frame cycle); move it with your own transform/animation.
export const Running = () => <CatSprite />;

export const FacingLeft = () => (
  <div style={{ width: 126, transform: "scaleX(-1)" }}>
    <CatSprite />
  </div>
);

export const OnALedge = () => (
  <div style={{ width: 420, paddingTop: 8 }}>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CatSprite />
    </div>
    <div style={{ height: 56, borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", boxShadow: "var(--shadow-soft)" }} />
  </div>
);

export const DarkMode = () => (
  <div className="dark" style={{ background: "var(--background)", padding: 20, borderRadius: 8, width: "fit-content" }}>
    <CatSprite />
  </div>
);
