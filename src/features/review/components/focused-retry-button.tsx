"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FocusedRetryButtonProps = {
  sessionId: string;
  providerId?: string;
  model?: string;
};

export default function FocusedRetryButton({
  sessionId,
  providerId,
  model,
}: FocusedRetryButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleClick() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/interview-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceSessionId: sessionId,
          providerId,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error("短板强化面试暂时不可用，请稍后再试");
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
      setSubmitError(error instanceof Error ? error.message : "短板强化面试暂时不可用，请稍后再试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        disabled={isSubmitting}
        onClick={handleClick}
        type="button"
        className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-[var(--border)] px-5 leading-none font-bold cursor-pointer disabled:cursor-progress disabled:opacity-70"
      >
        {isSubmitting ? "创建强化面试中..." : "围绕短板再练一轮"}
      </button>
      {submitError ? (
        <p className="font-semibold text-[#b83b20]">
          {submitError}
        </p>
      ) : null}
    </div>
  );
}
