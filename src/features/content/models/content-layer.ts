import type { JobTargetDomain } from "@/features/job-target/models/job-target";

export type RoleLevel = "初级" | "中级" | "高级";

export type SkillDictionaryRecord = {
  id: string;
  name: string;
  aliases: string[];
  domain: JobTargetDomain;
  category: string;
  isActive: boolean;
};

export type RoleTemplateRecord = {
  id: string;
  domain: JobTargetDomain;
  normalizedTitle: string;
  level: RoleLevel;
  dimensions: string[];
  defaultQuestionThemes: string[];
  defaultEvaluationPoints: string[];
  isActive: boolean;
};

export type RoleConfigRecord = {
  id: string;
  roleTemplateId: string;
  mustHaveSkillIds: string[];
  niceToHaveSkillIds: string[];
  questionSelectionRules: {
    maxQuestions: number;
    prioritizeMatchedSkills: boolean;
    preferredDimensions: string[];
  };
  prepPackRules: {
    maxStudyOutlineItems: number;
    emphasizeMatchedResponsibilities: boolean;
  };
  isActive: boolean;
};

export type QuestionBankItemRecord = {
  id: string;
  domain: JobTargetDomain;
  normalizedTitle: string;
  level: RoleLevel;
  dimension: string;
  question: string;
  questionType: "primary" | "follow-up";
  skillTags: string[];
  evaluationPoints: string[];
  followUpHints: string[];
  isActive: boolean;
};

export type MockJobDescriptionRecord = {
  id: string;
  domain: JobTargetDomain;
  normalizedTitle: string;
  level: RoleLevel;
  label: string;
  rawJD: string;
  isSeed: boolean;
};

export type SkillDictionarySeed = Omit<SkillDictionaryRecord, "id">;
export type RoleTemplateSeed = Omit<RoleTemplateRecord, "id">;
export type RoleConfigSeed = Omit<RoleConfigRecord, "id" | "roleTemplateId"> & {
  domain: JobTargetDomain;
  normalizedTitle: string;
  level: RoleLevel;
};
export type QuestionBankItemSeed = Omit<QuestionBankItemRecord, "id">;
export type MockJobDescriptionSeed = Omit<MockJobDescriptionRecord, "id">;
