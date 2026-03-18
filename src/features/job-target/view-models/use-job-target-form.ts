"use client";

import { useState } from "react";
import type {
  JobTargetDomain,
  JobTargetInput,
  JobTargetValidationResult,
  SavedJobTarget,
} from "../models/job-target";

const minimumLength = 20;

export function validateJobTargetInput(input: JobTargetInput): JobTargetValidationResult {
  const rawJD = input.rawJD.trim();

  if (!rawJD) {
    return {
      success: false,
      errors: {
        rawJD: "请输入职位描述",
      },
    };
  }

  if (rawJD.length < minimumLength) {
    return {
      success: false,
      errors: {
        rawJD: `职位描述至少需要 ${minimumLength} 个字符`,
      },
    };
  }

  return {
    success: true,
    errors: {},
  };
}

type UseJobTargetFormState = {
  rawJD: string;
  preferredDomain: JobTargetDomain;
};

export function useJobTargetForm() {
  const [state, setState] = useState<UseJobTargetFormState>({
    rawJD: "",
    preferredDomain: "technical",
  });
  const [errors, setErrors] = useState<JobTargetValidationResult["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedJobTarget, setSavedJobTarget] = useState<SavedJobTarget | null>(null);
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

      const payload = (await response.json()) as SavedJobTarget;
      setSavedJobTarget(payload);

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
    savedJobTarget,
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
