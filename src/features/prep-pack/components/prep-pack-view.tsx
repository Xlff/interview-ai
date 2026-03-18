import Link from "next/link";
import type { SavedPrepPack } from "../models/prep-pack";
import StartInterviewButton from "./start-interview-button";

type PrepPackViewProps = {
  prepPack: SavedPrepPack;
};

export default function PrepPackView({ prepPack }: PrepPackViewProps) {
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
            Prep Pack
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1,
            }}
          >
            {prepPack.level} {prepPack.normalizedTitle} 岗位准备包
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "52rem",
              color: "var(--muted)",
              lineHeight: 1.8,
              fontSize: "1.02rem",
            }}
          >
            {prepPack.roleSummary}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <StartInterviewButton jobTargetId={prepPack.jobTargetId} />
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "48px",
                padding: "0 20px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                fontWeight: 700,
              }}
            >
              重新解析 JD
            </Link>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gap: "18px",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
            <h2 style={{ marginTop: 0 }}>考察维度</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
              {prepPack.roleProfile.dimensions.map(function renderItem(item) {
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
            <h2 style={{ marginTop: 0 }}>关键技能</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
              {prepPack.keySkills.map(function renderItem(item) {
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
              background: "rgba(239, 226, 207, 0.5)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>高频问题</h2>
            <ol style={{ margin: "12px 0 0", paddingLeft: "22px", lineHeight: 1.8 }}>
              {prepPack.highFreqQuestions.map(function renderQuestion(question) {
                return <li key={question}>{question}</li>;
              })}
            </ol>
          </article>
          <article
            style={{
              border: "1px solid var(--border)",
              borderRadius: "24px",
              padding: "24px",
              background: "rgba(255, 253, 248, 0.88)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>评分关注点</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
              {prepPack.evaluationPoints.map(function renderPoint(point) {
                return <li key={point}>{point}</li>;
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
          <h2 style={{ marginTop: 0 }}>复习提纲</h2>
          <ul style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 1.8 }}>
            {prepPack.studyOutline.map(function renderOutline(item) {
              return <li key={item}>{item}</li>;
            })}
          </ul>
        </article>
      </section>
    </main>
  );
}
