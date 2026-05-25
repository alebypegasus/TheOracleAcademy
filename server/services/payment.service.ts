import { query, useFallback, fallbackDB } from "../database/pool";

let MercadoPagoConfig: any, Preference: any, PreApproval: any;
try {
  const mp = require("mercadopago");
  MercadoPagoConfig = mp.MercadoPagoConfig;
  Preference = mp.Preference;
  PreApproval = mp.PreApproval;
} catch (e) {
  console.error("[Payment] Mercado Pago SDK not initialized or requiring configurations.");
}

// ======================================================
// PLAN PRICING TABLE
// ======================================================
const PLAN_PRICES: Record<string, Record<string, number>> = {
  medium: {
    mensal: 49.90,
    trimestral: 134.73,  // 49.90 * 3 * 0.90 (10% off)
    anual: 419.16        // 49.90 * 12 * 0.70 (30% off)
  },
  master: {
    mensal: 109.90,
    trimestral: 296.73,  // 109.90 * 3 * 0.90 (10% off)
    anual: 922.56        // 109.90 * 12 * 0.70 (30% off)
  }
};

const PLAN_LABELS: Record<string, string> = {
  medium: 'Plano Ascendente',
  master: 'Plano Mestre Supremo'
};

function getExpiresAt(cycle: string): Date {
  const now = new Date();
  if (cycle === 'trimestral') {
    now.setMonth(now.getMonth() + 3);
  } else if (cycle === 'anual') {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setMonth(now.getMonth() + 1);
  }
  return now;
}

export class PaymentService {
  private static getMPConfig() {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN || "TEST-1234567890";
    if (!MercadoPagoConfig) return null;
    return new MercadoPagoConfig({
      accessToken: token,
      options: { timeout: 5000 }
    });
  }

  // 1. Create Checkout Preference
  public static async createCheckoutPreference(payload: any, userId: number): Promise<{ init_point: string; preferenceId: string }> {
    const { title, price, quantity = 1, sellerName } = payload;
    const mpConfig = this.getMPConfig();
    const itemPrice = Number(price);

    // Initialize mock fallback checkout if MP is not fully configured
    if (!mpConfig || !Preference) {
      console.warn("[Payment] Mercado Pago SDK unavailable. Using simulated local checkout.");
      
      const mockPrefId = `pref_mock_${Date.now()}`;
      const mockInitPoint = `${process.env.APP_URL || "http://localhost:3000"}/#/subscription?prefId=${mockPrefId}&price=${itemPrice}&title=${encodeURIComponent(title)}`;
      
      // Store pending transaction
      await this.logTransaction(userId, "compra", itemPrice, 0, 0, title, "pendente");
      
      return { init_point: mockInitPoint, preferenceId: mockPrefId };
    }

    try {
      const preference = new Preference(mpConfig);
      const response = await preference.create({
        body: {
          items: [
            {
              id: "oracle-item-id-" + Date.now(),
              title: title || "Item Cósmico",
              quantity: Number(quantity),
              unit_price: itemPrice,
              currency_id: "BRL",
            }
          ],
          metadata: {
            sellerName,
            price: itemPrice,
            title
          },
          external_reference: userId.toString()
        }
      });

      // Register checkout log
      await this.logTransaction(userId, "compra", itemPrice, 0, 0, title, "pendente");

      return { init_point: response.init_point, preferenceId: response.id };
    } catch (err: any) {
      console.error("[Payment] Error generating MP preference:", err);
      // Fallback
      const mockPrefId = `pref_mock_${Date.now()}`;
      return { 
        init_point: `${process.env.APP_URL || "http://localhost:3000"}/#/subscription?prefId=${mockPrefId}&price=${itemPrice}&title=${encodeURIComponent(title)}`,
        preferenceId: mockPrefId 
      };
    }
  }

