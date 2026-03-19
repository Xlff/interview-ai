import { describe, expect, it } from "vitest";
import {
  questionBankItems,
  roleConfigs,
  roleTemplates,
} from "../seeds/content-layer-data";
import { buildRoleProfile } from "./role-profile-service";
import { selectTopQuestions } from "./question-selection-service";
import { generatePrepPack } from "./prep-pack-service";

describe("generatePrepPack", function () {
  it("builds prep-pack content from selected questions and template defaults", function () {
    const roleTemplate = roleTemplates.find(function matchesTemplate(template) {
      return (
        template.domain === "technical" &&
        template.normalizedTitle === "前端开发工程师" &&
        template.level === "中级"
      );
    });

    const roleConfig = roleConfigs.find(function matchesConfig(config) {
      return (
        config.domain === "technical" &&
        config.normalizedTitle === "前端开发工程师" &&
        config.level === "中级"
      );
    });

    const selectedQuestions = selectTopQuestions({
      domain: "technical",
      normalizedTitle: "前端开发工程师",
      level: "中级",
      matchedSkills: ["React", "TypeScript", "Next.js"],
      preferredDimensions: roleConfig!.questionSelectionRules.preferredDimensions,
      maxQuestions: roleConfig!.questionSelectionRules.maxQuestions,
      questionBankItems,
    });

    const roleProfile = buildRoleProfile(
      {
        normalizedTitle: "前端开发工程师",
        domain: "technical",
        level: "中级",
        keySkills: ["React", "TypeScript", "Next.js"],
        responsibilities: ["企业级 Web 应用开发", "性能优化", "跨团队协作"],
      },
      roleTemplate!,
      roleConfig!,
    );

    const prepPack = generatePrepPack({
      normalizedTitle: "前端开发工程师",
      domain: "technical",
      level: "中级",
      keySkills: ["React", "TypeScript", "Next.js"],
      responsibilities: ["企业级 Web 应用开发", "性能优化", "跨团队协作"],
      roleProfile,
      roleTemplate: roleTemplate!,
      roleConfig: roleConfig!,
      selectedQuestions,
    });

    expect(prepPack.roleSummary).toContain("中级前端开发工程师");
    expect(prepPack.highFreqQuestions).toHaveLength(4);
    expect(prepPack.evaluationPoints).toEqual(
      expect.arrayContaining(["技术深度", "项目复杂度", "工程思维"]),
    );
    expect(prepPack.studyOutline).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Next.js"]),
    );
  });
});
