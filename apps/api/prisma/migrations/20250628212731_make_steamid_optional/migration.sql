-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "matchedSteamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "steamId" DROP NOT NULL;
