import { describe, expect, it } from "vitest";
import { groupHistoryEntries, type HistoryEntry } from "./history-entry";

describe("groupHistoryEntries", function () {
  it("groups focused, active, and completed entries separately", function () {
    const entries: HistoryEntry[] = [
      {
        id: "focused-1",
        normalizedTitle: "前端开发工程师",
        status: "completed",
        mode: "text",
        createdAt: "2026-03-20T00:00:00.000Z",
        currentRound: 6,
        totalRounds: 6,
        reviewReportId: "review-1",
        focusLabel: "工程质量",
      },
      {
        id: "active-1",
        normalizedTitle: "产品经理",
        status: "active",
        mode: "text",
        createdAt: "2026-03-20T00:10:00.000Z",
        currentRound: 2,
        totalRounds: 6,
        reviewReportId: null,
        focusLabel: null,
      },
      {
        id: "done-1",
        normalizedTitle: "增长运营",
        status: "completed",
        mode: "text",
        createdAt: "2026-03-20T00:20:00.000Z",
        currentRound: 6,
        totalRounds: 6,
        reviewReportId: "review-2",
        focusLabel: null,
      },
    ];

    const groups = groupHistoryEntries(entries);

    expect(groups.focused.map((entry) => entry.id)).toEqual(["focused-1"]);
    expect(groups.active.map((entry) => entry.id)).toEqual(["active-1"]);
    expect(groups.completed.map((entry) => entry.id)).toEqual(["done-1"]);
  });
});
