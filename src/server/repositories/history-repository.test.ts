import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, findMany } = vi.hoisted(function createMocks() {
  return {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  };
});

vi.mock("@/lib/db", function () {
  return {
    db: {
      user: {
        findUnique,
      },
      interviewSession: {
        findMany,
      },
    },
  };
});

import { listHistoryEntriesForUserEmail } from "./history-repository";

describe("listHistoryEntriesForUserEmail", function () {
  beforeEach(function resetMocks() {
    findUnique.mockReset();
    findMany.mockReset();
  });

  it("returns only the current user's saved sessions", async function () {
    findUnique.mockResolvedValue({
      id: "user-1",
      email: "tester@example.com",
    });
    findMany.mockResolvedValue([
      {
        id: "session-1",
        status: "completed",
        mode: "text",
        createdAt: new Date("2026-03-19T03:00:00.000Z"),
        currentRound: 6,
        totalRounds: 6,
        focusDimensions: ["工程质量"],
        jobTarget: {
          normalizedTitle: "前端开发工程师",
        },
        reviewReport: {
          id: "review-1",
        },
      },
    ]);

    const history = await listHistoryEntriesForUserEmail("tester@example.com");

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        email: "tester@example.com",
      },
    });
    expect(findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
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
    expect(history).toEqual([
      {
        id: "session-1",
        normalizedTitle: "前端开发工程师",
        status: "completed",
        mode: "text",
        createdAt: "2026-03-19T03:00:00.000Z",
        currentRound: 6,
        totalRounds: 6,
        reviewReportId: "review-1",
        focusLabel: "工程质量",
      },
    ]);
  });

  it("returns an empty list when the email has no local user", async function () {
    findUnique.mockResolvedValue(null);

    const history = await listHistoryEntriesForUserEmail("missing@example.com");

    expect(findMany).not.toHaveBeenCalled();
    expect(history).toEqual([]);
  });
});
