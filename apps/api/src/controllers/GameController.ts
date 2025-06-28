import Schemas from "../utils/ZodSchemas";
import Database from "../services/Database";
import Auth from "../services/Auth";
import Environment from "../utils/Environment";
import FetchUtils from "../utils/FetchUtils";
import type { IGDBGameAddition } from "../utils/Types";
import type { Request, Response, NextFunction } from "express";

const IGDB_BASE_URL = "https://api.igdb.com/v4/";

async function GetGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameSlug = Schemas.games.get.parse(req.params.id);

    const game = await Database.game.findFirst({
      where: {
        gameSlug,
        userId: req.user?.userId,
      },
    });

    res.status(200).json({
      status: 200,
      game,
    });
  } catch (e) {
    next(e);
  }
}
async function GetAllAddedGameSlugs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const slugs = await Database.game.findMany({
      select: {
        gameSlug: true,
      },
    });

    res.status(200).json({
      status: 200,
      slugs: slugs.map((v) => v.gameSlug),
    });
  } catch (e) {
    next(e);
  }
}
async function GetManyGames(req: Request, res: Response, next: NextFunction) {
  try {
    const games = await Database.game.findMany({
      where: {
        userId: req.user?.userId,
      },
    });

    res.status(200).json({
      status: 200,
      games,
    });
  } catch (e) {
    next(e);
  }
}
async function AddGame(req: Request, res: Response, next: NextFunction) {
  try {
    const body = Schemas.games.create.parse(req.body);

    const doesExist = await Database.game.findFirst({
      where: {
        gameSlug: body.gameSlug,
      },
    });

    if (doesExist) {
      res.status(409).json({
        status: 409,
        message: "Game already saved",
      });
      return;
    }

    const twitchToken = await Auth.verifyAgainstTwitch();
    const igdbResponse = await fetch(IGDB_BASE_URL + "games", {
      method: "post",
      headers: {
        Authorization: twitchToken,
        "Client-ID": Environment!.IGDB_CLIENT_ID,
        Accept: "application/json",
      },
      body: `where slug = "${body.gameSlug}"; fields name,summary,storyline,cover.url,first_release_date,genres.name,involved_companies.developer,involved_companies.publisher,involved_companies.company.name,screenshots.url,platforms.name;`,
    });

    if (igdbResponse.ok) {
      const igdbData = await igdbResponse.json();
      if (igdbData.length > 0) {
        console.log(igdbData, body);
        const {
          cover,
          summary,
          screenshots,
          involved_companies,
          platforms,
          storyline,
          first_release_date,
          genres,
          name: title,
        } = igdbData[0] as IGDBGameAddition;

        let screenshotIds = [];
        const coverId = await FetchUtils.FetchAndDownloadImage(
          "http:" + cover.url
        );
        for (const screenshot of screenshots) {
          const id = await FetchUtils.FetchAndDownloadImage(
            "http:" + screenshot.url
          );
          screenshotIds.push(id);
        }

        const game = await Database.game.create({
          data: {
            title,
            developer:
              involved_companies.filter((v) => v.developer)[0]?.company?.name ||
              "Not Found",
            publisher:
              involved_companies.filter((v) => v.publisher)[0]?.company?.name ||
              "Not Found",
            releaseDate: new Date(first_release_date * 1000),
            platforms: platforms.map((v) => v.name),
            genres: genres.map((v) => v.name),
            storyline: storyline,
            screenshotIds,
            coverId,
            summary,
            currentState: body.currentState,
            gameSlug: body.gameSlug,
            userId: req.user?.userId,
            review: null,
            reviewStars: null,
          },
        });

        res.status(200).json({
          status: 200,
          game,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "That game wasn't found",
        });
      }
    } else {
      if (Environment!.NODE_ENV === "development") {
        const data = await igdbResponse.json();
        console.log("IGDB response", data);
      }
      res.status(500).json({
        status: 500,
        message: "Failed to fetch data from IGDB",
      });
    }
  } catch (e) {
    next(e);
  }
}
async function DeleteGame(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Schemas.games.delete.parse(req.params.id);

    const game = await Database.game.findFirst({
      where: {
        id,
      },
    });

    if (game) {
      FetchUtils.DeleteImage(game.coverId);
      for (const screenshot of game.screenshotIds) {
        FetchUtils.DeleteImage(screenshot);
      }

      await Database.game.delete({
        where: {
          id,
        },
      });

      res.status(200).json({
        status: 200,
        message: "Item successfully deleted",
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "No item found with provided ID",
      });
    }
  } catch (e) {
    next(e);
  }
}
async function UpdateGame(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Schemas.games.id.parse(req.params.id);
    const body = Schemas.games.update.parse(req.body);

    const game = await Database.game.update({
      where: {
        id,
      },
      data: {
        ...body,
        userId: req.user?.userId,
      },
    });

    res.status(200).json({
      status: 200,
      game,
    });
  } catch (e) {
    next(e);
  }
}

export default {
  AddGame,
  GetGame,
  GetAllAddedGameSlugs,
  GetManyGames,
  DeleteGame,
  UpdateGame,
};
