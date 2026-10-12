const CONTACT_EMAIL = "your-email@example.com";

const REVIEW_SUBMISSION_MODE = "mailto";
const TUTOR_APPLICATION_MODE = "mailto";

const REVIEW_FORM_URL = "";
const TUTOR_APPLICATION_FORM_URL = "";

const DATA_URL = "./data/tutors.json";
const REGIONS_URL = "./data/regions.json";

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
    baseCountry: String(rawProfile.baseCountry || "").trim(),
    city: String(rawProfile.city || "").trim(),
    servesCountries: asArray(rawProfile.servesCountries),
    sessionModes: asArray(rawProfile.sessionModes),
    languages: asArray(rawProfile.languages),
    currentStudents: parseNumber(rawProfile.currentStudents),
    improvement: String(rawProfile.improvement || "").trim(),
    experience: String(rawProfile.experience || "").trim(),
    experienceYears: parseNumber(rawProfile.experienceYears),
    availability: String(rawProfile.availability || "").trim(),
    shortBio: String(rawProfile.shortBio || "").trim(),
    shortBioAr: String(rawProfile.shortBioAr || "").trim(),
    parentNote: String(rawProfile.parentNote || "").trim(),
    outcomes: normalizeOutcomes(rawProfile.outcomes),
    tags: asArray(rawProfile.tags),
    curricula: asArray(rawProfile.curricula),
    permitCountry: String(rawProfile.permitCountry || "").trim(),
    permitVerified: parseBoolean(rawProfile.permitVerified) === true,
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

const formatExperience = (profile) =>
  // A recorded "0 yrs" reads as no experience; unknown values still say "not listed".
  profile.experience && profile.experienceYears === 0
    ? "Under 1 yr"
    : profile.experience || "Experience not listed";

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

const getFocusableElements = (container) =>
  [...container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.disabled && !element.hidden && element.offsetParent !== null);

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
    `Country: ${application.country || "Not provided"}`,
    `City: ${application.city || "Not provided"}`,
    ...(application.place ? [`Location details: ${application.place}`] : []),
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

const fillApplicationCountries = () => {
  applicationCountry.innerHTML = optionsHtml([
    ["", "Choose one"],
    ...regions.countries.map((country) => [country.name, country.name]),
    ["Other", "Other"],
  ]);
};

// Free text only when the country or city is not in the lists.
const updateApplicationPlace = () => {
  applicationPlaceField.hidden = !(applicationCountry.value === "Other" || applicationCity.value === "Other");
};

const updateApplicationLocation = () => {
  const region = findRegion(applicationCountry.value);
  applicationCity.innerHTML = optionsHtml([
    ["", "Choose one"],
    ...(region?.cities ?? []).map((city) => [city.name, city.name]),
    ["Other", "Other / not listed"],
  ]);
  applicationCityField.hidden = !region;
  updateApplicationPlace();
};

const openApplicationForm = () => {
  if (!applicationForm || !applicationModal) return;
  applicationForm.reset();
  updateApplicationLocation();
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
    country: getTrimmedFormValue(formData, "country"),
    city: applicationCityField.hidden ? "" : getTrimmedFormValue(formData, "city"),
    place: applicationPlaceField.hidden ? "" : getTrimmedFormValue(formData, "place"),
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

const extractProfilesFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.profiles)) return payload.profiles;
  return [];
};


// ---------------------------------------------------------------------------
// Page state and elements
// ---------------------------------------------------------------------------

const DEFAULT_FILTER = { type: "all", value: "", where: "", city: "", curriculum: "" };

let profiles = [];
let regions = { countries: [], curricula: [] };
let dataLoadFailed = false;
let filter = { ...DEFAULT_FILTER };
let need = "tutoring";
let lastFocusedElement = null;
let lastModalFocusedElement = null;
let activeFormModal = null;
let drawerCloseTimer = null;
const shortlist = new Set();

const $ = (selector, root = document) => root.querySelector(selector);
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollToSection = (selector) =>
  $(selector).scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

