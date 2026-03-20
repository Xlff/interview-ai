import type {
  MockJobDescriptionRecord,
  QuestionBankItemRecord,
  RoleConfigRecord,
  RoleTemplateRecord,
  SkillDictionaryRecord,
} from "@/features/content/models/content-layer";
import { db } from "@/lib/db";

export async function listSkillDictionariesByDomain(
  domain: SkillDictionaryRecord["domain"],
): Promise<SkillDictionaryRecord[]> {
  const records = await db.skillDictionary.findMany({
    where: {
      domain,
      isActive: true,
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return records.map(function mapRecord(record) {
    return {
      id: record.id,
      name: record.name,
      aliases: record.aliases as string[],
      domain: record.domain as SkillDictionaryRecord["domain"],
      category: record.category,
      isActive: record.isActive,
    };
  });
}

export async function listRoleTemplatesByDomain(
  domain: RoleTemplateRecord["domain"],
): Promise<RoleTemplateRecord[]> {
  const records = await db.roleTemplate.findMany({
    where: {
      domain,
      isActive: true,
    },
    orderBy: [{ normalizedTitle: "asc" }, { level: "asc" }],
  });

  return records.map(function mapRecord(record) {
    return {
      id: record.id,
      domain: record.domain as RoleTemplateRecord["domain"],
      normalizedTitle: record.normalizedTitle,
      level: record.level as RoleTemplateRecord["level"],
      dimensions: record.dimensions as string[],
      defaultQuestionThemes: record.defaultQuestionThemes as string[],
      defaultEvaluationPoints: record.defaultEvaluationPoints as string[],
      isActive: record.isActive,
    };
  });
}

export async function getRoleConfigByTemplateId(
  roleTemplateId: string,
): Promise<RoleConfigRecord | null> {
  const record = await db.roleConfig.findUnique({
    where: {
      roleTemplateId,
    },
  });

  if (!record || !record.isActive) {
    return null;
  }

  return {
    id: record.id,
    roleTemplateId: record.roleTemplateId,
    mustHaveSkillIds: record.mustHaveSkillIds as string[],
    niceToHaveSkillIds: record.niceToHaveSkillIds as string[],
    questionSelectionRules: record.questionSelectionRules as RoleConfigRecord["questionSelectionRules"],
    prepPackRules: record.prepPackRules as RoleConfigRecord["prepPackRules"],
    isActive: record.isActive,
  };
}

export async function listQuestionBankItemsByDomain(
  domain: QuestionBankItemRecord["domain"],
): Promise<QuestionBankItemRecord[]> {
  const records = await db.questionBankItem.findMany({
    where: {
      domain,
      isActive: true,
    },
  });

  return records.map(function mapRecord(record) {
    return {
      id: record.id,
      domain: record.domain as QuestionBankItemRecord["domain"],
      normalizedTitle: record.normalizedTitle,
      level: record.level as QuestionBankItemRecord["level"],
      dimension: record.dimension,
      question: record.question,
      questionType: record.questionType as QuestionBankItemRecord["questionType"],
      skillTags: record.skillTags as string[],
      evaluationPoints: record.evaluationPoints as string[],
      followUpHints: record.followUpHints as string[],
      isActive: record.isActive,
    };
  });
}

export async function listMockJobDescriptions(): Promise<MockJobDescriptionRecord[]> {
  const records = await db.mockJobDescription.findMany({
    where: {
      isSeed: true,
    },
    orderBy: [{ domain: "asc" }, { normalizedTitle: "asc" }, { level: "asc" }, { label: "asc" }],
  });

  return records.map(function mapRecord(record) {
    return {
      id: record.id,
      domain: record.domain as MockJobDescriptionRecord["domain"],
      normalizedTitle: record.normalizedTitle,
      level: record.level as MockJobDescriptionRecord["level"],
      label: record.label,
      rawJD: record.rawJD,
      isSeed: record.isSeed,
    };
  });
}
