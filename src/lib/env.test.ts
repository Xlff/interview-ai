import { describe, expect, it } from "vitest";
import { env } from "./env";

describe("env", function () {
  it("normalizes wrapped quotes for runtime env values", function () {
    const previous = process.env.DATABASE_URL;

    process.env.DATABASE_URL = '"postgresql://user:pass@host:5432/db"';

    try {
      expect(env.databaseUrl()).toBe("postgresql://user:pass@host:5432/db");
    } finally {
      if (previous === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = previous;
      }
    }
  });

  it("encodes reserved characters in database credentials", function () {
    const previous = process.env.DATABASE_URL;

    process.env.DATABASE_URL = 'postgresql://user:pa#ss word@host:5432/db';

    try {
      expect(env.databaseUrl()).toBe("postgresql://user:pa%23ss%20word@host:5432/db");
    } finally {
      if (previous === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = previous;
      }
    }
  });
});
