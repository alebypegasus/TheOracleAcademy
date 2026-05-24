import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/firebase-sync", AuthController.firebaseSync);

router.get("/user/sync", authMiddleware, AuthController.syncUserState);
router.post("/profile/update", authMiddleware, AuthController.updateProfile);
router.post("/settings/update", authMiddleware, AuthController.updateSettings);

export default router;
