import { expect, test } from "@playwright/test";

test("anonymous user can open home page", async function ({ page }) {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "生成面试准备包" })).toBeVisible();
  await expect(page.getByRole("link", { name: "登录" })).toBeVisible();
  await expect(page.getByLabel("岗位方向", { exact: true })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "JD 识别结果" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "高频问题" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "复习提纲" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "识别职责" })).toBeVisible();
});

test("anonymous user can choose a mock jd template and edit it", async function ({ page }) {
  await page.goto("/");

  await page.getByRole("combobox", { name: "示例 JD 模板" }).selectOption({ index: 1 });

  await expect(page.getByRole("textbox", { name: "职位描述" })).not.toHaveValue("");
  await page.getByRole("textbox", { name: "职位描述" }).fill(
    "这是用户在 mock JD 基础上手动调整后的职位描述，补充了更多真实业务背景。",
  );
  await expect(page.getByRole("textbox", { name: "职位描述" })).toHaveValue(
    "这是用户在 mock JD 基础上手动调整后的职位描述，补充了更多真实业务背景。",
  );
});

test("anonymous user can filter mock jd templates by domain and level before selecting", async function ({
  page,
}) {
  await page.goto("/");

  await page.getByRole("combobox", { name: "示例岗位方向" }).selectOption("product");
  await page.getByRole("combobox", { name: "示例级别" }).selectOption("高级");
  await page.getByRole("combobox", { name: "示例 JD 模板" }).selectOption({
    label: "产品经理 · 高级 · sr-pm-strategy",
  });

  await expect(page.getByRole("textbox", { name: "职位描述" })).toHaveValue(
    /负责业务核心方向的产品策略制定与复杂项目推进/,
  );
  await expect(page.getByLabel("岗位方向", { exact: true })).toHaveValue("product");
});
