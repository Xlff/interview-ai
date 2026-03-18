import { describe, expect, it } from "vitest";
import { buildInterviewSessionDraft, planNextInterviewTurn } from "./interview-orchestrator-service";

describe("buildInterviewSessionDraft", function () {
  it("asks a bounded number of questions and tracks the first dimension", function () {
    const session = buildInterviewSessionDraft({
      id: "prep-pack-1",
      jobTargetId: "job-target-1",
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
      roleSummary:
        "高级前端开发工程师需要同时证明技术栈深度、复杂项目经验、性能优化能力与跨团队协作能力。",
      highFreqQuestions: [
        "请介绍一个你主导过的复杂前端项目，你负责了哪些关键模块？",
        "你是如何做性能优化的，具体指标提升了多少？",
        "在 React 组件设计上，你如何平衡复用性和可维护性？",
      ],
      evaluationPoints: ["技术栈深度", "项目复杂度", "性能优化思路"],
      studyOutline: ["React 组件设计", "Next.js 渲染策略", "性能优化专项复习"],
    });

    expect(session.totalRounds).toBe(6);
    expect(session.currentRound).toBe(1);
    expect(session.status).toBe("active");
    expect(session.mode).toBe("text");
    expect(session.currentTurn.dimension).toBe("基础能力");
    expect(session.currentTurn.question).toContain("复杂前端项目");
  });
});

describe("planNextInterviewTurn", function () {
  it("creates at most one lightweight follow-up for a weak answer", function () {
    const nextTurn = planNextInterviewTurn({
      prepPack: {
        id: "prep-pack-1",
        jobTargetId: "job-target-1",
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
        roleSummary:
          "高级前端开发工程师需要同时证明技术栈深度、复杂项目经验、性能优化能力与跨团队协作能力。",
        highFreqQuestions: [
          "请介绍一个你主导过的复杂前端项目，你负责了哪些关键模块？",
          "你是如何做性能优化的，具体指标提升了多少？",
          "在 React 组件设计上，你如何平衡复用性和可维护性？",
        ],
        evaluationPoints: ["技术栈深度", "项目复杂度", "性能优化思路"],
        studyOutline: ["React 组件设计", "Next.js 渲染策略", "性能优化专项复习"],
      },
      session: {
        id: "session-1",
        jobTargetId: "job-target-1",
        status: "active",
        mode: "text",
        totalRounds: 6,
        currentRound: 1,
      },
      turns: [
        {
          id: "turn-1",
          sessionId: "session-1",
          question: "请介绍一个你主导过的复杂前端项目，你负责了哪些关键模块？",
          questionType: "primary",
          dimension: "基础能力",
          turnIndex: 1,
        },
      ],
      currentTurn: {
        id: "turn-1",
        sessionId: "session-1",
        question: "请介绍一个你主导过的复杂前端项目，你负责了哪些关键模块？",
        questionType: "primary",
        dimension: "基础能力",
        turnIndex: 1,
      },
      userAnswer: "我做过几个项目，主要是日常开发。",
    });

    expect(nextTurn.evaluation.summary).toContain("需要补充");
    expect(nextTurn.nextTurn?.questionType).toBe("follow_up");
    expect(nextTurn.nextTurn?.dimension).toBe("基础能力");
  });

  it("returns to the primary question sequence after a follow-up answer", function () {
    const nextTurn = planNextInterviewTurn({
      prepPack: {
        id: "prep-pack-1",
        jobTargetId: "job-target-1",
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
        roleSummary:
          "高级前端开发工程师需要同时证明技术栈深度、复杂项目经验、性能优化能力与跨团队协作能力。",
        highFreqQuestions: [
          "请介绍一个你主导过的复杂前端项目，你负责了哪些关键模块？",
          "你是如何做性能优化的，具体指标提升了多少？",
          "在 React 组件设计上，你如何平衡复用性和可维护性？",
        ],
        evaluationPoints: ["技术栈深度", "项目复杂度", "性能优化思路"],
        studyOutline: ["React 组件设计", "Next.js 渲染策略", "性能优化专项复习"],
      },
      session: {
        id: "session-1",
        jobTargetId: "job-target-1",
        status: "active",
        mode: "text",
        totalRounds: 6,
        currentRound: 2,
      },
      turns: [
        {
          id: "turn-1",
          sessionId: "session-1",
          question: "请介绍一个你主导过的复杂前端项目，你负责了哪些关键模块？",
          questionType: "primary",
          dimension: "基础能力",
          turnIndex: 1,
          userAnswer: "我主要做 React 和 Next.js 项目，负责复杂模块设计和交付。",
        },
        {
          id: "turn-2",
          sessionId: "session-1",
          question: "请补充你负责的模块、关键技术选型以及最终结果。",
          questionType: "follow_up",
          dimension: "基础能力",
          turnIndex: 2,
        },
      ],
      currentTurn: {
        id: "turn-2",
        sessionId: "session-1",
        question: "请补充你负责的模块、关键技术选型以及最终结果。",
        questionType: "follow_up",
        dimension: "基础能力",
        turnIndex: 2,
      },
      userAnswer: "我负责首屏渲染链路，用 Next.js 做 SSR 和缓存优化，最终把核心页面性能提升了 30%。",
    });

    expect(nextTurn.nextTurn?.questionType).toBe("primary");
    expect(nextTurn.nextTurn?.dimension).toBe("项目实战");
    expect(nextTurn.nextTurn?.question).toContain("性能优化");
  });
});
