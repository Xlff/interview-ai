import { describe, expect, it } from "vitest";
import type { LLMProvider } from "./llm-provider";
import {
  buildInterviewSessionDraft,
  planNextInterviewTurn,
  planNextInterviewTurnWithLLM,
} from "./interview-orchestrator-service";

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

  it("prioritizes focus dimensions when building a retry session", function () {
    const session = buildInterviewSessionDraft(
      {
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
          "当团队代码质量出现波动时，你会怎么推动规范和工程治理？",
        ],
        evaluationPoints: ["技术栈深度", "项目复杂度", "性能优化思路"],
        studyOutline: ["React 组件设计", "Next.js 渲染策略", "性能优化专项复习"],
      },
      ["工程质量"],
    );

    expect(session.currentTurn.dimension).toBe("工程质量");
    expect(session.currentTurn.question).toContain("工程质量");
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

  it("allows the llm layer to turn an answer into a weak verdict and custom follow-up", async function () {
    const provider: LLMProvider = {
      enhancePrepPack: async (input) => input,
      rewriteSelectedQuestions: async (input) => input.highFreqQuestions,
      generateFollowUpQuestion: async () => "请继续补充你的目标、动作拆解和量化结果。",
      evaluateInterviewAnswer: async () => ({
        summary: "案例方向对了，但关键动作和结果不够具体。",
        coveredPoints: ["项目背景"],
        missingPoints: ["动作拆解", "量化结果"],
        verdict: "weak",
      }),
      generateReviewReport: async () => ({
        strengths: [],
        gaps: [],
        communicationNotes: [],
        nextStudyPlan: [],
      }),
    };

    const outcome = await planNextInterviewTurnWithLLM({
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
      userAnswer: "我负责过一个比较复杂的项目，也做了不少推进工作。",
      llmProvider: provider,
    });

    expect(outcome.evaluation.summary).toContain("关键动作和结果不够具体");
    expect(outcome.evaluation.verdict).toBe("weak");
    expect(outcome.nextTurn?.questionType).toBe("follow_up");
    expect(outcome.nextTurn?.question).toBe("请继续补充你的目标、动作拆解和量化结果。");
  });

  it("keeps the deterministic weak verdict when the answer is obviously too short", async function () {
    const provider: LLMProvider = {
      enhancePrepPack: async (input) => input,
      rewriteSelectedQuestions: async (input) => input.highFreqQuestions,
      generateFollowUpQuestion: async () => "请继续补充更具体的背景和结果。",
      evaluateInterviewAnswer: async () => ({
        summary: "虽然比较简短，但我认为方向还可以。",
        coveredPoints: ["项目背景"],
        missingPoints: [],
        verdict: "strong",
      }),
      generateReviewReport: async () => ({
        strengths: [],
        gaps: [],
        communicationNotes: [],
        nextStudyPlan: [],
      }),
    };

    const outcome = await planNextInterviewTurnWithLLM({
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
      userAnswer: "我做过一些项目。",
      llmProvider: provider,
    });

    expect(outcome.evaluation.verdict).toBe("weak");
    expect(outcome.nextTurn?.questionType).toBe("follow_up");
  });
});
