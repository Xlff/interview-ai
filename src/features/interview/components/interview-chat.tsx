"use client";

import Link from "next/link";
import type { InterviewSessionSnapshot } from "../models/interview-session";
import { useInterviewSession } from "../view-models/use-interview-session";

type InterviewChatProps = {
  initialSession: InterviewSessionSnapshot;
  providerId?: string;
  model?: string;
};

export default function InterviewChat({ initialSession, providerId, model }: InterviewChatProps) {
  const { session, answer, isSubmitting, submitError, setAnswer, submitAnswer } =
    useInterviewSession(initialSession, { providerId, model });
  const search = new URLSearchParams();

  if (providerId) {
    search.set("provider", providerId);
  }

  if (model) {
    search.set("model", model);
  }

  const searchSuffix = search.size > 0 ? `?${search.toString()}` : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitAnswer();
  }

  return (
    <main className="grid min-h-screen px-6 py-12">
      <section className="mx-auto grid w-full max-w-[1040px] gap-5">
        <header className="grid gap-3 rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-8 shadow-[0_24px_70px_rgba(24,19,17,0.08)]">
          <p className="text-[0.8rem] uppercase tracking-[0.2em] text-[var(--accent)]">
            Interview Session
          </p>
          <h1 className="text-[clamp(2rem,4vw,3.4rem)] leading-none font-semibold">
            {session.normalizedTitle} 文字面试
          </h1>
          <p className="leading-[1.8] text-[var(--muted)]">
            第 {Math.min(session.currentRound, session.totalRounds)} / {session.totalRounds} 轮
          </p>
          {session.currentTurn ? (
            <p className="font-bold text-[var(--accent)]">
              当前考察维度：{session.currentTurn.dimension}
            </p>
          ) : null}
        </header>

        <section className="grid gap-4">
          {session.turns.map(function renderTurn(turn) {
            return (
              <article key={turn.id} className="grid gap-3">
                <div className="rounded-3xl border border-[var(--border)] bg-[rgba(239,226,207,0.42)] px-6 py-5">
                  <p className="text-[0.82rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                    面试官
                  </p>
                  <p className="mt-2 leading-[1.8]">{turn.question}</p>
                </div>

                {turn.userAnswer ? (
                  <div className="justify-self-end w-full max-w-[760px] rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.92)] px-6 py-5">
                    <p className="text-[0.82rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                      你的回答
                    </p>
                    <p className="mt-2 leading-[1.8]">{turn.userAnswer}</p>
                    {turn.evaluation ? (
                      <p className="mt-3 font-bold text-[var(--accent)]">
                        面试官观察：{turn.evaluation.summary}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        {session.currentTurn ? (
          <form
            onSubmit={handleSubmit}
            className="grid gap-[14px] rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-6"
          >
            <label className="grid gap-2">
              <span className="font-bold">你的回答</span>
              <textarea
                aria-label="你的回答"
                value={answer}
                onChange={function handleChange(event) {
                  setAnswer(event.target.value);
                }}
                placeholder="用 STAR 或问题-行动-结果的结构来回答，会更容易拿到高分。"
                className="min-h-[180px] resize-y rounded-[18px] border border-[var(--border)] bg-white p-4 text-base leading-[1.7]"
              />
            </label>

            {submitError ? (
              <p className="font-semibold text-[#b83b20]">
                {submitError}
              </p>
            ) : null}

            <button
              disabled={isSubmitting}
              type="submit"
              className="inline-flex h-12 justify-self-start items-center justify-center whitespace-nowrap rounded-full border-0 bg-[var(--accent)] px-5 leading-none font-bold text-[var(--accent-foreground)] cursor-pointer disabled:cursor-progress disabled:opacity-70"
            >
              {isSubmitting ? "提交中..." : "提交回答，进入下一题"}
            </button>
          </form>
        ) : (
          <section className="grid gap-3 rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,248,0.9)] p-6">
            <h2 className="text-xl font-semibold">本轮文字面试已完成</h2>
            <p className="leading-[1.8] text-[var(--muted)]">
              复盘报告和下一轮弱项定向训练将在下一步开放。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/review/${session.id}${searchSuffix}`}
                className="inline-flex h-12 w-fit items-center justify-center whitespace-nowrap rounded-full bg-[var(--accent)] px-5 leading-none font-bold text-[var(--accent-foreground)]"
              >
                查看复盘报告
              </Link>
              <Link
                href={`/prep/${session.jobTargetId}${searchSuffix}`}
                className="inline-flex h-12 w-fit items-center justify-center whitespace-nowrap rounded-full border border-[var(--border)] px-5 leading-none font-bold"
              >
                返回岗位准备包
              </Link>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
