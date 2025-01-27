/*
  Warnings:

  - The values [text,file] on the enum `msgType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "msgType_new" AS ENUM ('contact', 'channel');
ALTER TABLE "messageSchema" ALTER COLUMN "messageType" TYPE "msgType_new" USING ("messageType"::text::"msgType_new");
ALTER TYPE "msgType" RENAME TO "msgType_old";
ALTER TYPE "msgType_new" RENAME TO "msgType";
DROP TYPE "msgType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "messageSchema" DROP CONSTRAINT "messageSchema_recipientId_fkey";

-- AlterTable
ALTER TABLE "messageSchema" ADD COLUMN     "channelId" INTEGER,
ALTER COLUMN "recipientId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "messageSchema_channelId_idx" ON "messageSchema"("channelId");

-- AddForeignKey
ALTER TABLE "messageSchema" ADD CONSTRAINT "messageSchema_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "userSchema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messageSchema" ADD CONSTRAINT "messageSchema_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channelSchema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
