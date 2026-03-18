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
