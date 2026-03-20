import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, create } = vi.hoisted(function createMocks() {
  return {
    findUnique: vi.fn(),
    create: vi.fn(),
  };
});

vi.mock("@/lib/db", function () {
  return {
    db: {
      user: {
        findUnique,
        create,
      },
    },
  };
});

import { getOrCreateLocalUserByEmail } from "./auth-user-repository";

describe("getOrCreateLocalUserByEmail", function () {
  beforeEach(function resetMocks() {
    findUnique.mockReset();
    create.mockReset();
  });

  it("creates a local user when the email does not exist", async function () {
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({
      id: "user-1",
      email: "tester@example.com",
    });

    const user = await getOrCreateLocalUserByEmail("tester@example.com");

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        email: "tester@example.com",
      },
    });
    expect(create).toHaveBeenCalledWith({
      data: {
        email: "tester@example.com",
      },
    });
    expect(user.email).toBe("tester@example.com");
  });

  it("reuses the existing local user when the email already exists", async function () {
    findUnique.mockResolvedValue({
      id: "user-2",
      email: "tester@example.com",
    });

    const user = await getOrCreateLocalUserByEmail("tester@example.com");

    expect(create).not.toHaveBeenCalled();
    expect(user.id).toBe("user-2");
  });
});
