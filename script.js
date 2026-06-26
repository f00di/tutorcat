const CONTACT_EMAIL = "hello@tutorcat.example";

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

const profiles = [
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

let activeFilter = "All";
let wizardStepIndex = 0;
let wizardAnswers = {};
let lastFocusedElement = null;
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

const toOption = (option) =>
  typeof option === "string" ? { label: option, value: option } : option;

const formatList = (items, fallback = "Not specified") =>
  items && items.length ? items.join(", ") : fallback;

const createMailto = (subject, body) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}`;

const profileTypeClass = (profile) =>
  profile.profileType === "Tutor + Counselor" ? "TutorCounselor" : profile.profileType;

const renderChips = (items, className, limit = items.length) =>
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
    return profilesToSort.sort((a, b) => b.experienceYears - a.experienceYears);
  }

  if (sortMode === "rating") {
    return profilesToSort.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }

  if (sortMode === "load") {
    return profilesToSort.sort((a, b) => a.currentStudents - b.currentStudents);
  }

  return profilesToSort.sort((a, b) => {
    const scoreA =
      getSearchScore(a, query) +
      (matchesFilter(a, activeFilter) && activeFilter !== "All" ? 20 : 0) +
      a.rating * 3 +
      a.experienceYears -
      a.currentStudents * 0.5;
    const scoreB =
      getSearchScore(b, query) +
      (matchesFilter(b, activeFilter) && activeFilter !== "All" ? 20 : 0) +
      b.rating * 3 +
      b.experienceYears -
      b.currentStudents * 0.5;
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
        <span class="avatar ${profileTypeClass(profile)}" aria-hidden="true">${escapeHtml(
          profile.initials
        )}</span>
        <div class="card-title">
          <h3>${escapeHtml(profile.name)}</h3>
          <p>${escapeHtml(profile.role)}</p>
        </div>
      </div>
      <span class="type-badge">${escapeHtml(profile.profileType)}</span>
      <div class="chip-list" aria-label="Countries supported">
        ${renderChips(profile.countries, "country-chip", 4)}
      </div>
      <div class="chip-list" aria-label="Subjects and topics">
        ${renderChips(topics, "subject-chip", 5)}
      </div>
      <div class="card-meta">
        <div>
          <strong>Rating</strong>
          <span>${escapeHtml(profile.rating.toFixed(1))} (${escapeHtml(
    profile.reviewCount
  )} sample reviews)</span>
        </div>
        <div>
          <strong>Experience</strong>
          <span>${escapeHtml(profile.experience)}</span>
        </div>
        <div>
          <strong>Availability</strong>
          <span>${escapeHtml(profile.availability)}</span>
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
  catalogStatus.textContent = `${visibleProfiles.length} specialist${
    visibleProfiles.length === 1 ? "" : "s"
  } shown for ${filterText}${searchText}.`;
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

const renderProfilePanel = (profile) => {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: `
        <p>${escapeHtml(profile.shortBio)}</p>
        <ul class="panel-list">
          ${renderPanelList([
            ["Profile type", profile.profileType],
            ["Experience", profile.educationOrExperience],
            ["Location", profile.location],
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
        <p>${escapeHtml(profile.improvement)}</p>
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
      id: "notes",
      label: "Parent/student notes",
      content: `
        <p>${escapeHtml(profile.parentNote)}</p>
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
            ["Availability", profile.availability],
            ["Session modes", formatList(profile.sessionModes)],
            ["Current student load", `${profile.currentStudents} active students`],
            ["Rating", `${profile.rating.toFixed(1)} from ${profile.reviewCount} sample reviews`],
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
      `,
    },
  ];

  profileContent.innerHTML = `
    <div class="profile-topline">
      <span class="avatar ${profileTypeClass(profile)}" aria-hidden="true">${escapeHtml(
    profile.initials
  )}</span>
      <div class="profile-heading">
        <h2 id="panelName">${escapeHtml(profile.name)}</h2>
        <p>${escapeHtml(profile.role)}</p>
      </div>
    </div>

    <div class="panel-metrics" aria-label="${escapeHtml(profile.name)} profile metrics">
      <div class="panel-metric">
        <strong>${escapeHtml(profile.currentStudents)}</strong>
        <span>current students</span>
      </div>
      <div class="panel-metric">
        <strong>${escapeHtml(profile.rating.toFixed(1))}</strong>
        <span>sample rating</span>
      </div>
      <div class="panel-metric">
        <strong>${escapeHtml(profile.experience)}</strong>
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

const setProfileTab = (tabId) => {
  profilePanel.querySelectorAll(".tab-button").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.tab === tabId));
  });

  profilePanel.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== `panel-${tabId}`;
  });
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

  if (tabButton) {
    setProfileTab(tabButton.dataset.tab);
    return;
  }

  if (requestButton) {
    requestProfileIntro(requestButton.dataset.requestProfile);
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
    if (!profilePanel.hidden) closeProfile();
    if (primaryNav.classList.contains("is-open")) setMobileNav(false);
  }

  if (event.key === "Tab" && !profilePanel.hidden) {
    const focusableElements = getFocusableElements(profilePanel);
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

renderFilterButtons();
renderCards();
renderWizardStep();
