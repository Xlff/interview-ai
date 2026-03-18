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
    <div
      style={{
        display: "grid",
        gap: "8px",
      }}
    >
      <button
        disabled={isSubmitting}
        onClick={startInterview}
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
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
        {isSubmitting ? "创建面试中..." : "开始 10 分钟文字面试"}
      </button>
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
    </div>
  );
}
