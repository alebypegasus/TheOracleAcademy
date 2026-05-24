import { Router } from "express";
import { pool } from "../database/pool";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

// Middleware de proteção para todas as rotas admin
router.use(adminAuth);

// ==========================================
// USUÁRIOS
// ==========================================

// Listar todos os usuários (com paginação simples)
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.role, u.status, u.strikes, u.created_at, p.name 
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Atualizar status do usuário (Banir/Suspender/Ativar)
router.post("/users/:id/status", async (req, res) => {
  const targetId = req.params.id;
  const { status, reason } = req.body;
  const adminId = (req as any).adminId;

  if (!['ativo', 'suspenso', 'banido'].includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  try {
    await pool.query("BEGIN");
    await pool.query("UPDATE users SET status = $1 WHERE id = $2", [status, targetId]);
    await pool.query(
      "INSERT INTO moderation_logs (admin_id, target_user_id, action, reason) VALUES ($1, $2, $3, $4)",
      [adminId, targetId, `change_status_to_${status}`, reason]
    );
    await pool.query("COMMIT");
    res.json({ success: true, message: `Usuário alterado para ${status}` });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// Adicionar Strike ao usuário
router.post("/users/:id/strike", async (req, res) => {
  const targetId = req.params.id;
  const { reason } = req.body;
  const adminId = (req as any).adminId;

  try {
    await pool.query("BEGIN");
    const updateRes = await pool.query("UPDATE users SET strikes = strikes + 1 WHERE id = $1 RETURNING strikes", [targetId]);
    const currentStrikes = updateRes.rows[0].strikes;

    await pool.query(
      "INSERT INTO moderation_logs (admin_id, target_user_id, action, reason) VALUES ($1, $2, $3, $4)",
      [adminId, targetId, "add_strike", reason]
    );

    // Auto-suspend if strikes >= 3
    if (currentStrikes >= 3) {
      await pool.query("UPDATE users SET status = 'suspenso' WHERE id = $1", [targetId]);
      await pool.query(
        "INSERT INTO moderation_logs (admin_id, target_user_id, action, reason) VALUES ($1, $2, $3, $4)",
        [adminId, targetId, "auto_suspend", "Atingiu 3 strikes"]
      );
    }
    
    await pool.query("COMMIT");
    res.json({ success: true, strikes: currentStrikes });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Erro ao aplicar strike" });
  }
});

// ==========================================
// CONTEÚDO (POSTS E MARKETPLACE)
// ==========================================

// Listar posts da comunidade (com filtros opcionais)
router.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM community_posts ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

// Atualizar status de um post (Aprovar, Rejeitar, Pendente)
router.post("/posts/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query("UPDATE community_posts SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar status do post" });
  }
});

// Atualizar status de um item de marketplace
router.post("/marketplace/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query("UPDATE marketplace_items SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar status do item" });
  }
});

// ==========================================
// CONFIGURAÇÕES GLOBAIS E IA
// ==========================================

// Buscar configurações
router.get("/settings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM global_settings WHERE id = 1");
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar configurações" });
  }
});

// Atualizar configurações
router.post("/settings", async (req, res) => {
  const { site_name, system_name, cnpj, company_info, favicon_url, logo_url, sublogo_url, partners, ad_companies } = req.body;
  try {
    await pool.query(`
      UPDATE global_settings 
      SET site_name = $1, system_name = $2, cnpj = $3, company_info = $4,
          favicon_url = $5, logo_url = $6, sublogo_url = $7, partners = $8, ad_companies = $9, updated_at = NOW()
      WHERE id = 1
    `, [site_name, system_name, cnpj, company_info, favicon_url, logo_url, sublogo_url, JSON.stringify(partners || []), JSON.stringify(ad_companies || [])]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar configurações" });
  }
});

// Buscar Prompts
router.get("/prompts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ai_prompts ORDER BY feature");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar prompts" });
  }
});

// Atualizar Prompt
router.post("/prompts/:id", async (req, res) => {
  const { prompt_text, description } = req.body;
  try {
    await pool.query(
      "UPDATE ai_prompts SET prompt_text = $1, description = $2, updated_at = NOW() WHERE id = $3",
      [prompt_text, description, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar prompt" });
  }
});

// Listar Logs de moderação
router.get("/logs", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, a.email as admin_email, t.email as target_email 
      FROM moderation_logs l
      LEFT JOIN users a ON a.id = l.admin_id
      LEFT JOIN users t ON t.id = l.target_user_id
      ORDER BY l.created_at DESC LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar logs" });
  }
});

export default router;
