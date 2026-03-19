import type { JobTargetDraft, JobTargetDomain, JobTargetInput } from "@/features/job-target/models/job-target";
import { skillDictionaries } from "../seeds/content-layer-data";

const technicalKeywords = [
  "React",
  "Vue",
  "TypeScript",
  "Next.js",
  "Vite",
  "Webpack",
  "WebGL",
  "WebGPU",
  "前端",
  "后端",
  "全栈",
  "工程师",
];
const productKeywords = ["产品", "需求分析", "PRD", "路线图", "用户研究"];
const operationsKeywords = ["运营", "增长", "投放", "活动策划", "内容运营"];

const responsibilityKeywords = [
  "企业级 Web 应用开发",
  "复杂页面搭建",
  "性能优化",
  "组件设计",
  "前端工程化",
  "模块化开发",
  "数据大屏开发",
  "适配不同尺寸设备",
  "跨团队协作",
  "需求分析",
  "活动策划",
  "数据分析",
];

export function analyzeJobDescription(input: JobTargetInput): JobTargetDraft {
  const rawJD = input.rawJD.trim();
  const domain = detectDomain(rawJD, input.preferredDomain);

  return {
    normalizedTitle: detectTitle(rawJD, domain),
    domain,
    level: detectLevel(rawJD),
    keySkills: collectSkillMatches(rawJD, domain),
    responsibilities: collectMatches(rawJD, responsibilityKeywords),
  };
}

function detectDomain(rawJD: string, fallback: JobTargetDomain): JobTargetDomain {
  if (containsAny(rawJD, technicalKeywords)) {
    return "technical";
  }

  if (containsAny(rawJD, productKeywords)) {
    return "product";
  }

  if (containsAny(rawJD, operationsKeywords)) {
    return "operations";
  }

  return fallback;
}

function detectTitle(rawJD: string, domain: JobTargetDomain) {
  if (containsAny(rawJD, ["前端", "Frontend"])) {
    return "前端开发工程师";
  }

  if (containsAny(rawJD, ["后端", "Backend"])) {
    return "后端开发工程师";
  }

  if (containsAny(rawJD, ["全栈", "Full Stack"])) {
    return "全栈开发工程师";
  }

  if (domain === "product") {
    return "产品经理";
  }

  if (domain === "operations") {
    return "运营专员";
  }

  return "技术岗位";
}

function detectLevel(rawJD: string) {
  if (containsAny(rawJD, ["高级", "资深", "Senior"])) {
    return "高级";
  }

  if (containsAny(rawJD, ["专家", "Lead"])) {
    return "专家";
  }

  return "中级";
}

function collectMatches(rawJD: string, keywords: string[]) {
  const matches = keywords.filter(function hasKeyword(keyword) {
    return rawJD.toLowerCase().includes(keyword.toLowerCase());
  });

  return matches.length > 0 ? matches : ["待进一步解析"];
}

function collectSkillMatches(rawJD: string, domain: JobTargetDomain) {
  const availableSkills = skillDictionaries.filter(function matchesDomain(skill) {
    return skill.domain === domain;
  });

  const matches = availableSkills
    .filter(function hasAnyAlias(skill) {
      return [skill.name, ...skill.aliases].some(function hasKeyword(keyword) {
        return rawJD.toLowerCase().includes(keyword.toLowerCase());
      });
    })
    .map(function toCanonicalName(skill) {
      return skill.name;
    });

  return matches.length > 0 ? matches : ["待进一步解析"];
}

function containsAny(rawJD: string, keywords: string[]) {
  return keywords.some(function hasKeyword(keyword) {
    return rawJD.toLowerCase().includes(keyword.toLowerCase());
  });
}
