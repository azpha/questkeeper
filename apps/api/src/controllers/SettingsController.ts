import type { Request, Response, NextFunction } from "express";
import env from "../utils/Environment";

function GetSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const isAuthEnabled = env?.AUTH_ENABLED;

    res.status(200).json({
      status: 200,
      settings: {
        isAuthEnabled,
      },
    });
  } catch (e) {
    next(e);
  }
}

export default {
  GetSettings,
};
