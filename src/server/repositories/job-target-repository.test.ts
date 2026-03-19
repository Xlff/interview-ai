import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobTargetDraft } from "@/features/job-target/models/job-target";

const { findUnique, create } = vi.hoisted(function createMocks() {
  return {
    findUnique: vi.fn(),
    create: vi.fn(),
  };
});

vi.mock("@/lib/db", function () {
      return {
        db: {
          jobTarget: {
        findUnique,
        create,
      },
    },
  };
});

import { createJobTarget } from "./job-target-repository";

describe("createJobTarget", function () {
  const draft: JobTargetDraft = {
    normalizedTitle: "前端开发工程师",
    domain: "technical",
    level: "中级",
    keySkills: ["React", "TypeScript", "Next.js"],
    responsibilities: ["性能优化", "跨团队协作"],
  };

  beforeEach(function resetMocks() {
    findUnique.mockReset();
    create.mockReset();
  });

  it("reuses an existing job target when the normalized jd hash matches", async function () {
    findUnique.mockResolvedValue({
      id: "job-target-1",
      rawJD: "高级前端开发工程师，负责 React、TypeScript、Next.js 项目开发；需要推进性能优化。",
      normalizedTitle: "前端开发工程师",
      domain: "technical",
      level: "中级",
      keySkills: ["React", "TypeScript", "Next.js"],
      responsibilities: ["性能优化", "跨团队协作"],
      createdAt: new Date("2026-03-19T00:00:00.000Z"),
    });

    const saved = await createJobTarget(
      "高级前端开发工程师 负责 react、typescript、next.js 项目开发; 需要推进性能优化。",
      draft,
      "technical",
    );

    expect(findUnique).toHaveBeenCalledOnce();
    expect(create).not.toHaveBeenCalled();
    expect(saved.id).toBe("job-target-1");
  });

  it("reads the existing job target after a concurrent unique-key conflict", async function () {
    findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "job-target-2",
        rawJD: "高级前端开发工程师，负责 React、TypeScript、Next.js 项目开发；需要推进性能优化。",
        normalizedTitle: "前端开发工程师",
        domain: "technical",
        level: "中级",
        keySkills: ["React", "TypeScript", "Next.js"],
        responsibilities: ["性能优化", "跨团队协作"],
        createdAt: new Date("2026-03-19T00:00:00.000Z"),
      });
    create.mockRejectedValue({
      code: "P2002",
    });

    const saved = await createJobTarget(
      "高级前端开发工程师 负责 react、typescript、next.js 项目开发; 需要推进性能优化。",
      draft,
      "technical",
    );

    expect(create).toHaveBeenCalledOnce();
    expect(findUnique).toHaveBeenCalledTimes(2);
    expect(saved.id).toBe("job-target-2");
  });
});
