/*
  Warnings:

  - You are about to drop the column `expLevel` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `trophies` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "expLevel",
DROP COLUMN "trophies",
ADD COLUMN     "rawDetails" JSONB;
