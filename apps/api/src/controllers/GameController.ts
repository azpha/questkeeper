import Schemas from "../utils/ZodSchemas";
import Database from "../services/Database";
import Auth from "../services/Auth";
import Environment from "../utils/Environment";
import FetchUtils from "../utils/FetchUtils";
import type { Request, Response, NextFunction } from "express";

const IGDB_BASE_URL = "https://api.igdb.com/v4/";

async function GetGame(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Schemas.games.get.parse(req.params.id);

    const game = await Database.game.findFirst({
      where: {
        id,
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

    const twitchToken = await Auth.verifyAgainstTwitch();
    const igdbResponse = await fetch(IGDB_BASE_URL + "games", {
      method: "post",
      headers: {
        Authorization: twitchToken,
        "Client-ID": Environment!.IGDB_CLIENT_ID,
        Accept: "application/json",
      },
      body: `where slug = "${body.gameSlug}"; fields slug,cover.url,name,summary;`,
    });

    if (igdbResponse.ok) {
      const igdbData = await igdbResponse.json();
      const { cover, summary, name: title } = igdbData[0];

      const coverId = await FetchUtils.FetchAndDownloadImage(
        "http:" + cover.url
      );

      const game = await Database.game.create({
        data: {
          title,
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
  GetManyGames,
  DeleteGame,
  UpdateGame,
};
