import { describe, expect, it } from "vitest";
import { analyzeJobDescription } from "./jd-analysis-service";

describe("analyzeJobDescription", function () {
  it("extracts a normalized technical role from a frontend jd", function () {
    const draft = analyzeJobDescription({
      rawJD: `
        我们正在招聘高级前端开发工程师，负责企业级 Web 应用开发。
        需要熟练掌握 React、TypeScript、Next.js，能够负责复杂页面搭建、
        性能优化、组件设计和跨团队协作，有 3-5 年相关经验。
      `,
      preferredDomain: "technical",
    });

    expect(draft.normalizedTitle).toBe("前端开发工程师");
    expect(draft.domain).toBe("technical");
    expect(draft.level).toBe("高级");
    expect(draft.keySkills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Next.js"]),
    );
    expect(draft.responsibilities).toEqual(
      expect.arrayContaining(["企业级 Web 应用开发", "性能优化", "跨团队协作"]),
    );
  });

  it("maps skill aliases back to canonical dictionary names", function () {
    const draft = analyzeJobDescription({
      rawJD: `
        负责增长业务前端开发，要求熟悉 react.js、ts 和 next，
        能够推进复杂页面开发、性能优化，并与后端保持跨团队协作。
      `,
      preferredDomain: "technical",
    });

    expect(draft.keySkills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Next.js"]),
    );
  });

  it("extracts richer frontend and visualization skills from a detailed jd", function () {
    const draft = analyzeJobDescription({
      rawJD: `
        熟练掌握JavaScript/TypeScript/HTML/CSS，熟悉W3C标准和ES规范。
        熟练掌握Vue3或React技术栈，了解其原理，能够编写高效易维护的前端代码。
        熟悉前端工程化与模块化开发流程，如Vite和Webpack等。
        有WebGIS和音视频相关工作经验优先。
        熟悉数据大屏开发，能够适配不同尺寸设备。
        了解Three.js、WebGL、WebGPU等3D图形可视化技术。
        具备良好的团队合作精神和沟通能力。
        热爱技术，持续关注Web开发领域的前沿技术。
      `,
      preferredDomain: "technical",
    });

    expect(draft.keySkills).toEqual(
      expect.arrayContaining([
        "JavaScript",
        "TypeScript",
        "HTML/CSS",
        "Vue 3",
        "React",
        "Vite",
        "Webpack",
        "WebGIS",
        "音视频",
        "数据大屏",
        "Three.js",
        "WebGL",
        "WebGPU",
        "沟通协作",
      ]),
    );
  });
});
