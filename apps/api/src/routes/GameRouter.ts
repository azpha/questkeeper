import { Router } from "express";
import Auth from "../services/Auth";
import GameController from "../controllers/GameController";

const router = Router();

router.post("/create", Auth.verifyJwt, GameController.AddGame);
router.patch("/:id", Auth.verifyJwt, GameController.UpdateGame);
router.delete("/:id", Auth.verifyJwt, GameController.DeleteGame);
router.get(
  "/backlog",
  Auth.verifyJwt,
  GameController.GetGamesInPlayingForLongTime
);
router.get("/:id", Auth.verifyJwt, GameController.GetGame);
router.get("/", Auth.verifyJwt, GameController.GetManyGames);

export default router;
