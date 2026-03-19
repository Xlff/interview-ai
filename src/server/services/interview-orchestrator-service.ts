import type {
  InterviewSessionDraft,
  InterviewSessionRecord,
} from "@/features/interview/models/interview-session";
import type { InterviewTurnDraft, SavedInterviewTurn } from "@/features/interview/models/interview-turn";
import type { SavedPrepPack } from "@/features/prep-pack/models/prep-pack";
import type { LLMProvider } from "./llm-provider";
import { enhanceInterviewEvaluation, evaluateInterviewAnswer } from "./answer-evaluator-service";

const defaultTotalRounds = 6;

type PlanNextInterviewTurnInput = {
  prepPack: SavedPrepPack;
  session: InterviewSessionRecord;
  turns: SavedInterviewTurn[];
  currentTurn: SavedInterviewTurn;
  userAnswer: string;
};

export function buildInterviewSessionDraft(prepPack: SavedPrepPack): InterviewSessionDraft {
  const sequence = buildQuestionSequence(prepPack);

  return {
    jobTargetId: prepPack.jobTargetId,
    status: "active",
    mode: "text",
    totalRounds: defaultTotalRounds,
    currentRound: 1,
    currentTurn: sequence[0],
  };
}

export function planNextInterviewTurn(input: PlanNextInterviewTurnInput) {
  const evaluation = evaluateInterviewAnswer({
    prepPack: input.prepPack,
    currentTurn: input.currentTurn,
    userAnswer: input.userAnswer,
  });

  return buildPlannedInterviewOutcome(input, evaluation);
}

type PlanNextInterviewTurnWithLLMInput = PlanNextInterviewTurnInput & {
  llmProvider: LLMProvider;
};

export async function planNextInterviewTurnWithLLM(input: PlanNextInterviewTurnWithLLMInput) {
  const baseEvaluation = evaluateInterviewAnswer({
    prepPack: input.prepPack,
    currentTurn: input.currentTurn,
    userAnswer: input.userAnswer,
  });
  const evaluation = await enhanceInterviewEvaluation({
    prepPack: input.prepPack,
    currentTurn: input.currentTurn,
    userAnswer: input.userAnswer,
    evaluation: baseEvaluation,
    llmProvider: input.llmProvider,
  });

  return buildPlannedInterviewOutcome(input, evaluation);
}

function buildPlannedInterviewOutcome(
  input: PlanNextInterviewTurnInput,
  evaluation: ReturnType<typeof evaluateInterviewAnswer>,
) {
  const nextTurnIndex = input.currentTurn.turnIndex + 1;

  if (nextTurnIndex > input.session.totalRounds) {
    return {
      evaluation,
      nextTurn: null,
      nextStatus: "completed" as const,
      nextRound: input.session.totalRounds,
    };
  }

  if (evaluation.verdict === "weak" && input.currentTurn.questionType === "primary") {
    return {
      evaluation,
      nextTurn: {
        question: evaluation.followUpHint ?? "请再展开补充一下刚才的回答。",
        questionType: "follow_up" as const,
        dimension: input.currentTurn.dimension,
        turnIndex: nextTurnIndex,
      },
      nextStatus: "active" as const,
      nextRound: nextTurnIndex,
    };
  }

  const primaryQuestionsAnswered = countAnsweredPrimaryTurns(input.turns, input.currentTurn.questionType);
  const sequence = buildQuestionSequence(input.prepPack);
  const nextPrimaryTurn = sequence[Math.min(primaryQuestionsAnswered, sequence.length - 1)];

  return {
    evaluation,
    nextTurn: {
      ...nextPrimaryTurn,
      turnIndex: nextTurnIndex,
    },
    nextStatus: "active" as const,
    nextRound: nextTurnIndex,
  };
}

function buildQuestionSequence(prepPack: SavedPrepPack): InterviewTurnDraft[] {
  const dimensions = prepPack.roleProfile.dimensions;
  const primaryQuestions = Array.from({ length: defaultTotalRounds }, function buildTurn(_, index) {
    const question = prepPack.highFreqQuestions[index] ?? buildFallbackQuestion(prepPack, index);
    const dimension = dimensions[index % dimensions.length] ?? "综合能力";

    return {
      question,
      questionType: "primary" as const,
      dimension,
      turnIndex: index + 1,
    };
  });

  return primaryQuestions;
}

function buildFallbackQuestion(prepPack: SavedPrepPack, index: number) {
  const theme = prepPack.roleProfile.questionThemes[index % prepPack.roleProfile.questionThemes.length];

  return `围绕${theme}，请结合你的实际经历讲一个最能体现你能力的案例。`;
}

function countAnsweredPrimaryTurns(turns: SavedInterviewTurn[], currentQuestionType: SavedInterviewTurn["questionType"]) {
  const answeredPrimaryTurns = turns.filter(function includeTurn(turn) {
    return turn.questionType === "primary";
  }).length;

  return currentQuestionType === "primary" ? answeredPrimaryTurns : answeredPrimaryTurns;
}
