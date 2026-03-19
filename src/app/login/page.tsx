export default function LoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-88px)] px-6 py-10">
      <section className="m-auto w-full max-w-[560px] rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.92)] p-8 shadow-[0_24px_60px_rgba(24,19,17,0.08)]">
        <p className="text-[0.8rem] uppercase tracking-[0.2em] text-[var(--accent)]">
          Auth
        </p>
        <h1 className="my-4 text-[2.2rem] font-semibold">
          登录后保存你的练习记录
        </h1>
        <p className="leading-[1.7] text-[var(--muted)]">
          第一版会使用 Supabase 邮箱 Magic Link。当前页面先作为占位入口，下一任务会接上真实的登录流程。
        </p>
        <div className="mt-6 grid gap-3">
          <input
            aria-label="邮箱地址"
            disabled
            placeholder="name@example.com"
            className="min-h-12 rounded-[14px] border border-[var(--border)] bg-white px-4 text-[var(--muted)]"
          />
          <button
            disabled
            className="min-h-12 rounded-[14px] border-0 bg-[var(--accent)] font-bold text-[var(--accent-foreground)] opacity-65"
            type="button"
          >
            发送 Magic Link
          </button>
        </div>
      </section>
    </main>
  );
}
