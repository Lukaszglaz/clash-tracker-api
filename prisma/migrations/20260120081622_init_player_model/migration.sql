/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `townHall` on the `Player` table. All the data in the column will be lost.
  - Added the required column `expLevel` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `townHallLevel` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trophies` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "createdAt",
DROP COLUMN "townHall",
ADD COLUMN     "expLevel" INTEGER NOT NULL,
ADD COLUMN     "townHallLevel" INTEGER NOT NULL,
ADD COLUMN     "trophies" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
