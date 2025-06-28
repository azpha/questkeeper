/*
  Warnings:

  - Added the required column `developer` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisher` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenshotId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "developer" TEXT NOT NULL,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "platforms" TEXT[],
ADD COLUMN     "publisher" TEXT NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "screenshotId" TEXT NOT NULL;
