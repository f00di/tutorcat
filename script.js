const CONTACT_EMAIL = "your-email@example.com";

const REVIEW_SUBMISSION_MODE = "mailto";
const TUTOR_APPLICATION_MODE = "mailto";

const REVIEW_FORM_URL = "";
const TUTOR_APPLICATION_FORM_URL = "";

const DATA_URL = "./data/tutors.json";

const FILTER_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Tutors", value: "Tutors" },
  { label: "Counselors", value: "Counselors" },
  { label: "Tutor + Counselor", value: "Tutor + Counselor" },
  { label: "Math", value: "Math" },
  { label: "Science", value: "Science" },
  { label: "English", value: "English" },
  { label: "Test Prep", value: "Test Prep" },
  { label: "Computer Science", value: "Computer Science" },
  { label: "US", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "Germany", value: "Germany" },
  { label: "Netherlands", value: "Netherlands" },
  { label: "Czech Republic", value: "Czech Republic" },
  { label: "UK", value: "United Kingdom" },
  { label: "South Africa", value: "South Africa" },
];

const WIZARD_STEPS = [
  {
    key: "person",
    title: "I am a",
    options: ["Parent", "Student"],
  },
  {
    key: "support",
    title: "Support needed",
    options: [
      "Academic tutoring",
      "Test prep",
      "Country counseling",
      "University pathway planning",
      "Unsure",
    ],
  },
  {
    key: "destination",
    title: "Study destination of interest",
    options: [
      { label: "US", value: "United States" },
      "Canada",
      "Germany",
      "Netherlands",
      "Czech Republic",
      { label: "UK", value: "United Kingdom" },
      "Australia",
      "UAE",
      "Other",
    ],
  },
  {
    key: "level",
    title: "Student level",
    options: [
      "Middle school",
      "High school",
      "A-levels/IB/AP",
      "Undergraduate",
      "Transfer student",
      "Other",
    ],
  },
  {
    key: "focus",
    title: "Subject or counseling focus",
    options: [
      "Math",
      "Science",
      "English",
      "Computer Science",
      "SAT/ACT",
      "IELTS/TOEFL",
      "Applications",
      "Scholarships",
      "Visa preparation checklist",
      "Country fit",
      "Parent guidance",
    ],
  },
  {
    key: "format",
    title: "Preferred format",
    options: ["Online", "In-person", "Hybrid"],
  },
  {
    key: "urgency",
    title: "Urgency",
    options: ["This week", "This month", "Planning ahead"],
  },
];

const FALLBACK_PROFILES = [
  {
    id: "maya-patel",
    name: "Maya Patel",
    initials: "MP",
    profileType: "Tutor",
    role: "Math and SAT/ACT test-prep tutor",
    supportTypes: ["Academic tutoring", "Test prep"],
    subjects: ["Math", "Statistics", "Test Prep", "SAT/ACT"],
    countries: ["United States"],
    counselingTopics: ["Parent guidance", "Study planning"],
    educationOrExperience:
      "M.S. Applied Mathematics; former learning lab instructor for algebra, calculus, and statistics.",
    location: "Oakland and online",
    sessionModes: ["Online", "Hybrid"],
    languages: ["English", "Gujarati"],
    currentStudents: 5,
    improvement: "Sample outcomes include Algebra II C+ to B+ and SAT Math +110.",
    experience: "7 yrs",
    experienceYears: 7,
    availability: "Mon, Wed, Sat; limited same-week openings",
    rating: 4.9,
    reviewCount: 34,
    shortBio:
      "Maya builds short diagnostic plans for students who need precision in algebra, functions, limits, statistics, and test timing.",
    parentNote:
      "Good fit for families who want clear weekly practice plans and visible error-log review.",
    outcomes: [
      ["AP Calculus AB", "B-", "A-", "Spring sample"],
      ["Algebra II", "C+", "B+", "Winter sample"],
      ["SAT Math", "610", "720", "Sample score record"],
    ],
    tags: ["Math", "STEM", "Test Prep", "Online sessions", "High school"],
    studentLevels: ["Middle school", "High school", "A-levels/IB/AP"],
  },
  {
    id: "daniel-kim",
    name: "Daniel Kim",
    initials: "DK",
    profileType: "Tutor",
    role: "Physics, chemistry, and lab-skills tutor",
    supportTypes: ["Academic tutoring", "Test prep"],
    subjects: ["Science", "Physics", "Chemistry", "Test Prep"],
    countries: ["United States", "Canada"],
    counselingTopics: ["STEM pathway planning", "Parent guidance"],
    educationOrExperience:
      "Materials science Ph.D. candidate with experience mentoring high school lab and AP science students.",
    location: "Palo Alto and online",
    sessionModes: ["Online", "In-person", "Hybrid"],
    languages: ["English", "Korean"],
    currentStudents: 4,
    improvement: "Sample outcomes include Physics C to B+ and lab reports 78% to 91%.",
    experience: "5 yrs",
    experienceYears: 5,
    availability: "Tue, Thu, Sun; this-month openings",
    rating: 4.8,
    reviewCount: 27,
    shortBio:
      "Daniel connects formulas to lab intuition, then uses structured problem sets to make unit conversions, force diagrams, and reaction steps repeatable.",
    parentNote:
      "Helpful for students who understand class lectures but lose points on multi-step problems and lab writeups.",
    outcomes: [
      ["AP Physics 1", "C", "B+", "Spring sample"],
      ["Honors Chemistry", "B", "A-", "Spring sample"],
      ["Lab reports", "78%", "91%", "Winter sample"],
    ],
    tags: ["Science", "STEM", "AP", "Canada", "Online sessions"],
    studentLevels: ["High school", "A-levels/IB/AP", "Undergraduate"],
  },
  {
    id: "lena-brooks",
    name: "Lena Brooks",
    initials: "LB",
    profileType: "Tutor + Counselor",
    role: "English, essays, and US/UK application mentor",
    supportTypes: [
      "Academic tutoring",
      "Country counseling",
      "University pathway planning",
    ],
    subjects: ["English", "History", "College Essays", "Test Prep"],
    countries: ["United States", "United Kingdom"],
    counselingTopics: ["Applications", "Scholarships", "Country fit", "Parent guidance"],
    educationOrExperience:
      "Writing center fellow with experience supporting essays, humanities coursework, and application storytelling.",
    location: "Los Angeles and online",
    sessionModes: ["Online", "Hybrid"],
    languages: ["English"],
    currentStudents: 4,
    improvement: "Sample outcomes include research essay 82% to 94% and stronger timed writing rubrics.",
    experience: "6 yrs",
    experienceYears: 6,
    availability: "Mon, Thu, Sat; planning-ahead preferred",
    rating: 4.9,
    reviewCount: 31,
    shortBio:
      "Lena focuses on argument structure, close reading, revision routines, and application essays that sound specific rather than generic.",
    parentNote:
      "Strong fit when a family needs both writing improvement and a calm application timeline.",
    outcomes: [
      ["AP Literature", "B", "A-", "Spring sample"],
      ["Research essay", "82%", "94%", "Winter sample"],
      ["Personal statement", "Draft unclear", "Focused final draft", "Sample application cycle"],
    ],
    tags: ["English", "Applications", "Scholarships", "US", "UK"],
    studentLevels: ["High school", "A-levels/IB/AP", "Transfer student"],
  },
  {
    id: "nora-chen",
    name: "Nora Chen",
    initials: "NC",
    profileType: "Tutor",
    role: "Computer science and robotics mentor",
    supportTypes: ["Academic tutoring", "Test prep"],
    subjects: ["Computer Science", "Math", "Robotics", "Python"],
    countries: ["United States", "Canada", "Australia"],
    counselingTopics: ["STEM pathway planning", "Portfolio projects"],
    educationOrExperience:
      "Software engineer and student club mentor with project-based CS teaching experience.",
    location: "Seattle and online",
    sessionModes: ["Online"],
    languages: ["English", "Mandarin"],
    currentStudents: 3,
    improvement:
      "Sample outcomes include AP CSP B to A and Python project completion from incomplete to 92%.",
    experience: "6 yrs",
    experienceYears: 6,
    availability: "Tue, Thu, Sat; this-week openings",
    rating: 4.8,
    reviewCount: 24,
    shortBio:
      "Nora keeps coding lessons project-based while maintaining clear rubrics for debugging, documentation, and math prerequisites.",
    parentNote:
      "Useful for students who want structured CS practice without turning every session into open-ended project time.",
    outcomes: [
      ["AP Computer Science Principles", "B", "A", "Spring sample"],
      ["Python project", "Incomplete", "92%", "May sample"],
      ["Geometry proofs", "C+", "B+", "Winter sample"],
    ],
    tags: ["Computer Science", "Math", "STEM", "Online sessions", "Portfolio"],
    studentLevels: ["Middle school", "High school", "A-levels/IB/AP", "Undergraduate"],
  },
  {
    id: "sarah-morgan",
    name: "Sarah Morgan",
    initials: "SM",
    profileType: "Counselor",
    role: "US higher education pathway counselor",
    supportTypes: ["Country counseling", "University pathway planning"],
    subjects: ["College Essays", "Test Prep"],
    countries: ["United States"],
    counselingTopics: [
      "Applications",
      "Scholarships",
      "Country fit",
      "Parent guidance",
      "SAT/ACT",
    ],
    educationOrExperience:
      "Former university advising office staff member with experience helping families compare US college pathways.",
    location: "Boston and online",
    sessionModes: ["Online"],
    languages: ["English"],
    currentStudents: 6,
    improvement:
      "Sample planning outcomes include balanced college lists and family application calendars.",
    experience: "9 yrs",
    experienceYears: 9,
    availability: "Wed, Fri; planning-ahead preferred",
    rating: 4.9,
    reviewCount: 42,
    shortBio:
      "Sarah helps families compare US college options, testing decisions, essay timelines, scholarships, and parent responsibilities.",
    parentNote:
      "Best for families who want decision structure before they spend time and money on applications.",
    outcomes: [
      ["College list", "Unsorted", "Balanced reach/fit/safety list", "Sample planning session"],
      ["Testing plan", "Unclear", "SAT/ACT decision calendar", "Sample junior-year plan"],
      ["Scholarship search", "Ad hoc", "Priority tracker", "Sample family checklist"],
    ],
    tags: ["United States", "Applications", "Scholarships", "Parent guidance", "Online sessions"],
    studentLevels: ["High school", "A-levels/IB/AP", "Transfer student"],
  },
  {
    id: "aisha-rahman",
    name: "Aisha Rahman",
    initials: "AR",
    profileType: "Counselor",
    role: "Canada pathway and co-op program counselor",
    supportTypes: ["Country counseling", "University pathway planning"],
    subjects: ["IELTS/TOEFL", "English"],
    countries: ["Canada"],
    counselingTopics: [
      "Applications",
      "Scholarships",
      "Country fit",
      "IELTS/TOEFL",
      "Parent guidance",
    ],
    educationOrExperience:
      "Advises families comparing Canadian provinces, co-op programs, entry requirements, and English-language planning.",
    location: "Toronto and online",
    sessionModes: ["Online"],
    languages: ["English", "Urdu", "Hindi"],
    currentStudents: 5,
    improvement:
      "Sample planning outcomes include province comparison and language-test preparation checklists.",
    experience: "8 yrs",
    experienceYears: 8,
    availability: "Mon, Wed; this-month openings",
    rating: 4.8,
    reviewCount: 29,
    shortBio:
      "Aisha guides families through Canadian program selection, application documents, co-op considerations, and language-test timelines.",
    parentNote:
      "Strong fit for parents who need a practical comparison across provinces and public university options.",
    outcomes: [
      ["Program shortlist", "15 options", "6 priority programs", "Sample counseling session"],
      ["IELTS plan", "No timeline", "8-week practice calendar", "Sample pathway plan"],
      ["Parent questions", "Scattered", "Decision checklist", "Sample family session"],
    ],
    tags: ["Canada", "IELTS/TOEFL", "Applications", "Scholarships", "Online sessions"],
    studentLevels: ["High school", "A-levels/IB/AP", "Undergraduate", "Transfer student"],
  },
  {
    id: "lukas-weber",
    name: "Lukas Weber",
    initials: "LW",
    profileType: "Tutor + Counselor",
    role: "Germany and Netherlands STEM pathway mentor",
    supportTypes: [
      "Academic tutoring",
      "Country counseling",
      "University pathway planning",
    ],
    subjects: ["Math", "Science", "Computer Science", "IELTS/TOEFL"],
    countries: ["Germany", "Netherlands"],
    counselingTopics: [
      "Applications",
      "Visa preparation checklist",
      "Country fit",
      "STEM pathway planning",
      "Parent guidance",
    ],
    educationOrExperience:
      "Studied engineering in Germany and has advised students comparing English-taught programs in Germany and the Netherlands.",
    location: "Berlin and online",
    sessionModes: ["Online", "Hybrid"],
    languages: ["English", "German"],
    currentStudents: 4,
    improvement:
      "Sample outcomes include STEM readiness plans and Germany/Netherlands application checklists.",
    experience: "7 yrs",
    experienceYears: 7,
    availability: "Tue, Fri; this-week openings",
    rating: 4.9,
    reviewCount: 33,
    shortBio:
      "Lukas combines STEM tutoring with destination-specific planning for German and Dutch university pathways.",
    parentNote:
      "Good fit when the student needs math or science support and the family is comparing European study routes.",
    outcomes: [
      ["Germany eligibility", "Unknown", "Document checklist", "Sample pathway session"],
      ["Netherlands programs", "Broad search", "Program comparison table", "Sample planning session"],
      ["Math readiness", "Gaps in functions", "Targeted practice plan", "Sample tutoring plan"],
    ],
    tags: [
      "Germany",
      "Netherlands",
      "Math",
      "Science",
      "Computer Science",
      "Visa checklist",
    ],
    studentLevels: ["High school", "A-levels/IB/AP", "Undergraduate", "Transfer student"],
  },
  {
    id: "petra-novak",
    name: "Petra Novak",
    initials: "PN",
    profileType: "Counselor",
    role: "Czech Republic and Europe education counselor",
    supportTypes: ["Country counseling", "University pathway planning"],
    subjects: ["Science", "English", "IELTS/TOEFL"],
    countries: ["Czech Republic", "Germany", "Netherlands", "UAE"],
    counselingTopics: [
      "Applications",
      "Scholarships",
      "Visa preparation checklist",
      "Country fit",
      "Parent guidance",
    ],
    educationOrExperience:
      "Supports families comparing European English-taught programs, entrance exams, documentation, and transition planning.",
    location: "Prague and online",
    sessionModes: ["Online"],
    languages: ["English", "Czech"],
    currentStudents: 2,
    improvement:
      "Sample planning outcomes include entrance-exam calendars and family document checklists.",
    experience: "10 yrs",
    experienceYears: 10,
    availability: "Thu, Sat; this-month openings",
    rating: 4.7,
    reviewCount: 22,
    shortBio:
      "Petra helps families understand Czech Republic and broader Europe options, especially for medicine, technical fields, and English-taught programs.",
    parentNote:
      "Best for families who want a clear checklist before contacting institutions or preparing entrance exams.",
    outcomes: [
      ["Czech programs", "Unclear", "Shortlist by field and cost", "Sample counseling session"],
      ["Entrance exams", "No plan", "Preparation calendar", "Sample family checklist"],
      ["Documents", "Unverified list", "Official-site verification plan", "Sample pathway session"],
    ],
    tags: ["Czech Republic", "Europe", "Applications", "Visa checklist", "Parent guidance"],
    studentLevels: ["High school", "A-levels/IB/AP", "Undergraduate", "Transfer student"],
  },
];

