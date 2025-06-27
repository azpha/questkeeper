import { Router } from "express";
import AuthService from "../services/Auth";
import AuthController from "../controllers/AuthController";

const router = Router();

router.get("/@me", AuthController.GetCurrentUser);
router.post("/register", AuthController.RegisterAccount);
router.post("/login", AuthController.LogIn);
router.delete("/logout", AuthService.verifyJwt, AuthController.LogOut);

export default router;
