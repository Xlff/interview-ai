import { describe, expect, it } from "vitest";
import { questionBankItems } from "../seeds/content-layer-data";
import { selectTopQuestions } from "./question-selection-service";

describe("selectTopQuestions", function () {
  it("prioritizes exact title, level, and skill overlap when selecting questions", function () {
    const selected = selectTopQuestions({
      domain: "technical",
      normalizedTitle: "前端开发工程师",
      level: "中级",
      matchedSkills: ["React", "Next.js", "TypeScript"],
      preferredDimensions: ["项目实战", "工程质量"],
      maxQuestions: 3,
      questionBankItems,
    });

    expect(selected).toHaveLength(3);
    expect(selected[0]?.level).toBe("中级");
    expect(selected[0]?.normalizedTitle).toBe("前端开发工程师");
    expect(selected[0]?.skillTags).toEqual(
      expect.arrayContaining(["React"]),
    );
  });

  it("filters out questions from other domains", function () {
    const selected = selectTopQuestions({
      domain: "product",
      normalizedTitle: "产品经理",
      level: "中级",
      matchedSkills: ["需求分析", "数据分析"],
      preferredDimensions: ["问题定义"],
      maxQuestions: 4,
      questionBankItems,
    });

    expect(
      selected.every(function isProductQuestion(item) {
        return item.domain === "product";
      }),
    ).toBe(true);
  });
});
