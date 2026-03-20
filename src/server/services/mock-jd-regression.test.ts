import { describe, expect, it } from "vitest";
import { mockJobDescriptions } from "../seeds/content-layer-data";

describe("mock JD seed data", function () {
  it("includes 27 seeded mock job descriptions", function () {
    expect(mockJobDescriptions).toHaveLength(27);
  });

  it("ensures each mock JD is long enough to exercise parsing", function () {
    expect(
      mockJobDescriptions.every(function hasUsefulBody(item) {
        return item.rawJD.trim().length >= 20;
      }),
    ).toBe(true);
  });
});
