import type { JobTargetDraft } from "@/features/job-target/models/job-target";
import type {
  RoleConfigSeed,
  RoleTemplateSeed,
} from "@/features/content/models/content-layer";
import type { RoleProfileDraft } from "@/features/prep-pack/models/prep-pack";

export function buildRoleProfile(
  jobTarget: JobTargetDraft,
  roleTemplate: RoleTemplateSeed,
  roleConfig: RoleConfigSeed,
): RoleProfileDraft {
  return {
    dimensions: roleTemplate.dimensions,
    mustHaveSkills: collectAvailableSkills(jobTarget.keySkills, roleConfig.mustHaveSkillIds),
    niceToHaveSkills: roleConfig.niceToHaveSkillIds,
    questionThemes: roleTemplate.defaultQuestionThemes,
  };
}

function collectAvailableSkills(matchedSkills: string[], configuredSkills: string[]) {
  const intersections = configuredSkills.filter(function isMatched(skill) {
    return matchedSkills.includes(skill);
  });

  return intersections.length > 0 ? intersections : configuredSkills;
}
