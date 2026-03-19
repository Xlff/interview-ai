import type { InterviewSessionSnapshot } from "@/features/interview/models/interview-session";
import type { SavedInterviewTurn } from "@/features/interview/models/interview-turn";
import { db } from "@/lib/db";
import { getOrCreatePrepPack } from "@/server/repositories/prep-pack-repository";
import { createLLMProvider, type LLMRequestOptions } from "@/server/services/llm-provider";
import {
  buildInterviewSessionDraft,
  planNextInterviewTurnWithLLM,
} from "@/server/services/interview-orchestrator-service";

export async function createInterviewSession(
  jobTargetId: string,
  llmOptions?: LLMRequestOptions,
): Promise<InterviewSessionSnapshot | null> {
  const prepPack = await getOrCreatePrepPack(jobTargetId, llmOptions);

  if (!prepPack) {
    return null;
  }

  const draft = buildInterviewSessionDraft(prepPack);

  const record = await db.interviewSession.create({
    data: {
      jobTargetId,
      status: draft.status,
      mode: draft.mode,
      totalRounds: draft.totalRounds,
      currentRound: draft.currentRound,
      turns: {
        create: {
          question: draft.currentTurn.question,
          questionType: draft.currentTurn.questionType,
          dimension: draft.currentTurn.dimension,
          turnIndex: draft.currentTurn.turnIndex,
        },
      },
    },
    include: {
      jobTarget: true,
      turns: {
        orderBy: { turnIndex: "asc" },
      },
    },
  });

  return mapSessionSnapshot(record);
}

export async function getInterviewSessionById(
  sessionId: string,
): Promise<InterviewSessionSnapshot | null> {
  const record = await db.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      jobTarget: true,
      turns: {
        orderBy: { turnIndex: "asc" },
      },
    },
  });

  if (!record) {
    return null;
  }

  return mapSessionSnapshot(record);
}

export async function answerCurrentInterviewTurn(
  sessionId: string,
  userAnswer: string,
  llmOptions?: LLMRequestOptions,
): Promise<InterviewSessionSnapshot | null> {
  const existing = await db.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      turns: {
        orderBy: { turnIndex: "asc" },
      },
    },
  });

  if (!existing) {
    return null;
  }

  const currentTurn = existing.turns.find(function findTurn(turn) {
    return !turn.userAnswer;
  });

  if (!currentTurn) {
    return getInterviewSessionById(sessionId);
  }

  const prepPack = await getOrCreatePrepPack(existing.jobTargetId, llmOptions);

  if (!prepPack) {
    return null;
  }

  const llmProvider = createLLMProvider(llmOptions);
  const outcome = await planNextInterviewTurnWithLLM({
    prepPack,
    session: {
      id: existing.id,
      jobTargetId: existing.jobTargetId,
      status: existing.status as "active" | "completed",
      mode: existing.mode as "text",
      totalRounds: existing.totalRounds,
      currentRound: existing.currentRound,
    },
    turns: existing.turns.map(mapTurnRecord),
    currentTurn: mapTurnRecord(currentTurn),
    userAnswer,
    llmProvider,
  });

  await db.$transaction(async function runTransaction(transaction) {
    await transaction.interviewTurn.update({
      where: { id: currentTurn.id },
      data: {
        userAnswer: userAnswer.trim(),
        evaluation: outcome.evaluation,
        followUpHint:
          outcome.nextTurn?.questionType === "follow_up" ? outcome.nextTurn.question : null,
      },
    });

    if (outcome.nextTurn) {
      await transaction.interviewTurn.create({
        data: {
          sessionId,
          question: outcome.nextTurn.question,
          questionType: outcome.nextTurn.questionType,
          dimension: outcome.nextTurn.dimension,
          turnIndex: outcome.nextTurn.turnIndex,
        },
      });
    }

    await transaction.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: outcome.nextStatus,
        currentRound: outcome.nextRound,
        completedAt: outcome.nextStatus === "completed" ? new Date() : null,
      },
    });
  });

  return getInterviewSessionById(sessionId);
}

function mapSessionSnapshot(record: {
  id: string;
  jobTargetId: string;
  status: string;
  mode: string;
  totalRounds: number;
  currentRound: number;
  jobTarget: {
    normalizedTitle: string;
  };
  turns: Array<{
    id: string;
    sessionId: string;
    question: string;
    questionType: string;
    dimension: string;
    userAnswer: string | null;
    evaluation: unknown;
    followUpHint: string | null;
    turnIndex: number;
  }>;
}) {
  const turns = record.turns.map(mapTurnRecord);
  const currentTurn = turns.find(function findCurrentTurn(turn) {
    return !turn.userAnswer;
  }) ?? null;

  return {
    id: record.id,
    jobTargetId: record.jobTargetId,
    normalizedTitle: record.jobTarget.normalizedTitle,
    status: record.status as InterviewSessionSnapshot["status"],
    mode: record.mode as InterviewSessionSnapshot["mode"],
    totalRounds: record.totalRounds,
    currentRound: record.currentRound,
    turns,
    currentTurn,
  };
}

function mapTurnRecord(record: {
  id: string;
  sessionId: string;
  question: string;
  questionType: string;
  dimension: string;
  userAnswer?: string | null;
  evaluation?: unknown;
  followUpHint?: string | null;
  turnIndex: number;
}): SavedInterviewTurn {
  return {
    id: record.id,
    sessionId: record.sessionId,
    question: record.question,
    questionType: record.questionType as SavedInterviewTurn["questionType"],
    dimension: record.dimension,
    userAnswer: record.userAnswer ?? undefined,
    evaluation: record.evaluation as SavedInterviewTurn["evaluation"],
    followUpHint: record.followUpHint ?? null,
    turnIndex: record.turnIndex,
  };
}
