-- AlterTable
ALTER TABLE "InterviewSession" ADD COLUMN     "focusDimensions" JSONB,
ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
