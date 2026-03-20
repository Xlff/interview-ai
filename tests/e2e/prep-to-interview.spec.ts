import { expect, test } from "@playwright/test";

test("anonymous user can start a text interview from the prep pack", async function ({ page }) {
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
  await expect(page.getByRole("heading", { name: /文字面试/ })).toBeVisible();
  await expect(page.getByText(/当前考察维度/)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "你的回答" })).toBeVisible();
});

test("anonymous user can submit an answer and advance the interview", async function ({ page }) {
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
  await page.getByRole("textbox", { name: "你的回答" }).fill(
    "我负责核心首屏链路，用 React、TypeScript 和 Next.js 交付复杂模块，并把关键页面性能提升了 30%。",
  );
  await page.getByRole("button", { name: "提交回答，进入下一题" }).click();

  await expect(page.getByText("第 2 / 6 轮")).toBeVisible();
  await expect(page.getByText(/面试官观察：/)).toBeVisible();
});
