import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/checkout", authMiddleware, PaymentController.checkout);
router.post("/create-preference", authMiddleware, PaymentController.createCartPreference);
router.post("/webhook", PaymentController.webhook); // Webhooks are unprotected by design so MP can call it
router.get("/balance", authMiddleware, PaymentController.getBalance);
router.get("/transactions", authMiddleware, PaymentController.getTransactions);
router.post("/withdraw", authMiddleware, PaymentController.withdraw);
router.get("/validate-credentials", PaymentController.validateCredentials);

// Subscription routes
router.post("/subscribe", authMiddleware, PaymentController.subscribe);
router.get("/subscription", authMiddleware, PaymentController.getSubscription);
router.post("/cancel-subscription", authMiddleware, PaymentController.cancelSubscription);

export default router;
