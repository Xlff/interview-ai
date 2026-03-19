-- CreateTable
CREATE TABLE "SkillDictionary" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" JSONB NOT NULL,
    "domain" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleTemplate" (
    "id" UUID NOT NULL,
    "domain" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "dimensions" JSONB NOT NULL,
    "defaultQuestionThemes" JSONB NOT NULL,
    "defaultEvaluationPoints" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleConfig" (
    "id" UUID NOT NULL,
    "roleTemplateId" UUID NOT NULL,
    "mustHaveSkillIds" JSONB NOT NULL,
    "niceToHaveSkillIds" JSONB NOT NULL,
    "questionSelectionRules" JSONB NOT NULL,
    "prepPackRules" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionBankItem" (
    "id" UUID NOT NULL,
    "domain" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "skillTags" JSONB NOT NULL,
    "evaluationPoints" JSONB NOT NULL,
    "followUpHints" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionBankItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockJobDescription" (
    "id" UUID NOT NULL,
    "domain" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "rawJD" TEXT NOT NULL,
    "isSeed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockJobDescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkillDictionary_domain_name_key" ON "SkillDictionary"("domain", "name");

-- CreateIndex
CREATE UNIQUE INDEX "RoleTemplate_domain_normalizedTitle_level_key" ON "RoleTemplate"("domain", "normalizedTitle", "level");

-- CreateIndex
CREATE UNIQUE INDEX "RoleConfig_roleTemplateId_key" ON "RoleConfig"("roleTemplateId");

-- CreateIndex
CREATE INDEX "QuestionBankItem_domain_normalizedTitle_level_idx" ON "QuestionBankItem"("domain", "normalizedTitle", "level");

-- CreateIndex
CREATE INDEX "MockJobDescription_domain_normalizedTitle_level_idx" ON "MockJobDescription"("domain", "normalizedTitle", "level");

-- AddForeignKey
ALTER TABLE "RoleConfig" ADD CONSTRAINT "RoleConfig_roleTemplateId_fkey" FOREIGN KEY ("roleTemplateId") REFERENCES "RoleTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
