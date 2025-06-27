import Schemas from "../utils/ZodSchemas";
import Database from "../services/Database";
import type { Request, Response, NextFunction } from "express";

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

    const game = await Database.game.create({
      data: {
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
