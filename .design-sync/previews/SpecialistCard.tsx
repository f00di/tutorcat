import { SpecialistCard, profiles } from "tutorcat";

// Real tutors from data/tutors.json; covers cycle sage, peach, lavender as on the site.
const tones = ["sage", "peach", "lavender"] as const;
const noop = () => {};

export const Catalogue = () => (
  <div className="specialist-grid" style={{ width: "100%", maxWidth: 920 }}>
    {profiles.map((profile, i) => (
      <SpecialistCard key={profile.id} profile={profile} tone={tones[i % tones.length]} saved={false} onToggleSave={noop} onOpen={noop} />
    ))}
  </div>
);

export const Shortlisted = () => (
  <div style={{ width: 300 }}>
    <SpecialistCard profile={profiles[0]} tone="sage" saved onToggleSave={noop} onOpen={noop} />
  </div>
);

export const DarkMode = () => (
  <div className="dark" style={{ width: 300, padding: 16, borderRadius: 8, background: "var(--background)", color: "var(--foreground)" }}>
    <SpecialistCard profile={profiles[1]} tone="peach" saved={false} onToggleSave={noop} onOpen={noop} />
  </div>
);
