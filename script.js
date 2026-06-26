const tutors = [
  {
    id: "maya-patel",
    name: "Maya Patel",
    initials: "MP",
    role: "AP Calculus and statistics coach",
    primary: "Math",
    subjects: ["Math", "Statistics", "Test Prep"],
    workStudy: "Lecturer at East Bay Learning Lab; M.S. Applied Mathematics",
    location: "Oakland and remote",
    currentStudents: 5,
    improvement: "95%",
    experience: "7 yrs",
    currentRoster: [
      ["AP Calculus AB", "2 students"],
      ["Algebra II honors", "2 students"],
      ["SAT Math", "1 student"],
    ],
    gradeOutcomes: [
      ["AP Calculus AB", "B-", "A", "Spring 2026"],
      ["Algebra II", "C+", "B+", "Winter 2026"],
      ["SAT Math", "610", "730", "May 2026"],
    ],
    bio: "Maya builds short diagnostic plans for students who need precision in algebra, functions, limits, and data interpretation before moving into harder work.",
    availability: "Mon, Wed, Sat",
  },
  {
    id: "daniel-kim",
    name: "Daniel Kim",
    initials: "DK",
    role: "Physics and chemistry tutor",
    primary: "Science",
    subjects: ["Science", "Physics", "Chemistry"],
    workStudy: "Materials science Ph.D. candidate at Stanford University",
    location: "Palo Alto and remote",
    currentStudents: 4,
    improvement: "88%",
    experience: "5 yrs",
    currentRoster: [
      ["AP Physics 1", "2 students"],
      ["Honors Chemistry", "1 student"],
      ["Environmental Science", "1 student"],
    ],
    gradeOutcomes: [
      ["AP Physics 1", "C", "B+", "Spring 2026"],
      ["Chemistry", "B", "A-", "Spring 2026"],
      ["Lab reports", "78%", "91%", "Winter 2026"],
    ],
    bio: "Daniel connects formulas to lab intuition, then uses structured problem sets to make unit conversions, force diagrams, and reaction steps feel repeatable.",
    availability: "Tue, Thu, Sun",
  },
  {
    id: "lena-brooks",
    name: "Lena Brooks",
    initials: "LB",
    role: "Writing and humanities mentor",
    primary: "English",
    subjects: ["English", "History", "College Essays"],
    workStudy: "Writing center fellow at UCLA; B.A. English literature",
    location: "Los Angeles and remote",
    currentStudents: 4,
    improvement: "92%",
    experience: "6 yrs",
    currentRoster: [
      ["AP Literature", "2 students"],
      ["College essays", "1 student"],
      ["Grade 10 writing", "1 student"],
    ],
    gradeOutcomes: [
      ["AP Literature", "B", "A-", "Spring 2026"],
      ["Research essay", "82%", "94%", "Winter 2026"],
      ["History DBQ", "3/7", "6/7", "May 2026"],
    ],
    bio: "Lena focuses on argument structure, close reading, and revision routines that help students write cleaner essays under time pressure.",
    availability: "Mon, Thu, Sat",
  },
  {
    id: "sofia-alvarez",
    name: "Sofia Alvarez",
    initials: "SA",
    role: "Spanish and French language tutor",
    primary: "Language",
    subjects: ["Language", "Spanish", "French"],
    workStudy: "World language teacher at Lakeside Prep",
    location: "San Jose and remote",
    currentStudents: 3,
    improvement: "90%",
    experience: "8 yrs",
    currentRoster: [
      ["Spanish III", "1 student"],
      ["French II", "1 student"],
      ["Conversation fluency", "1 student"],
    ],
    gradeOutcomes: [
      ["Spanish III", "C+", "A-", "Spring 2026"],
      ["French II", "B-", "B+", "Spring 2026"],
      ["Oral exam", "76%", "90%", "Winter 2026"],
    ],
    bio: "Sofia blends grammar practice with conversation drills, pronunciation work, and compact vocabulary systems for stronger recall.",
    availability: "Wed, Fri, Sun",
  },
  {
    id: "marcus-reed",
    name: "Marcus Reed",
    initials: "MR",
    role: "SAT, ACT, and algebra specialist",
    primary: "Test Prep",
    subjects: ["Test Prep", "Math", "Reading"],
    workStudy: "Testing coordinator at Summit Prep Academy",
    location: "Berkeley and remote",
    currentStudents: 5,
    improvement: "93%",
    experience: "9 yrs",
    currentRoster: [
      ["SAT prep", "2 students"],
      ["ACT prep", "2 students"],
      ["Algebra I", "1 student"],
    ],
    gradeOutcomes: [
      ["SAT composite", "1180", "1370", "June 2026"],
      ["ACT English", "24", "31", "April 2026"],
      ["Algebra I", "C", "B+", "Spring 2026"],
    ],
    bio: "Marcus uses timed diagnostics, score-band strategy, and weekly error logs to turn test prep into measurable decisions.",
    availability: "Tue, Wed, Sat",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    initials: "PN",
    role: "Biology and health sciences tutor",
    primary: "Science",
    subjects: ["Science", "Biology", "Anatomy"],
    workStudy: "Medical student at UCSF; former AP Biology lab assistant",
    location: "San Francisco and remote",
    currentStudents: 3,
    improvement: "89%",
    experience: "4 yrs",
    currentRoster: [
      ["AP Biology", "1 student"],
      ["Anatomy", "1 student"],
      ["Grade 9 biology", "1 student"],
    ],
    gradeOutcomes: [
      ["AP Biology", "B-", "A-", "Spring 2026"],
      ["Anatomy practical", "72%", "88%", "Winter 2026"],
      ["Biology unit tests", "C+", "B+", "Spring 2026"],
    ],
    bio: "Priya turns dense biology content into diagrams, retrieval practice, and short oral checks so students can explain the material clearly.",
    availability: "Mon, Fri, Sun",
  },
  {
    id: "nora-chen",
    name: "Nora Chen",
    initials: "NC",
    role: "Computer science and robotics mentor",
    primary: "Math",
    subjects: ["Math", "Computer Science", "Robotics"],
    workStudy: "Software engineer at Blue Harbor Labs; CS club mentor",
    location: "Seattle and remote",
    currentStudents: 4,
    improvement: "90%",
    experience: "6 yrs",
    currentRoster: [
      ["Python foundations", "2 students"],
      ["AP Computer Science Principles", "1 student"],
      ["Robotics project", "1 student"],
    ],
    gradeOutcomes: [
      ["AP CSP", "B", "A", "Spring 2026"],
      ["Python project", "Incomplete", "92%", "May 2026"],
      ["Geometry proofs", "C+", "B+", "Winter 2026"],
    ],
    bio: "Nora keeps coding lessons project-based while maintaining clear rubrics for debugging, documentation, and math prerequisites.",
    availability: "Tue, Thu, Sat",
  },
  {
    id: "amelia-jordan",
    name: "Amelia Jordan",
    initials: "AJ",
    role: "Elementary reading and math teacher",
    primary: "English",
    subjects: ["English", "Math", "Reading"],
    workStudy: "Lead teacher at Redwood Montessori School",
    location: "Marin County and remote",
    currentStudents: 4,
    improvement: "91%",
    experience: "10 yrs",
    currentRoster: [
      ["Grade 4 reading", "2 students"],
      ["Grade 5 math", "1 student"],
      ["Executive skills", "1 student"],
    ],
    gradeOutcomes: [
      ["Reading fluency", "Below level", "On level", "Spring 2026"],
      ["Fractions unit", "C", "B+", "Spring 2026"],
      ["Homework completion", "58%", "87%", "Winter 2026"],
    ],
    bio: "Amelia helps younger students build confidence through short lessons, visual models, and parent-friendly weekly progress notes.",
    availability: "Mon, Wed, Sun",
  },
];

