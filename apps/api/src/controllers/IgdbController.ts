import type { Request, Response, NextFunction } from "express";
import Auth from "../services/Auth";
import Schemas from "../utils/ZodSchemas";
import Environment from "../utils/Environment";
import { IGDBGameAddition } from "../utils/Types";

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
      body: `search "${gameName}"; fields name,slug,summary;`,
    });

    if (game.ok) {
      const data = await game.json();
      console.log(data[0].websites);

      res.status(200).json({
        status: 200,
        games: data.map((v: IGDBGameAddition) => {
          return {
            id: v.id,
            title: v.name,
            gameSlug: v.slug,
            summary: v.summary,
          };
        }),
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
        const game = data[0] as IGDBGameAddition;
        res.status(200).json({
          status: 200,
          game: {
            id: game?.id,
            title: game?.name,
            summary: game?.summary,
            coverUrl:
              "https:" + game?.cover?.url.replace("t_thumb", "t_cover_big"),
            storyline: game?.storyline,
            screenshotUrls: game?.screenshots?.map(
              (v) => "https:" + v.url.replace("t_thumb", "t_cover_big")
            ),
            releaseDate: new Date(game?.first_release_date * 1000),
            genres: game?.genres?.map((v) => v.name),
            platforms: game?.platforms?.map((v) => v.name),
            developer:
              game?.involved_companies?.filter((v) => v.developer)[0]?.company
                ?.name || "Not Found",
            publisher:
              game?.involved_companies?.filter((v) => v.publisher)[0]?.company
                ?.name || "Not Found",
          },
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

    let filterString = "";
    let steamIdsAsArray: string[] = [...steamIdOrIds.split(",")];
    let steamUrls: string[] = [];

    if (steamIdsAsArray.length > 0) {
      for (const steamId of steamIdsAsArray) {
        steamUrls.push(`websites.url = *"${steamId}"*`);
      }

      filterString += steamUrls.join(" | ");
    }
    filterString += "; fields name,slug,summary;";

    const twitchToken = await Auth.verifyAgainstTwitch();
    const igdbResponse = await fetch(IGDB_BASE_URL + "games", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Client-ID": Environment!.IGDB_CLIENT_ID,
        Authorization: twitchToken,
      },
      body: `where ${filterString}`,
    });

    const data = (await igdbResponse.json()) as IGDBGameAddition[];
    res.status(200).json({
      status: 200,
      games: data.map((v) => {
        return {
          id: v.id,
          title: v.name,
          gameSlug: v.slug,
          summary: v.summary,
        };
      }),
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
