import type { SavedPrepPack } from "@/features/prep-pack/models/prep-pack";
import type { SavedInterviewTurn, InterviewTurnEvaluation } from "@/features/interview/models/interview-turn";

type EvaluateInterviewAnswerInput = {
  prepPack: SavedPrepPack;
  currentTurn: SavedInterviewTurn;
  userAnswer: string;
};

export function evaluateInterviewAnswer(
  input: EvaluateInterviewAnswerInput,
): InterviewTurnEvaluation & { followUpHint?: string } {
  const normalizedAnswer = input.userAnswer.trim();
  const loweredAnswer = normalizedAnswer.toLowerCase();
  const expectedKeywords = collectExpectedKeywords(input.prepPack, input.currentTurn.dimension);
  const coveredPoints = expectedKeywords.filter(function includeKeyword(keyword) {
    return loweredAnswer.includes(keyword.toLowerCase());
  });
  const missingPoints = expectedKeywords.filter(function excludeKeyword(keyword) {
    return !coveredPoints.includes(keyword);
  });

  if (normalizedAnswer.length < 40 || coveredPoints.length === 0) {
    return {
      verdict: "weak",
      summary: "回答较短，需要补充具体场景、职责分工、行动和结果。",
      coveredPoints,
      missingPoints,
      followUpHint: buildFollowUpHint(input.currentTurn.dimension),
    };
  }

  if (normalizedAnswer.length < 90 || coveredPoints.length < 2) {
    return {
      verdict: "mixed",
      summary: "回答有方向，但还可以补充量化结果、技术细节或决策依据。",
      coveredPoints,
      missingPoints,
    };
  }

  return {
    verdict: "strong",
    summary: "回答结构完整，已经覆盖了关键背景、行动和结果。",
    coveredPoints,
    missingPoints,
  };
}

function collectExpectedKeywords(prepPack: SavedPrepPack, dimension: string) {
  const domainKeywords = prepPack.keySkills.slice(0, 3);
  const themeKeywords = prepPack.roleProfile.questionThemes.slice(0, 2);

  if (dimension === "基础能力") {
    return [...domainKeywords, "项目", "模块"];
  }

  if (dimension === "项目实战") {
    return [...themeKeywords, "指标", "结果"];
  }

  if (dimension === "工程质量") {
    return [...domainKeywords, "性能", "稳定性"];
  }

  return ["协作", "推进", "沟通", ...themeKeywords];
}

function buildFollowUpHint(dimension: string) {
  if (dimension === "基础能力") {
    return "请补充你负责的模块、关键技术选型以及最终结果。";
  }

  if (dimension === "项目实战") {
    return "请补充你的拆解思路、落地动作和可量化结果。";
  }

  if (dimension === "工程质量") {
    return "请补充你如何保证性能、稳定性或可维护性。";
  }

  return "请补充你如何和其他角色协作推进，以及遇到的阻力。";
}
