import { DraftReady } from "tutorcat";

// A request draft as RequestForm builds it (English, for the Tutorcat team); sample visitor answers.
const draft = {
  kind: "request" as const,
  subject: "TutorCat intro request: Hassan Ansari",
  body: [
    "Parent/student name: Layla Ahmed",
    "Email: layla@example.com",
    "Student level: IGCSE",
    "Support type: Academic tutoring",
    "Specialist: Hassan Ansari",
    "Site language: English",
    "",
    "Message:",
    "My son needs help with IGCSE Math before his May exams.",
  ].join("\n"),
};

export const RequestDraft = () => (
  <div className="dialog-panel" style={{ maxHeight: "none" }}>
    <DraftReady draft={draft} />
  </div>
);
