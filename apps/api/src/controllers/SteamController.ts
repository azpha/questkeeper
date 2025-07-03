import type { Request, Response, NextFunction } from "express";
import Environment from "../utils/Environment";
import Database from "../services/Database";
import { SteamGame } from "../utils/Types";

const STEAM_BASE_URL = "https://api.steampowered.com/";

async function FetchUserGames(req: Request, res: Response, next: NextFunction) {
  try {
    if (!Environment!.STEAM_API_KEY) {
      res.status(400).json({
        status: 400,
        message: "No Steam API key provided",
      });
      return;
    }

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
        games: data.response.games.sort((a: SteamGame, b: SteamGame) => {
          if (a.appid < b.appid) {
            return 1;
          } else if (a.appid > b.appid) {
            return -1;
          }
          return 0;
        }),
      });
    } else {
      console.log(await steamResponse.json());
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
