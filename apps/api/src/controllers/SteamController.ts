import type { Request, Response, NextFunction } from "express";
import Environment from "../utils/Environment";
import Database from "../services/Database";

const STEAM_BASE_URL = "https://api.steampowered.com/";
const IGDB_BASE_URL = "https://api.igdb.com/v4/";

async function FetchUserGames(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await Database.user.findFirst({
      where: {
        id: req.user?.userId,
      },
    });

    // get games from steam
    const steamResponse = await fetch(
      STEAM_BASE_URL +
        `IPlayerService/GetOwnedGames/v0001?key=${Environment!.STEAM_API_KEY}&steamid=${user?.steamId}&format=json`
    );

    if (steamResponse.ok) {
      const data = await steamResponse.json();

      res.status(200).json({
        status: 200,
        games: data.response.games,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "Failed to fetch Steam library",
      });
    }
  } catch (e) {
    next(e);
  }
}

export default {
  FetchUserGames,
};
