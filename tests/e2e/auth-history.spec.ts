import { expect, test } from "@playwright/test";

test("history page asks anonymous users to log in", async function ({ page }) {
  await page.goto("/history");

  await expect(page.getByRole("heading", { name: "登录后查看你的练习记录" })).toBeVisible();
  await expect(page.getByRole("link", { name: "去登录" })).toBeVisible();
});
