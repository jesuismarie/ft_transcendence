/*
  Warnings:

  - You are about to drop the column `userId` on the `TotpSecret` table. All the data in the column will be lost.
  - Added the required column `userID` to the `TotpSecret` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "LoginTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TotpSecret" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userID" INTEGER NOT NULL,
    "secret" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TotpSecret" ("createdAt", "id", "secret", "updatedAt", "verified") SELECT "createdAt", "id", "secret", "updatedAt", "verified" FROM "TotpSecret";
DROP TABLE "TotpSecret";
ALTER TABLE "new_TotpSecret" RENAME TO "TotpSecret";
CREATE UNIQUE INDEX "TotpSecret_userID_key" ON "TotpSecret"("userID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "LoginTicket_userId_idx" ON "LoginTicket"("userId");

-- CreateIndex
CREATE INDEX "LoginTicket_expiresAt_idx" ON "LoginTicket"("expiresAt");
