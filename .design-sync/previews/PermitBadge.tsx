import { PermitBadge, profiles } from "tutorcat";

// Renders only when a profile has a verified Gulf tutoring permit. No current tutor has one, so this
// shows the badge with a permit set on a copy of the data. Never add permits a tutor doesn't hold.
const withPermit = { ...profiles[0], permitVerified: true, permitCountry: "United Arab Emirates" };

export const Verified = () => <PermitBadge profile={withPermit} />;
