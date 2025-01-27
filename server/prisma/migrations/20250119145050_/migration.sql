/*
  Warnings:

  - Added the required column `admin` to the `channelSchema` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channelSchema" ADD COLUMN     "admin" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "channelSchema" ADD CONSTRAINT "channelSchema_admin_fkey" FOREIGN KEY ("admin") REFERENCES "userSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
