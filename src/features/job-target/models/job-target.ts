export type JobTargetDomain = "product" | "operations" | "technical";

export type JobTargetInput = {
  rawJD: string;
  preferredDomain: JobTargetDomain;
};

export type JobTargetValidationResult = {
  success: boolean;
  errors: {
    rawJD?: string;
  };
};

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

export type JobTargetDraft = {
  normalizedTitle: string;
  domain: JobTargetDomain;
  level: string;
  keySkills: string[];
  responsibilities: string[];
};

export type SavedJobTarget = JobTargetDraft & {
  id: string;
  rawJD: string;
  createdAt: string;
};
