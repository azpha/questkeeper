import { Router } from "express";
import AuthService from "../services/Auth";
import AuthController from "../controllers/AuthController";

const router = Router();

router.get("/eligibility", AuthController.ServerEligibleForRegistration);
router.get("/@me", AuthService.verifyJwt, AuthController.GetCurrentUser);
router.patch("/@me", AuthService.verifyJwt, AuthController.UpdateUser);
router.post("/register", AuthController.RegisterAccount);
router.post("/login", AuthController.LogIn);
router.delete("/logout", AuthService.verifyJwt, AuthController.LogOut);

export default router;
