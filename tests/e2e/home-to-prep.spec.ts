import { expect, test } from "@playwright/test";

test("anonymous user can open home page", async function ({ page }) {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "生成面试准备包" })).toBeVisible();
  await expect(page.getByRole("link", { name: "登录" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "岗位方向" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "职位描述" })).toBeVisible();
});