const cardGrid = $("#cardGrid");
const emptyState = $("#emptyState");
const catalogStatus = $("#catalogStatus");
const factsLine = $("#factsLine");
const chipGroup = $("#chipGroup");
const needGroup = $("#needGroup");
const matchTopic = $("#matchTopic");
const drawerRoot = $("#drawerRoot");
const drawer = $("#drawer");
const shortlistButton = $("#shortlistButton");
const shortlistCount = $("#shortlistCount");
const menuButton = $("#menuButton");
const menuPanel = $("#menuPanel");
const contactForm = $("#contactForm");
const contactStatus = $("#contactStatus");
const contactSpecialist = $("#contactSpecialist");
const formBackdrop = $("#formBackdrop");
const reviewModal = $("#reviewModal");
const reviewForm = $("#reviewForm");
const reviewProfileSelect = $("#reviewProfile");
const reviewFormStatus = $("#reviewFormStatus");
const applicationModal = $("#applicationModal");
const applicationForm = $("#applicationForm");
const applicationFormStatus = $("#applicationFormStatus");
const applicationCountry = $("#applicationCountry");
const applicationCity = $("#applicationCity");
const applicationCityField = $("#applicationCityField");
const applicationPlaceField = $("#applicationPlaceField");
const filterRow = $("#filterRow");
const whereFilter = $("#whereFilter");
const cityFilter = $("#cityFilter");
const cityFilterField = $("#cityFilterField");
const curriculumFilter = $("#curriculumFilter");
const curriculumFilterField = $("#curriculumFilterField");
const matchWhere = $("#matchWhere");
const matchCity = $("#matchCity");
const matchCityField = $("#matchCityField");

const allSubjects = () => uniqueList(profiles.flatMap((profile) => profile.subjects));
const allCountries = () => uniqueList(profiles.flatMap((profile) => profile.countries));
const isTutor = (profile) => profile.profileType.includes("Tutor");
const isCounselor = (profile) => profile.profileType.includes("Counselor") || profile.countries.length > 0;

// "Where" = the Gulf country/city a tutor is based in or teaches online (data/regions.json).
// Not to be confused with `countries`, the study-abroad destinations counselors advise on.
const ONLINE_ANYWHERE = "online";
const findRegion = (name) => regions.countries.find((country) => country.name === name);
const shortCountry = (name) => findRegion(name)?.short || name;
const offersOnline = (profile) => profile.sessionModes.some((mode) => /online|hybrid/i.test(mode));
const offersInPerson = (profile) => profile.sessionModes.some((mode) => /in.?person|hybrid|home|face/i.test(mode));
// Online tutors teach their base country plus any Serves Countries.
const servedCountries = (profile) => uniqueList([profile.baseCountry, ...profile.servesCountries].filter(Boolean));
const hasVerifiedPermit = (profile) => profile.permitVerified && Boolean(findRegion(profile.permitCountry)?.permitBadge);
const allCurricula = () => {
  const used = new Set(profiles.flatMap((profile) => profile.curricula));
  const known = [...regions.curricula, ...regions.countries.flatMap((country) => country.nationalCurricula ?? [])].map(
    (curriculum) => curriculum.name
  );
  return [...known.filter((name) => used.has(name)), ...[...used].filter((name) => !known.includes(name))];
};

const bookmarkIcon =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>';
const closeIcon =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const checkIcon =
  '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

// ---------------------------------------------------------------------------
// Facts line (computed from the data so it never overstates)
// ---------------------------------------------------------------------------

