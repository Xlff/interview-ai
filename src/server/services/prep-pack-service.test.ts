import { describe, expect, it } from "vitest";
import { generatePrepPack } from "./prep-pack-service";

describe("generatePrepPack", function () {
  it("returns role summary, high-frequency questions, evaluation points, and study outline", function () {
    const prepPack = generatePrepPack({
      normalizedTitle: "前端开发工程师",
      domain: "technical",
      level: "高级",
      keySkills: ["React", "TypeScript", "Next.js"],
      responsibilities: ["企业级 Web 应用开发", "性能优化", "跨团队协作"],
      roleProfile: {
        dimensions: ["基础能力", "项目实战", "工程质量", "协作沟通"],
        mustHaveSkills: ["React", "TypeScript", "Next.js"],
        niceToHaveSkills: ["性能优化", "组件设计"],
        questionThemes: ["组件设计", "性能优化", "复杂项目拆解"],
      },
    });

    expect(prepPack.roleSummary).toContain("高级前端开发工程师");
    expect(prepPack.highFreqQuestions.length).toBeGreaterThan(2);
    expect(prepPack.evaluationPoints).toEqual(
      expect.arrayContaining(["技术栈深度", "项目复杂度", "性能优化思路"]),
    );
    expect(prepPack.studyOutline).toEqual(
      expect.arrayContaining(["React 组件设计", "Next.js 渲染策略", "性能优化专项复习"]),
    );
  });
});
