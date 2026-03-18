export type InterviewQuestionType = "primary" | "follow_up";

export type InterviewTurnEvaluation = {
  verdict: "strong" | "mixed" | "weak";
  summary: string;
  coveredPoints: string[];
  missingPoints: string[];
};

export type InterviewTurnDraft = {
  question: string;
  questionType: InterviewQuestionType;
  dimension: string;
  turnIndex: number;
};

export type SavedInterviewTurn = InterviewTurnDraft & {
  id: string;
  sessionId: string;
  userAnswer?: string;
  evaluation?: InterviewTurnEvaluation;
  followUpHint?: string | null;
};
