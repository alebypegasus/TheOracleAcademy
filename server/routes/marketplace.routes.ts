import { Router } from "express";
import { MarketplaceController } from "../controllers/marketplace.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/items", authMiddleware, MarketplaceController.listItems);
router.post("/items", authMiddleware, MarketplaceController.createItem);
router.get("/items/:id", authMiddleware, MarketplaceController.getItemDetail);
router.post("/items/:id/reviews", authMiddleware, MarketplaceController.submitReview);
router.post("/purchase", authMiddleware, MarketplaceController.purchase);

export default router;
