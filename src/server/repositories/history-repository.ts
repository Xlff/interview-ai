import type { HistoryEntry } from "@/features/history/models/history-entry";
import { db } from "@/lib/db";
import { findLocalUserByEmail } from "./auth-user-repository";

export async function listHistoryEntriesForUserEmail(email: string): Promise<HistoryEntry[]> {
  const user = await findLocalUserByEmail(email);

  if (!user) {
    return [];
  }

  const sessions = await db.interviewSession.findMany({
    where: {
      userId: user.id,
    },
    include: {
      jobTarget: true,
      reviewReport: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return sessions.map(function mapSession(session): HistoryEntry {
    const focusDimensions = Array.isArray(session.focusDimensions)
      ? (session.focusDimensions as string[])
      : [];

    return {
      id: session.id,
      normalizedTitle: session.jobTarget.normalizedTitle,
      status: session.status as HistoryEntry["status"],
      mode: session.mode as HistoryEntry["mode"],
      createdAt: session.createdAt.toISOString(),
      currentRound: session.currentRound,
      totalRounds: session.totalRounds,
      reviewReportId: session.reviewReport?.id ?? null,
      focusLabel: focusDimensions.length > 0 ? focusDimensions.join(" / ") : null,
    };
  });
}
