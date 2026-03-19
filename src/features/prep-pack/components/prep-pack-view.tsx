import Link from "next/link";
import { getListItemKey } from "@/lib/list-item-key";
import type { SavedPrepPack } from "../models/prep-pack";
import StartInterviewButton from "./start-interview-button";

type PrepPackViewProps = {
  prepPack: SavedPrepPack;
};

export default function PrepPackView({ prepPack }: PrepPackViewProps) {
  return (
    <main className="grid min-h-screen px-6 py-12">
      <section className="mx-auto grid w-full max-w-[1040px] gap-5">
        <header className="grid gap-3 rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-8 shadow-[0_24px_70px_rgba(24,19,17,0.08)]">
          <p className="text-[0.8rem] uppercase tracking-[0.2em] text-[var(--accent)]">
            Prep Pack
          </p>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-none font-semibold">
            {prepPack.level} {prepPack.normalizedTitle} 岗位准备包
          </h1>
          <p className="max-w-[52rem] text-[1.02rem] leading-[1.8] text-[var(--muted)]">
            {prepPack.roleSummary}
          </p>
          <div className="flex flex-wrap gap-3">
            <StartInterviewButton jobTargetId={prepPack.jobTargetId} />
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-[var(--border)] px-5 leading-none font-bold"
            >
              重新解析 JD
            </Link>
          </div>
        </header>

        <section className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          <article className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-6">
            <h2 className="text-xl font-semibold">考察维度</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
              {prepPack.roleProfile.dimensions.map(function renderItem(item, index) {
                return <li key={getListItemKey(item, index)}>{item}</li>;
              })}
            </ul>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-6">
            <h2 className="text-xl font-semibold">关键技能</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
              {prepPack.keySkills.map(function renderItem(item, index) {
                return <li key={getListItemKey(item, index)}>{item}</li>;
              })}
            </ul>
          </article>
        </section>

        <section className="grid gap-[18px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <article className="rounded-3xl border border-[var(--border)] bg-[rgba(239,226,207,0.5)] p-6">
            <h2 className="text-xl font-semibold">高频问题</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-[22px] leading-[1.8]">
              {prepPack.highFreqQuestions.map(function renderQuestion(question, index) {
                return <li key={getListItemKey(question, index)}>{question}</li>;
              })}
            </ol>
          </article>
          <article className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-6">
            <h2 className="text-xl font-semibold">评分关注点</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
              {prepPack.evaluationPoints.map(function renderPoint(point, index) {
                return <li key={getListItemKey(point, index)}>{point}</li>;
              })}
            </ul>
          </article>
        </section>

        <article className="rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-6">
          <h2 className="text-xl font-semibold">复习提纲</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 leading-[1.8]">
            {prepPack.studyOutline.map(function renderOutline(item, index) {
              return <li key={getListItemKey(item, index)}>{item}</li>;
            })}
          </ul>
        </article>
      </section>
    </main>
  );
}
