import { describe, expect, it } from "vitest";
import { validateJobTargetInput } from "./use-job-target-form";

describe("validateJobTargetInput", function () {
  it("rejects blank jd input", function () {
    const result = validateJobTargetInput({
      rawJD: "",
      preferredDomain: "technical",
    });

    expect(result.success).toBe(false);
    expect(result.errors.rawJD).toContain("请输入职位描述");
  });

  it("rejects jd input that is too short", function () {
    const result = validateJobTargetInput({
      rawJD: "前端开发",
      preferredDomain: "technical",
    });

    expect(result.success).toBe(false);
    expect(result.errors.rawJD).toContain("职位描述至少需要 20 个字符");
  });
});
