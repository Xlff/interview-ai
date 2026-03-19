import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("supabase browser client env access", function () {
  it("reads NEXT_PUBLIC env vars directly so Next can inline them in client bundles", function () {
    const source = readFileSync(
      resolve(process.cwd(), "src/lib/supabase/browser.ts"),
      "utf8",
    );

    expect(source).toContain("process.env.NEXT_PUBLIC_SUPABASE_URL");
    expect(source).toContain("process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
  });
});
