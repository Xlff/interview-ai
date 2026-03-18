export default function LoginPage() {
  return (
    <main
      style={{
        display: "grid",
        minHeight: "calc(100vh - 88px)",
        padding: "40px 24px",
      }}
    >
      <section
        style={{
          margin: "auto",
          width: "min(560px, 100%)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "32px",
          background: "rgba(255, 253, 248, 0.92)",
          boxShadow: "0 24px 60px rgba(24, 19, 17, 0.08)",
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
          Auth
        </p>
        <h1
          style={{
            margin: "16px 0 12px",
            fontSize: "2.2rem",
          }}
        >
          登录后保存你的练习记录
        </h1>
        <p
          style={{
            margin: 0,
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          第一版会使用 Supabase 邮箱 Magic Link。当前页面先作为占位入口，下一任务会接上真实的登录流程。
        </p>
        <div
          style={{
            display: "grid",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <input
            aria-label="邮箱地址"
            disabled
            placeholder="name@example.com"
            style={{
              minHeight: "48px",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              padding: "0 16px",
              background: "#fff",
              color: "var(--muted)",
            }}
          />
          <button
            disabled
            style={{
              minHeight: "48px",
              border: "none",
              borderRadius: "14px",
              background: "var(--accent)",
              color: "var(--accent-foreground)",
              fontWeight: 700,
              opacity: 0.65,
            }}
            type="button"
          >
            发送 Magic Link
          </button>
        </div>
      </section>
    </main>
  );
}
