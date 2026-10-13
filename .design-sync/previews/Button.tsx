import { Button } from "tutorcat";

const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 } as const;

export const Variants = () => (
  <div style={row}>
    <Button>Find my match</Button>
    <Button variant="outline">View profile</Button>
    <Button variant="secondary">Shortlist</Button>
    <Button variant="ghost">Cancel</Button>
    <Button variant="link">Let’s find your direction</Button>
    <Button variant="destructive">Remove</Button>
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Request an introduction</Button>
    <Button size="icon" variant="outline" aria-label="Save to shortlist">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
      </svg>
    </Button>
  </div>
);

export const LinkAndDisabled = () => (
  <div style={row}>
    <Button asChild variant="outline">
      <a href="#specialists">Find a specialist</a>
    </Button>
    <Button disabled>Prepare request</Button>
  </div>
);

export const DarkMode = () => (
  <div className="dark" style={{ ...row, background: "var(--background)", color: "var(--foreground)", padding: 16, borderRadius: 8 }}>
    <Button>Find my match</Button>
    <Button variant="outline">View profile</Button>
    <Button variant="ghost">Shortlist</Button>
  </div>
);
