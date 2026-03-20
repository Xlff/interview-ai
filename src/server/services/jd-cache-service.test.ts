import { describe, expect, it } from "vitest";
import { buildJdCacheKey, normalizeJobDescription } from "./jd-cache-service";

describe("normalizeJobDescription", function () {
  it("normalizes whitespace, punctuation, and casing before hashing", function () {
    const first = [
      "高级前端开发工程师",
      "负责 React、TypeScript、Next.js 项目开发；",
      "需要推进性能优化。  ",
    ].join("\n");
    const second =
      "高级前端开发工程师 负责 react、typescript、next.js 项目开发; 需要推进性能优化。";

    expect(normalizeJobDescription(first)).toBe(normalizeJobDescription(second));
    expect(buildJdCacheKey(first)).toBe(buildJdCacheKey(second));
  });
});
