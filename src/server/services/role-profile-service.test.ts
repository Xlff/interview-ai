import { describe, expect, it } from "vitest";
import { roleConfigs, roleTemplates } from "../seeds/content-layer-data";
import { buildRoleProfile } from "./role-profile-service";

describe("buildRoleProfile", function () {
  it("builds a role profile from the selected template and config", function () {
    const roleTemplate = roleTemplates.find(function matchesTemplate(template) {
      return (
        template.domain === "technical" &&
        template.normalizedTitle === "前端开发工程师" &&
        template.level === "高级"
      );
    });

    const roleConfig = roleConfigs.find(function matchesConfig(config) {
      return (
        config.domain === "technical" &&
        config.normalizedTitle === "前端开发工程师" &&
        config.level === "高级"
      );
    });

    const profile = buildRoleProfile({
      normalizedTitle: "前端开发工程师",
      domain: "technical",
      level: "高级",
      keySkills: ["React", "TypeScript", "Next.js"],
      responsibilities: ["企业级 Web 应用开发", "性能优化", "跨团队协作"],
    }, roleTemplate!, roleConfig!);

    expect(profile.dimensions).toEqual(
      expect.arrayContaining(["架构设计", "复杂项目", "工程治理", "跨团队影响力"]),
    );
    expect(profile.mustHaveSkills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Next.js"]),
    );
    expect(profile.niceToHaveSkills).toEqual(
      expect.arrayContaining(["Node.js", "SQL"]),
    );
    expect(profile.questionThemes).toEqual(
      expect.arrayContaining(["架构演进", "性能治理", "项目带动"]),
    );
  });
});
