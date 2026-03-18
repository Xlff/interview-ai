export type ReviewReportDraft = {
  strengths: string[];
  gaps: string[];
  missedPoints: string[];
  communicationNotes: string[];
  nextStudyPlan: string[];
};

export type SavedReviewReport = ReviewReportDraft & {
  id: string;
  sessionId: string;
  jobTargetId: string;
  normalizedTitle: string;
};