let profiles = [];
let dataLoadNotice = "";

const tutorGrid = document.querySelector("#tutorGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const filterGroup = document.querySelector("#filterGroup");
const catalogStatus = document.querySelector("#catalogStatus");
const clearFilters = document.querySelector("#clearFilters");
const profilePanel = document.querySelector("#profilePanel");
const profileBackdrop = document.querySelector("#profileBackdrop");
const profileContent = document.querySelector("#profileContent");
const closePanel = document.querySelector("#closePanel");
const menuToggle = document.querySelector("#menuToggle");
const primaryNav = document.querySelector("#primaryNav");
const wizardContent = document.querySelector("#wizardContent");
const wizardStepLabel = document.querySelector("#wizardStepLabel");
const wizardProgressBar = document.querySelector("#wizardProgressBar");
const wizardBack = document.querySelector("#wizardBack");
const wizardReset = document.querySelector("#wizardReset");
const wizardSummaryList = document.querySelector("#wizardSummaryList");
const wizardResults = document.querySelector("#wizardResults");
const contactForm = document.querySelector("#contactForm");
const formBackdrop = document.querySelector("#formBackdrop");
const reviewModal = document.querySelector("#reviewModal");
const reviewForm = document.querySelector("#reviewForm");
const reviewProfileSelect = document.querySelector("#reviewProfile");
const reviewFormStatus = document.querySelector("#reviewFormStatus");
const applicationModal = document.querySelector("#applicationModal");
const applicationForm = document.querySelector("#applicationForm");
const applicationFormStatus = document.querySelector("#applicationFormStatus");
const openApplicationFormButton = document.querySelector("#openApplicationForm");

let activeFilter = "All";
let wizardStepIndex = 0;
let wizardAnswers = {};
let lastFocusedElement = null;
let lastModalFocusedElement = null;
let activeFormModal = null;
const shortlistedProfiles = new Set();

const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => htmlEscapes[character]);

const normalizeText = (value) => String(value ?? "").toLowerCase().trim();

const uniqueList = (items) => {
  const seen = new Set();
  return items
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const asArray = (value) => {
  if (Array.isArray(value)) return uniqueList(value);
  if (value === null || value === undefined || value === "") return [];
  return uniqueList(String(value).split(/[\n,;|]+/));
};

const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (Number.isFinite(number)) return number;
  const match = String(value).match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined || value === "") return null;

  const normalized = normalizeText(value);
  if (["true", "yes", "y", "1", "approved", "verified", "public"].includes(normalized)) {
    return true;
  }
  if (["false", "no", "n", "0", "rejected", "private", "unapproved"].includes(normalized)) {
    return false;
  }
  return null;
};

