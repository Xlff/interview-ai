import JobTargetForm from "../components/job-target-form";

const supportedTracks = ["产品经理", "运营增长", "技术岗位"];

export default function JobTargetPage() {
  return (
    <main className="grid min-h-screen px-6 py-12">
      <section className="m-auto w-full max-w-[960px] rounded-[28px] border border-[var(--border)] bg-[rgba(255,253,248,0.88)] p-10 shadow-[0_28px_80px_rgba(24,19,17,0.08)] backdrop-blur-[18px]">
        <p className="text-[0.8rem] uppercase tracking-[0.22em] text-[var(--accent)]">
          Interview AI
        </p>
        <h1 className="my-[18px] max-w-[10ch] text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.94] font-semibold">
          用 JD 驱动的面试准备工作台
        </h1>
        <p className="max-w-[48rem] text-[1.05rem] leading-[1.7] text-[var(--muted)]">
          粘贴岗位描述，先拿到岗位解读、高频问题和个性化复习提纲，再进入一场聚焦弱项的文字模拟面试。
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#jd-input"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-5 font-semibold text-[var(--accent-foreground)]"
          >
            生成面试准备包
          </a>
          <a
            href="#supported-tracks"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] px-5 font-semibold"
          >
            查看支持岗位
          </a>
        </div>

        <div
          id="supported-tracks"
          className="mt-9 grid gap-[14px] [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]"
        >
          {supportedTracks.map(function renderTrack(track) {
            return (
              <article
                key={track}
                className="rounded-[20px] border border-[var(--border)] bg-[rgba(239,226,207,0.42)] p-5"
              >
                <p className="text-[0.82rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                  当前支持
                </p>
                <h2 className="mt-3 text-[1.4rem] font-semibold">
                  {track}
                </h2>
              </article>
            );
          })}
        </div>

        <JobTargetForm />
      </section>
    </main>
  );
}
