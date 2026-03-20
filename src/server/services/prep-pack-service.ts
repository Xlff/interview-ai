import type {
  QuestionBankItemSeed,
  RoleConfigSeed,
  RoleTemplateSeed,
} from "@/features/content/models/content-layer";
import type { JobTargetDraft } from "@/features/job-target/models/job-target";
import type { PrepPackDraft, RoleProfileDraft } from "@/features/prep-pack/models/prep-pack";
import type { LLMProvider } from "./llm-provider";

type GeneratePrepPackInput = JobTargetDraft & {
  roleProfile: RoleProfileDraft;
  roleTemplate: RoleTemplateSeed;
  roleConfig: RoleConfigSeed;
  selectedQuestions: QuestionBankItemSeed[];
};

export function generatePrepPack(input: GeneratePrepPackInput): PrepPackDraft {
  return {
    roleSummary: buildRoleSummary(input),
    highFreqQuestions: input.selectedQuestions.map(function toQuestion(item) {
      return item.question;
    }),
    evaluationPoints: deduplicateStrings([
      ...input.roleTemplate.defaultEvaluationPoints,
      ...input.selectedQuestions.flatMap(function toPoints(item) {
        return item.evaluationPoints;
      }),
    ]),
    studyOutline: deduplicateStrings([
      ...input.roleProfile.mustHaveSkills,
      ...input.roleProfile.niceToHaveSkills,
      ...input.roleTemplate.defaultQuestionThemes,
    ]).slice(0, input.roleConfig.prepPackRules.maxStudyOutlineItems),
  };
}

type EnhancePrepPackDraftInput = {
  rawJD: string;
  prepPack: PrepPackDraft;
  llmProvider: LLMProvider;
};

export async function enhancePrepPackDraft(
  input: EnhancePrepPackDraftInput,
): Promise<PrepPackDraft> {
  const enhanced = await input.llmProvider.enhancePrepPack({
    rawJD: input.rawJD,
    roleSummary: input.prepPack.roleSummary,
    highFreqQuestions: input.prepPack.highFreqQuestions,
    studyOutline: input.prepPack.studyOutline,
  });

  return {
    roleSummary: enhanced.roleSummary,
    highFreqQuestions: enhanced.highFreqQuestions,
    evaluationPoints: input.prepPack.evaluationPoints,
    studyOutline: enhanced.studyOutline,
  };
}

function buildRoleSummary(input: GeneratePrepPackInput) {
  return `${input.level}${input.normalizedTitle}需要重点覆盖${input.roleTemplate.dimensions.join("、")}，并结合 JD 中出现的 ${input.keySkills.join("、")} 证明岗位匹配度。`;
}

function deduplicateStrings(items: string[]) {
  return Array.from(new Set(items));
}
