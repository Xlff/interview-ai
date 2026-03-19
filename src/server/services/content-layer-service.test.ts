import { describe, expect, it } from "vitest";
import { roleConfigs, roleTemplates } from "../seeds/content-layer-data";
import {
  resolveRoleConfig,
  resolveRoleTemplate,
} from "./content-layer-service";

describe("content layer service", function () {
  it("resolves an exact domain, title, and level template", function () {
    const template = resolveRoleTemplate(
      {
        domain: "technical",
        normalizedTitle: "前端开发工程师",
        level: "中级",
      },
      roleTemplates,
    );

    expect(template?.level).toBe("中级");
    expect(template?.normalizedTitle).toBe("前端开发工程师");
  });

  it("falls back to the nearest available level when the input level is non-standard", function () {
    const template = resolveRoleTemplate(
      {
        domain: "technical",
        normalizedTitle: "前端开发工程师",
        level: "专家",
      },
      roleTemplates,
    );

    expect(template?.normalizedTitle).toBe("前端开发工程师");
    expect(template?.level).toBe("高级");
  });

  it("resolves the matching role config for a selected template", function () {
    const template = resolveRoleTemplate(
      {
        domain: "operations",
        normalizedTitle: "增长运营",
        level: "中级",
      },
      roleTemplates,
    );

    const config = resolveRoleConfig(template, roleConfigs);

    expect(config?.questionSelectionRules.maxQuestions).toBe(4);
    expect(config?.questionSelectionRules.preferredDimensions).toContain("增长策略");
    expect(config?.mustHaveSkillIds).toContain("增长实验");
  });
});
