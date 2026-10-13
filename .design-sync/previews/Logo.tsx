import { Logo } from "tutorcat";

// `logo` gives the header size and the --logo colour; add `footer-logo` for the smaller footer size.
export const Header = () => <Logo className="logo" label="Tutorcat" />;

export const HeaderAndFooterSizes = () => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 32 }}>
    <Logo className="logo" label="Tutorcat" />
    <Logo className="logo footer-logo" label="Tutorcat" />
  </div>
);

export const DarkMode = () => (
  <div className="dark" style={{ background: "var(--card)", padding: 24, borderRadius: 8, width: "fit-content" }}>
    <Logo className="logo" label="Tutorcat" />
  </div>
);
