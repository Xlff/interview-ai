import type { JobTargetDomain } from "@/features/job-target/models/job-target";

export type RoleProfileDraft = {
  dimensions: string[];
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  questionThemes: string[];
};

export type PrepPackDraft = {
  roleSummary: string;
  highFreqQuestions: string[];
  evaluationPoints: string[];
  studyOutline: string[];
};

export type SavedPrepPack = PrepPackDraft & {
  id: string;
  jobTargetId: string;
  normalizedTitle: string;
  domain: JobTargetDomain;
  level: string;
  keySkills: string[];
  responsibilities: string[];
  roleProfile: RoleProfileDraft;
};
