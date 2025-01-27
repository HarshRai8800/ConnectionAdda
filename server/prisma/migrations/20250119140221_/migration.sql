-- CreateTable
CREATE TABLE "channelSchema" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "members" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channelSchema_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "channelSchema" ADD CONSTRAINT "channelSchema_members_fkey" FOREIGN KEY ("members") REFERENCES "userSchema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
