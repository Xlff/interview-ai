const supportedTracks = ["产品经理", "运营增长", "技术岗位"];

export default function HomePage() {
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
          margin: "auto",
          width: "min(960px, 100%)",
          border: "1px solid var(--border)",
          borderRadius: "28px",
          background: "rgba(255, 253, 248, 0.88)",
          padding: "40px",
          boxShadow: "0 28px 80px rgba(24, 19, 17, 0.08)",
          backdropFilter: "blur(18px)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "var(--accent)",
            fontSize: "0.8rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Interview AI
        </p>
        <h1
          style={{
            margin: "18px 0 12px",
            fontSize: "clamp(2.8rem, 7vw, 5.6rem)",
            lineHeight: 0.94,
            maxWidth: "10ch",
          }}
        >
          用 JD 驱动的面试准备工作台
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: "48rem",
            color: "var(--muted)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
        >
          粘贴岗位描述，先拿到岗位解读、高频问题和个性化复习提纲，再进入一场聚焦弱项的文字模拟面试。
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "28px",
          }}
        >
          <a
            href="#jd-input"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "48px",
              padding: "0 20px",
              borderRadius: "999px",
              background: "var(--accent)",
              color: "var(--accent-foreground)",
              fontWeight: 600,
            }}
          >
            生成面试准备包
          </a>
          <a
            href="#supported-tracks"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "48px",
              padding: "0 20px",
              borderRadius: "999px",
              border: "1px solid var(--border)",
              fontWeight: 600,
            }}
          >
            查看支持岗位
          </a>
        </div>

        <div
          id="supported-tracks"
          style={{
            display: "grid",
            gap: "14px",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            marginTop: "36px",
          }}
        >
          {supportedTracks.map(function renderTrack(track) {
            return (
              <article
                key={track}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "20px",
                  background: "rgba(239, 226, 207, 0.42)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "var(--muted)",
                    fontSize: "0.82rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  当前支持
                </p>
                <h2
                  style={{
                    margin: "12px 0 0",
                    fontSize: "1.4rem",
                  }}
                >
                  {track}
                </h2>
              </article>
            );
          })}
        </div>

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
          <h2
            style={{
              margin: 0,
              fontSize: "1.35rem",
            }}
          >
            第一步会是 JD 输入表单
          </h2>
          <p
            style={{
              margin: "10px 0 0",
              color: "var(--muted)",
              lineHeight: 1.7,
            }}
          >
            当前阶段先把项目骨架搭起来。下一步会在这里接入 JD 粘贴、岗位解析和准备包生成流程。
          </p>
        </section>
      </section>
    </main>
  );
}
