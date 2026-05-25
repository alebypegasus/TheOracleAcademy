import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { PaymentService } from "../services/payment.service";

export class PaymentController {
  // 1. POST /api/payments/checkout
  public static async checkout(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id || "1";
    try {
      const result = await PaymentService.createCheckoutPreference(req.body, Number(userId));
      return res.json(result);
    } catch (err: any) {
      console.error("Checkout Controller Error:", err);
      return res.status(500).json({ error: "Erro ao gerar checkout comercial" });
    }
  }

  // 2. POST /api/payments/webhook (processes MP approvals)
  public static async webhook(req: Request, res: Response) {
    try {
      const { type, resource, data } = req.body;
      const paymentId = data?.id || req.query.id || req.body.id;
      const topic = type || req.query.topic || "payment";

      await PaymentService.approvePayment(
        paymentId ? paymentId.toString() : "",
        topic ? topic.toString() : "",
        req.query.userId ? req.query.userId.toString() : undefined,
        req.query.amount ? req.query.amount.toString() : undefined,
        req.query.title ? req.query.title.toString() : undefined
      );

      return res.status(200).send("OK");
    } catch (err: any) {
      console.error("Webhook Controller Error:", err);
      return res.status(500).send("Error processing split commission webhook");
    }
  }

  // 3. GET /api/payments/balance
  public static async getBalance(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    try {
      const balance = await PaymentService.getBalance(Number(userId));
      return res.json(balance);
    } catch (err: any) {
      console.error("Get Balance Controller Error:", err);
      return res.status(500).json({ error: "Falha ao calcular o saldo da carteira mística" });
    }
  }

  // 4. GET /api/payments/transactions
  public static async getTransactions(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    try {
      const txs = await PaymentService.getTransactions(Number(userId));
      return res.json({ transactions: txs });
    } catch (err: any) {
      console.error("Get Transactions Controller Error:", err);
      return res.status(500).json({ error: "Falha ao buscar as transações da carteira oracular" });
    }
  }

  // 5. POST /api/payments/withdraw (saques)
  public static async withdraw(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { amount, pixKey, type = "cpf" } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      const message = await PaymentService.withdraw(Number(userId), Number(amount), pixKey, type);
      return res.json({ success: true, message });
    } catch (err: any) {
      console.error("Withdraw Controller Error:", err);
      return res.status(400).json({ error: err.message || "Erro ao processar saque do vendedor" });
    }
  }

  // 6. GET /api/payments/validate-credentials
  public static async validateCredentials(req: Request, res: Response) {
    try {
      const status = PaymentService.validateCredentials();
      return res.json(status);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao validar chaves" });
    }
  }

  // 7. POST /api/payments/subscribe — Create subscription (Preapproval) or Annual (Preference)
  public static async subscribe(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || Number(req.headers["x-user-id"]);
    const { plan, cycle = 'mensal', payerEmail } = req.body;
    
    if (!userId) return res.status(401).json({ error: "Não autorizado" });
    if (!plan || !['medium', 'master'].includes(plan)) {
      return res.status(400).json({ error: "Plano inválido. Use 'medium' ou 'master'." });
    }
    if (!['mensal', 'anual'].includes(cycle)) {
      return res.status(400).json({ error: "Ciclo inválido. Use 'mensal' ou 'anual'." });
    }
    if (!payerEmail) {
      return res.status(400).json({ error: "E-mail do pagador é obrigatório." });
    }
    
    try {
      if (cycle === 'mensal') {
        const result = await PaymentService.createMonthlySubscription(userId, plan, payerEmail);
        return res.json(result);
      } else {
        const result = await PaymentService.createAnnualPurchase(userId, plan, payerEmail);
        return res.json(result);
      }
    } catch (err: any) {
      console.error("Subscribe Controller Error:", err);
      return res.status(500).json({ error: err.message || "Erro ao iniciar plano" });
    }
  }

  // 8. GET /api/payments/subscription — Get current plan info
  public static async getSubscription(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || Number(req.headers["x-user-id"]);
    if (!userId) return res.status(401).json({ error: "Não autorizado" });
    try {
      const result = await PaymentService.getSubscription(userId);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: "Erro ao buscar assinatura" });
    }
  }

  // 9. POST /api/payments/cancel-subscription
  public static async cancelSubscription(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id || Number(req.headers["x-user-id"]);
    if (!userId) return res.status(401).json({ error: "Não autorizado" });
    try {
      await PaymentService.cancelSubscription(userId);
      return res.json({ success: true, message: "Assinatura cancelada. Acesso mantido até o fim do período." });
    } catch (err: any) {
      return res.status(500).json({ error: "Erro ao cancelar assinatura" });
    }
  }
}