const clampRating = (value) => {
  const rating = parseNumber(value);
  if (rating === null) return null;
  return Math.min(5, Math.max(1, rating));
};

const isSafeImageUrl = (value) => {
  const url = String(value ?? "").trim();
  if (!url) return false;
  return /^(https?:\/\/|\.?\/?assets\/)/i.test(url);
};

const normalizeReviewStatus = (status) => {
  const normalized = normalizeText(status || "pending");
  return [
    "pending",
    "awaiting_tutor_verification",
    "verified_by_tutor",
    "approved",
    "rejected",
  ].includes(normalized)
    ? normalized
    : "pending";
};

const normalizeReview = (review = {}) => ({
  studentName: String(review.studentName || review.reviewerName || review.name || "").trim(),
  studentEmail: String(review.studentEmail || review.reviewerEmail || review.email || "").trim(),
  reviewerType: String(review.reviewerType || "Student").trim(),
  rating: clampRating(review.rating),
  comment: String(review.comment || review.review || "").trim(),
  date: String(review.date || review.submittedDate || "").trim(),
  sessionType: String(review.sessionType || "Tutoring").trim(),
  verifiedByTutor: parseBoolean(review.verifiedByTutor) === true,
  approvedByAdmin: parseBoolean(review.approvedByAdmin) === true,
  publicPermission: parseBoolean(review.publicPermission) === true,
  status: normalizeReviewStatus(review.status),
});

const normalizeReviews = (reviews) =>
  Array.isArray(reviews)
    ? reviews
        .map(normalizeReview)
        .filter((review) => review.rating !== null || review.comment)
    : [];

const normalizePublicContactMethod = (rawProfile) => {
  const source =
    rawProfile.publicContactMethod && typeof rawProfile.publicContactMethod === "object"
      ? rawProfile.publicContactMethod
      : {
          type: rawProfile.publicContactType,
          value: rawProfile.publicContactValue,
          approved: rawProfile.publicContactApproved,
        };

  return {
    type: normalizeText(source.type),
    value: String(source.value || "").trim(),
    approved: parseBoolean(source.approved) === true,
  };
};

const countryAliases = new Map([
  ["us", "United States"],
  ["usa", "United States"],
  ["u.s.", "United States"],
  ["united states of america", "United States"],
  ["uk", "United Kingdom"],
  ["u.k.", "United Kingdom"],
  ["sa", "South Africa"],
  ["south africa", "South Africa"],
  ["uae", "UAE"],
  ["u.a.e.", "UAE"],
  ["united arab emirates", "UAE"],
  ["czechia", "Czech Republic"],
]);

const normalizeCountryName = (country) => {
  const cleaned = String(country ?? "").trim();
  return countryAliases.get(cleaned.toLowerCase()) || cleaned;
};

const normalizeProfileType = (profileType, profile) => {
  const raw = normalizeText(profileType);
  if (raw.includes("tutor") && (raw.includes("counselor") || raw.includes("counsellor"))) {
    return "Tutor + Counselor";
  }
  if (raw.includes("counselor") || raw.includes("counsellor") || raw.includes("counsel")) {
    return "Counselor";
  }
  if (raw.includes("tutor")) return "Tutor";

  const hasSubjects = profile.subjects.length > 0;
  const hasCounseling = profile.countries.length > 0 || profile.counselingTopics.length > 0;
  if (hasSubjects && hasCounseling) return "Tutor + Counselor";
  if (hasCounseling) return "Counselor";
  return "Tutor";
};

const makeInitials = (name) =>
  String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "TC";

const slugify = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const deriveSupportTypes = (profile) => {
  const supportTypes = [];
  if (profile.profileType.includes("Tutor")) supportTypes.push("Academic tutoring");
  if (
    profile.subjects.some((subject) =>
      ["test prep", "sat/act", "ielts/toefl"].includes(normalizeText(subject))
    )
  ) {
    supportTypes.push("Test prep");
  }
  if (profile.profileType.includes("Counselor") || profile.countries.length || profile.counselingTopics.length) {
    supportTypes.push("Country counseling", "University pathway planning");
  }
  return uniqueList(supportTypes);
};

const deriveExperienceYears = (profile) => {
  if (Number.isFinite(profile.experienceYears)) return profile.experienceYears;
  const parsed = parseNumber(profile.experience);
  return parsed ?? 0;
};

const normalizeOutcomes = (outcomes) => {
  const outcomeItems = Array.isArray(outcomes) ? outcomes : asArray(outcomes);
  return outcomeItems.map((outcome) => {
    if (Array.isArray(outcome)) {
      return [outcome[0] || "", outcome[1] || "", outcome[2] || "", outcome[3] || ""];
    }
    return [outcome, "", "", ""];
  });
};

const normalizeLoadedProfile = (rawProfile, index) => {
  const profile = {
    id: String(rawProfile.id || "").trim(),
    name: String(rawProfile.name || `TutorCat Specialist ${index + 1}`).trim(),
    initials: String(rawProfile.initials || "").trim(),
    profileType: String(rawProfile.profileType || "").trim(),
    role: String(rawProfile.role || "").trim(),
    subjects: asArray(rawProfile.subjects),
    countries: asArray(rawProfile.countries).map(normalizeCountryName),
    counselingTopics: asArray(rawProfile.counselingTopics),
    educationOrExperience: String(rawProfile.educationOrExperience || "").trim(),
    location: String(rawProfile.location || "").trim(),
    sessionModes: asArray(rawProfile.sessionModes),
    languages: asArray(rawProfile.languages),
    currentStudents: parseNumber(rawProfile.currentStudents),
    improvement: String(rawProfile.improvement || "").trim(),
    experience: String(rawProfile.experience || "").trim(),
    experienceYears: parseNumber(rawProfile.experienceYears),
    availability: String(rawProfile.availability || "").trim(),
    shortBio: String(rawProfile.shortBio || "").trim(),
    parentNote: String(rawProfile.parentNote || "").trim(),
    outcomes: normalizeOutcomes(rawProfile.outcomes),
    tags: asArray(rawProfile.tags),
    imageUrl: isSafeImageUrl(rawProfile.imageUrl) ? String(rawProfile.imageUrl).trim() : "",
    imageAlt: String(rawProfile.imageAlt || "").trim(),
    photoApproved: parseBoolean(rawProfile.photoApproved) === true,
    rating: parseNumber(rawProfile.rating),
    reviewCount: parseNumber(rawProfile.reviewCount),
    reviews: normalizeReviews(rawProfile.reviews),
    email: String(rawProfile.email || "").trim(),
    verificationContactEmail: String(rawProfile.verificationContactEmail || "").trim(),
    publicContactMethod: normalizePublicContactMethod(rawProfile),
    applicationStatus: String(rawProfile.applicationStatus || "approved").trim(),
  };

  profile.profileType = normalizeProfileType(profile.profileType, profile);
  profile.initials = profile.initials || makeInitials(profile.name);
  profile.role = profile.role || `${profile.subjects[0] || "Education"} specialist`;
  profile.id = profile.id || slugify(`${profile.name} ${profile.profileType}`) || `profile-${index + 1}`;
  profile.sessionModes = profile.sessionModes.length ? profile.sessionModes : ["Online"];
  profile.supportTypes = deriveSupportTypes(profile);
  profile.studentLevels = uniqueList([...profile.tags, ...profile.subjects]);
  profile.experienceYears = deriveExperienceYears(profile);
  return profile;
};

const normalizeLoadedProfiles = (loadedProfiles) =>
  loadedProfiles.map(normalizeLoadedProfile).filter((profile) => profile.name && profile.role);

const toOption = (option) =>
  typeof option === "string" ? { label: option, value: option } : option;

const formatList = (items, fallback = "Not specified") =>
  items && items.length ? items.join(", ") : fallback;

const isVerifiedPublicReview = (review) =>
  review.rating !== null &&
  review.verifiedByTutor === true &&
  review.approvedByAdmin === true &&
  review.publicPermission === true &&
  review.status === "approved";

function getVerifiedReviewStats(profile) {
  const verifiedReviews = normalizeReviews(profile.reviews).filter(isVerifiedPublicReview);
  const verifiedReviewCount = verifiedReviews.length;
  const averageRating = verifiedReviewCount
    ? Number(
        (
          verifiedReviews.reduce((total, review) => total + review.rating, 0) /
          verifiedReviewCount
        ).toFixed(1)
      )
    : null;

  return {
    averageRating,
    verifiedReviewCount,
    verifiedReviews,
  };
}

const getRatingDisplayInfo = (profile) => {
  const stats = getVerifiedReviewStats(profile);
  const hasReviewObjects = Array.isArray(profile.reviews) && profile.reviews.length > 0;

  if (hasReviewObjects) {
    return {
      source: "verified",
      averageRating: stats.averageRating,
      reviewCount: stats.verifiedReviewCount,
      verifiedReviews: stats.verifiedReviews,
    };
  }

  if (profile.rating !== null && profile.reviewCount !== null) {
    return {
      source: "manual",
      averageRating: clampRating(profile.rating),
      reviewCount: profile.reviewCount,
      verifiedReviews: [],
    };
  }

  return {
    source: "none",
    averageRating: null,
    reviewCount: 0,
    verifiedReviews: [],
  };
};

