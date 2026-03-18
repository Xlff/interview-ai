"use client";

import { useState } from "react";
import type { InterviewSessionSnapshot } from "../models/interview-session";

type UseInterviewSessionResult = {
  session: InterviewSessionSnapshot;
  answer: string;
  isSubmitting: boolean;
  submitError: string | null;
  setAnswer(value: string): void;
  submitAnswer(): Promise<void>;
};

export function useInterviewSession(initialSession: InterviewSessionSnapshot): UseInterviewSessionResult {
  const [session, setSession] = useState(initialSession);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function submitAnswer() {
    if (!answer.trim()) {
      setSubmitError("请先输入你的回答");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/interview-turns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
          userAnswer: answer,
        }),
      });

      if (!response.ok) {
        throw new Error("提交回答失败，请稍后重试");
      }

      const payload = (await response.json()) as InterviewSessionSnapshot;
      setSession(payload);
      setAnswer("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "提交回答失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    session,
    answer,
    isSubmitting,
    submitError,
    setAnswer,
    submitAnswer,
  };
}
