import { LoadingBuffer } from "tutorcat";

// LoadingBuffer is position: fixed (it covers the whole window). The transform on the frame makes
// it the containing block, so the full-screen skeleton renders inside this card instead of escaping.
const frame = { position: "relative", height: 680, overflow: "hidden", transform: "translateZ(0)" } as const;

export const Open = () => (
  <div style={frame}>
    <LoadingBuffer open />
  </div>
);