const getSortableRating = (profile) => getRatingDisplayInfo(profile).averageRating || 0;

const pluralizeReviews = (count) => `${count} verified review${count === 1 ? "" : "s"}`;

const formatRating = (profile) => {
  const ratingInfo = getRatingDisplayInfo(profile);
  if (ratingInfo.averageRating === null) return "No verified public reviews yet.";
  if (ratingInfo.source === "manual") return "Rating shown from TutorCat records";
  return `${ratingInfo.averageRating.toFixed(1)} out of 5 based on ${pluralizeReviews(
    ratingInfo.reviewCount
  )}`;
};

const getStarText = (rating) => {
  if (rating === null) return "☆☆☆☆☆";
  const filledStars = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"★".repeat(filledStars)}${"☆".repeat(5 - filledStars)}`;
};

const renderRatingSummary = (profile, variant = "card") => {
  const ratingInfo = getRatingDisplayInfo(profile);

  if (ratingInfo.averageRating === null) {
    return `
      <div class="rating-summary rating-summary-${variant}">
        <span class="rating-empty">No verified public reviews yet.</span>
      </div>
    `;
  }

  const ratingText =
    ratingInfo.source === "manual"
      ? `Rated ${ratingInfo.averageRating.toFixed(1)} out of 5 based on ${
          ratingInfo.reviewCount
        } TutorCat record${ratingInfo.reviewCount === 1 ? "" : "s"}`
      : `Rated ${ratingInfo.averageRating.toFixed(1)} out of 5 based on ${
          ratingInfo.reviewCount
        } verified review${ratingInfo.reviewCount === 1 ? "" : "s"}`;
  const note =
    ratingInfo.source === "manual"
      ? "Rating shown from TutorCat records"
      : `${ratingInfo.reviewCount} verified review${ratingInfo.reviewCount === 1 ? "" : "s"}`;

  return `
    <div class="rating-summary rating-summary-${variant}" aria-label="${escapeHtml(ratingText)}">
      <span class="rating-stars" aria-hidden="true">${getStarText(ratingInfo.averageRating)}</span>
      <span class="rating-value">${escapeHtml(ratingInfo.averageRating.toFixed(1))}</span>
      <span class="rating-note">${escapeHtml(note)}</span>
    </div>
  `;
};

const formatStudentLoad = (profile) =>
  profile.currentStudents === null
    ? "Student load not listed"
    : `${profile.currentStudents} active students`;

const formatExperience = (profile) => profile.experience || "Experience not listed";

const formatAvailability = (profile) => profile.availability || "Availability on request";

const sanitizeMailRecipient = (recipient) =>
  String(recipient || CONTACT_EMAIL)
    .replace(/[\r\n?&]/g, "")
    .trim();

const createMailto = (subject, body, recipient = CONTACT_EMAIL) =>
  `mailto:${sanitizeMailRecipient(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;

const profileTypeClass = (profile) =>
  profile.profileType === "Tutor + Counselor" ? "TutorCounselor" : profile.profileType;

const hasApprovedProfileImage = (profile) =>
  profile.photoApproved === true && isSafeImageUrl(profile.imageUrl);

const getProfileImageAlt = (profile) =>
  profile.imageAlt || `Profile photo of ${profile.name}`;

const renderProfileAvatar = (profile, variant = "card") => {
  const hasPhoto = hasApprovedProfileImage(profile);
  const ariaAttributes = hasPhoto
    ? ""
    : `role="img" aria-label="${escapeHtml(`${profile.name} initials avatar`)}"`;

  return `
    <span class="profile-avatar profile-avatar-${variant} ${profileTypeClass(profile)}${
    hasPhoto ? " has-photo" : ""
  }" data-avatar-name="${escapeHtml(profile.name)}" ${ariaAttributes}>
      ${
        hasPhoto
          ? `<img src="${escapeHtml(profile.imageUrl)}" alt="${escapeHtml(
              getProfileImageAlt(profile)
            )}" loading="lazy" decoding="async" />`
          : ""
      }
      <span class="avatar-initials" aria-hidden="true">${escapeHtml(profile.initials)}</span>
    </span>
  `;
};

const renderChips = (items = [], className, limit = items.length) =>
  items
    .slice(0, limit)
    .map((item) => `<span class="${className}">${escapeHtml(item)}</span>`)
    .join("");

const getFilterLabel = (value) =>
  FILTER_OPTIONS.find((option) => option.value === value)?.label || value;

const getProfileSearchText = (profile) =>
  [
    profile.name,
    profile.profileType,
    profile.role,
    profile.supportTypes.join(" "),
    profile.subjects.join(" "),
    profile.countries.join(" "),
    profile.counselingTopics.join(" "),
    profile.educationOrExperience,
    profile.location,
    profile.sessionModes.join(" "),
    profile.languages.join(" "),
    profile.availability,
    profile.shortBio,
    profile.parentNote,
    profile.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

const getSearchTokens = (profile) => getProfileSearchText(profile).match(/[a-z0-9]+/g) || [];

const getSearchAliases = (query) => {
  const aliases = {
    us: ["united states"],
    usa: ["united states"],
    uk: ["united kingdom"],
    cs: ["computer science"],
  };

  return aliases[query] || [];
};

const matchesSearch = (profile, query) => {
  if (!query) return true;

  const text = getProfileSearchText(profile);
  const aliases = getSearchAliases(query);
  if (aliases.some((alias) => text.includes(alias))) return true;

  if (query.length <= 2) {
    return getSearchTokens(profile).includes(query);
  }

  return text.includes(query);
};

const hasAnyValue = (items, value) =>
  items.some((item) => normalizeText(item) === normalizeText(value));

const matchesFilter = (profile, filterValue) => {
  if (filterValue === "All") return true;
  if (filterValue === "Tutors") return profile.profileType.includes("Tutor");
  if (filterValue === "Counselors") return profile.profileType.includes("Counselor");
  if (filterValue === "Tutor + Counselor") return profile.profileType === filterValue;

  const profileValues = [
    ...profile.subjects,
    ...profile.countries,
    ...profile.counselingTopics,
    ...profile.tags,
  ];

  if (filterValue === "Test Prep") {
    return profileValues.some((value) =>
      ["test prep", "sat/act", "ielts/toefl"].includes(normalizeText(value))
    );
  }

  return profileValues.some((value) => normalizeText(value).includes(normalizeText(filterValue)));
};

const getSearchScore = (profile, query) => {
  if (!query) return 0;
  const normalizedQuery = normalizeText(query);
  const name = normalizeText(profile.name);
  const role = normalizeText(profile.role);
  const text = getProfileSearchText(profile);

  let score = 0;
  if (name.includes(normalizedQuery)) score += 35;
  if (role.includes(normalizedQuery)) score += 20;
  if (profile.subjects.some((subject) => normalizeText(subject).includes(normalizedQuery))) {
    score += 18;
  }
  if (profile.countries.some((country) => normalizeText(country).includes(normalizedQuery))) {
    score += 18;
  }
  if (
    profile.counselingTopics.some((topic) => normalizeText(topic).includes(normalizedQuery))
  ) {
    score += 16;
  }
  if (text.includes(normalizedQuery)) score += 8;
  return score;
};

const sortProfiles = (items, query) => {
  const sortMode = sortSelect.value;
  const profilesToSort = [...items];

  if (sortMode === "experience") {
    return profilesToSort.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
  }

  if (sortMode === "rating") {
    return profilesToSort.sort(
      (a, b) =>
        getSortableRating(b) - getSortableRating(a) ||
        getRatingDisplayInfo(b).reviewCount - getRatingDisplayInfo(a).reviewCount
    );
  }

  if (sortMode === "load") {
    return profilesToSort.sort(
      (a, b) => (a.currentStudents ?? Number.POSITIVE_INFINITY) - (b.currentStudents ?? Number.POSITIVE_INFINITY)
    );
  }

  return profilesToSort.sort((a, b) => {
    const scoreA =
      getSearchScore(a, query) +
      (matchesFilter(a, activeFilter) && activeFilter !== "All" ? 20 : 0) +
      getSortableRating(a) * 3 +
      (a.experienceYears || 0) -
      (a.currentStudents || 0) * 0.5;
    const scoreB =
      getSearchScore(b, query) +
      (matchesFilter(b, activeFilter) && activeFilter !== "All" ? 20 : 0) +
      getSortableRating(b) * 3 +
      (b.experienceYears || 0) -
      (b.currentStudents || 0) * 0.5;
    return scoreB - scoreA;
  });
};

const getVisibleProfiles = () => {
  const query = normalizeText(searchInput.value);
  const filtered = profiles.filter(
    (profile) => matchesFilter(profile, activeFilter) && matchesSearch(profile, query)
  );
  return sortProfiles(filtered, query);
};

const renderFilterButtons = () => {
  filterGroup.innerHTML = FILTER_OPTIONS.map(
    (option) => `
      <button
        class="filter-button${option.value === activeFilter ? " is-active" : ""}"
        type="button"
        data-filter="${escapeHtml(option.value)}"
      >
        ${escapeHtml(option.label)}
      </button>
    `
  ).join("");
};

const renderProfileCard = (profile) => {
  const topics = [...profile.subjects, ...profile.counselingTopics];
  const isShortlisted = shortlistedProfiles.has(profile.id);

  return `
    <article class="tutor-card">
      <div class="card-topline">
        ${renderProfileAvatar(profile, "card")}
        <div class="card-title">
          <h3>${escapeHtml(profile.name)}</h3>
          <p>${escapeHtml(profile.role)}</p>
        </div>
      </div>
      <span class="type-badge">${escapeHtml(profile.profileType)}</span>
      ${renderRatingSummary(profile, "card")}
      <div class="chip-list" aria-label="Countries supported">
        ${renderChips(profile.countries, "country-chip", 4)}
      </div>
      <div class="chip-list" aria-label="Subjects and topics">
        ${renderChips(topics, "subject-chip", 5)}
      </div>
      <div class="chip-list" aria-label="Boards and levels">
        ${renderChips(profile.tags, "tag-chip", 4)}
      </div>
      <div class="card-meta">
        <div>
          <strong>Experience</strong>
          <span>${escapeHtml(formatExperience(profile))}</span>
        </div>
        <div>
          <strong>Availability</strong>
          <span>${escapeHtml(formatAvailability(profile))}</span>
        </div>
        <div>
          <strong>Mode</strong>
          <span>${escapeHtml(formatList(profile.sessionModes))}</span>
        </div>
      </div>
      <div class="card-spacer"></div>
      <div class="card-actions">
        <button class="card-action primary-card" type="button" data-profile-id="${escapeHtml(
          profile.id
        )}">
          View Profile
        </button>
        <button
          class="card-action${isShortlisted ? " is-shortlisted" : ""}"
          type="button"
          data-shortlist-id="${escapeHtml(profile.id)}"
          aria-pressed="${isShortlisted ? "true" : "false"}"
        >
          ${isShortlisted ? "Shortlisted" : "Shortlist"}
        </button>
      </div>
    </article>
  `;
};

const renderCards = () => {
  const visibleProfiles = getVisibleProfiles();
  tutorGrid.innerHTML = visibleProfiles.map(renderProfileCard).join("");
  emptyState.hidden = visibleProfiles.length > 0;

  const filterLabel = getFilterLabel(activeFilter);
  const query = searchInput.value.trim();
  const filterText = activeFilter === "All" ? "all specialists" : filterLabel;
  const searchText = query ? ` matching "${query}"` : "";
  const countText = `${visibleProfiles.length} specialist${
    visibleProfiles.length === 1 ? "" : "s"
  } shown for ${filterText}${searchText}.`;
  catalogStatus.textContent = dataLoadNotice ? `${dataLoadNotice} ${countText}` : countText;
};

const setActiveFilter = (value) => {
  activeFilter = value;
  renderFilterButtons();
  renderCards();
};

const renderPanelList = (items) =>
  items
    .map(
      ([label, value]) => `
        <li>
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(value)}</span>
        </li>
      `
    )
    .join("");

const renderOutcomes = (profile) =>
  profile.outcomes
    .map(
      ([area, before, after, term]) => `
        <tr>
          <td>${escapeHtml(area)}</td>
          <td>${escapeHtml(before)}</td>
          <td>${escapeHtml(after)}</td>
          <td>${escapeHtml(term)}</td>
        </tr>
      `
    )
    .join("");

const REVIEW_POLICY_TEXT =
  "All TutorCat reviews are verified by the tutor/counselor and approved by TutorCat before being displayed publicly or included in overall ratings.";

const renderVerifiedReviews = (profile) => {
  const { verifiedReviews } = getVerifiedReviewStats(profile);

  return `
    <p class="review-policy">${escapeHtml(REVIEW_POLICY_TEXT)}</p>
    ${
      verifiedReviews.length
        ? `
          <div class="review-list">
            ${verifiedReviews
              .map(
                (review) => `
                  <article class="review-card">
                    <div class="review-card-topline">
                      <strong>${escapeHtml(review.reviewerType || "Student")}</strong>
                      <span>${escapeHtml(review.date || "Date not listed")}</span>
                    </div>
                    <div class="review-rating" aria-label="${escapeHtml(
                      `Rated ${review.rating.toFixed(1)} out of 5`
                    )}">
                      <span class="rating-stars" aria-hidden="true">${getStarText(
                        review.rating
                      )}</span>
                      <span>${escapeHtml(review.rating.toFixed(1))}</span>
                    </div>
                    <p>${escapeHtml(review.comment)}</p>
                    <span class="review-session">${escapeHtml(
                      review.sessionType || "Session type not listed"
                    )}</span>
                  </article>
                `
              )
              .join("")}
          </div>
        `
        : `<p class="empty-reviews">No verified public reviews yet.</p>`
    }
  `;
};

const getApprovedPublicContact = (profile) => {
  const contact = profile.publicContactMethod;
  if (!contact || contact.approved !== true || !contact.value) return null;

  const type = normalizeText(contact.type);
  if (!["email", "whatsapp", "linkedin", "website"].includes(type)) return null;
  return { type, value: contact.value };
};

const normalizeExternalUrl = (value) => {
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch (error) {
    return "";
  }
};

const getPublicContactHref = (contact) => {
  if (!contact) return "";

  if (contact.type === "email") {
    return `mailto:${sanitizeMailRecipient(contact.value)}`;
  }

  if (contact.type === "whatsapp") {
    const normalizedUrl = normalizeExternalUrl(contact.value);
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(normalizedUrl)) {
      return normalizedUrl;
    }
    const digits = contact.value.replace(/[^\d]/g, "");
    return digits ? `https://wa.me/${digits}` : "";
  }

  return normalizeExternalUrl(contact.value);
};

