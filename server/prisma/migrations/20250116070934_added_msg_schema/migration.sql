-- CreateEnum
CREATE TYPE "msgType" AS ENUM ('text', 'file');

-- AlterTable
ALTER TABLE "userSchema" ADD CONSTRAINT "userSchema_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "messageSchema" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "messageType" "msgType" NOT NULL,
    "content" BOOLEAN NOT NULL,
    "fileUrl" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messageSchema_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messageSchema" ADD CONSTRAINT "messageSchema_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "userSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messageSchema" ADD CONSTRAINT "messageSchema_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "userSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
