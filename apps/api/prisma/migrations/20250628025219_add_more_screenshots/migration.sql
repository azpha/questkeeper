/*
  Warnings:

  - You are about to drop the column `screenshotId` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "screenshotId",
ADD COLUMN     "screenshotIds" TEXT[];
