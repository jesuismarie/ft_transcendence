/*
  Warnings:

  - You are about to drop the column `userID` on the `TotpSecret` table. All the data in the column will be lost.
  - Added the required column `userId` to the `TotpSecret` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TotpSecret" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "secret" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TotpSecret" ("createdAt", "id", "secret", "updatedAt", "verified") SELECT "createdAt", "id", "secret", "updatedAt", "verified" FROM "TotpSecret";
DROP TABLE "TotpSecret";
ALTER TABLE "new_TotpSecret" RENAME TO "TotpSecret";
CREATE UNIQUE INDEX "TotpSecret_userId_key" ON "TotpSecret"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
