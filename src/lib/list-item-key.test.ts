import { describe, expect, it } from "vitest";
import { getListItemKey } from "./list-item-key";

describe("getListItemKey", function () {
  it("returns unique keys for duplicate values in the same list", function () {
    const values = ["性能优化", "性能优化", "系统设计"];
    const keys = values.map(function buildKey(value, index) {
      return getListItemKey(value, index);
    });

    expect(new Set(keys).size).toBe(keys.length);
  });

  it("keeps keys stable for the same value and index", function () {
    expect(getListItemKey("React", 2)).toBe("2:React");
  });
});
