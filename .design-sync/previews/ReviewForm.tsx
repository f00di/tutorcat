import { ReviewForm, profiles } from "tutorcat";

export const ForASpecialist = () => (
  <div className="dialog-panel" style={{ maxHeight: "none" }}>
    <ReviewForm person={profiles[0]} profiles={profiles} onDraft={() => {}} />
  </div>
);
