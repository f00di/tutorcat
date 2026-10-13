import { SiteHeader } from "tutorcat";

// The header's "Skip to content" link sits just above it until focused; overflow: hidden keeps it
// out of view when the header is placed inside another layout.
const noop = () => {};
const clip = { position: "relative", overflow: "hidden" } as const;

export const Default = () => (
  <div style={clip}>
    <SiteHeader savedCount={0} onShortlist={noop} onJoin={noop} />
  </div>
);

export const WithShortlist = () => (
  <div style={clip}>
    <SiteHeader savedCount={2} onShortlist={noop} onJoin={noop} />
  </div>
);

export const DarkMode = () => (
  <div className="dark" style={{ ...clip, background: "var(--background)", color: "var(--foreground)" }}>
    <SiteHeader savedCount={1} onShortlist={noop} onJoin={noop} />
  </div>
);
