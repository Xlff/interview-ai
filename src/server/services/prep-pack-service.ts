import type { JobTargetDraft } from "@/features/job-target/models/job-target";
import type { PrepPackDraft, RoleProfileDraft } from "@/features/prep-pack/models/prep-pack";

type GeneratePrepPackInput = JobTargetDraft & {
  roleProfile: RoleProfileDraft;
};

export function generatePrepPack(input: GeneratePrepPackInput): PrepPackDraft {
  if (input.domain === "technical") {
    return {
      roleSummary: `${input.level}${input.normalizedTitle}需要同时证明技术栈深度、复杂项目经验、性能优化能力与跨团队协作能力。`,
      highFreqQuestions: [
        "请介绍一个你主导过的复杂前端项目，你负责了哪些关键模块？",
        "你是如何做性能优化的，具体指标提升了多少？",
        "在 React 组件设计上，你如何平衡复用性和可维护性？",
        "如果线上出现关键页面性能回退，你会怎么排查和止损？",
      ],
      evaluationPoints: ["技术栈深度", "项目复杂度", "性能优化思路", "表达与协作"],
      studyOutline: ["React 组件设计", "Next.js 渲染策略", "性能优化专项复习", "项目表达模板整理"],
    };
  }

  if (input.domain === "product") {
    return {
      roleSummary: `${input.level}${input.normalizedTitle}需要重点证明问题定义能力、方案设计能力、数据判断能力以及跨团队推进能力。`,
      highFreqQuestions: [
        "你如何从模糊需求中拆出可执行的问题定义？",
        "介绍一个你推动上线的核心功能，如何评估效果？",
        "如果业务方和研发优先级冲突，你怎么推进？",
      ],
      evaluationPoints: ["问题拆解", "数据判断", "方案取舍", "协作推进"],
      studyOutline: ["需求拆解框架", "指标体系复习", "项目案例沉淀", "跨团队沟通表达"],
    };
  }

  return {
    roleSummary: `${input.level}${input.normalizedTitle}需要证明增长思维、执行落地能力、复盘能力和协同推进能力。`,
    highFreqQuestions: [
      "介绍一次你负责的增长活动，目标、动作和结果分别是什么？",
      "如果活动效果不达预期，你会如何快速定位问题？",
      "你如何与产品和设计协作推进运营方案落地？",
    ],
    evaluationPoints: ["增长判断", "执行质量", "数据复盘", "沟通协同"],
    studyOutline: ["增长实验方法", "活动复盘模板", "运营案例整理", "跨团队协作表达"],
  };
}
