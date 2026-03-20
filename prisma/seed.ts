import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import {
  mockJobDescriptions,
  questionBankItems,
  roleConfigs,
  roleTemplates,
  skillDictionaries,
} from "../src/server/seeds/content-layer-data";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString,
});

const db = new PrismaClient({
  adapter: new PrismaPg(pool),
});

function buildTemplateKey(input: {
  domain: string;
  normalizedTitle: string;
  level: string;
}) {
  return `${input.domain}:${input.normalizedTitle}:${input.level}`;
}

async function main() {
  await db.reviewReport.deleteMany();
  await db.interviewTurn.deleteMany();
  await db.interviewSession.deleteMany();
  await db.prepPack.deleteMany();
  await db.roleProfile.deleteMany();
  await db.jobTarget.deleteMany();

  await db.roleConfig.deleteMany();
  await db.roleTemplate.deleteMany();
  await db.questionBankItem.deleteMany();
  await db.mockJobDescription.deleteMany();
  await db.skillDictionary.deleteMany();

  await db.skillDictionary.createMany({
    data: skillDictionaries,
  });

  const templateIdByKey = new Map<string, string>();

  for (const template of roleTemplates) {
    const record = await db.roleTemplate.create({
      data: template,
    });

    templateIdByKey.set(buildTemplateKey(template), record.id);
  }

  for (const config of roleConfigs) {
    const templateKey = buildTemplateKey(config);
    const roleTemplateId = templateIdByKey.get(templateKey);

    if (!roleTemplateId) {
      throw new Error(`Missing role template for config: ${templateKey}`);
    }

    await db.roleConfig.create({
      data: {
        roleTemplateId,
        mustHaveSkillIds: config.mustHaveSkillIds,
        niceToHaveSkillIds: config.niceToHaveSkillIds,
        questionSelectionRules: config.questionSelectionRules,
        prepPackRules: config.prepPackRules,
        isActive: config.isActive,
      },
    });
  }

  await db.questionBankItem.createMany({
    data: questionBankItems,
  });

  await db.mockJobDescription.createMany({
    data: mockJobDescriptions,
  });

  console.log(
    JSON.stringify(
      {
        skills: skillDictionaries.length,
        roleTemplates: roleTemplates.length,
        roleConfigs: roleConfigs.length,
        questionBankItems: questionBankItems.length,
        mockJobDescriptions: mockJobDescriptions.length,
      },
      null,
      2,
    ),
  );
}

main()
  .catch(async function handleError(error) {
    console.error(error);
    await db.$disconnect();
    await pool.end();
    process.exit(1);
  })
  .finally(async function cleanup() {
    await db.$disconnect();
    await pool.end();
  });
