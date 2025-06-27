import { Router } from "express";
import IgdbController from "../controllers/IgdbController";

const router = Router();

router.get("/search", IgdbController.SearchForGame);
router.get("/game/:id", IgdbController.GetGameById);

export default router;