const joinWords = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const renderFacts = () => {
  if (!profiles.length) {
    factsLine.hidden = true;
    return;
  }
  const subjects = allSubjects();
  const countries = allCountries();
  const modes = uniqueList(profiles.flatMap((profile) => profile.sessionModes));
  const gulf = uniqueList(profiles.flatMap(servedCountries)).filter(findRegion);
  const parts = [
    `${profiles.length} specialist${profiles.length === 1 ? "" : "s"} today`,
    subjects.length ? `teaching ${subjects.length} subject${subjects.length === 1 ? "" : "s"}` : "",
    gulf.length ? `across ${gulf.length} Gulf countr${gulf.length === 1 ? "y" : "ies"}` : "",
    countries.length ? `with counseling for ${joinWords(countries)}` : "",
  ].filter(Boolean);
  const format = modes.length === 1 ? ` All sessions are ${modes[0].toLowerCase()}.` : "";
  factsLine.textContent = `${parts.join(", ")}.${format}`;
  factsLine.hidden = false;
};

// ---------------------------------------------------------------------------
// Hero match box
// ---------------------------------------------------------------------------

const fillMatchTopics = () => {
  const options =
    need === "tutoring" ? allSubjects() : need === "counseling" ? allCountries() : [...allSubjects(), ...allCountries()];
  $("#matchTopicLabel").textContent =
    need === "tutoring" ? "Subject" : need === "counseling" ? "Destination" : "Subject or destination";
  matchTopic.innerHTML =
    '<option value="">Any</option>' +
    options.map((option) => `<option>${escapeHtml(option)}</option>`).join("");
};

