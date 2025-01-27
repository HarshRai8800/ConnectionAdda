-- CreateTable
CREATE TABLE "userSchema" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT,
    "color" INTEGER,
    "profileSetup" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "userSchema_email_key" ON "userSchema"("email");
