import type { JobTargetDraft, SavedJobTarget } from "@/features/job-target/models/job-target";
import type { JobTargetDomain } from "@/features/job-target/models/job-target";
import { db } from "@/lib/db";
import { buildJdCacheKey, normalizeJobDescription } from "../services/jd-cache-service";

export async function createJobTarget(
  rawJD: string,
  draft: JobTargetDraft,
  preferredDomain: JobTargetDomain,
): Promise<SavedJobTarget> {
  const normalizedJD = normalizeJobDescription(rawJD);
  const jdHash = buildJdCacheKey(rawJD, preferredDomain);
  const existing = await findJobTargetByHash(jdHash);

  if (existing) {
    return mapSavedJobTarget(existing);
  }

  try {
    const record = await db.jobTarget.create({
      data: {
        rawJD,
        normalizedJD,
        jdHash,
        normalizedTitle: draft.normalizedTitle,
        domain: draft.domain,
        level: draft.level,
        keySkills: draft.keySkills,
        responsibilities: draft.responsibilities,
      },
    });

    return mapSavedJobTarget(record);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const cached = await findJobTargetByHash(jdHash);

      if (cached) {
        return mapSavedJobTarget(cached);
      }
    }

    throw error;
  }
}

async function findJobTargetByHash(jdHash: string) {
  return db.jobTarget.findUnique({
    where: {
      jdHash,
    },
  });
}

function mapSavedJobTarget(record: {
  id: string;
  rawJD: string;
  normalizedTitle: string;
  domain: string;
  level: string;
  keySkills: unknown;
  responsibilities: unknown;
  createdAt: Date;
}): SavedJobTarget {
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

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
