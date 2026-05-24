import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { MarketplaceService } from "../services/marketplace.service";

export class MarketplaceController {
  // 1. GET /api/marketplace/items
  public static async listItems(req: AuthenticatedRequest, res: Response) {
    try {
      const items = await MarketplaceService.getItems();
      return res.json(items);
    } catch (err: any) {
      console.error("List Items Controller Error:", err);
      return res.status(500).json({ error: "Erro ao ler as mercadorias místicas" });
    }
  }

  // 2. POST /api/marketplace/items
  public static async createItem(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Acesso comercial não autorizado" });
    }

    try {
      const item = await MarketplaceService.createItem(Number(userId), req.body);
      return res.json(item);
    } catch (err: any) {
      console.error("Create Item Controller Error:", err);
      return res.status(500).json({ error: "Erro ao manifestar livro ou serviço para venda" });
    }
  }

  // 3. GET /api/marketplace/items/:id
  public static async getItemDetail(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const item = await MarketplaceService.getItemDetail(Number(id));
      if (!item) {
        return res.status(404).json({ error: "Item não encontrado no éter" });
      }
      return res.json(item);
    } catch (err: any) {
      console.error("Item Detail Controller Error:", err);
      return res.status(500).json({ error: "Erro ao consultar item místico" });
    }
  }

  // 4. POST /api/marketplace/items/:id/reviews
  public static async submitReview(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      const review = await MarketplaceService.submitReview(Number(userId), Number(id), Number(rating), comment);
      return res.json({ success: true, review });
    } catch (err: any) {
      console.error("Submit Review Controller Error:", err);
      return res.status(400).json({ error: err.message || "Erro ao registrar avaliação" });
    }
  }

  // 5. POST /api/marketplace/purchase (supports multi-item cart split transactions!)
  public static async purchase(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { itemId, itemIds } = req.body; // Supports single purchase (itemId) or cart checkout (itemIds!)
    
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      const targetIds = itemIds && Array.isArray(itemIds) 
        ? itemIds.map(Number) 
        : [Number(itemId)];
        
      const result = await MarketplaceService.checkoutCart(Number(userId), targetIds);
      return res.json(result);
    } catch (err: any) {
      console.error("Purchase Controller Error:", err);
      return res.status(400).json({ error: err.message || "Erro ao processar intercâmbio comercial." });
    }
  }
}
