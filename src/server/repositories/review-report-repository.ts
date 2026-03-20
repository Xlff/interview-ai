import type { SavedReviewReport } from "@/features/review/models/review-report";
import { db } from "@/lib/db";
import { getOrCreatePrepPack } from "@/server/repositories/prep-pack-repository";
import { createLLMProvider, type LLMRequestOptions } from "@/server/services/llm-provider";
import { buildReviewReport, enhanceReviewReportDraft } from "@/server/services/review-report-service";

export async function getOrCreateReviewReport(
  sessionId: string,
  llmOptions?: LLMRequestOptions,
): Promise<SavedReviewReport | null> {
  const existing = await db.reviewReport.findUnique({
    where: { sessionId },
    include: {
      session: {
        include: {
          jobTarget: true,
        },
      },
    },
  });

  if (existing) {
    return {
      id: existing.id,
      sessionId,
      jobTargetId: existing.session.jobTargetId,
      normalizedTitle: existing.session.jobTarget.normalizedTitle,
      strengths: existing.strengths as string[],
      gaps: existing.gaps as string[],
      missedPoints: existing.missedPoints as string[],
      communicationNotes: existing.communicationNotes as string[],
      nextStudyPlan: existing.nextStudyPlan as string[],
    };
  }

  const session = await db.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      jobTarget: true,
      turns: {
        orderBy: { turnIndex: "asc" },
      },
    },
  });

  if (!session || session.status !== "completed") {
    return null;
  }

  const prepPack = await getOrCreatePrepPack(session.jobTargetId, llmOptions);

  if (!prepPack) {
    return null;
  }

  const baseDraft = buildReviewReport({
    normalizedTitle: session.jobTarget.normalizedTitle,
    turns: session.turns.map(function mapTurn(turn) {
      return {
        id: turn.id,
        sessionId: turn.sessionId,
        question: turn.question,
        questionType: turn.questionType as "primary" | "follow_up",
        dimension: turn.dimension,
        turnIndex: turn.turnIndex,
        userAnswer: turn.userAnswer ?? undefined,
        evaluation: turn.evaluation as {
          verdict: "strong" | "mixed" | "weak";
          summary: string;
          coveredPoints: string[];
          missingPoints: string[];
        } | undefined,
        followUpHint: turn.followUpHint,
      };
    }),
    studyOutline: prepPack.studyOutline,
  });
  const llmProvider = createLLMProvider(llmOptions);
  const draft = await enhanceReviewReportDraft({
    normalizedTitle: session.jobTarget.normalizedTitle,
    turns: session.turns.map(function mapTurn(turn) {
      return {
        id: turn.id,
        sessionId: turn.sessionId,
        question: turn.question,
        questionType: turn.questionType as "primary" | "follow_up",
        dimension: turn.dimension,
        turnIndex: turn.turnIndex,
        userAnswer: turn.userAnswer ?? undefined,
        evaluation: turn.evaluation as {
          verdict: "strong" | "mixed" | "weak";
          summary: string;
          coveredPoints: string[];
          missingPoints: string[];
        } | undefined,
        followUpHint: turn.followUpHint,
      };
    }),
    report: baseDraft,
    llmProvider,
  });

  const record = await db.reviewReport.create({
    data: {
      sessionId,
      strengths: draft.strengths,
      gaps: draft.gaps,
      missedPoints: draft.missedPoints,
      communicationNotes: draft.communicationNotes,
      nextStudyPlan: draft.nextStudyPlan,
    },
  });

  return {
    id: record.id,
    sessionId,
    jobTargetId: session.jobTargetId,
    normalizedTitle: session.jobTarget.normalizedTitle,
    strengths: draft.strengths,
    gaps: draft.gaps,
    missedPoints: draft.missedPoints,
    communicationNotes: draft.communicationNotes,
    nextStudyPlan: draft.nextStudyPlan,
  };
}
