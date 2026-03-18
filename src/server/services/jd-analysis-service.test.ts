import { describe, expect, it } from "vitest";
import { analyzeJobDescription } from "./jd-analysis-service";

describe("analyzeJobDescription", function () {
  it("extracts a normalized technical role from a frontend jd", function () {
    const draft = analyzeJobDescription({
      rawJD: `
        我们正在招聘高级前端开发工程师，负责企业级 Web 应用开发。
        需要熟练掌握 React、TypeScript、Next.js，能够负责复杂页面搭建、
        性能优化、组件设计和跨团队协作，有 3-5 年相关经验。
      `,
      preferredDomain: "technical",
    });

    expect(draft.normalizedTitle).toBe("前端开发工程师");
    expect(draft.domain).toBe("technical");
    expect(draft.level).toBe("高级");
    expect(draft.keySkills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Next.js"]),
    );
    expect(draft.responsibilities).toEqual(
      expect.arrayContaining(["企业级 Web 应用开发", "性能优化", "跨团队协作"]),
    );
  });
});
