/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `userSchema` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL DEFAULT 'Contact',
    "lastname" TEXT NOT NULL DEFAULT 'User',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_personId_key" ON "Contact"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userSchema_id_key" ON "userSchema"("id");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
