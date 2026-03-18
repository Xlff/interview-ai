import type { JobTargetDraft } from "@/features/job-target/models/job-target";
import type { SavedPrepPack } from "@/features/prep-pack/models/prep-pack";
import { db } from "@/lib/db";
import { generatePrepPack } from "@/server/services/prep-pack-service";
import { buildRoleProfile } from "@/server/services/role-profile-service";

type PersistedJobTarget = JobTargetDraft & {
  id: string;
};

export async function getJobTargetById(jobTargetId: string): Promise<PersistedJobTarget | null> {
  const record = await db.jobTarget.findUnique({
    where: { id: jobTargetId },
  });

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    normalizedTitle: record.normalizedTitle,
    domain: record.domain as JobTargetDraft["domain"],
    level: record.level,
    keySkills: record.keySkills as string[],
    responsibilities: record.responsibilities as string[],
  };
}

export async function getOrCreatePrepPack(jobTargetId: string): Promise<SavedPrepPack | null> {
  const jobTarget = await getJobTargetById(jobTargetId);

  if (!jobTarget) {
    return null;
  }

  const roleProfileDraft = buildRoleProfile(jobTarget);

  const roleProfileRecord = await db.roleProfile.upsert({
    where: { jobTargetId },
    update: {
      dimensions: roleProfileDraft.dimensions,
      mustHaveSkills: roleProfileDraft.mustHaveSkills,
      niceToHaveSkills: roleProfileDraft.niceToHaveSkills,
      questionThemes: roleProfileDraft.questionThemes,
    },
    create: {
      jobTargetId,
      dimensions: roleProfileDraft.dimensions,
      mustHaveSkills: roleProfileDraft.mustHaveSkills,
      niceToHaveSkills: roleProfileDraft.niceToHaveSkills,
      questionThemes: roleProfileDraft.questionThemes,
    },
  });

  const prepPackDraft = generatePrepPack({
    ...jobTarget,
    roleProfile: roleProfileDraft,
  });

  const prepPackRecord = await db.prepPack.upsert({
    where: { jobTargetId },
    update: {
      roleSummary: prepPackDraft.roleSummary,
      highFreqQuestions: prepPackDraft.highFreqQuestions,
      evaluationPoints: prepPackDraft.evaluationPoints,
      studyOutline: prepPackDraft.studyOutline,
    },
    create: {
      jobTargetId,
      roleSummary: prepPackDraft.roleSummary,
      highFreqQuestions: prepPackDraft.highFreqQuestions,
      evaluationPoints: prepPackDraft.evaluationPoints,
      studyOutline: prepPackDraft.studyOutline,
    },
  });

  return {
    id: prepPackRecord.id,
    jobTargetId,
    normalizedTitle: jobTarget.normalizedTitle,
    domain: jobTarget.domain,
    level: jobTarget.level,
    keySkills: jobTarget.keySkills,
    responsibilities: jobTarget.responsibilities,
    roleProfile: {
      dimensions: roleProfileRecord.dimensions as string[],
      mustHaveSkills: roleProfileRecord.mustHaveSkills as string[],
      niceToHaveSkills: roleProfileRecord.niceToHaveSkills as string[],
      questionThemes: roleProfileRecord.questionThemes as string[],
    },
    roleSummary: prepPackRecord.roleSummary,
    highFreqQuestions: prepPackRecord.highFreqQuestions as string[],
    evaluationPoints: prepPackRecord.evaluationPoints as string[],
    studyOutline: prepPackRecord.studyOutline as string[],
  };
}
