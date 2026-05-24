import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { query } from "../database/pool";
import { GeminiService } from "../services/gemini.service";

export class GrimoireController {
  // 1. GET /api/grimoire/list
  public static async listEntries(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      const items = await query(
        `SELECT id, date, question, spread_type as "spreadType", cards, interpretation, attachments 
         FROM grimoire_entries WHERE user_id = $1 ORDER BY date DESC`,
        [userId]
      );
      // parse cards and attachments if they are strings
      const rows = items.rows.map(row => ({
        ...row,
        cards: typeof row.cards === "string" ? JSON.parse(row.cards) : row.cards,
        attachments: typeof row.attachments === "string" ? JSON.parse(row.attachments) : row.attachments
      }));
      return res.json(rows);
    } catch (err: any) {
      console.error("Grimoire List Controller Error:", err);
      return res.status(500).json({ error: "Erro ao sintonizar grimório" });
    }
  }

  // 2. POST /api/grimoire/create
  public static async createEntry(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { question, spreadType, cards, interpretation, date, attachments } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      const result = await query(
        `INSERT INTO grimoire_entries (user_id, date, question, spread_type, cards, interpretation, attachments) 
         VALUES ($1, COALESCE($2, NOW()), $3, $4, $5, $6, $7) RETURNING id, date`,
        [userId, date, question, spreadType, JSON.stringify(cards || []), interpretation, JSON.stringify(attachments || [])]
      );
      return res.json({ success: true, entryId: result.rows[0].id, date: result.rows[0].date });
    } catch (err: any) {
      console.error("Grimoire Create Controller Error:", err);
      return res.status(500).json({ error: "Falha ao selar grimório no altar" });
    }
  }

  // 3. POST /api/grimoire/update
  public static async updateEntry(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { id, question, spreadType, cards, interpretation, attachments } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }
    if (!id) {
      return res.status(400).json({ error: "ID do registro é obrigatório" });
    }

    try {
      await query(
        `UPDATE grimoire_entries 
         SET question = $1, spread_type = $2, cards = $3, interpretation = $4, attachments = $5 
         WHERE id = $6 AND user_id = $7`,
        [question, spreadType, JSON.stringify(cards || []), interpretation, JSON.stringify(attachments || []), id, userId]
      );
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Grimoire Update Controller Error:", err);
      return res.status(500).json({ error: "Falha ao atualizar grimório no altar" });
    }
  }

  // 4. DELETE /api/grimoire/delete/:id
  public static async deleteEntry(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      await query(
        `DELETE FROM grimoire_entries WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Grimoire Delete Controller Error:", err);
      return res.status(500).json({ error: "Falha ao deletar registro do grimório" });
    }
  }

  // 5. POST /api/ai/analyze-notes (Gemini AI refinement)
  public static async analyzeNotes(req: AuthenticatedRequest, res: Response) {
    const { title, content, type } = req.body;
    try {
      const analysisObj = await GeminiService.analyzeNotes(title, content, type);
      return res.json(analysisObj);
    } catch (err: any) {
      console.error("AI Analyze Notes Controller Error:", err);
      return res.status(500).json({ 
        error: "Visão turva ao ler o éter de IA", 
        details: err.message 
      });
    }
  }
}
