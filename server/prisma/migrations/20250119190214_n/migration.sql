/*
  Warnings:

  - You are about to drop the column `members` on the `channelSchema` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "channelSchema" DROP CONSTRAINT "channelSchema_members_fkey";

-- AlterTable
ALTER TABLE "channelSchema" DROP COLUMN "members";

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_channelrelation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_channelrelation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_channelrelation_B_index" ON "_channelrelation"("B");

-- AddForeignKey
ALTER TABLE "_channelrelation" ADD CONSTRAINT "_channelrelation_A_fkey" FOREIGN KEY ("A") REFERENCES "channelSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelrelation" ADD CONSTRAINT "_channelrelation_B_fkey" FOREIGN KEY ("B") REFERENCES "userSchema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