const formatPublicContactLabel = (type) => {
  const labels = {
    email: "Public email",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    website: "Website",
  };
  return labels[type] || "Public contact";
};

const renderPublicContact = (profile) => {
  const contact = getApprovedPublicContact(profile);
  const href = getPublicContactHref(contact);

  if (!contact || !href) {
    return `
      <p class="contact-fallback">
        No approved public contact is listed for this profile. Use Request intro and TutorCat will route the message.
      </p>
    `;
  }

  return `
    <div class="public-contact">
      <span>Approved public contact</span>
      <a href="${escapeHtml(href)}" ${
    contact.type === "email" ? "" : 'target="_blank" rel="noopener noreferrer"'
  }>
        ${escapeHtml(formatPublicContactLabel(contact.type))}
      </a>
    </div>
  `;
};

const renderProfilePanel = (profile) => {
  const ratingInfo = getRatingDisplayInfo(profile);
  const ratingMetric = ratingInfo.averageRating === null ? "-" : ratingInfo.averageRating.toFixed(1);
  const ratingMetricLabel =
    ratingInfo.source === "manual"
      ? "TutorCat records"
      : ratingInfo.source === "verified"
        ? `${ratingInfo.reviewCount} verified`
        : "rating";
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: `
        <p>${escapeHtml(profile.shortBio || "Profile summary will be added soon.")}</p>
        <ul class="panel-list">
          ${renderPanelList([
            ["Profile type", profile.profileType],
            ["Experience", profile.educationOrExperience || formatExperience(profile)],
            ["Location", profile.location || "Location not listed"],
            ["Languages", formatList(profile.languages)],
          ])}
        </ul>
      `,
    },
    {
      id: "subjects",
      label: "Subjects & countries",
      content: `
        <h3>Subjects</h3>
        <div class="chip-list">${renderChips(profile.subjects, "subject-chip")}</div>
        <h3>Countries</h3>
        <div class="chip-list">${renderChips(profile.countries, "country-chip")}</div>
        <h3>Counseling topics</h3>
        <div class="chip-list">${renderChips(profile.counselingTopics, "tag-chip")}</div>
      `,
    },
    {
      id: "outcomes",
      label: "Outcomes",
      content: `
        <p>${escapeHtml(profile.improvement || "Outcome details will be added when available.")}</p>
        <table class="outcome-table">
          <thead>
            <tr>
              <th>Area</th>
              <th>Before</th>
              <th>After</th>
              <th>Context</th>
            </tr>
          </thead>
          <tbody>${renderOutcomes(profile)}</tbody>
        </table>
      `,
    },
    {
      id: "reviews",
      label: "Reviews",
      content: `
        ${renderVerifiedReviews(profile)}
        <button class="secondary-action profile-secondary-action" type="button" data-rate-profile="${escapeHtml(
          profile.id
        )}">
          Rate this tutor
        </button>
      `,
    },
    {
      id: "notes",
      label: "Parent/student notes",
      content: `
        <p>${escapeHtml(profile.parentNote || "Parent/student notes will be added when available.")}</p>
        <ul class="panel-list">
          ${renderPanelList([
            ["Best support types", formatList(profile.supportTypes)],
            ["Student levels", formatList(profile.studentLevels)],
            ["Tags", formatList(profile.tags)],
          ])}
        </ul>
      `,
    },
    {
      id: "availability",
      label: "Availability",
      content: `
        <ul class="panel-list">
          ${renderPanelList([
            ["Availability", formatAvailability(profile)],
            ["Session modes", formatList(profile.sessionModes)],
            ["Current student load", formatStudentLoad(profile)],
            ["Rating", formatRating(profile)],
          ])}
        </ul>
      `,
    },
    {
      id: "request",
      label: "Request intro",
      content: `
        <p>Open a prefilled email with this profile, support areas, countries, topics, and a suggested next step.</p>
        <button class="profile-action" type="button" data-request-profile="${escapeHtml(
          profile.id
        )}">
          Request intro
        </button>
        ${renderPublicContact(profile)}
      `,
    },
  ];

  profileContent.innerHTML = `
    <div class="profile-topline">
      ${renderProfileAvatar(profile, "panel")}
      <div class="profile-heading">
        <h2 id="panelName">${escapeHtml(profile.name)}</h2>
        <p>${escapeHtml(profile.role)}</p>
        ${renderRatingSummary(profile, "panel")}
      </div>
    </div>

    <div class="profile-quick-actions" aria-label="${escapeHtml(profile.name)} actions">
      <button class="profile-action" type="button" data-request-profile="${escapeHtml(profile.id)}">
        Request intro
      </button>
      <button class="secondary-action profile-secondary-action" type="button" data-rate-profile="${escapeHtml(
        profile.id
      )}">
        Rate this tutor
      </button>
    </div>

    <div class="panel-metrics" aria-label="${escapeHtml(profile.name)} profile metrics">
      <div class="panel-metric">
        <strong>${escapeHtml(profile.currentStudents ?? "-")}</strong>
        <span>current students</span>
      </div>
      <div class="panel-metric">
        <strong>${escapeHtml(ratingMetric)}</strong>
        <span>${escapeHtml(ratingMetricLabel)}</span>
      </div>
      <div class="panel-metric">
        <strong>${escapeHtml(formatExperience(profile))}</strong>
        <span>experience</span>
      </div>
    </div>

    <div class="tab-list" role="tablist" aria-label="${escapeHtml(profile.name)} profile sections">
      ${tabs
        .map(
          (tab, index) => `
            <button
              class="tab-button"
              id="tab-${escapeHtml(tab.id)}"
              type="button"
              role="tab"
              aria-selected="${index === 0 ? "true" : "false"}"
              aria-controls="panel-${escapeHtml(tab.id)}"
              data-tab="${escapeHtml(tab.id)}"
            >
              ${escapeHtml(tab.label)}
            </button>
          `
        )
        .join("")}
    </div>

    ${tabs
      .map(
        (tab, index) => `
          <section
            class="tab-panel"
            id="panel-${escapeHtml(tab.id)}"
            role="tabpanel"
            aria-labelledby="tab-${escapeHtml(tab.id)}"
            ${index === 0 ? "" : "hidden"}
          >
            ${tab.content}
          </section>
        `
      )
      .join("")}
  `;
};

