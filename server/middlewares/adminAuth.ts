import { Request, Response, NextFunction } from "express";
import { pool } from "../database/pool";

export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers["x-user-id"];
  
  if (!userId) {
    return res.status(401).json({ error: "Não autorizado. ID não fornecido." });
  }

  try {
    const result = await pool.query("SELECT role, status FROM users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const user = result.rows[0];

    if (user.role !== 'admin') {
      return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
    }

    if (user.status === 'suspenso' || user.status === 'banido') {
      return res.status(403).json({ error: "Sua conta de administrador está inativa." });
    }

    // Attach admin context if needed
    (req as any).adminId = userId;
    next();
  } catch (err) {
    console.error("[AdminAuth] Erro ao validar admin:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
