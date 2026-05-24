import { query, useFallback, fallbackDB } from "../database/pool";
import { PaymentService } from "./payment.service";

export class MarketplaceService {
  // 1. Get all catalog items
  public static async getItems(): Promise<any[]> {
    if (!useFallback) {
      const res = await query("SELECT * FROM marketplace_items ORDER BY date DESC");
      return res.rows.map(row => ({
        id: row.id.toString(),
        userId: row.user_id,
        authorName: row.author_name,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        price: parseFloat(row.price),
        category: row.category,
        coverImage: row.cover_image,
        hashtags: typeof row.hashtags === "string" ? JSON.parse(row.hashtags) : row.hashtags,
        fileUrl: row.file_url,
        date: row.date
      }));
    } else {
      return fallbackDB.marketplace_items.map(row => ({
        ...row,
        id: row.id.toString(),
        hashtags: typeof row.hashtags === "string" ? JSON.parse(row.hashtags) : row.hashtags
      }));
    }
  }

  // 2. Create a catalog item
  public static async createItem(userId: number, payload: any): Promise<any> {
    const { title, subtitle, description, price, category, coverImage, hashtags, fileUrl } = payload;
    
    // Fetch profile name for author_name
    let authorName = "Alquimista";
    const profileRes = await query("SELECT name FROM profiles WHERE user_id = $1", [userId]);
    if (profileRes.rows.length > 0) {
      authorName = profileRes.rows[0].name;
    }

    if (!useFallback) {
      const res = await query(
        `INSERT INTO marketplace_items (user_id, author_name, title, subtitle, description, price, category, cover_image, hashtags, file_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [userId, authorName, title, subtitle, description, price, category, coverImage, JSON.stringify(hashtags || []), fileUrl || '']
      );
      const row = res.rows[0];
      return {
        id: row.id.toString(),
        userId: row.user_id,
        authorName: row.author_name,
        title: row.title,
        subtitle: row.subtitle,
        description: row.description,
        price: parseFloat(row.price),
        category: row.category,
        coverImage: row.cover_image,
        hashtags: JSON.parse(row.hashtags || '[]'),
        fileUrl: row.file_url,
        date: row.date
      };
    } else {
      const id = fallbackDB.marketplace_items.length + 1;
      const newItem = {
        id,
        user_id: userId,
        author_name: authorName,
        title,
        subtitle,
        description,
        price: Number(price),
        category,
        cover_image: coverImage,
        hashtags,
        file_url: fileUrl || '',
        date: new Date().toISOString()
      };
      fallbackDB.marketplace_items.push(newItem);
      return {
        ...newItem,
        id: id.toString(),
        userId: newItem.user_id,
        authorName: newItem.author_name,
        coverImage: newItem.cover_image,
        fileUrl: newItem.file_url
      };
    }
  }

  // 3. Get item detailed view with reviews and seller info
  public static async getItemDetail(id: number): Promise<any> {
    const items = await this.getItems();
    const item = items.find(i => Number(i.id) === id);
    if (!item) return null;

    // Load reviews
    let reviews = [];
    if (!useFallback) {
      const revRes = await query(
        "SELECT r.id, r.rating, r.comment, r.created_at, p.name as author FROM product_reviews r JOIN profiles p ON r.user_id = p.user_id WHERE r.item_id = $1",
        [id]
      );
      reviews = revRes.rows;
    } else {
      reviews = fallbackDB.product_reviews.filter(r => r.item_id === id);
    }

    return {
      ...item,
      reviews,
      ratingAverage: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "N/A"
    };
  }

  // 4. Submit a product review (1 to 5 stars)
  public static async submitReview(userId: number, itemId: number, rating: number, comment: string): Promise<any> {
    if (rating < 1 || rating > 5) {
      throw new Error("Avaliação deve ser de 1 a 5 estrelas");
    }

    if (!useFallback) {
      const res = await query(
        "INSERT INTO product_reviews (item_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (item_id, user_id) DO UPDATE SET rating = $3, comment = $4 RETURNING *",
        [itemId, userId, rating, comment]
      );
      return res.rows[0];
    } else {
      fallbackDB.product_reviews = fallbackDB.product_reviews.filter(r => !(r.item_id === itemId && r.user_id === userId));
      const newRev = {
        id: fallbackDB.product_reviews.length + 1,
        item_id: itemId,
        user_id: userId,
        rating,
        comment,
        author: "Buscador Local",
        created_at: new Date().toISOString()
      };
      fallbackDB.product_reviews.push(newRev);
      return newRev;
    }
  }

  // 5. Checkout Cart with Splits (splits payment: 15% platform, 85% to seller wallet)
  public static async checkoutCart(userId: number, itemIds: number[]): Promise<{ success: boolean; newBalance: number }> {
    if (!itemIds || itemIds.length === 0) {
      throw new Error("Seu carrinho místico está vazio.");
    }

    // Load items to checkout
    const allItems = await this.getItems();
    const checkoutItems = allItems.filter(i => itemIds.includes(Number(i.id)));
    
    if (checkoutItems.length === 0) {
      throw new Error("Nenhum item válido encontrado no catálogo.");
    }

    const totalCost = checkoutItems.reduce((sum, item) => sum + item.price, 0);

    // Verify buyer balance
    const buyerWallet = await PaymentService.getBalance(userId);
    if (buyerWallet.balance < totalCost) {
      throw new Error(`Saldo insuficiente para transação. Total do carrinho: R$ ${totalCost.toFixed(2)}. Seu saldo atual: R$ ${buyerWallet.balance.toFixed(2)}.`);
    }

    const commissionRate = 15; // 15% platform split

    // Perform purchases, debits, splits, credits
    for (const item of checkoutItems) {
      const itemPrice = Number(item.price);
      if (itemPrice > 0) {
        const platformCommission = Number((itemPrice * (commissionRate / 100)).toFixed(2));
        const sellerEarnings = Number((itemPrice - platformCommission).toFixed(2));

        if (!useFallback) {
          // Debit buyer
          const buyerTxId = await PaymentService.logTransaction(
            userId,
            "saque",
            itemPrice,
            platformCommission,
            0,
            `Adquiriu: ${item.title}`,
            "concluído"
          );

          // Credit seller
          await PaymentService.logTransaction(
            item.userId,
            "compra",
            itemPrice,
            platformCommission,
            sellerEarnings,
            `Vendeu: ${item.title}`,
            "concluído"
          );

          // Update seller wallet
          await query(
            "UPDATE sellers SET balance = balance + $1 WHERE user_id = $2",
            [sellerEarnings, item.userId]
          );

          // Log purchases table
          await query(
            "INSERT INTO purchases (user_id, item_id, amount, transaction_id, status) VALUES ($1, $2, $3, $4, 'concluído')",
            [userId, Number(item.id), itemPrice, buyerTxId]
          );

          // Send notifications
          await query(
            "INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'challenge')",
            [item.userId, `Seu item "${item.title}" foi comprado! R$ ${sellerEarnings.toFixed(2)} (líquido) adicionados ao saldo.`]
          );
        } else {
          // Fallback splits
          fallbackDB.transactions.push({
            id: fallbackDB.transactions.length + 1,
            user_id: userId,
            type: "saque",
            amount: itemPrice,
            commission_platform: platformCommission,
            amount_seller: 0,
            title: `Adquiriu: ${item.title}`,
            status: "concluído",
            date: new Date().toISOString()
          });

          fallbackDB.transactions.push({
            id: fallbackDB.transactions.length + 1,
            user_id: item.userId,
            type: "compra",
            amount: itemPrice,
            commission_platform: platformCommission,
            amount_seller: sellerEarnings,
            title: `Vendeu: ${item.title}`,
            status: "concluído",
            date: new Date().toISOString()
          });

          const seller = fallbackDB.sellers.find(s => Number(s.user_id) === item.userId);
          if (seller) {
            seller.balance = Number(seller.balance) + sellerEarnings;
          }

          fallbackDB.purchases.push({
            id: fallbackDB.purchases.length + 1,
            user_id: userId,
            item_id: Number(item.id),
            amount: itemPrice,
            status: "concluído",
            created_at: new Date().toISOString()
          });
        }
      }
    }

    // Deduct buyer total cost
    if (!useFallback) {
      await query("UPDATE sellers SET balance = balance - $1 WHERE user_id = $2", [totalCost, userId]);
    } else {
      const buyer = fallbackDB.sellers.find(s => Number(s.user_id) === userId);
      if (buyer) {
        buyer.balance = Number(buyer.balance) - totalCost;
      }
    }

    const nextBuyerWallet = await PaymentService.getBalance(userId);
    return { success: true, newBalance: nextBuyerWallet.balance };
  }
}
