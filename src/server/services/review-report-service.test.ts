import { describe, expect, it } from "vitest";
import type { LLMProvider } from "./llm-provider";
import { buildReviewReport, enhanceReviewReportDraft } from "./review-report-service";

describe("buildReviewReport", function () {
  it("aggregates turns into strengths, gaps, and next study plan", function () {
    const report = buildReviewReport({
      normalizedTitle: "前端开发工程师",
      turns: [
        {
          id: "turn-1",
          sessionId: "session-1",
          question: "请介绍一个复杂项目",
          questionType: "primary",
          dimension: "项目实战",
          turnIndex: 1,
          userAnswer: "我负责首屏渲染链路，用 React 和 Next.js 交付核心模块。",
          evaluation: {
            verdict: "strong",
            summary: "回答结构完整，已经覆盖了关键背景、行动和结果。",
            coveredPoints: ["React", "Next.js", "项目"],
            missingPoints: ["量化指标"],
          },
        },
        {
          id: "turn-2",
          sessionId: "session-1",
          question: "你如何做性能优化",
          questionType: "primary",
          dimension: "工程质量",
          turnIndex: 2,
          userAnswer: "主要做了一些优化。",
          evaluation: {
            verdict: "weak",
            summary: "回答较短，需要补充具体场景、职责分工、行动和结果。",
            coveredPoints: [],
            missingPoints: ["性能", "稳定性", "结果"],
          },
        },
      ],
      studyOutline: ["React 组件设计", "Next.js 渲染策略", "性能优化专项复习"],
    });

    expect(report.strengths).toEqual(expect.arrayContaining(["项目实战表达完整"]));
    expect(report.gaps).toEqual(expect.arrayContaining(["工程质量维度回答偏弱"]));
    expect(report.missedPoints).toEqual(expect.arrayContaining(["性能", "稳定性", "结果"]));
    expect(report.nextStudyPlan).toEqual(
      expect.arrayContaining(["优先复习：性能优化专项复习", "补充一段可量化的性能优化案例"]),
    );
  });

  it("allows the llm layer to enhance strengths, gaps, and next actions", async function () {
    const provider: LLMProvider = {
      enhancePrepPack: async (input) => input,
      rewriteSelectedQuestions: async (input) => input.highFreqQuestions,
      generateFollowUpQuestion: async () => "follow-up",
      evaluateInterviewAnswer: async () => ({
        summary: "summary",
        coveredPoints: [],
        missingPoints: [],
        verdict: "mixed",
      }),
      generateReviewReport: async () => ({
        strengths: ["复杂项目表达更有说服力"],
        gaps: ["量化指标不足"],
        communicationNotes: ["建议固定使用背景-动作-结果结构"],
        nextStudyPlan: ["准备两段可量化案例"],
      }),
    };

    const baseReport = buildReviewReport({
      normalizedTitle: "前端开发工程师",
      turns: [
        {
          id: "turn-1",
          sessionId: "session-1",
          question: "请介绍一个复杂项目",
          questionType: "primary",
          dimension: "项目实战",
          turnIndex: 1,
          userAnswer: "我负责首屏渲染链路，用 React 和 Next.js 交付核心模块。",
          evaluation: {
            verdict: "strong",
            summary: "回答结构完整，已经覆盖了关键背景、行动和结果。",
            coveredPoints: ["React", "Next.js", "项目"],
            missingPoints: ["量化指标"],
          },
        },
      ],
      studyOutline: ["React 组件设计", "Next.js 渲染策略", "性能优化专项复习"],
    });

    const enhanced = await enhanceReviewReportDraft({
      normalizedTitle: "前端开发工程师",
      turns: [
        {
          id: "turn-1",
          sessionId: "session-1",
          question: "请介绍一个复杂项目",
          questionType: "primary",
          dimension: "项目实战",
          turnIndex: 1,
          userAnswer: "我负责首屏渲染链路，用 React 和 Next.js 交付核心模块。",
          evaluation: {
            verdict: "strong",
            summary: "回答结构完整，已经覆盖了关键背景、行动和结果。",
            coveredPoints: ["React", "Next.js", "项目"],
            missingPoints: ["量化指标"],
          },
        },
      ],
      report: baseReport,
      llmProvider: provider,
    });

    expect(enhanced.strengths).toEqual(["复杂项目表达更有说服力"]);
    expect(enhanced.gaps).toEqual(["量化指标不足"]);
    expect(enhanced.communicationNotes).toEqual(["建议固定使用背景-动作-结果结构"]);
    expect(enhanced.nextStudyPlan).toEqual(["准备两段可量化案例"]);
    expect(enhanced.missedPoints).toEqual(["量化指标"]);
  });
});
