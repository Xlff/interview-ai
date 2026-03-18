import { expect, test } from "@playwright/test";

test("anonymous user can open home page", async function ({ page }) {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "生成面试准备包" })).toBeVisible();
  await expect(page.getByRole("link", { name: "登录" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "岗位方向" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "职位描述" })).toBeVisible();
});

test("anonymous user can submit a jd and land on the prep pack page", async function ({
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
  await expect(page.getByRole("heading", { name: /岗位准备包/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "高频问题" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "复习提纲" })).toBeVisible();
});
