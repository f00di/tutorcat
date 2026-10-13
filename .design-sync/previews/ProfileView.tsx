import { ProfileView, profiles } from "tutorcat";

// Normally rendered inside DialogShell; here in the same panel styling without the overlay.
const panel = { maxHeight: "none" } as const;
const noop = () => {};

export const Tutor = () => (
  <div className="dialog-panel" style={panel}>
    <ProfileView profile={profiles[0]} saved={false} onToggleSave={noop} onRequest={noop} onReview={noop} />
  </div>
);

export const Shortlisted = () => (
  <div className="dialog-panel" style={panel}>
    <ProfileView profile={profiles[2]} saved onToggleSave={noop} onRequest={noop} onReview={noop} />
  </div>
);

export const DarkMode = () => (
  <div className="dark" style={{ background: "var(--background)", color: "var(--foreground)", padding: 24 }}>
    <div className="dialog-panel" style={panel}>
      <ProfileView profile={profiles[1]} saved={false} onToggleSave={noop} onRequest={noop} onReview={noop} />
    </div>
  </div>
);
