import { Avatar, profiles } from "tutorcat";

// The avatar is white, so it sits on a card cover (profile-cover + sage | peach | lavender) or on the
// dialog panel, which tints it.
const tones = ["sage", "peach", "lavender"];

export const OnCardCovers = () => (
  <div style={{ display: "flex", gap: 12 }}>
    {profiles.map((profile, i) => (
      <div key={profile.id} className={`profile-cover ${tones[i % tones.length]}`} style={{ width: 180, borderRadius: 8 }}>
        <Avatar profile={profile} />
      </div>
    ))}
  </div>
);

export const InDialog = () => (
  <div className="dialog-panel" style={{ width: 220 }}>
    <Avatar profile={profiles[1]} />
  </div>
);
