import { DialogShell, ProfileView, profiles } from "tutorcat";

// DialogShell is a fixed, full-window overlay. The transform on the frame makes it the containing
// block so the open dialog renders inside this card.
const frame = { position: "relative", height: 720, overflow: "hidden", transform: "translateZ(0)" } as const;
const noop = () => {};

export const WithProfile = () => (
  <div style={frame}>
    <DialogShell onClose={noop} contentKey={`profile-${profiles[0].id}`}>
      <ProfileView profile={profiles[0]} saved={false} onToggleSave={noop} onRequest={noop} onReview={noop} />
    </DialogShell>
  </div>
);