const setNeed = (button) => {
  const buttons = [...needGroup.querySelectorAll("[data-need]")];
  buttons.forEach((item) => {
    const selected = item === button;
    item.setAttribute("aria-checked", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  $(".seg-indicator", needGroup).style.transform = `translateX(${buttons.indexOf(button) * 100}%)`;
  need = button.dataset.need;
  fillMatchTopics();
};

// ---------------------------------------------------------------------------
// Specialist catalog
// ---------------------------------------------------------------------------

const matchesType = (profile) => {
  switch (filter.type) {
    case "tutoring":
      return isTutor(profile);
    case "counseling":
      return isCounselor(profile);
    case "subject":
      return profile.subjects.includes(filter.value);
    case "country":
      return profile.countries.includes(filter.value);
    case "saved":
      return shortlist.has(profile.id);
    default:
      return true;
  }
};

// In-person tutors match their own country (and city); online tutors match every country they teach.
const matchesWhere = (profile) => {
  if (!filter.where) return true;
  const served = servedCountries(profile);
  if (filter.where === ONLINE_ANYWHERE) return offersOnline(profile) && served.some(findRegion);
  const inPerson =
    offersInPerson(profile) && profile.baseCountry === filter.where && (!filter.city || profile.city === filter.city);
  return inPerson || (offersOnline(profile) && served.includes(filter.where));
};

const matchesFilter = (profile) =>
  matchesType(profile) &&
  matchesWhere(profile) &&
  (!filter.curriculum || profile.curricula.includes(filter.curriculum));

const getChipOptions = () => [
  { type: "all", value: "", label: "All" },
  { type: "tutoring", value: "", label: "Tutoring" },
  { type: "counseling", value: "", label: "Counseling" },
  ...allSubjects().map((value) => ({ type: "subject", value, label: value })),
  ...allCountries().map((value) => ({ type: "country", value, label: value })),
  ...(shortlist.size ? [{ type: "saved", value: "", label: `Saved (${shortlist.size})` }] : []),
];

const renderChipFilters = () => {
  if (!profiles.length) {
    chipGroup.innerHTML = "";
    return;
  }
  chipGroup.innerHTML = getChipOptions()
    .map(
      (chip) => `
        <button class="chip" type="button" data-type="${chip.type}" data-value="${escapeHtml(chip.value)}"
          aria-pressed="${filter.type === chip.type && filter.value === chip.value}">${escapeHtml(chip.label)}</button>`
    )
    .join("");
};

// "Dubai, UAE" for in-person tutors, "Online in UAE and Oman" for online-only ones.
const describeLocation = (profile) => {
  const base = [profile.city, profile.baseCountry && shortCountry(profile.baseCountry)].filter(Boolean).join(", ");
  const online = offersOnline(profile) ? servedCountries(profile).map(shortCountry) : [];
  if (base && offersInPerson(profile)) return base;
  return online.length ? `Online in ${joinWords(online)}` : base;
};

const renderPermitBadge = (profile) =>
  hasVerifiedPermit(profile) ? `<p class="permit-badge">${checkIcon}Permit verified</p>` : "";

const renderProfileCard = (profile, index, animate) => {
  const hasReviews = getVerifiedReviewStats(profile).verifiedReviews.length > 0;
  const details = [
    describeLocation(profile),
    profile.tags.slice(0, 2).join(", "),
    formatList(profile.sessionModes, ""),
    `${formatExperience(profile)} experience`,
  ]
    .filter(Boolean)
    .join(". ");
  return `
    <article class="card${animate ? " enter" : ""}" style="--i:${index}">
      <div class="card-top">
        ${renderProfileAvatar(profile, "card")}
        <div class="card-heading">
          <h3>${escapeHtml(profile.name)}</h3>
          <p class="role">${escapeHtml(profile.role)}</p>
          ${renderPermitBadge(profile)}
        </div>
      </div>
      ${profile.subjects.length ? `<div class="tags">${renderChips(profile.subjects, "tag")}</div>` : ""}
      ${hasReviews ? renderRatingSummary(profile, "card") : ""}
      <p class="card-meta">${escapeHtml(details)}.</p>
      <div class="card-actions">
        <button class="btn btn-quiet" type="button" data-open="${escapeHtml(profile.id)}">View profile</button>
        <button class="btn btn-quiet save-btn" type="button" data-save="${escapeHtml(profile.id)}"
          aria-pressed="${shortlist.has(profile.id)}" aria-label="Save ${escapeHtml(profile.name)} to shortlist">${bookmarkIcon}</button>
      </div>
    </article>`;
};

const renderCards = (animate = false) => {
  const visible = profiles.filter(matchesFilter);
  cardGrid.innerHTML = visible.map((profile, index) => renderProfileCard(profile, index, animate && !prefersReducedMotion())).join("");
  emptyState.hidden = visible.length > 0;

  $("h3", emptyState).textContent = dataLoadFailed
    ? "Specialist profiles could not load."
    : "No specialist matches this yet.";
  $("p", emptyState).textContent = dataLoadFailed
    ? "Please refresh the page, or use the contact form below and we will match you directly."
    : "Tell us what you need and we will look for the right person.";
  $("#showAll").hidden = dataLoadFailed;

  catalogStatus.textContent = dataLoadFailed
    ? "Specialist profiles could not load."
    : `${visible.length} specialist${visible.length === 1 ? "" : "s"} shown.`;
};

const setFilter = (type, value = "") => {
  filter = { ...filter, type, value };
  renderChipFilters();
  renderCards(true);
};

const resetFilters = () => {
  filter = { ...DEFAULT_FILTER };
  syncFilterControls();
  renderChipFilters();
  renderCards(true);
};

// ---------------------------------------------------------------------------
// Where and curriculum filters (catalog row + hero match form)
// ---------------------------------------------------------------------------

const optionsHtml = (items) =>
  items.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("");

const whereOptionsHtml = () =>
  optionsHtml([
    ["", "Anywhere"],
    ...(regions.countries.length ? [[ONLINE_ANYWHERE, "Online, anywhere in the Gulf"]] : []),
    ...regions.countries.map((country) => [country.name, country.name]),
  ]);

// The City select only appears once a Gulf country with cities is chosen.
const fillCitySelect = (select, field, where, value = "") => {
  const cities = findRegion(where)?.cities ?? [];
  select.innerHTML = optionsHtml([["", "Any city"], ...cities.map((city) => [city.name, city.name])]);
  select.value = cities.some((city) => city.name === value) ? value : "";
  field.hidden = !cities.length;
};

const syncFilterControls = () => {
  whereFilter.value = filter.where;
  fillCitySelect(cityFilter, cityFilterField, filter.where, filter.city);
  curriculumFilter.value = filter.curriculum;
};

const renderLocationFilters = () => {
  const curricula = allCurricula();
  const hasRegions = regions.countries.length > 0;
  whereFilter.innerHTML = whereOptionsHtml();
  whereFilter.parentElement.hidden = !hasRegions;
  matchWhere.innerHTML = whereOptionsHtml();
  $(".match-where").hidden = !hasRegions;
  fillCitySelect(matchCity, matchCityField, "");
  curriculumFilter.innerHTML = optionsHtml([["", "Any curriculum"], ...curricula.map((name) => [name, name])]);
  curriculumFilterField.hidden = !curricula.length;
  filterRow.hidden = !profiles.length || (!hasRegions && !curricula.length);
  syncFilterControls();
};

const setWhere = (where, city = "") => {
  filter = { ...filter, where, city: findRegion(where) ? city : "" };
  syncFilterControls();
  renderCards(true);
};

const setCurriculum = (curriculum) => {
  filter = { ...filter, curriculum };
  renderCards(true);
};

// ---------------------------------------------------------------------------
// Shortlist
// ---------------------------------------------------------------------------

const updateShortlistCount = () => {
  shortlistCount.textContent = shortlist.size;
  shortlistButton.setAttribute("aria-label", `Shortlist, ${shortlist.size} saved`);
  if (!prefersReducedMotion()) {
    shortlistCount.animate(
      [
        { filter: "blur(3px)", opacity: 0.4, transform: "translateY(4px)" },
        { filter: "none", opacity: 1, transform: "none" },
      ],
      { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );
  }
};

const toggleShortlist = (id) => {
  if (shortlist.has(id)) shortlist.delete(id);
  else shortlist.add(id);
  document.querySelectorAll(`[data-save="${CSS.escape(id)}"]`).forEach((button) => {
    button.setAttribute("aria-pressed", String(shortlist.has(id)));
  });
  updateShortlistCount();
  if (filter.type === "saved" && !shortlist.size) setFilter("all");
  else renderChipFilters();
};

// ---------------------------------------------------------------------------
// Counseling countries
// ---------------------------------------------------------------------------

const getUniversity = (profile) =>
  profile.educationOrExperience
    .split(";")
    .map((part) => part.trim().replace(/\.$/, ""))
    .find((part) => /universit|college|institut/i.test(part)) || "";

const renderCountries = () => {
  const countries = allCountries();
  $("#counseling").hidden = countries.length === 0;
  $("#countryGrid").innerHTML = countries
    .map((country) => {
      const counselors = profiles
        .filter((profile) => profile.countries.includes(country))
        .map((profile) => {
          const university = getUniversity(profile);
          return university ? `${profile.name}, who studied at ${university}` : profile.name;
        });
      return `
        <div class="country">
          <h3 class="country-name">${escapeHtml(country)}</h3>
          <p>Counselor${counselors.length === 1 ? "" : "s"}: ${escapeHtml(counselors.join("; "))}.</p>
          <button class="btn btn-quiet" type="button" data-country="${escapeHtml(country)}">See ${escapeHtml(country)} counseling</button>
        </div>`;
    })
    .join("");
};

// ---------------------------------------------------------------------------
// Profile drawer
// ---------------------------------------------------------------------------

const renderDetailRows = (rows) =>
  rows
    .filter(([, value]) => value)
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`)
    .join("");

const renderDrawer = (profile) => {
  const education = profile.educationOrExperience
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map(escapeHtml)
    .join("<br />");
  const listOrEmpty = (items) => (items.length ? escapeHtml(items.join(", ")) : "");
  const hasReviews = getVerifiedReviewStats(profile).verifiedReviews.length > 0;
  const hasContact = Boolean(getPublicContactHref(getApprovedPublicContact(profile)));

  drawer.innerHTML = `
    <div class="drawer-head">
      ${renderProfileAvatar(profile, "panel")}
      <button class="btn btn-quiet icon-btn" type="button" data-close-drawer aria-label="Close profile">${closeIcon}</button>
    </div>
    <div>
      <h2 id="drawerName">${escapeHtml(profile.name)}</h2>
      <p class="role">${escapeHtml(profile.role)}</p>
      ${renderPermitBadge(profile)}
    </div>
    ${profile.shortBio ? `<p>${escapeHtml(profile.shortBio)}</p>` : ""}
    <dl class="detail-list">
      ${renderDetailRows([
        ["Education and experience", education],
        ["Subjects", listOrEmpty(profile.subjects)],
        ["Curricula and levels", listOrEmpty(profile.tags)],
        ["Counseling for", listOrEmpty(profile.countries)],
        ["Counseling topics", listOrEmpty(profile.counselingTopics)],
        ["Languages", listOrEmpty(profile.languages)],
        ["Based in", escapeHtml([profile.city, profile.baseCountry].filter(Boolean).join(", "))],
        ["Teaches online in", offersOnline(profile) ? escapeHtml(joinWords(servedCountries(profile))) : ""],
        ["Location", !profile.baseCountry && profile.location ? escapeHtml(profile.location) : ""],
        ["Permit", hasVerifiedPermit(profile) ? escapeHtml(`${findRegion(profile.permitCountry).permitName}, checked by the TutorCat team`) : ""],
        ["Format and experience", escapeHtml(`${formatList(profile.sessionModes, "Online")}. ${formatExperience(profile)}.`)],
        ["Availability", profile.availability ? escapeHtml(profile.availability) : ""],
        ["Parent note", profile.parentNote ? escapeHtml(profile.parentNote) : ""],
      ])}
    </dl>
    ${
      profile.outcomes.length
        ? `<div class="outcomes"><h3>Outcomes</h3><table class="outcome-table"><thead><tr><th>Area</th><th>Before</th><th>After</th><th>Context</th></tr></thead><tbody>${renderOutcomes(profile)}</tbody></table></div>`
        : ""
    }
    ${hasReviews ? `<div class="drawer-reviews">${renderRatingSummary(profile, "panel")}${renderVerifiedReviews(profile)}</div>` : ""}
    ${hasContact ? renderPublicContact(profile) : ""}
    ${hasApprovedProfileImage(profile) ? "" : '<p class="photo-note">Photo will be added once the specialist approves one.</p>'}
    <div class="drawer-actions">
      <button class="btn btn-primary" type="button" data-request="${escapeHtml(profile.id)}">Request an introduction</button>
      <button class="btn btn-quiet save-btn" type="button" data-save="${escapeHtml(profile.id)}"
        aria-pressed="${shortlist.has(profile.id)}" aria-label="Save ${escapeHtml(profile.name)} to shortlist">${bookmarkIcon}</button>
    </div>
    <button class="text-btn" type="button" data-rate="${escapeHtml(profile.id)}">Leave a review for ${escapeHtml(profile.name)}</button>`;
};

const openDrawer = (id) => {
  const profile = profiles.find((item) => item.id === id);
  if (!profile) return;
  lastFocusedElement = document.activeElement;
  renderDrawer(profile);
  window.clearTimeout(drawerCloseTimer);
  drawerRoot.hidden = false;
  $("main").inert = true;
  document.body.classList.add("is-locked");
  requestAnimationFrame(() => requestAnimationFrame(() => drawerRoot.classList.add("is-open")));
  $("[data-close-drawer]", drawer).focus({ preventScroll: true });
};

const closeDrawer = ({ restoreFocus = true } = {}) => {
  if (drawerRoot.hidden) return;
  drawerRoot.classList.remove("is-open");
  $("main").inert = false;
  document.body.classList.remove("is-locked");
  drawerCloseTimer = window.setTimeout(() => {
    drawerRoot.hidden = true;
  }, prefersReducedMotion() ? 0 : 240);
  if (restoreFocus && lastFocusedElement) lastFocusedElement.focus({ preventScroll: true });
};

const getOpenDialog = () => {
  if (activeFormModal && !activeFormModal.hidden) return activeFormModal;
  if (!drawerRoot.hidden) return drawer;
  return null;
};

// ---------------------------------------------------------------------------
// Contact form (opens a prefilled email)
// ---------------------------------------------------------------------------

const fillContactSpecialists = () => {
  contactSpecialist.innerHTML =
    '<option value="">No preference</option>' +
    profiles.map((profile) => `<option value="${escapeHtml(profile.id)}">${escapeHtml(profile.name)}</option>`).join("");
};

const requestIntroduction = (profileId) => {
  contactSpecialist.value = profileId;
  closeDrawer({ restoreFocus: false });
  scrollToSection("#contact");
  $("#contactName").focus({ preventScroll: true });
};

const handleContactSubmit = (event) => {
  event.preventDefault();
  const emailField = $("#contactEmail");
  const emailInvalid = !emailField.validity.valid || !emailField.value.trim();
  $("#contactEmailError").hidden = !emailInvalid;
  emailField.setAttribute("aria-invalid", String(emailInvalid));

  if (!contactForm.checkValidity() || emailInvalid) {
    const firstInvalid = contactForm.querySelector(":invalid");
    (emailInvalid ? emailField : firstInvalid)?.focus();
    setFormStatus(contactStatus, "Please complete the highlighted fields.", "error");
    return;
  }

  const formData = new FormData(contactForm);
  const profile = profiles.find((item) => item.id === formData.get("specialist"));
  const level = getTrimmedFormValue(formData, "level");
  const support = getTrimmedFormValue(formData, "support");
  const body = [
    `Parent/student name: ${getTrimmedFormValue(formData, "name")}`,
    `Email: ${getTrimmedFormValue(formData, "email")}`,
    `Student level: ${level}`,
    `Support type: ${support}`,
    `Specialist: ${profile ? profile.name : "No preference"}`,
    "",
    "Message:",
    getTrimmedFormValue(formData, "message") || "Not provided",
  ].join("\n");

  setFormStatus(contactStatus, "Your email app should open with this request ready to send.");
  window.location.href = createMailto(
    profile ? `TutorCat intro request: ${profile.name}` : `TutorCat request: ${support} for ${level}`,
    body
  );
};

// ---------------------------------------------------------------------------
// Menu, FAQ
// ---------------------------------------------------------------------------

const setMenu = (open) => {
  menuPanel.dataset.state = open ? "open" : "closed";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};

const toggleFaq = (button) => {
  const item = button.closest(".faq-item");
  const open = !item.classList.contains("is-open");
  item.classList.toggle("is-open", open);
  button.setAttribute("aria-expanded", String(open));
};

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

const loadProfiles = async () => {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const loaded = normalizeLoadedProfiles(extractProfilesFromPayload(await response.json()));
    if (!loaded.length) throw new Error("No public profiles found in data/tutors.json");
    profiles = loaded;
    dataLoadFailed = false;
  } catch (error) {
    profiles = [];
    dataLoadFailed = true;
  }
};

// Regions only power the Where filters; without them the catalog still works.
const loadRegions = async () => {
  try {
    const response = await fetch(REGIONS_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    regions = {
      countries: Array.isArray(data.countries) ? data.countries : [],
      curricula: Array.isArray(data.curricula) ? data.curricula : [],
    };
  } catch (error) {
    regions = { countries: [], curricula: [] };
  }
};

const initializeApp = async () => {
  await Promise.all([loadProfiles(), loadRegions()]);
  renderFacts();
  fillMatchTopics();
  renderLocationFilters();
  fillApplicationCountries();
  renderChipFilters();
  renderCards();
  renderCountries();
  fillContactSpecialists();
  populateReviewProfileOptions();
};

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

needGroup.addEventListener("click", (event) => {
  const button = event.target.closest("[data-need]");
  if (button) setNeed(button);
});

needGroup.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault();
  const buttons = [...needGroup.querySelectorAll("[data-need]")];
  const current = buttons.findIndex((button) => button.getAttribute("aria-checked") === "true");
  const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
  const next = buttons[(current + step + buttons.length) % buttons.length];
  setNeed(next);
  next.focus();
});

$("#matchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  filter = { ...filter, where: matchWhere.value, city: findRegion(matchWhere.value) ? matchCity.value : "" };
  syncFilterControls();
  const topic = matchTopic.value;
  if (topic) setFilter(allCountries().includes(topic) ? "country" : "subject", topic);
  else setFilter(need === "both" ? "all" : need);
  scrollToSection("#catalog");
});

chipGroup.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (chip) setFilter(chip.dataset.type, chip.dataset.value);
});

cardGrid.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open]");
  const saveButton = event.target.closest("[data-save]");
  if (openButton) openDrawer(openButton.dataset.open);
  if (saveButton) toggleShortlist(saveButton.dataset.save);
});

$("#showAll").addEventListener("click", resetFilters);

matchWhere.addEventListener("change", () => fillCitySelect(matchCity, matchCityField, matchWhere.value));
whereFilter.addEventListener("change", () => setWhere(whereFilter.value));
cityFilter.addEventListener("change", () => setWhere(filter.where, cityFilter.value));
curriculumFilter.addEventListener("change", () => setCurriculum(curriculumFilter.value));
applicationCountry.addEventListener("change", updateApplicationLocation);
applicationCity.addEventListener("change", updateApplicationPlace);

$("#countryGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-country]");
  if (!button) return;
  setFilter("country", button.dataset.country);
  scrollToSection("#catalog");
});

shortlistButton.addEventListener("click", () => {
  if (shortlist.size) setFilter("saved");
  scrollToSection("#catalog");
});

drawerRoot.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-drawer]")) {
    closeDrawer();
    return;
  }
  const saveButton = event.target.closest("[data-save]");
  const requestButton = event.target.closest("[data-request]");
  const rateButton = event.target.closest("[data-rate]");
  if (saveButton) toggleShortlist(saveButton.dataset.save);
  if (requestButton) requestIntroduction(requestButton.dataset.request);
  if (rateButton) {
    closeDrawer({ restoreFocus: false });
    openReviewForm(rateButton.dataset.rate);
  }
});

$("#faqList").addEventListener("click", (event) => {
  const button = event.target.closest(".faq-q");
  if (button) toggleFaq(button);
});

menuButton.addEventListener("click", () => setMenu(menuPanel.dataset.state !== "open"));
menuPanel.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("click", (event) => {
  if (menuPanel.dataset.state === "open" && !event.target.closest("#menuPanel, #menuButton")) setMenu(false);
});

contactForm.addEventListener("submit", handleContactSubmit);
$("#contactEmail").addEventListener("input", () => {
  $("#contactEmailError").hidden = true;
  $("#contactEmail").removeAttribute("aria-invalid");
});

document.querySelectorAll("[data-open-application]").forEach((button) => {
  button.addEventListener("click", openApplicationForm);
});

if (reviewForm) reviewForm.addEventListener("submit", handleReviewSubmit);

if (applicationForm) {
  applicationForm.addEventListener("submit", handleApplicationSubmit);
  applicationForm.querySelectorAll("#applicationSubjects, #applicationCountries").forEach((field) => {
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

if (formBackdrop) formBackdrop.addEventListener("click", closeFormModal);
document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeFormModal);
});

// Fall back to initials if an approved photo fails to load.
document.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.closest(".profile-avatar")) return;
    const avatar = image.closest(".profile-avatar");
    avatar.classList.add("is-image-broken");
    avatar.setAttribute("role", "img");
    avatar.setAttribute("aria-label", `${avatar.dataset.avatarName || "TutorCat specialist"} initials avatar`);
    image.removeAttribute("src");
  },
  true
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (activeFormModal && !activeFormModal.hidden) closeFormModal();
    else if (!drawerRoot.hidden) closeDrawer();
    else if (menuPanel.dataset.state === "open") {
      setMenu(false);
      menuButton.focus();
    }
    return;
  }

  if (event.key !== "Tab") return;
  const openDialog = getOpenDialog();
  if (!openDialog) return;
  const focusable = getFocusableElements(openDialog);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

initializeApp();