const getFocusableElements = (container) =>
  [...container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.disabled && !element.hidden && element.offsetParent !== null);

const openProfile = (id) => {
  const profile = profiles.find((item) => item.id === id);
  if (!profile) return;

  lastFocusedElement = document.activeElement;
  renderProfilePanel(profile);
  profileBackdrop.hidden = false;
  profilePanel.hidden = false;
  document.body.classList.add("panel-open");
  closePanel.focus();
};

const closeProfile = () => {
  profileBackdrop.hidden = true;
  profilePanel.hidden = true;
  document.body.classList.remove("panel-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
};

const buildProfileRequestBody = (profile) => {
  const topics = [...new Set([...profile.subjects, ...profile.counselingTopics])];
  return [
    `Selected profile: ${profile.name}`,
    `Role: ${profile.role}`,
    `Support type: ${formatList(profile.supportTypes)}`,
    `Countries: ${formatList(profile.countries)}`,
    `Subjects/topics: ${formatList(topics)}`,
    `Session modes: ${formatList(profile.sessionModes)}`,
    "",
    "Suggested next step:",
    `Please confirm whether ${profile.name} is available for an introductory TutorCat session and recommend the best first-session focus.`,
  ].join("\n");
};

const requestProfileIntro = (profileId) => {
  const profile = profiles.find((item) => item.id === profileId);
  if (!profile) return;
  window.location.href = createMailto(
    `TutorCat intro request: ${profile.name}`,
    buildProfileRequestBody(profile)
  );
};

function createTutorVerificationEmail(review, profile) {
  const studentName = review.studentName || review.reviewerName || "Student/parent name not listed";
  const studentEmail = review.studentEmail || review.reviewerEmail || "Student/parent email not listed";
  const submittedDate = review.date || review.submittedDate || new Date().toISOString();
  const publicPermission = review.publicPermission ? "Yes" : "No";

  const subject = `Please verify TutorCat review — ${studentName} / ${profile.name}`;
  const body = [
    `Student/parent name: ${studentName}`,
    `Student/parent email: ${studentEmail}`,
    `Tutor/counselor name: ${profile.name}`,
    `Rating: ${review.rating || "Not listed"}`,
    `Session type: ${review.sessionType || "Not listed"}`,
    "",
    "Review text:",
    review.comment || "No review text provided.",
    "",
    `Submitted date: ${submittedDate}`,
    `Public display permission: ${publicPermission}`,
    "",
    "Please confirm whether the reviewed session actually happened.",
    "Reply with one of: Verified, Not verified, Needs clarification.",
  ].join("\n");

  return {
    recipient: profile.verificationContactEmail || CONTACT_EMAIL,
    subject,
    body,
  };
}

const appendUrlParams = (url, params) => {
  if (!url) return "";

  try {
    const nextUrl = new URL(url, window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        nextUrl.searchParams.set(key, value);
      }
    });
    return nextUrl.href;
  } catch (error) {
    return url;
  }
};

const openSubmissionTarget = (url, isExternal) => {
  if (isExternal) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.href = url;
};

const getReviewSubmissionTarget = (review, profile) => {
  const useExternal = REVIEW_SUBMISSION_MODE === "external" && REVIEW_FORM_URL.trim();

  if (useExternal) {
    return {
      url: appendUrlParams(REVIEW_FORM_URL, {
        profileId: profile.id,
        tutorName: profile.name,
      }),
      isExternal: true,
    };
  }

  const body = [
    `Student/parent name: ${review.studentName}`,
    `Student/parent email: ${review.studentEmail}`,
    `Tutor/counselor name: ${profile.name}`,
    `Tutor/counselor profile ID: ${profile.id}`,
    `Rating: ${review.rating}`,
    `Session type: ${review.sessionType}`,
    "",
    "Review text:",
    review.comment,
    "",
    `Public display permission: ${review.publicPermission ? "Yes" : "No"}`,
    `Date submitted: ${review.date}`,
    "",
    "Note: This review should not be published or added to the tutor's rating until the tutor verifies the session and TutorCat approves the review.",
  ].join("\n");

  return {
    url: createMailto(`TutorCat Review Verification Needed — ${profile.name}`, body),
    isExternal: false,
  };
};

const getApplicationSubmissionTarget = (application) => {
  const useExternal =
    TUTOR_APPLICATION_MODE === "external" && TUTOR_APPLICATION_FORM_URL.trim();

  if (useExternal) {
    return {
      url: appendUrlParams(TUTOR_APPLICATION_FORM_URL, {
        name: application.fullName,
        email: application.email,
        applicantType: application.applicantType,
      }),
      isExternal: true,
    };
  }

  const body = [
    `Applicant wants to be listed as: ${application.applicantType}`,
    "",
    `Full name: ${application.fullName}`,
    `Email: ${application.email}`,
    `Phone or WhatsApp: ${application.phone || "Not provided"}`,
    `City/country: ${application.location || "Not provided"}`,
    `Subjects I can teach: ${application.subjects || "Not provided"}`,
    `Countries I can advise on: ${application.countries || "Not provided"}`,
    `Languages spoken: ${application.languages || "Not provided"}`,
    `Education/experience: ${application.experience || "Not provided"}`,
    `Years of experience: ${application.years || "Not provided"}`,
    `Session mode: ${application.sessionMode || "Not provided"}`,
    `Availability: ${application.availability || "Not provided"}`,
    "",
    "Short bio:",
    application.bio || "Not provided",
    "",
    `Profile picture URL: ${application.photoUrl || "Not provided"}`,
    `LinkedIn/portfolio/profile link: ${application.profileLink || "Not provided"}`,
    `Photo display consent: ${application.photoConsent ? "Yes" : "No"}`,
    `Submitted date: ${application.submittedDate}`,
    "",
    "Note: TutorCat should review this application before adding any public profile.",
  ].join("\n");

  return {
    url: createMailto(
      `TutorCat Tutor/Counselor Application — ${application.fullName}`,
      body
    ),
    isExternal: false,
  };
};

const setProfileTab = (tabId) => {
  profilePanel.querySelectorAll(".tab-button").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.tab === tabId));
  });

  profilePanel.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== `panel-${tabId}`;
  });
};

const getOpenDialog = () => {
  if (activeFormModal && !activeFormModal.hidden) return activeFormModal;
  if (!profilePanel.hidden) return profilePanel;
  return null;
};

const setFormStatus = (element, message, type = "success") => {
  if (!element) return;
  element.textContent = message;
  if (!message) {
    element.classList.remove("is-error", "is-success");
    return;
  }
  element.classList.toggle("is-error", type === "error");
  element.classList.toggle("is-success", type !== "error");
};

