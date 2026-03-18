import Link from "next/link";
import type { SavedReviewReport } from "../models/review-report";

type ReviewReportViewProps = {
  report: SavedReviewReport;
};

export default function ReviewReportView({ report }: ReviewReportViewProps) {
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
            Review Report
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1,
            }}
          >
            {report.normalizedTitle} 面试复盘
          </h1>
          <p
            style={{
              margin: 0,
              color: "var(--muted)",
              lineHeight: 1.8,
            }}
          >
            把刚刚这轮文字面试沉淀成优势、短板和下一步复习动作。
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gap: "18px",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <article
            style={{
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "24px",
              background: "rgba(255, 253, 248, 0.88)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>优势表现</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
              {report.strengths.map(function renderStrength(item) {
                return <li key={item}>{item}</li>;
              })}
            </ul>
          </article>
          <article
            style={{
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "24px",
              background: "rgba(239, 226, 207, 0.5)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>待补短板</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
              {report.gaps.map(function renderGap(item) {
                return <li key={item}>{item}</li>;
              })}
            </ul>
          </article>
        </section>

        <section
          style={{
            display: "grid",
            gap: "18px",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <article
            style={{
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "24px",
              background: "rgba(255, 253, 248, 0.88)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>遗漏点</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
              {report.missedPoints.map(function renderMissedPoint(item) {
                return <li key={item}>{item}</li>;
              })}
            </ul>
          </article>
          <article
            style={{
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "24px",
              background: "rgba(255, 253, 248, 0.88)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>表达建议</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
              {report.communicationNotes.map(function renderCommunicationNote(item) {
                return <li key={item}>{item}</li>;
              })}
            </ul>
          </article>
        </section>

        <article
          style={{
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "24px",
            background: "rgba(255, 253, 248, 0.88)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>下一步复习计划</h2>
          <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
            {report.nextStudyPlan.map(function renderPlan(item) {
              return <li key={item}>{item}</li>;
            })}
          </ul>
        </article>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <Link
            href={`/prep/${report.jobTargetId}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "48px",
              padding: "0 20px",
              borderRadius: "999px",
              background: "var(--accent)",
              color: "var(--accent-foreground)",
              fontWeight: 700,
            }}
          >
            回到准备包，开始下一轮
          </Link>
        </div>
      </section>
    </main>
  );
}
