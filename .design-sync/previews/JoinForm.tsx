import { JoinForm } from "tutorcat";

export const Application = () => (
  <div className="dialog-panel" style={{ maxHeight: "none" }}>
    <p className="eyebrow">Grow with Tutorcat</p>
    <h2 id="dialog-title">Share your expertise.</h2>
    <JoinForm onDraft={() => {}} />
  </div>
);
