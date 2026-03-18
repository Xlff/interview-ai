import { describe, expect, it } from "vitest";
import { buildReviewReport } from "./review-report-service";

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
});
