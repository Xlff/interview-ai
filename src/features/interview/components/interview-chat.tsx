"use client";

import Link from "next/link";
import type { InterviewSessionSnapshot } from "../models/interview-session";
import { useInterviewSession } from "../view-models/use-interview-session";

type InterviewChatProps = {
  initialSession: InterviewSessionSnapshot;
};

export default function InterviewChat({ initialSession }: InterviewChatProps) {
  const { session, answer, isSubmitting, submitError, setAnswer, submitAnswer } =
    useInterviewSession(initialSession);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitAnswer();
  }

  return (
    <main
      style={{
        display: "grid",
        minHeight: "100vh",
        padding: "48px 24px",
      }}
    >
      <section
        style={{
          margin: "0 auto",
          width: "min(1040px, 100%)",
          display: "grid",
          gap: "20px",
        }}
      >
        <header
          style={{
            display: "grid",
            gap: "12px",
            border: "1px solid var(--border)",
            borderRadius: "28px",
            padding: "32px",
            background: "rgba(255, 253, 248, 0.9)",
            boxShadow: "0 24px 70px rgba(24, 19, 17, 0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--accent)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Interview Session
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 4vw, 3.4rem)",
              lineHeight: 1,
            }}
          >
            {session.normalizedTitle} 文字面试
          </h1>
          <p
            style={{
              margin: 0,
              color: "var(--muted)",
              lineHeight: 1.8,
            }}
          >
            第 {Math.min(session.currentRound, session.totalRounds)} / {session.totalRounds} 轮
          </p>
          {session.currentTurn ? (
            <p
              style={{
                margin: 0,
                color: "var(--accent)",
                fontWeight: 700,
              }}
            >
              当前考察维度：{session.currentTurn.dimension}
            </p>
          ) : null}
        </header>

        <section
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {session.turns.map(function renderTurn(turn) {
            return (
              <article
                key={turn.id}
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "24px",
                    padding: "20px 24px",
                    background: "rgba(239, 226, 207, 0.42)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "var(--muted)",
                      fontSize: "0.82rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    面试官
                  </p>
                  <p style={{ margin: "8px 0 0", lineHeight: 1.8 }}>{turn.question}</p>
                </div>

                {turn.userAnswer ? (
                  <div
                    style={{
                      justifySelf: "end",
                      width: "min(760px, 100%)",
                      border: "1px solid var(--border)",
                      borderRadius: "24px",
                      padding: "20px 24px",
                      background: "rgba(255, 253, 248, 0.92)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "var(--muted)",
                        fontSize: "0.82rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      你的回答
                    </p>
                    <p style={{ margin: "8px 0 0", lineHeight: 1.8 }}>{turn.userAnswer}</p>
                    {turn.evaluation ? (
                      <p
                        style={{
                          margin: "12px 0 0",
                          color: "var(--accent)",
                          fontWeight: 700,
                        }}
                      >
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
            style={{
              display: "grid",
              gap: "14px",
              border: "1px solid var(--border)",
              borderRadius: "28px",
              padding: "24px",
              background: "rgba(255, 253, 248, 0.9)",
            }}
          >
            <label
              style={{
                display: "grid",
                gap: "8px",
              }}
            >
              <span style={{ fontWeight: 700 }}>你的回答</span>
              <textarea
                aria-label="你的回答"
                value={answer}
                onChange={function handleChange(event) {
                  setAnswer(event.target.value);
                }}
                placeholder="用 STAR 或问题-行动-结果的结构来回答，会更容易拿到高分。"
                style={{
                  minHeight: "180px",
                  resize: "vertical",
                  borderRadius: "18px",
                  border: "1px solid var(--border)",
                  padding: "16px",
                  background: "#fff",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                }}
              />
            </label>

            {submitError ? (
              <p
                style={{
                  margin: 0,
                  color: "#b83b20",
                  fontWeight: 600,
                }}
              >
                {submitError}
              </p>
            ) : null}

            <button
              disabled={isSubmitting}
              type="submit"
              style={{
                justifySelf: "start",
                minHeight: "48px",
                padding: "0 20px",
                borderRadius: "999px",
                border: "none",
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                fontWeight: 700,
                cursor: isSubmitting ? "progress" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "提交中..." : "提交回答，进入下一题"}
            </button>
          </form>
        ) : (
          <section
            style={{
              display: "grid",
              gap: "12px",
              border: "1px solid var(--border)",
              borderRadius: "28px",
              padding: "24px",
              background: "rgba(255, 253, 248, 0.9)",
            }}
          >
            <h2 style={{ margin: 0 }}>本轮文字面试已完成</h2>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>
              复盘报告和下一轮弱项定向训练将在下一步开放。
            </p>
            <Link
              href={`/prep/${session.jobTargetId}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "48px",
                padding: "0 20px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                fontWeight: 700,
                width: "fit-content",
              }}
            >
              返回岗位准备包
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
