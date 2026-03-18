import { describe, expect, it } from "vitest";
import { buildRoleProfile } from "./role-profile-service";

describe("buildRoleProfile", function () {
  it("maps a technical job target into interview dimensions and themes", function () {
    const profile = buildRoleProfile({
      normalizedTitle: "前端开发工程师",
      domain: "technical",
      level: "高级",
      keySkills: ["React", "TypeScript", "Next.js"],
      responsibilities: ["企业级 Web 应用开发", "性能优化", "跨团队协作"],
    });

    expect(profile.dimensions).toEqual(
      expect.arrayContaining(["基础能力", "项目实战", "工程质量", "协作沟通"]),
    );
    expect(profile.mustHaveSkills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Next.js"]),
    );
    expect(profile.questionThemes).toEqual(
      expect.arrayContaining(["组件设计", "性能优化", "复杂项目拆解"]),
    );
  });
});
