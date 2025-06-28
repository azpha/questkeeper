import type { Request, Response, NextFunction } from "express";
import Auth from "../services/Auth";
import Schemas from "../utils/ZodSchemas";
import Environment from "../utils/Environment";

const IGDB_BASE_URL = "https://api.igdb.com/v4/";

async function SearchForGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameName = Schemas.igdb.search.parse(req.query.q);

    const twitchToken = await Auth.verifyAgainstTwitch();
    const game = await fetch(IGDB_BASE_URL + "games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": Environment!.IGDB_CLIENT_ID,
        Authorization: twitchToken as string,
      },
      body: `search "${gameName}"; fields name,slug,summary,websites.url;`,
    });

    if (game.ok) {
      const data = await game.json();
      console.log(data[0].websites);
      res.status(200).json({
        status: 200,
        data,
      });
    } else {
      console.log(await game.json());
      next(new Error("An error occurred while searching for that game"));
    }
  } catch (e) {
    next(e);
  }
}
async function GetGameBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const gameSlug = Schemas.igdb.getBySlug.parse(req.params.slug);

    const twitchToken = await Auth.verifyAgainstTwitch();
    const game = await fetch(IGDB_BASE_URL + "games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": Environment!.IGDB_CLIENT_ID,
        Authorization: twitchToken as string,
      },
      body: `where slug = "${gameSlug}"; fields name,summary,storyline,cover.url,first_release_date,genres.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.name,screenshots.url,platforms.name;`,
    });

    if (game.ok) {
      const data = await game.json();

      if (data[0]) {
        res.status(200).json({
          status: 200,
          game: data[0],
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "That game was not found",
        });
      }
    } else {
      console.log(await game.json());
      next(new Error("An error occurred while searching for that game"));
    }
  } catch (e) {
    next(e);
  }
}
async function SearchForSteamId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let steamIdOrIds = Schemas.games.steamIds.parse(req.query.ids);

    let filterString = ``;
    let steamIdsAsArray: string[] = [...steamIdOrIds.split(",")];

    if (steamIdsAsArray.length > 0) {
      for (const steamId of steamIdsAsArray) {
        if (filterString === "") {
          filterString += `where websites.url = *"https://store.steampowered.com/app/${steamId}" `;
        } else {
          filterString += `| websites.url = *"https://store.steampowered.com/app/${steamId}" `;
        }
      }
    }
    filterString += "; fields name;";

    const twitchToken = await Auth.verifyAgainstTwitch();
    const igdbResponse = await fetch(IGDB_BASE_URL + "games", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Client-ID": Environment!.IGDB_CLIENT_ID,
        Authorization: twitchToken,
      },
      body: filterString,
    });

    const data = await igdbResponse.json();
    res.status(200).json({
      status: 200,
      data,
    });
  } catch (e) {
    next(e);
  }
}

export default {
  SearchForGame,
  GetGameBySlug,
  SearchForSteamId,
};
