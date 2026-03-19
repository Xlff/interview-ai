import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("core interview schema", function () {
  it("defines the required persistence models", function () {
    const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

    expect(schema).toContain("model JobTarget");
    expect(schema).toContain("model RoleProfile");
    expect(schema).toContain("model PrepPack");
    expect(schema).toContain("model InterviewSession");
    expect(schema).toContain("model InterviewTurn");
    expect(schema).toContain("model ReviewReport");
  });

  it("defines the content layer persistence models", function () {
    const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

    expect(schema).toContain("model SkillDictionary");
    expect(schema).toContain("model RoleTemplate");
    expect(schema).toContain("model RoleConfig");
    expect(schema).toContain("model QuestionBankItem");
    expect(schema).toContain("model MockJobDescription");
  });

  it("stores one prep pack per job target", function () {
    const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

    expect(schema).toContain("prepPack        PrepPack?");
    expect(schema).toContain("jobTargetId      String    @unique @db.Uuid");
  });

  it("stores normalized jd cache fields on job targets", function () {
    const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

    expect(schema).toContain("normalizedJD");
    expect(schema).toContain("jdHash");
  });

  it("stores session ownership and focused retry fields", function () {
    const schema = readFileSync(resolve(process.cwd(), "prisma/schema.prisma"), "utf8");

    expect(schema).toContain("model InterviewSession");
    expect(schema).toContain("userId");
    expect(schema).toContain("focusDimensions Json?");
  });
});
