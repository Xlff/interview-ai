import type { SavedInterviewTurn } from "@/features/interview/models/interview-turn";
import type { ReviewReportDraft } from "@/features/review/models/review-report";
import type { LLMProvider } from "./llm-provider";

type BuildReviewReportInput = {
  normalizedTitle: string;
  turns: SavedInterviewTurn[];
  studyOutline: string[];
};

export function buildReviewReport(input: BuildReviewReportInput): ReviewReportDraft {
  const evaluatedTurns = input.turns.filter(function includeTurn(turn) {
    return turn.evaluation;
  });
  const strengths = evaluatedTurns
    .filter(function includeStrongTurn(turn) {
      return turn.evaluation?.verdict === "strong";
    })
    .map(function mapStrength(turn) {
      return `${turn.dimension}表达完整`;
    });
  const gaps = evaluatedTurns
    .filter(function includeWeakTurn(turn) {
      return turn.evaluation?.verdict === "weak";
    })
    .map(function mapGap(turn) {
      return `${turn.dimension}维度回答偏弱`;
    });
  const missedPoints = Array.from(
    new Set(
      evaluatedTurns.flatMap(function flattenMissingPoints(turn) {
        return turn.evaluation?.missingPoints ?? [];
      }),
    ),
  );
  const communicationNotes = buildCommunicationNotes(evaluatedTurns);
  const nextStudyPlan = buildNextStudyPlan(input.studyOutline, gaps, missedPoints);

  return {
    strengths: strengths.length > 0 ? strengths : ["整体回答结构清晰，具备继续强化的基础"],
    gaps: gaps.length > 0 ? gaps : ["当前短板不明显，建议继续通过真实案例提高稳定性"],
    missedPoints,
    communicationNotes,
    nextStudyPlan,
  };
}

type EnhanceReviewReportDraftInput = {
  normalizedTitle: string;
  turns: SavedInterviewTurn[];
  report: ReviewReportDraft;
  llmProvider: LLMProvider;
};

export async function enhanceReviewReportDraft(
  input: EnhanceReviewReportDraftInput,
): Promise<ReviewReportDraft> {
  const llmReport = await input.llmProvider.generateReviewReport({
    normalizedTitle: input.normalizedTitle,
    turns: input.turns
      .filter(function includeAnsweredTurn(turn) {
        return Boolean(turn.userAnswer);
      })
      .map(function mapTurn(turn) {
        return {
          question: turn.question,
          answer: turn.userAnswer ?? "",
          dimension: turn.dimension,
        };
      }),
  });

  return {
    strengths: normalizeArray(llmReport.strengths, input.report.strengths),
    gaps: normalizeArray(llmReport.gaps, input.report.gaps),
    missedPoints: input.report.missedPoints,
    communicationNotes: normalizeArray(llmReport.communicationNotes, input.report.communicationNotes),
    nextStudyPlan: normalizeArray(llmReport.nextStudyPlan, input.report.nextStudyPlan),
  };
}

function buildCommunicationNotes(turns: SavedInterviewTurn[]) {
  const averageLength =
    turns.reduce(function sumLength(total, turn) {
      return total + (turn.userAnswer?.trim().length ?? 0);
    }, 0) / Math.max(turns.length, 1);

  if (averageLength < 60) {
    return ["整体回答偏短，建议固定使用背景-动作-结果结构来组织表达。"];
  }

  return ["表达节奏稳定，下一步重点补充量化结果和关键决策依据。"];
}

function buildNextStudyPlan(studyOutline: string[], gaps: string[], missedPoints: string[]) {
  const plan = studyOutline.slice(0, 2).map(function mapOutline(item) {
    return `优先复习：${item}`;
  });

  if (gaps.some(function includeGap(gap) {
    return gap.includes("工程质量");
  }) && studyOutline.includes("性能优化专项复习")) {
    plan.unshift("优先复习：性能优化专项复习");
  }

  if (missedPoints.some(function includeMetric(point) {
    return point === "结果" || point === "量化指标";
  })) {
    plan.push("补充一段可量化的性能优化案例");
  }

  return Array.from(new Set(plan));
}

function normalizeArray(value: string[], fallback: string[]) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}
