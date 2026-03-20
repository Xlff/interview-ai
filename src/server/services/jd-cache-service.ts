import { createHash } from "node:crypto";
import type { JobTargetDomain } from "@/features/job-target/models/job-target";

export function normalizeJobDescription(rawJD: string) {
  return rawJD
    .trim()
    .replace(/[，、；：。！？（）【】]/g, function replacePunctuation(character) {
      const punctuationMap: Record<string, string> = {
        "，": ",",
        "、": ",",
        "；": ";",
        "：": ":",
        "。": ".",
        "！": "!",
        "？": "?",
        "（": "(",
        "）": ")",
        "【": "[",
        "】": "]",
      };

      return punctuationMap[character] ?? character;
    })
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function buildJdCacheKey(rawJD: string, preferredDomain: JobTargetDomain) {
  const normalizedJD = normalizeJobDescription(rawJD);

  return createHash("sha256")
    .update(`${preferredDomain}::${normalizedJD}`)
    .digest("hex");
}
