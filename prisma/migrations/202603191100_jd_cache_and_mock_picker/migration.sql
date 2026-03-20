ALTER TABLE "JobTarget"
ADD COLUMN "normalizedJD" TEXT,
ADD COLUMN "jdHash" TEXT;

CREATE UNIQUE INDEX "JobTarget_jdHash_key" ON "JobTarget"("jdHash");
