import { Router } from "express";
import { pool } from "../database/pool";

const router = Router();

// Endpoint público para carregar as configurações dinâmicas da plataforma (nome, favicon, logo) no frontend
router.get("/global", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT site_name, system_name, cnpj, company_info, favicon_url, logo_url, sublogo_url, partners, ad_companies 
      FROM global_settings WHERE id = 1
    `);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error("[Settings] Erro ao buscar global_settings:", err);
    res.status(500).json({ error: "Erro ao buscar configurações" });
  }
});

export default router;
