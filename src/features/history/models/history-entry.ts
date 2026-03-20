export type HistoryEntry = {
  id: string;
  normalizedTitle: string;
  status: "active" | "completed";
  mode: "text";
  createdAt: string;
  currentRound: number;
  totalRounds: number;
  reviewReportId: string | null;
  focusLabel: string | null;
};

export type GroupedHistoryEntries = {
  focused: HistoryEntry[];
  active: HistoryEntry[];
  completed: HistoryEntry[];
};

export function groupHistoryEntries(entries: HistoryEntry[]): GroupedHistoryEntries {
  return entries.reduce<GroupedHistoryEntries>(
    function group(groups, entry) {
      if (entry.focusLabel) {
        groups.focused.push(entry);
        return groups;
      }

      if (entry.status === "active") {
        groups.active.push(entry);
        return groups;
      }

      groups.completed.push(entry);
      return groups;
    },
    {
      focused: [],
      active: [],
      completed: [],
    },
  );
}
