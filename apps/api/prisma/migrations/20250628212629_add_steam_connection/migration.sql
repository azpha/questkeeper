/*
  Warnings:

  - Added the required column `matchedSteamId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steamId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "matchedSteamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "steamId" TEXT NOT NULL;
