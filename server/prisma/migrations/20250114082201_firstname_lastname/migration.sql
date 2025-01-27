/*
  Warnings:

  - You are about to drop the column `username` on the `userSchema` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "userSchema" DROP COLUMN "username",
ADD COLUMN     "firstname" TEXT NOT NULL DEFAULT 'Jonny',
ADD COLUMN     "lastname" TEXT NOT NULL DEFAULT 'Deep';
