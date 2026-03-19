import Link from "next/link";
import { getListItemKey } from "@/lib/list-item-key";
import type { SavedReviewReport } from "../models/review-report";

type ReviewReportViewProps = {
  report: SavedReviewReport;
  providerId?: string;
  model?: string;
};

export default function ReviewReportView({ report, providerId, model }: ReviewReportViewProps) {
  const search = new URLSearchParams();

  if (providerId) {
    search.set("provider", providerId);
  }

  if (model) {
    search.set("model", model);
  }

  const searchSuffix = search.size > 0 ? `?${search.toString()}` : "";

  return (
    <main className="grid min-h-screen px-6 py-12">
      <section className="mx-auto grid w-full max-w-[1040px] gap-5">
        <header className="grid gap-3 rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-8 shadow-[0_24px_70px_rgba(24,19,17,0.08)]">
          <p className="text-[0.8rem] uppercase tracking-[0.2em] text-[var(--accent)]">
            Review Report
          </p>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-none font-semibold">
            {report.normalizedTitle} 面试复盘
          </h1>
          <p className="leading-[1.8] text-[var(--muted)]">
            把刚刚这轮文字面试沉淀成优势、短板和下一步复习动作。
          </p>
        </header>

        <section className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <article className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-6">
            <h2 className="text-xl font-semibold">优势表现</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
              {report.strengths.map(function renderStrength(item, index) {
                return <li key={getListItemKey(item, index)}>{item}</li>;
              })}
            </ul>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-[rgba(239,226,207,0.5)] p-6">
            <h2 className="text-xl font-semibold">待补短板</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
              {report.gaps.map(function renderGap(item, index) {
                return <li key={getListItemKey(item, index)}>{item}</li>;
              })}
            </ul>
          </article>
        </section>

        <section className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <article className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-6">
            <h2 className="text-xl font-semibold">遗漏点</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
              {report.missedPoints.map(function renderMissedPoint(item, index) {
                return <li key={getListItemKey(item, index)}>{item}</li>;
              })}
            </ul>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-6">
            <h2 className="text-xl font-semibold">表达建议</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
              {report.communicationNotes.map(function renderCommunicationNote(item, index) {
                return <li key={getListItemKey(item, index)}>{item}</li>;
              })}
            </ul>
          </article>
        </section>

        <article className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-6">
          <h2 className="text-xl font-semibold">下一步复习计划</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
            {report.nextStudyPlan.map(function renderPlan(item, index) {
              return <li key={getListItemKey(item, index)}>{item}</li>;
            })}
          </ul>
        </article>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/prep/${report.jobTargetId}${searchSuffix}`}
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-[var(--accent)] px-5 leading-none font-bold text-[var(--accent-foreground)]"
          >
            回到准备包，开始下一轮
          </Link>
        </div>
      </section>
    </main>
  );
}
