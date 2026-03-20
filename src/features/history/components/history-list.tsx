import Link from "next/link";
import {
  groupHistoryEntries,
  type HistoryEntry,
} from "../models/history-entry";

type HistoryListProps = {
  entries: HistoryEntry[];
};

export default function HistoryList({ entries }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <section className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-6">
        <h2 className="text-xl font-semibold">还没有已保存的练习记录</h2>
        <p className="mt-3 leading-[1.8] text-[var(--muted)]">
          先从一个 JD 生成准备包并开始文字面试。登录后创建的新面试会自动保存在这里。
        </p>
      </section>
    );
  }

  const groups = groupHistoryEntries(entries);

  return (
    <section className="grid gap-4">
      <HistoryGroup
        title="短板强化"
        description="优先回到围绕弱项的强化练习。"
        entries={groups.focused}
      />
      <HistoryGroup
        title="进行中"
        description="继续完成上次还没结束的文字面试。"
        entries={groups.active}
      />
      <HistoryGroup
        title="已完成"
        description="回看复盘报告，继续总结和补强。"
        entries={groups.completed}
      />
    </section>
  );
}

type HistoryGroupProps = {
  title: string;
  description: string;
  entries: HistoryEntry[];
};

function HistoryGroup({ title, description, entries }: HistoryGroupProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.72)] p-5">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-[1.7] text-[var(--muted)]">
          {description}
        </p>
      </div>
      <div className="grid gap-4">
        {entries.map(function renderEntry(entry) {
          return (
            <article
              key={entry.id}
              className="grid gap-3 rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold">{entry.normalizedTitle}</h3>
                <span className="rounded-full bg-[rgba(239,226,207,0.6)] px-3 py-1 text-sm font-semibold">
                  {entry.status === "completed" ? "已完成" : "进行中"}
                </span>
                {entry.focusLabel ? (
                  <span className="rounded-full bg-[rgba(205,119,73,0.12)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                    聚焦：{entry.focusLabel}
                  </span>
                ) : null}
              </div>
              <p className="text-sm leading-[1.7] text-[var(--muted)]">
                创建时间：{new Date(entry.createdAt).toLocaleString("zh-CN")}
              </p>
              <p className="text-sm leading-[1.7] text-[var(--muted)]">
                进度：第 {Math.min(entry.currentRound, entry.totalRounds)} / {entry.totalRounds} 轮
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/interview/${entry.id}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--border)] px-4 font-semibold"
                >
                  {entry.status === "completed" ? "重新查看面试" : "继续作答"}
                </Link>
                {entry.reviewReportId ? (
                  <Link
                    href={`/review/${entry.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-4 font-semibold text-[var(--accent-foreground)]"
                  >
                    查看复盘
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
