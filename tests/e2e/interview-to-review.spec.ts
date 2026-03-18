import { expect, test } from "@playwright/test";

test("anonymous user can finish an interview and open the review report", async function ({
  page,
}) {
  await page.goto("/");

  await page.getByRole("textbox", { name: "职位描述" }).fill(
    [
      "高级前端开发工程师",
      "负责企业级 Web 应用开发、性能优化和跨团队协作。",
      "要求熟悉 React、TypeScript、Next.js，有复杂项目拆解经验。",
    ].join("\n"),
  );

  await page.getByRole("button", { name: "生成岗位目标" }).click();

  await page.waitForURL(/\/prep\/.+/);
  await page.getByRole("button", { name: "开始 10 分钟文字面试" }).click();
  await page.waitForURL(/\/interview\/.+/);

  const strongAnswer =
    "我负责核心首屏链路，用 React、TypeScript 和 Next.js 交付复杂模块，拆解性能瓶颈并和设计、后端协作，最终把关键页面性能提升了 30%，稳定性和业务结果都有明显改善。";

  for (let round = 0; round < 6; round += 1) {
    await page.getByRole("textbox", { name: "你的回答" }).fill(strongAnswer);
    await page.getByRole("button", { name: "提交回答，进入下一题" }).click();

    if (round < 5) {
      await page
        .getByText(new RegExp(`第 ${Math.min(round + 2, 6)} / 6 轮|本轮文字面试已完成`))
        .waitFor();
    }
  }

  await expect(page.getByRole("heading", { name: "本轮文字面试已完成" })).toBeVisible();
  await page.getByRole("link", { name: "查看复盘报告" }).click();

  await page.waitForURL(/\/review\/.+/);
  await expect(page.getByRole("heading", { name: /面试复盘/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "优势表现" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "下一步复习计划" })).toBeVisible();
});
