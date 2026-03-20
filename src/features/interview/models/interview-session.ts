import type { SavedInterviewTurn, InterviewTurnDraft } from "./interview-turn";

export type InterviewSessionStatus = "active" | "completed";
export type InterviewSessionMode = "text";

export type InterviewSessionDraft = {
  jobTargetId: string;
  status: InterviewSessionStatus;
  mode: InterviewSessionMode;
  totalRounds: number;
  currentRound: number;
  focusDimensions?: string[];
  currentTurn: InterviewTurnDraft;
};

export type InterviewSessionRecord = {
  id: string;
  jobTargetId: string;
  status: InterviewSessionStatus;
  mode: InterviewSessionMode;
  totalRounds: number;
  currentRound: number;
  focusDimensions?: string[];
};

export type InterviewSessionSnapshot = InterviewSessionRecord & {
  normalizedTitle: string;
  turns: SavedInterviewTurn[];
  currentTurn: SavedInterviewTurn | null;
};
