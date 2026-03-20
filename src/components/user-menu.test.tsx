import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import UserMenu from "./user-menu";

describe("UserMenu", function () {
  it("renders a sign-out form for authenticated users", function () {
    const html = renderToStaticMarkup(
      <UserMenu isAuthenticated userEmail="tester@example.com" />,
    );

    expect(html).toContain("tester@example.com");
    expect(html).toContain('action="/auth/sign-out"');
    expect(html).toContain("退出登录");
  });
});