const setSubmitButtonState = (button, isBusy, busyLabel) => {
  if (!button) return;
  if (!button.dataset.defaultLabel) {
    button.dataset.defaultLabel = button.textContent.trim();
  }
  button.disabled = isBusy;
  button.textContent = isBusy ? busyLabel : button.dataset.defaultLabel;
};

const populateReviewProfileOptions = () => {
  if (!reviewProfileSelect) return;

  reviewProfileSelect.innerHTML = `
    <option value="">Choose one</option>
    ${profiles
      .map(
        (profile) => `
          <option value="${escapeHtml(profile.id)}">${escapeHtml(profile.name)}</option>
        `
      )
      .join("")}
  `;
};

const openFormModal = (modal) => {
  if (!modal || !formBackdrop) return;

  lastModalFocusedElement = document.activeElement;
  activeFormModal = modal;
  formBackdrop.hidden = false;
  modal.hidden = false;
  document.body.classList.add("modal-open");

  const focusableElements = getFocusableElements(modal);
  (focusableElements[0] || modal).focus();
};

const closeFormModal = () => {
  if (!activeFormModal || !formBackdrop) return;

  activeFormModal.hidden = true;
  formBackdrop.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastModalFocusedElement && typeof lastModalFocusedElement.focus === "function") {
    lastModalFocusedElement.focus();
  }

  activeFormModal = null;
  lastModalFocusedElement = null;
};

const openReviewForm = (profileId = "") => {
  if (!reviewForm || !reviewModal) return;
  populateReviewProfileOptions();
  reviewForm.reset();
  reviewProfileSelect.value = profileId;
  setFormStatus(reviewFormStatus, "");
  openFormModal(reviewModal);
};

const openApplicationForm = () => {
  if (!applicationForm || !applicationModal) return;
  applicationForm.reset();
  setFormStatus(applicationFormStatus, "");
  openFormModal(applicationModal);
};

const getTrimmedFormValue = (formData, key) => String(formData.get(key) || "").trim();

const handleReviewSubmit = (event) => {
  event.preventDefault();

  if (!reviewForm.checkValidity()) {
    reviewForm.reportValidity();
    setFormStatus(reviewFormStatus, "Please complete the required review fields.", "error");
    return;
  }

  const formData = new FormData(reviewForm);
  const profileId = getTrimmedFormValue(formData, "profileId");
  const profile = profiles.find((item) => item.id === profileId);

  if (!profile) {
    setFormStatus(reviewFormStatus, "Choose a valid tutor or counselor.", "error");
    return;
  }

  const review = {
    studentName: getTrimmedFormValue(formData, "studentName"),
    studentEmail: getTrimmedFormValue(formData, "studentEmail"),
    rating: getTrimmedFormValue(formData, "rating"),
    sessionType: getTrimmedFormValue(formData, "sessionType"),
    comment: getTrimmedFormValue(formData, "comment"),
    publicPermission: formData.get("publicPermission") === "on",
    date: new Date().toISOString(),
    status: "pending",
  };
  const submitButton = reviewForm.querySelector('[type="submit"]');
  const target = getReviewSubmissionTarget(review, profile);

  setSubmitButtonState(submitButton, true, "Preparing submission...");
  setFormStatus(
    reviewFormStatus,
    "Thank you. Your review has been submitted. It will be sent for tutor verification and TutorCat approval before appearing publicly."
  );
  openSubmissionTarget(target.url, target.isExternal);
  window.setTimeout(() => setSubmitButtonState(submitButton, false), 900);
};

const handleApplicationSubmit = (event) => {
  event.preventDefault();

  const subjectsField = applicationForm.querySelector("#applicationSubjects");
  const countriesField = applicationForm.querySelector("#applicationCountries");
  subjectsField.setCustomValidity("");
  countriesField.setCustomValidity("");

  if (!subjectsField.value.trim() && !countriesField.value.trim()) {
    subjectsField.setCustomValidity("Enter at least one subject or country.");
  }

  if (!applicationForm.checkValidity()) {
    applicationForm.reportValidity();
    setFormStatus(
      applicationFormStatus,
      "Please complete the required application fields.",
      "error"
    );
    return;
  }

  const formData = new FormData(applicationForm);
  const application = {
    fullName: getTrimmedFormValue(formData, "fullName"),
    email: getTrimmedFormValue(formData, "email"),
    phone: getTrimmedFormValue(formData, "phone"),
    location: getTrimmedFormValue(formData, "location"),
    applicantType: getTrimmedFormValue(formData, "applicantType"),
    subjects: getTrimmedFormValue(formData, "subjects"),
    countries: getTrimmedFormValue(formData, "countries"),
    languages: getTrimmedFormValue(formData, "languages"),
    experience: getTrimmedFormValue(formData, "experience"),
    years: getTrimmedFormValue(formData, "years"),
    sessionMode: getTrimmedFormValue(formData, "sessionMode"),
    availability: getTrimmedFormValue(formData, "availability"),
    bio: getTrimmedFormValue(formData, "bio"),
    photoUrl: getTrimmedFormValue(formData, "photoUrl"),
    profileLink: getTrimmedFormValue(formData, "profileLink"),
    photoConsent: formData.get("photoConsent") === "on",
    submittedDate: new Date().toISOString(),
  };
  const submitButton = applicationForm.querySelector('[type="submit"]');
  const target = getApplicationSubmissionTarget(application);

  setSubmitButtonState(submitButton, true, "Preparing application...");
  setFormStatus(
    applicationFormStatus,
    "Thank you for applying. TutorCat will review your information before adding any public profile."
  );
  openSubmissionTarget(target.url, target.isExternal);
  window.setTimeout(() => setSubmitButtonState(submitButton, false), 900);
};

const optionMatchesProfile = (profile, value) => {
  if (!profile || !value) return false;

  const normalizedValue = normalizeText(value);
  const profileValues = [
    ...profile.supportTypes,
    ...profile.subjects,
    ...profile.countries,
    ...profile.counselingTopics,
    ...profile.sessionModes,
    ...profile.studentLevels,
    ...profile.tags,
  ];

  return profileValues.some((item) => normalizeText(item).includes(normalizedValue));
};

const scoreProfileForAnswers = (profile, answers) => {
  if (!profile) {
    return { profile: null, score: 0, reasons: [] };
  }

  let score = 20;
  const reasons = [];

  if (answers.support === "Unsure") {
    score += 8;
    reasons.push("flexible planning");
  } else if (optionMatchesProfile(profile, answers.support)) {
    score += 20;
    reasons.push(answers.support.toLowerCase());
  } else if (
    answers.support === "Academic tutoring" &&
    profile.profileType.includes("Tutor")
  ) {
    score += 14;
    reasons.push("academic tutoring");
  } else if (
    answers.support?.includes("counseling") &&
    profile.profileType.includes("Counselor")
  ) {
    score += 14;
    reasons.push("counseling");
  }

  if (answers.destination && answers.destination !== "Other") {
    if (hasAnyValue(profile.countries, answers.destination)) {
      score += 24;
      reasons.push(`${answers.destination} guidance`);
    } else if (profile.profileType.includes("Counselor")) {
      score += 6;
    }
  }

  if (answers.level && optionMatchesProfile(profile, answers.level)) {
    score += 12;
    reasons.push(`${answers.level} students`);
  }

  if (answers.focus) {
    if (optionMatchesProfile(profile, answers.focus)) {
      score += 20;
      reasons.push(`${answers.focus} support`);
    } else if (
      ["Math", "Science", "Computer Science"].includes(answers.focus) &&
      profile.tags.some((tag) => normalizeText(tag).includes("stem"))
    ) {
      score += 12;
      reasons.push("STEM tutoring");
    }
  }

  if (answers.format && hasAnyValue(profile.sessionModes, answers.format)) {
    score += 12;
    reasons.push(`${answers.format.toLowerCase()} sessions`);
  } else if (answers.format === "In-person" && hasAnyValue(profile.sessionModes, "Hybrid")) {
    score += 7;
    reasons.push("hybrid sessions");
  }

  if (answers.urgency === "This week" && profile.availability.toLowerCase().includes("this-week")) {
    score += 6;
    reasons.push("same-week availability");
  } else if (
    answers.urgency === "This month" &&
    profile.availability.toLowerCase().includes("this-month")
  ) {
    score += 6;
    reasons.push("this-month availability");
  } else if (answers.urgency === "Planning ahead") {
    score += 4;
    reasons.push("planning ahead");
  }

  return {
    profile,
    score: Math.min(score, 98),
    reasons: [...new Set(reasons)].slice(0, 4),
  };
};

const getWizardRecommendations = () =>
  profiles
    .map((profile) => scoreProfileForAnswers(profile, wizardAnswers))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

const getWizardAnswerRows = () =>
  WIZARD_STEPS.map((step) => ({
    label: step.title,
    value: wizardAnswers[step.key] || "Not selected",
  }));

const renderWizardSummary = () => {
  wizardSummaryList.innerHTML = getWizardAnswerRows()
    .map(
      (row) => `
        <div>
          <dt>${escapeHtml(row.label)}</dt>
          <dd>${escapeHtml(row.value)}</dd>
        </div>
      `
    )
    .join("");
};

