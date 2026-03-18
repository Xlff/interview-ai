import type { JobTargetDraft } from "@/features/job-target/models/job-target";
import type { RoleProfileDraft } from "@/features/prep-pack/models/prep-pack";

export function buildRoleProfile(jobTarget: JobTargetDraft): RoleProfileDraft {
  if (jobTarget.domain === "technical") {
    return {
      dimensions: ["基础能力", "项目实战", "工程质量", "协作沟通"],
      mustHaveSkills: jobTarget.keySkills,
      niceToHaveSkills: collectNiceToHave(jobTarget.responsibilities, ["性能优化", "组件设计", "架构演进"]),
      questionThemes: ["组件设计", "性能优化", "复杂项目拆解"],
    };
  }

  if (jobTarget.domain === "product") {
    return {
      dimensions: ["问题定义", "方案设计", "数据判断", "协作推进"],
      mustHaveSkills: jobTarget.keySkills,
      niceToHaveSkills: ["用户研究", "优先级判断"],
      questionThemes: ["需求分析", "指标设计", "跨团队推进"],
    };
  }

  return {
    dimensions: ["增长策略", "执行落地", "数据复盘", "协同推进"],
    mustHaveSkills: jobTarget.keySkills,
    niceToHaveSkills: ["活动策划", "渠道运营"],
    questionThemes: ["增长实验", "活动复盘", "协作执行"],
  };
}

function collectNiceToHave(responsibilities: string[], fallbacks: string[]) {
  const matches = responsibilities.filter(function includeResponsibility(item) {
    return fallbacks.includes(item);
  });

  return matches.length > 0 ? matches : fallbacks.slice(0, 2);
}
