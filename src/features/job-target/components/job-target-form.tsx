"use client";

import { useJobTargetForm } from "../view-models/use-job-target-form";

const domains = [
  { value: "technical", label: "技术岗位" },
  { value: "product", label: "产品岗位" },
  { value: "operations", label: "运营岗位" },
] as const;

export default function JobTargetForm() {
  const {
    state,
    errors,
    isSubmitting,
    savedJobTarget,
    submitError,
    setPreferredDomain,
    setRawJD,
    submit,
  } = useJobTargetForm();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit();
  }

  return (
    <section
      id="jd-input"
      style={{
        marginTop: "32px",
        border: "1px solid var(--border)",
        borderRadius: "24px",
        padding: "24px",
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.45rem",
          }}
        >
          粘贴 JD，生成岗位目标画像
        </h2>
        <p
          style={{
            margin: 0,
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          第一版支持产品、运营、技术岗。提交后会先做岗位归类、职级判断和关键词提取。
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        <label
          style={{
            display: "grid",
            gap: "8px",
          }}
        >
          <span style={{ fontWeight: 700 }}>岗位方向</span>
          <select
            aria-label="岗位方向"
            value={state.preferredDomain}
            onChange={function handleChange(event) {
              setPreferredDomain(event.target.value as (typeof domains)[number]["value"]);
            }}
            style={{
              minHeight: "48px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              padding: "0 14px",
              background: "#fff",
              fontSize: "1rem",
            }}
          >
            {domains.map(function renderDomain(option) {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </label>

        <label
          style={{
            display: "grid",
            gap: "8px",
          }}
        >
          <span style={{ fontWeight: 700 }}>职位描述</span>
          <textarea
            aria-label="职位描述"
            value={state.rawJD}
            onChange={function handleChange(event) {
              setRawJD(event.target.value);
            }}
            placeholder="粘贴完整 JD，包括职责、技能要求、经验要求等"
            style={{
              minHeight: "220px",
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

        {errors.rawJD ? (
          <p
            style={{
              margin: 0,
              color: "#b83b20",
              fontWeight: 600,
            }}
          >
            {errors.rawJD}
          </p>
        ) : null}

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

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <button
            disabled={isSubmitting}
            type="submit"
            style={{
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
            {isSubmitting ? "解析中..." : "生成岗位目标"}
          </button>
          <span
            style={{
              color: "var(--muted)",
              fontSize: "0.95rem",
            }}
          >
            结果会保存在本地数据库，后续直接接准备包与模拟面试。
          </span>
        </div>
      </form>

      {savedJobTarget ? (
        <article
          style={{
            display: "grid",
            gap: "14px",
            marginTop: "24px",
            borderRadius: "20px",
            padding: "20px",
            background: "rgba(239, 226, 207, 0.5)",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "var(--muted)",
                fontSize: "0.82rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              解析结果
            </p>
            <h3
              style={{
                margin: "10px 0 0",
                fontSize: "1.4rem",
              }}
            >
              {savedJobTarget.level} {savedJobTarget.normalizedTitle}
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gap: "12px",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <section>
              <h4 style={{ margin: 0 }}>关键技能</h4>
              <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
                {savedJobTarget.keySkills.join(" / ")}
              </p>
            </section>
            <section>
              <h4 style={{ margin: 0 }}>职责关键词</h4>
              <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
                {savedJobTarget.responsibilities.join(" / ")}
              </p>
            </section>
          </div>
        </article>
      ) : null}
    </section>
  );
}
