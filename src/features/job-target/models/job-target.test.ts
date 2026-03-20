import { describe, expect, it } from "vitest";
import { validateJobTargetInput } from "./job-target";

describe("validateJobTargetInput", function () {
  it("accepts a complete jd payload from shared model code", function () {
    const result = validateJobTargetInput({
      rawJD: "负责企业级 Web 应用开发、性能优化与跨团队协作，要求熟悉 React、TypeScript 与 Next.js。",
      preferredDomain: "technical",
    });

    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
  });
});
