/*
  Warnings:

  - The primary key for the `Contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `personId` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_pkey",
DROP COLUMN "personId",
ADD COLUMN     "index" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "Contact_pkey" PRIMARY KEY ("index");
DROP SEQUENCE "Contact_id_seq";
