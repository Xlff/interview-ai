import Link from "next/link";
import HistoryList from "../components/history-list";
import type { HistoryEntry } from "../models/history-entry";

type HistoryPageProps = {
  isAuthenticated: boolean;
  entries: HistoryEntry[];
};

export default function HistoryPage({ isAuthenticated, entries }: HistoryPageProps) {
  return (
    <main className="grid min-h-screen px-6 py-12">
      <section className="mx-auto grid w-full max-w-[1040px] gap-5">
        <header className="grid gap-3 rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-8 shadow-[0_24px_70px_rgba(24,19,17,0.08)]">
          <p className="text-[0.8rem] uppercase tracking-[0.2em] text-[var(--accent)]">
            History
          </p>
          <h1 className="text-[clamp(2rem,4vw,3.4rem)] leading-none font-semibold">
            你的练习记录
          </h1>
          <p className="leading-[1.8] text-[var(--muted)]">
            保存每次文字面试的进度、复盘和针对短板的强化练习。
          </p>
        </header>

        {isAuthenticated ? (
          <HistoryList entries={entries} />
        ) : (
          <section className="grid gap-4 rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-8">
            <h2 className="text-2xl font-semibold">登录后查看你的练习记录</h2>
            <p className="leading-[1.8] text-[var(--muted)]">
              匿名状态下你仍然可以生成准备包和进行文字面试，但历史记录只会对已登录用户持续保存。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-5 font-bold text-[var(--accent-foreground)]"
              >
                去登录
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border)] px-5 font-bold"
              >
                返回首页
              </Link>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
