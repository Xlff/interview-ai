"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StartInterviewButtonProps = {
  jobTargetId: string;
  providerId?: string;
  model?: string;
};

export default function StartInterviewButton({
  jobTargetId,
  providerId,
  model,
}: StartInterviewButtonProps) {
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
        body: JSON.stringify({ jobTargetId, providerId, model }),
      });

      if (!response.ok) {
        throw new Error("文字面试暂时不可用，请稍后重试");
      }

      const payload = (await response.json()) as { id: string };
      const search = new URLSearchParams();

      if (providerId) {
        search.set("provider", providerId);
      }

      if (model) {
        search.set("model", model);
      }

      const searchSuffix = search.size > 0 ? `?${search.toString()}` : "";
      router.push(`/interview/${payload.id}${searchSuffix}`);
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
