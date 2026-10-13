import { RatingSummary, profiles } from "tutorcat";

// Ratings come only from verified, approved reviews. Current tutors have none yet (first cell).
// The second cell uses sample reviews to show the filled state; never invent ratings in real designs.
const verified = { verifiedByTutor: true, approvedByAdmin: true, publicPermission: true, status: "approved", comment: "", date: "2026-09-01", sessionType: "Tutoring", reviewerType: "Parent" };
const withReviews = { ...profiles[0], reviews: [5, 5, 4].map((rating) => ({ ...verified, rating })) };

export const NoReviewsYet = () => <RatingSummary profile={profiles[0]} />;

export const WithVerifiedReviews = () => <RatingSummary profile={withReviews} />;