  // 2. Validate Credentials Status
  public static validateCredentials(): { status: string; message: string } {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
    if (!token || token.includes("TEST-1234567890")) {
      return { 
        status: "unconfigured", 
        message: "Chaves de Sandbox não injetadas. Pagamentos reais desativados." 
      };
    }
    return { 
      status: "configured", 
      message: "Credenciais do Mercado Pago prontas para processamento." 
    };
  }

  // 3. Payout Saque with PIX Key Validation and Deductions
  public static async withdraw(userId: number, amount: number, pixKey: string, keyType: string): Promise<string> {
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error("Valor de saque inválido.");
    }

    // PIX format checks
    let isValid = false;
    const cleanKey = pixKey.replace(/\D/g, "");
    if (keyType === "cpf") isValid = /^\d{11}|\d{14}$/.test(cleanKey);
    else if (keyType === "email") isValid = /^\S+@\S+\.\S+$/.test(pixKey);
    else if (keyType === "phone") isValid = /^\+?\d{10,}$/.test(pixKey.replace(/[\s()-]/g, ""));
    else if (keyType === "random") isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pixKey);

    if (!isValid) {
      throw new Error(`Chave PIX via ${keyType.toUpperCase()} possui formato inválido.`);
    }

    // Check balance
    const wallet = await this.getBalance(userId);
    if (amountNum > wallet.balance) {
      throw new Error(`Saldo insuficiente para saque. Seu saldo atual é R$ ${wallet.balance.toFixed(2)}.`);
    }

    // Deduct and log payout
    if (!useFallback) {
      await query(
        "UPDATE sellers SET balance = balance - $1 WHERE user_id = $2",
        [amountNum, userId]
      );
      await query(
        "INSERT INTO transactions (user_id, type, amount, commission_platform, amount_seller, title, status, pix_key) VALUES ($1, 'saque', $2, 0, $2, 'Saque Mercado Pago PIX', 'concluído', $3)",
        [userId, amountNum, pixKey]
      );
    } else {
      const seller = fallbackDB.sellers.find(s => Number(s.user_id) === userId);
      if (seller) {
        seller.balance = Number(seller.balance) - amountNum;
      }
      fallbackDB.transactions.push({
        id: fallbackDB.transactions.length + 1,
        user_id: userId,
        type: "saque",
        amount: amountNum,
        commission_platform: 0,
        amount_seller: amountNum,
        title: "Saque Mercado Pago PIX (Repasse)",
        status: "concluído",
        pix_key: pixKey,
        date: new Date().toISOString()
      });
    }

    return `Transferência de repasse PIX de R$ ${amountNum.toFixed(2)} concluída com sucesso na carteira.`;
  }

  // 4. Extract wallet balance
  public static async getBalance(userId: number): Promise<{ balance: number }> {
    if (!useFallback) {
      const res = await query("SELECT balance FROM sellers WHERE user_id = $1", [userId]);
      if (res.rows.length === 0) {
        // Create balance record if not exists
        await query("INSERT INTO sellers (user_id, balance, commission_rate) VALUES ($1, 0.00, 15.00) ON CONFLICT DO NOTHING", [userId]);
        return { balance: 500.00 }; // Baseline R$ 500.00 for course demo
      }
      return { balance: Number(res.rows[0].balance) + 500.00 }; // Baseline included
    } else {
      const seller = fallbackDB.sellers.find(s => Number(s.user_id) === userId);
      if (!seller) {
        fallbackDB.sellers.push({ user_id: userId, balance: 0.00, commission_rate: 15.00 });
        return { balance: 500.00 };
      }
      return { balance: Number(seller.balance) + 500.00 };
    }
  }

  // 5. Get transactions list
  public static async getTransactions(userId: number): Promise<any[]> {
    if (!useFallback) {
      const res = await query("SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC", [userId]);
      return res.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        type: row.type,
        amount: parseFloat(row.amount),
        commissionPlatform: parseFloat(row.commission_platform),
        amountSeller: parseFloat(row.amount_seller),
        title: row.title,
        status: row.status,
        date: row.date
      }));
    } else {
      return fallbackDB.transactions.filter(t => Number(t.user_id) === userId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  // Helper log transaction
  public static async logTransaction(userId: number, type: string, amount: number, commission: number, sellerVal: number, title: string, status: string): Promise<any> {
    if (!useFallback) {
      const res = await query(
        "INSERT INTO transactions (user_id, type, amount, commission_platform, amount_seller, title, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [userId, type, amount, commission, sellerVal, title, status]
      );
      return res.rows[0]?.id;
    } else {
      const id = fallbackDB.transactions.length + 1;
      fallbackDB.transactions.push({
        id,
        user_id: userId,
        type,
        amount,
        commission_platform: commission,
        amount_seller: sellerVal,
        title,
        status,
        date: new Date().toISOString()
      });
      return id;
    }
  }

  // 6. Process IPN Webhook and apply 15% - 20% platform splits
  public static async approvePayment(paymentId: string, topic: string, queryUserId?: string, queryAmount?: string, queryTitle?: string): Promise<void> {
    let targetUserId = 1;
    let paymentAmount = 0;
    let itemTitle = "Plano VIP e Acesso Completo";

    // 1. Fetch payment details from MP API if credentials exist
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    let detail: any = null;
    if (paymentId && token && !token.includes("TEST-1234567890")) {
      try {
        const fetchRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (fetchRes.ok) {
          detail = await fetchRes.json();
          if (detail.external_reference) {
            targetUserId = Number(detail.external_reference);
          }
          if (detail.transaction_amount) {
            paymentAmount = Number(detail.transaction_amount);
          }
          if (detail.description) {
            itemTitle = detail.description;
          }
        }
      } catch (e) {
        console.error("[Payment Webhook] Error fetching payment details:", e);
      }
    }

    // 2. Fallbacks
    if (targetUserId === 1 && queryUserId) {
      targetUserId = Number(queryUserId);
    }
    if (paymentAmount === 0 && queryAmount) {
      paymentAmount = Number(queryAmount);
    }
    if (queryTitle) {
      itemTitle = queryTitle;
    }

    console.log(`[Payment Webhook Split] Aprovando R$ ${paymentAmount} para Usuário ID ${targetUserId} | ref: ${detail?.external_reference || '?'}`);

    // Check if this is a subscription payment (external_reference starts with 'sub:')
    const externalRef = detail?.external_reference || '';
    if (externalRef.startsWith('sub:')) {
      const [, plan, cycle, userIdStr] = externalRef.split(':');
      await this.activatePlan(Number(userIdStr), plan, cycle, paymentId, paymentAmount);
      return;
    }

    // 3. Split commission rule: 15% platform fee, 85% to seller wallet!
    const commissionRate = 15; // 15% commission fee
    const platformCommission = Number((paymentAmount * (commissionRate / 100)).toFixed(2));
    const sellerEarnings = Number((paymentAmount - platformCommission).toFixed(2));

    // Update internal DB
    if (!useFallback) {
      // Mark premium user
      await query("UPDATE users SET is_paid = true WHERE id = $1", [targetUserId]);

      // Complete pending transactions
      await query(
        "UPDATE transactions SET status = 'concluído', commission_platform = $1, amount_seller = $2 WHERE user_id = $3 AND status = 'pendente'",
        [platformCommission, sellerEarnings, targetUserId]
      );

      // If checkout is a seller purchase, add the net earnings to the seller
      // For general app payment/subscription, we split into general system logs
      await query(
        "INSERT INTO transactions (user_id, type, amount, commission_platform, amount_seller, title, status) VALUES ($1, 'venda', $2, $3, $4, $5, 'concluído')",
        [targetUserId, paymentAmount, platformCommission, sellerEarnings, `Faturamento: ${itemTitle}`]
      );
      
      await query(
        "UPDATE sellers SET balance = balance + $1 WHERE user_id = $2",
        [sellerEarnings, targetUserId]
      );

      // Save notification
      await query(
        "INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'challenge')",
        [targetUserId, `Pagamento aprovado! Seu faturamento de R$ ${sellerEarnings.toFixed(2)} (líquido) foi depositado na carteira mística.`]
      );

    } else {
      const u = fallbackDB.users.find(x => x.id === targetUserId);
      if (u) u.is_paid = true;

      // Complete pending in mem
      const tx = fallbackDB.transactions.find(t => t.user_id === targetUserId && t.status === "pendente");
      if (tx) {
        tx.status = "concluído";
        tx.commission_platform = platformCommission;
        tx.amount_seller = sellerEarnings;
      }

      // Add seller balance in mem
      const seller = fallbackDB.sellers.find(s => Number(s.user_id) === targetUserId);
      if (seller) {
        seller.balance = Number(seller.balance) + sellerEarnings;
      }

      fallbackDB.transactions.push({
        id: fallbackDB.transactions.length + 1,
        user_id: targetUserId,
        type: "venda",
        amount: paymentAmount,
        commission_platform: platformCommission,
        amount_seller: sellerEarnings,
        title: `Faturamento: ${itemTitle}`,
        status: "concluído",
        date: new Date().toISOString()
      });

      fallbackDB.notifications.push({
        id: fallbackDB.notifications.length + 1,
        user_id: targetUserId,
        text: `Pagamento de R$ ${sellerEarnings.toFixed(2)} aprovado na carteira em modo local.`,
        is_read: false,
        created_at: new Date().toISOString(),
        type: "challenge"
      });
    }
  }
  // ======================================================
  // SUBSCRIPTION METHODS (NOVA ARQUITETURA MENSAL/ANUAL)
  // ======================================================

  // Cria uma assinatura MENSAL (Checkout Pro - sem Brick)
  public static async createMonthlySubscription(userId: number, plan: string, payerEmail: string): Promise<{ init_point: string }> {
    const amount = PLAN_PRICES[plan]?.mensal;
    if (!amount) throw new Error(`Plano inválido: ${plan}`);

    const label = PLAN_LABELS[plan] || plan;
    const title = `Assinatura Mensal - ${label}`;
    const externalRef = `sub:${plan}:mensal:${userId}`;
    const mpConfig = this.getMPConfig();

    if (!mpConfig || !PreApproval) {
      console.warn("[Subscription] MP SDK indisponível. Usando mock.");
      const mockInitPoint = `${process.env.APP_URL || "http://localhost:3000"}/#/subscription?mock=true&plan=${plan}`;
      await this.activatePlan(userId, plan, 'mensal', `mock_sub_${Date.now()}`, amount);
      return { init_point: mockInitPoint };
    }

    try {
      const preApproval = new PreApproval(mpConfig);
      
      const response = await preApproval.create({
        body: {
          reason: title,
          external_reference: externalRef,
          payer_email: payerEmail,
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: amount,
            currency_id: 'BRL'
          },
          back_url: `${process.env.APP_URL || "http://localhost:3000"}/#/subscription`,
          status: "pending"
        }
      });
      
      console.log("[Subscription] PreApproval Pro criado:", response.id);
      
      return { init_point: response.init_point };
    } catch (err: any) {
      console.error('[Subscription] MP PreApproval error:', err);
      throw new Error('Erro ao criar assinatura mensal: ' + err.message);
    }
  }

  // Cria o pagamento ANUAL (Compra única com parcelamento)
  public static async createAnnualPurchase(userId: number, plan: string, payerEmail: string): Promise<{ init_point: string, preferenceId: string }> {
    const amount = PLAN_PRICES[plan]?.anual;
    if (!amount) throw new Error(`Plano inválido: ${plan}`);

    const label = PLAN_LABELS[plan] || plan;
    const title = `Acesso de 1 Ano - ${label}`;
    const externalRef = `sub:${plan}:anual:${userId}`;
    const mpConfig = this.getMPConfig();

    if (!mpConfig || !Preference) {
      console.warn("[Subscription] MP SDK indisponível. Usando mock.");
      const mockPrefId = `pref_mock_${Date.now()}`;
      const mockInitPoint = `${process.env.APP_URL || "http://localhost:3000"}/#/subscription?prefId=${mockPrefId}&price=${amount}`;
      return { init_point: mockInitPoint, preferenceId: mockPrefId };
    }

    try {
      const preference = new Preference(mpConfig);
      const response = await preference.create({
        body: {
          items: [
            {
              id: `annual_${plan}`,
              title: title,
              quantity: 1,
              unit_price: amount,
              currency_id: "BRL",
            }
          ],
          payer: {
            email: payerEmail
          },
          external_reference: externalRef,
          back_urls: {
            success: `${process.env.APP_URL || "http://localhost:3000"}/#/subscription?success=true`,
            failure: `${process.env.APP_URL || "http://localhost:3000"}/#/subscription?failure=true`,
            pending: `${process.env.APP_URL || "http://localhost:3000"}/#/subscription?pending=true`
          },
          auto_return: "approved"
        }
      });
      
      console.log("[Subscription] Annual Preference criada:", response.id);
      return { init_point: response.init_point, preferenceId: response.id };
    } catch (err: any) {
      console.error('[Subscription] MP Preference error:', err);
      throw new Error('Erro ao criar pagamento anual: ' + err.message);
    }
  }

  // Activate plan after payment confirmed
  public static async activatePlan(userId: number, plan: string, cycle: string, paymentId: string, amount: number): Promise<void> {
    const expiresAt = getExpiresAt(cycle);
    console.log(`[Subscription] Activating ${plan}/${cycle} for user ${userId} until ${expiresAt.toISOString()}`);

    if (!useFallback) {
      await query(
        "UPDATE users SET plan = $1, plan_expires_at = $2, is_paid = true WHERE id = $3",
        [plan, expiresAt.toISOString(), userId]
      );
      await query(
        "INSERT INTO subscriptions (user_id, plan, cycle, status, payment_id, amount, expires_at) VALUES ($1, $2, $3, 'active', $4, $5, $6)",
        [userId, plan, cycle, paymentId, amount, expiresAt.toISOString()]
      );
      await query(
        "INSERT INTO transactions (user_id, type, amount, commission_platform, amount_seller, title, status) VALUES ($1, 'assinatura', $2, 0, $2, $3, 'concluído')",
        [userId, amount, `Assinatura ${PLAN_LABELS[plan]} - ${cycle}`]
      );
      await query(
        "INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'certificate')",
        [userId, `✨ Plano ${PLAN_LABELS[plan]} ativado com sucesso! Aproveite todo o conteúdo premium.`]
      );
    } else {
      const u = fallbackDB.users.find((x: any) => x.id === userId);
      if (u) { u.plan = plan; u.plan_expires_at = expiresAt.toISOString(); u.is_paid = true; }
    }
  }

  // Get current subscription info
  public static async getSubscription(userId: number): Promise<any> {
    if (!useFallback) {
      const userRes = await query("SELECT plan, plan_expires_at FROM users WHERE id = $1", [userId]);
      const subRes = await query(
        "SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' ORDER BY created_at DESC LIMIT 1",
        [userId]
      );
      return {
        plan: userRes.rows[0]?.plan || 'free',
        planExpiresAt: userRes.rows[0]?.plan_expires_at || null,
        subscription: subRes.rows[0] || null
      };
    } else {
      const u = fallbackDB.users.find((x: any) => x.id === userId);
      return { plan: u?.plan || 'free', planExpiresAt: u?.plan_expires_at || null, subscription: null };
    }
  }

  // Cancel subscription (set to expire at end of current period)
  public static async cancelSubscription(userId: number): Promise<void> {
    if (!useFallback) {
      await query(
        "UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'",
        [userId]
      );
      await query(
        "INSERT INTO notifications (user_id, text, type) VALUES ($1, 'Sua assinatura foi cancelada. Você mantém o acesso até o fim do período pago.', 'generic')",
        [userId]
      );
    } else {
      const u = fallbackDB.users.find((x: any) => x.id === userId);
      if (u) u.plan = 'free';
    }
  }
}
