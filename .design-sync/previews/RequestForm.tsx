import { RequestForm, profiles } from "tutorcat";

const noop = () => {};

export const ForASpecialist = () => (
  <div className="dialog-panel" style={{ maxHeight: "none" }}>
    <p className="eyebrow">Let’s connect</p>
    <h2 id="dialog-title">Meet {profiles[0].name.split(" ")[0]}.</h2>
    <RequestForm person={profiles[0]} profiles={profiles} onDraft={noop} />
  </div>
);

export const NoPreference = () => (
  <div className="dialog-panel" style={{ maxHeight: "none" }}>
    <RequestForm person={null} profiles={profiles} onDraft={noop} />
  </div>
);
