import { describe, expect, it } from "vitest";
import {
  questionBankItems,
  roleConfigs,
  roleTemplates,
} from "../seeds/content-layer-data";
import type { LLMProvider } from "./llm-provider";
import { buildRoleProfile } from "./role-profile-service";
import { selectTopQuestions } from "./question-selection-service";
import { enhancePrepPackDraft, generatePrepPack } from "./prep-pack-service";

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

  it("allows a live llm provider to enhance the generated prep pack", async function () {
    const basePrepPack = {
      roleSummary: "中级前端开发工程师需要重点覆盖项目实战，并结合 JD 中出现的 React、TypeScript 证明岗位匹配度。",
      highFreqQuestions: ["原始问题 1", "原始问题 2"],
      evaluationPoints: ["技术深度"],
      studyOutline: ["React", "TypeScript"],
    };

    const provider: LLMProvider = {
      ...{
        rewriteSelectedQuestions: async () => basePrepPack.highFreqQuestions,
        generateFollowUpQuestion: async () => "follow-up",
        evaluateInterviewAnswer: async () => ({
          summary: "summary",
          coveredPoints: [],
          missingPoints: [],
          verdict: "mixed" as const,
        }),
        generateReviewReport: async () => ({
          strengths: [],
          gaps: [],
          communicationNotes: [],
          nextStudyPlan: [],
        }),
      },
      enhancePrepPack: async () => ({
        roleSummary: "这是模型增强后的岗位总结。",
        highFreqQuestions: ["模型问题 1", "模型问题 2", "模型问题 3"],
        studyOutline: ["模型提纲 1", "模型提纲 2"],
      }),
    };

    const enhanced = await enhancePrepPackDraft({
      rawJD: "负责 React 和 TypeScript 项目开发。",
      prepPack: basePrepPack,
      llmProvider: provider,
    });

    expect(enhanced.roleSummary).toBe("这是模型增强后的岗位总结。");
    expect(enhanced.highFreqQuestions).toEqual(["模型问题 1", "模型问题 2", "模型问题 3"]);
    expect(enhanced.evaluationPoints).toEqual(["技术深度"]);
    expect(enhanced.studyOutline).toEqual(["模型提纲 1", "模型提纲 2"]);
  });
});
