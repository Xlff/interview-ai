import type { JobTargetDraft, SavedJobTarget } from "@/features/job-target/models/job-target";
import { db } from "@/lib/db";

export async function createJobTarget(rawJD: string, draft: JobTargetDraft): Promise<SavedJobTarget> {
  const record = await db.jobTarget.create({
    data: {
      rawJD,
      normalizedTitle: draft.normalizedTitle,
      domain: draft.domain,
      level: draft.level,
      keySkills: draft.keySkills,
      responsibilities: draft.responsibilities,
    },
  });

  return {
    id: record.id,
    rawJD: record.rawJD,
    normalizedTitle: record.normalizedTitle,
    domain: record.domain as SavedJobTarget["domain"],
    level: record.level,
    keySkills: record.keySkills as string[],
    responsibilities: record.responsibilities as string[],
    createdAt: record.createdAt.toISOString(),
  };
}