const tutorGrid = document.querySelector("#tutorGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
const profilePanel = document.querySelector("#profilePanel");
const profileBackdrop = document.querySelector("#profileBackdrop");
const profileContent = document.querySelector("#profileContent");
const closePanel = document.querySelector("#closePanel");

let activeFilter = "All";
let lastFocusedElement = null;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const subjectClass = (subject) => subject.toLowerCase().replaceAll(" ", "-");

const renderSubjectChips = (subjects) =>
  subjects
    .map((subject) => `<span class="subject-chip">${escapeHtml(subject)}</span>`)
    .join("");

const renderCards = () => {
  const query = searchInput.value.trim().toLowerCase();
  const visibleTutors = tutors.filter((tutor) => {
    const hasSubject =
      activeFilter === "All" || tutor.subjects.includes(activeFilter);
    const searchable = [
      tutor.name,
      tutor.role,
      tutor.subjects.join(" "),
      tutor.workStudy,
      tutor.location,
    ]
      .join(" ")
      .toLowerCase();

    return hasSubject && searchable.includes(query);
  });

  tutorGrid.innerHTML = visibleTutors
    .map(
      (tutor) => `
        <article class="tutor-card">
          <button class="card-button" type="button" data-tutor-id="${escapeHtml(tutor.id)}" aria-label="View ${escapeHtml(tutor.name)} profile">
            <div class="card-topline">
              <span class="avatar ${subjectClass(tutor.primary)}" aria-hidden="true">${escapeHtml(tutor.initials)}</span>
              <div class="card-title">
                <h3>${escapeHtml(tutor.name)}</h3>
                <p>${escapeHtml(tutor.role)}</p>
              </div>
            </div>
            <div class="subject-list">${renderSubjectChips(tutor.subjects)}</div>
            <div class="card-details">
              <div class="detail-row">
                <strong>Works</strong>
                <span>${escapeHtml(tutor.workStudy)}</span>
              </div>
              <div class="detail-row">
                <strong>Roster</strong>
                <span>${escapeHtml(tutor.currentStudents)} current students</span>
              </div>
              <div class="detail-row">
                <strong>Location</strong>
                <span>${escapeHtml(tutor.location)}</span>
              </div>
            </div>
            <div class="card-stats">
              <span class="mini-stat">
                <span>${escapeHtml(tutor.improvement)}</span>
                <span>grade gains</span>
              </span>
              <span class="mini-stat">
                <span>${escapeHtml(tutor.experience)}</span>
                <span>experience</span>
              </span>
              <span class="open-profile">View profile</span>
            </div>
          </button>
        </article>
      `
    )
    .join("");

  emptyState.hidden = visibleTutors.length > 0;
};

const renderPanel = (tutor) => {
  const roster = tutor.currentRoster
    .map(
      ([course, count]) => `
        <li>
          <strong>${escapeHtml(course)}</strong>
          <span>${escapeHtml(count)}</span>
        </li>
      `
    )
    .join("");

  const outcomes = tutor.gradeOutcomes
    .map(
      ([course, before, after, term]) => `
        <tr>
          <td>${escapeHtml(course)}</td>
          <td>${escapeHtml(before)}</td>
          <td>${escapeHtml(after)}</td>
          <td>${escapeHtml(term)}</td>
        </tr>
      `
    )
    .join("");

  profileContent.innerHTML = `
    <div class="profile-topline">
      <span class="avatar ${subjectClass(tutor.primary)}" aria-hidden="true">${escapeHtml(tutor.initials)}</span>
      <div class="profile-heading">
        <h2 id="panelName">${escapeHtml(tutor.name)}</h2>
        <p id="panelTitle">${escapeHtml(tutor.role)}</p>
      </div>
    </div>

    <div class="panel-metrics" aria-label="${escapeHtml(tutor.name)} profile metrics">
      <div class="panel-metric">
        <strong>${escapeHtml(tutor.currentStudents)}</strong>
        <span>current students</span>
      </div>
      <div class="panel-metric">
        <strong>${escapeHtml(tutor.improvement)}</strong>
        <span>recent grade gains</span>
      </div>
      <div class="panel-metric">
        <strong>${escapeHtml(tutor.experience)}</strong>
        <span>teaching experience</span>
      </div>
    </div>

    <section class="panel-section">
      <h3>Work and study</h3>
      <p>${escapeHtml(tutor.workStudy)}</p>
      <p><strong>Base:</strong> ${escapeHtml(tutor.location)}</p>
    </section>

    <section class="panel-section">
      <h3>Current students</h3>
      <ul class="panel-list">${roster}</ul>
    </section>

    <section class="panel-section">
      <h3>Previous grade outcomes</h3>
      <table class="outcome-table">
        <thead>
          <tr>
            <th>Area</th>
            <th>Before</th>
            <th>After</th>
            <th>Term</th>
          </tr>
        </thead>
        <tbody>${outcomes}</tbody>
      </table>
    </section>

    <section class="panel-section">
      <h3>Teaching profile</h3>
      <p>${escapeHtml(tutor.bio)}</p>
      <p><strong>Availability:</strong> ${escapeHtml(tutor.availability)}</p>
      <div class="subject-list">${renderSubjectChips(tutor.subjects)}</div>
    </section>

    <button class="profile-action" type="button" data-request="${escapeHtml(tutor.name)}">Request intro</button>
  `;
};

const openTutorProfile = (id) => {
  const tutor = tutors.find((item) => item.id === id);
  if (!tutor) return;

  lastFocusedElement = document.activeElement;
  renderPanel(tutor);
  profileBackdrop.hidden = false;
  profilePanel.hidden = false;
  document.body.classList.add("panel-open");
  closePanel.focus();
};

const closeTutorProfile = () => {
  profileBackdrop.hidden = true;
  profilePanel.hidden = true;
  document.body.classList.remove("panel-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};

tutorGrid.addEventListener("click", (event) => {
  const cardButton = event.target.closest(".card-button");
  if (!cardButton) return;

  openTutorProfile(cardButton.dataset.tutorId);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderCards();
  });
});

searchInput.addEventListener("input", renderCards);
closePanel.addEventListener("click", closeTutorProfile);
profileBackdrop.addEventListener("click", closeTutorProfile);

profilePanel.addEventListener("click", (event) => {
  const requestButton = event.target.closest(".profile-action");
  if (!requestButton) return;

  const tutorName = requestButton.dataset.request;
  window.location.href = `mailto:hello@tutorcat.example?subject=${encodeURIComponent(
    `TutorCat intro: ${tutorName}`
  )}`;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !profilePanel.hidden) {
    closeTutorProfile();
  }
});

renderCards();
