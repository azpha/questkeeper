import { Router } from "express";
import Auth from "../services/Auth";
import SteamController from "../controllers/SteamController";

const router = Router();

router.get("/games", Auth.verifyJwt, SteamController.FetchUserGames);

export default router;
