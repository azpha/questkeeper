import { Router } from "express";
import IgdbController from "../controllers/IgdbController";

const router = Router();

router.get("/search", IgdbController.SearchForGame);
router.get("/game/:slug", IgdbController.GetGameBySlug);
router.get("/steam", IgdbController.SearchForSteamId);

export default router;
