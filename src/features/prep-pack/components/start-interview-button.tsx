"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StartInterviewButtonProps = {
  jobTargetId: string;
};

export default function StartInterviewButton({ jobTargetId }: StartInterviewButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function startInterview() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/interview-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTargetId }),
      });

      if (!response.ok) {
        throw new Error("文字面试暂时不可用，请稍后重试");
      }

      const payload = (await response.json()) as { id: string };
      router.push(`/interview/${payload.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "文字面试暂时不可用，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        disabled={isSubmitting}
        onClick={startInterview}
        type="button"
        className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border-0 bg-[var(--accent)] px-5 leading-none font-bold text-[var(--accent-foreground)] cursor-pointer disabled:cursor-progress disabled:opacity-70"
      >
        {isSubmitting ? "创建面试中..." : "开始 10 分钟文字面试"}
      </button>
      {submitError ? (
        <p className="font-semibold text-[#b83b20]">
          {submitError}
        </p>
      ) : null}
    </div>
  );
}
