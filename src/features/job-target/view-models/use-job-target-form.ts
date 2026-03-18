"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  JobTargetDomain,
  JobTargetValidationResult,
} from "../models/job-target";
import { validateJobTargetInput } from "../models/job-target";

type UseJobTargetFormState = {
  rawJD: string;
  preferredDomain: JobTargetDomain;
};

export function useJobTargetForm() {
  const router = useRouter();
  const [state, setState] = useState<UseJobTargetFormState>({
    rawJD: "",
    preferredDomain: "technical",
  });
  const [errors, setErrors] = useState<JobTargetValidationResult["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function submit() {
    const validation = validateJobTargetInput(state);
    setErrors(validation.errors);

    if (!validation.success) {
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/job-targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error("岗位解析暂时不可用，请稍后重试");
      }

      const payload = (await response.json()) as { id: string };
      router.push(`/prep/${payload.id}`);

      return true;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "岗位解析暂时不可用，请稍后重试");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    state,
    errors,
    isSubmitting,
    submitError,
    setRawJD(rawJD: string) {
      setState(function update(previous) {
        return { ...previous, rawJD };
      });
    },
    setPreferredDomain(preferredDomain: JobTargetDomain) {
      setState(function update(previous) {
        return { ...previous, preferredDomain };
      });
    },
    submit,
  };
}