const renderWizardStep = () => {
  const step = WIZARD_STEPS[wizardStepIndex];
  const progress = ((wizardStepIndex + 1) / WIZARD_STEPS.length) * 100;

  wizardStepLabel.textContent = `Step ${wizardStepIndex + 1} of ${WIZARD_STEPS.length}`;
  wizardProgressBar.style.width = `${progress}%`;
  wizardBack.disabled = wizardStepIndex === 0;

  wizardContent.innerHTML = `
    <h3>${escapeHtml(step.title)}</h3>
    <p>Select the option that best describes this request.</p>
    <div class="option-grid">
      ${step.options
        .map(toOption)
        .map(
          (option) => `
            <button
              class="option-button${
                wizardAnswers[step.key] === option.value ? " is-selected" : ""
              }"
              type="button"
              data-wizard-key="${escapeHtml(step.key)}"
              data-wizard-value="${escapeHtml(option.value)}"
            >
              ${escapeHtml(option.label)}
            </button>
          `
        )
        .join("")}
    </div>
  `;

  renderWizardSummary();
};

const buildWizardRequestBody = (recommendation) => {
  const rows = getWizardAnswerRows()
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n");

  return [
    `Requested match: ${recommendation.profile.name}`,
    `Match score: ${recommendation.score}%`,
    `Recommended because: ${recommendation.reasons.join(" + ") || "general profile fit"}`,
    "",
    "Matching summary:",
    rows,
    "",
    "Suggested next step:",
    "Please confirm the best tutor or counselor introduction and recommend a first-session focus.",
  ].join("\n");
};

const renderWizardResults = () => {
  const recommendations = getWizardRecommendations();

  wizardResults.innerHTML = `
    <h3>Recommended matches</h3>
    <div class="match-grid">
      ${recommendations
        .map((recommendation) => {
          const label = recommendation.score >= 76 ? "Strong match" : "Good match";
          const reasons = recommendation.reasons.length
            ? recommendation.reasons.join(" + ")
            : "overall profile fit";
          return `
            <article class="match-card">
              <span class="match-score">${escapeHtml(label)} - ${escapeHtml(
            recommendation.score
          )}%</span>
              <h3>${escapeHtml(recommendation.profile.name)}</h3>
              <p>${escapeHtml(recommendation.profile.role)}</p>
              <p>Recommended because they support ${escapeHtml(reasons)}.</p>
              <button
                class="profile-action"
                type="button"
                data-request-match="${escapeHtml(recommendation.profile.id)}"
              >
                Request this match
              </button>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
};

const resetWizard = () => {
  wizardStepIndex = 0;
  wizardAnswers = {};
  wizardResults.innerHTML = "";
  renderWizardStep();
};

const handleWizardOption = (button) => {
  const { wizardKey, wizardValue } = button.dataset;
  wizardAnswers[wizardKey] = wizardValue;

  if (wizardStepIndex < WIZARD_STEPS.length - 1) {
    wizardStepIndex += 1;
    renderWizardStep();
    return;
  }

  renderWizardStep();
  renderWizardResults();
};

const requestWizardMatch = (profileId) => {
  const profile = profiles.find((item) => item.id === profileId);
  if (!profile) return;

  const recommendation = scoreProfileForAnswers(profile, wizardAnswers);

  window.location.href = createMailto(
    `TutorCat match request: ${recommendation.profile.name}`,
    buildWizardRequestBody(recommendation)
  );
};

const setMobileNav = (isOpen) => {
  primaryNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
};

const scrollToCatalog = () => {
  document.querySelector("#catalog").scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
};

const handleCountryAction = (country) => {
  searchInput.value = "";
  setActiveFilter(country);
  scrollToCatalog();
};

const handleContactSubmit = (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const level = formData.get("level");
  const support = formData.get("support");
  const country = formData.get("country") || "Not specified";
  const topic = formData.get("topic");
  const email = formData.get("email");
  const message = formData.get("message");

  const body = [
    `Parent/student name: ${name}`,
    `Email: ${email}`,
    `Student level: ${level}`,
    `Support type: ${support}`,
    `Country of interest: ${country}`,
    `Subject/topic: ${topic}`,
    "",
    "Message:",
    message,
  ].join("\n");

  window.location.href = createMailto(
    `TutorCat request: ${support} for ${level}`,
    body
  );
};

const extractProfilesFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.profiles)) return payload.profiles;
  return [];
};

const loadProfiles = async () => {
  catalogStatus.textContent = "Loading specialists...";
  tutorGrid.innerHTML = "";
  emptyState.hidden = true;
  wizardResults.innerHTML = "";
  wizardContent.innerHTML = "<p>Loading specialists...</p>";

  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const loadedProfiles = normalizeLoadedProfiles(extractProfilesFromPayload(payload));
    if (!loadedProfiles.length) {
      throw new Error("No public profiles found in data/tutors.json");
    }

    profiles = loadedProfiles;
    dataLoadNotice = "";
  } catch (error) {
    profiles = normalizeLoadedProfiles(FALLBACK_PROFILES);
    dataLoadNotice = "Could not load data/tutors.json. Showing fallback sample profiles.";
  }
};

const initializeApp = async () => {
  renderFilterButtons();
  await loadProfiles();
  renderCards();
  populateReviewProfileOptions();
  renderWizardStep();
};

filterGroup.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");
  if (!button) return;
  setActiveFilter(button.dataset.filter);
});

tutorGrid.addEventListener("click", (event) => {
  const profileButton = event.target.closest("[data-profile-id]");
  const shortlistButton = event.target.closest("[data-shortlist-id]");

  if (profileButton) {
    openProfile(profileButton.dataset.profileId);
    return;
  }

  if (shortlistButton) {
    const profileId = shortlistButton.dataset.shortlistId;
    if (shortlistedProfiles.has(profileId)) {
      shortlistedProfiles.delete(profileId);
    } else {
      shortlistedProfiles.add(profileId);
    }
    renderCards();
  }
});

profilePanel.addEventListener("click", (event) => {
  const tabButton = event.target.closest(".tab-button");
  const requestButton = event.target.closest("[data-request-profile]");
  const rateButton = event.target.closest("[data-rate-profile]");

  if (tabButton) {
    setProfileTab(tabButton.dataset.tab);
    return;
  }

  if (requestButton) {
    requestProfileIntro(requestButton.dataset.requestProfile);
    return;
  }

  if (rateButton) {
    openReviewForm(rateButton.dataset.rateProfile);
  }
});

wizardContent.addEventListener("click", (event) => {
  const optionButton = event.target.closest(".option-button");
  if (!optionButton) return;
  handleWizardOption(optionButton);
});

wizardResults.addEventListener("click", (event) => {
  const matchButton = event.target.closest("[data-request-match]");
  if (!matchButton) return;
  requestWizardMatch(matchButton.dataset.requestMatch);
});

document.querySelectorAll(".country-action").forEach((button) => {
  button.addEventListener("click", () => handleCountryAction(button.dataset.country));
});

searchInput.addEventListener("input", renderCards);
sortSelect.addEventListener("change", renderCards);
clearFilters.addEventListener("click", () => {
  searchInput.value = "";
  sortSelect.value = "best";
  setActiveFilter("All");
});

wizardBack.addEventListener("click", () => {
  if (wizardStepIndex === 0) return;
  wizardStepIndex -= 1;
  wizardResults.innerHTML = "";
  renderWizardStep();
});

wizardReset.addEventListener("click", resetWizard);
closePanel.addEventListener("click", closeProfile);
profileBackdrop.addEventListener("click", closeProfile);
contactForm.addEventListener("submit", handleContactSubmit);

if (openApplicationFormButton) {
  openApplicationFormButton.addEventListener("click", openApplicationForm);
}

if (reviewForm) {
  reviewForm.addEventListener("submit", handleReviewSubmit);
}

if (applicationForm) {
  applicationForm.addEventListener("submit", handleApplicationSubmit);
  applicationForm
    .querySelectorAll("#applicationSubjects, #applicationCountries")
    .forEach((field) => {
      field.addEventListener("input", () => {
        const subjectsField = applicationForm.querySelector("#applicationSubjects");
        const countriesField = applicationForm.querySelector("#applicationCountries");
        if (subjectsField.value.trim() || countriesField.value.trim()) {
          subjectsField.setCustomValidity("");
          countriesField.setCustomValidity("");
        }
      });
    });
}

if (formBackdrop) {
  formBackdrop.addEventListener("click", closeFormModal);
}

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeFormModal);
});

document.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.closest(".profile-avatar")) return;
    const avatar = image.closest(".profile-avatar");
    avatar.classList.add("is-image-broken");
    avatar.setAttribute("role", "img");
    avatar.setAttribute(
      "aria-label",
      `${avatar.dataset.avatarName || "TutorCat specialist"} initials avatar`
    );
    image.removeAttribute("src");
  },
  true
);

menuToggle.addEventListener("click", () => {
  setMobileNav(!primaryNav.classList.contains("is-open"));
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMobileNav(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (activeFormModal && !activeFormModal.hidden) {
      closeFormModal();
      return;
    }
    if (!profilePanel.hidden) closeProfile();
    if (primaryNav.classList.contains("is-open")) setMobileNav(false);
  }

  if (event.key === "Tab") {
    const openDialog = getOpenDialog();
    if (!openDialog) return;

    const focusableElements = getFocusableElements(openDialog);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

initializeApp();
