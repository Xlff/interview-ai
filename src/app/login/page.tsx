"use client";

import Link from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setError("请输入邮箱地址");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = new URL("/auth/callback?next=/history", window.location.origin);
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo.toString(),
        },
      });

      if (authError) {
        throw authError;
      }

      setFeedback("Magic Link 已发送，请前往邮箱完成登录。");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "发送 Magic Link 失败");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-88px)] px-6 py-10">
      <section className="m-auto grid w-full max-w-[560px] gap-5 rounded-3xl border border-[var(--border)] bg-[rgba(255,253,248,0.92)] p-8 shadow-[0_24px_60px_rgba(24,19,17,0.08)]">
        <div>
          <p className="text-[0.8rem] uppercase tracking-[0.2em] text-[var(--accent)]">
            Auth
          </p>
          <h1 className="my-4 text-[2.2rem] font-semibold">
            登录后保存你的练习记录
          </h1>
          <p className="leading-[1.7] text-[var(--muted)]">
            现在支持 Supabase 邮箱 Magic Link。登录后，你发起的文字面试会自动进入历史记录，方便持续复盘。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <label className="grid gap-2">
            <span className="font-bold">邮箱地址</span>
            <input
              aria-label="邮箱地址"
              value={email}
              onChange={function handleChange(event) {
                setEmail(event.target.value);
              }}
              placeholder="name@example.com"
              className="min-h-12 rounded-[14px] border border-[var(--border)] bg-white px-4"
              type="email"
            />
          </label>
          <button
            disabled={isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-[14px] border-0 bg-[var(--accent)] px-4 font-bold text-[var(--accent-foreground)] disabled:cursor-progress disabled:opacity-65"
            type="submit"
          >
            {isSubmitting ? "发送中..." : "发送 Magic Link"}
          </button>
        </form>

        {feedback ? (
          <p className="font-semibold text-[var(--accent)]">
            {feedback}
          </p>
        ) : null}

        {error ? (
          <p className="font-semibold text-[#b83b20]">
            {error}
          </p>
        ) : null}

        <p className="text-sm leading-[1.7] text-[var(--muted)]">
          如果你只是先体验，仍然可以直接回到
          {" "}
          <Link href="/" className="font-semibold text-[var(--accent)] underline underline-offset-4">
            首页
          </Link>
          {" "}
          继续匿名练习。
        </p>
      </section>
    </main>
  );
}
