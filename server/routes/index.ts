import { Router, Request, Response } from "express";
import authRoutes from "./auth.routes";
import courseRoutes from "./course.routes";
import marketplaceRoutes from "./marketplace.routes";
import paymentRoutes from "./payment.routes";

import { authMiddleware, AuthenticatedRequest } from "../middlewares/auth.middleware";
import { GrimoireController } from "../controllers/grimoire.controller";
import { CommunityController } from "../controllers/community.controller";
import { WorkspaceController } from "../controllers/workspace.controller";
import { AuthController } from "../controllers/auth.controller";
import { GeminiService } from "../services/gemini.service";
import { query, useFallback, fallbackDB } from "../database/pool";

const apiRouter = Router();

// Mount modules
apiRouter.use("/auth", authRoutes);
apiRouter.use("/courses", courseRoutes);
apiRouter.use("/marketplace", marketplaceRoutes);
apiRouter.use("/payments", paymentRoutes);

// Direct aliases under /api to match frontend fetches perfectly
apiRouter.get("/user/sync", authMiddleware, AuthController.syncUserState);
apiRouter.post("/profile/update", authMiddleware, AuthController.updateProfile);
apiRouter.post("/settings/update", authMiddleware, AuthController.updateSettings);

// --- ADDITIONAL PROFILE ROUTES ---
apiRouter.get("/profile/badges", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  try {
    if (useFallback) {
      return res.json({ badges: fallbackDB.badges.filter(b => b.user_id === Number(userId)) });
    }
    const badgesRes = await query("SELECT * FROM badges WHERE user_id = $1", [userId]);
    return res.json({ badges: badgesRes.rows });
  } catch (e) {
    return res.status(500).json({ error: "Error fetching badges" });
  }
});

apiRouter.get("/profile/:userId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  try {
    const profileRes = await query("SELECT * FROM profiles WHERE user_id = $1", [userId]);
    if (profileRes.rows.length === 0) {
      return res.status(404).json({ error: "Buscador não localizado no éter." });
    }

    const row = profileRes.rows[0];
    const itemsRes = await query("SELECT * FROM marketplace_items WHERE user_id = $1 ORDER BY date DESC", [userId]);
    const services = itemsRes.rows.map(item => ({
      title: item.title,
      price: "R$ " + parseFloat(item.price).toFixed(2),
      desc: item.description,
      category: item.category
    }));

    return res.json({
      userId: row.user_id,
      authorName: row.name,
      authorTitle: row.author_title || "Busca-Caminhos",
      grau: row.grau || "Grau I - Iniciado",
      status: "online",
      avatar: row.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
      location: row.location || "Santuário Sagrado",
      bio: row.description || "Um buscador silencioso sintonizado nos mistérios.",
      level: Math.floor((row.xp || 100) / 100) || 1,
      stats: {
        ecos: 14 + Math.floor((row.xp || 100) / 90),
        aura: parseFloat(((row.xp || 100) * 1.5).toFixed(0)),
        ritos: Math.floor((row.xp || 100) / 250)
      },
      socials: {
        ig: row.instagram || "@oraculum_comunidade",
        web: row.website || "oracle.academy"
      },
      services: services,
      creds: [
        { title: "Selo de Verificação", source: "Oracle Academy Assinante", year: "2026" }
      ]
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Erro ao localizar buscador espiritual." });
  }
});

// --- GRIMOIRE ROUTES ---
apiRouter.get("/grimoire/list", authMiddleware, GrimoireController.listEntries);
apiRouter.post("/grimoire/create", authMiddleware, GrimoireController.createEntry);
apiRouter.post("/grimoire/update", authMiddleware, GrimoireController.updateEntry);
apiRouter.delete("/grimoire/delete/:id", authMiddleware, GrimoireController.deleteEntry);

// --- SEARCH & RANKING ROUTES ---
apiRouter.get("/search", authMiddleware, CommunityController.globalSearch);
apiRouter.get("/rankings", authMiddleware, CommunityController.listRankings);

// --- COMMUNITY NEWS & POSTS ---
apiRouter.get("/community/news", authMiddleware, CommunityController.listNews);
apiRouter.post("/community/news/generate", authMiddleware, CommunityController.generateNews);
apiRouter.get("/community/posts", authMiddleware, CommunityController.listPosts);
apiRouter.post("/community/posts", authMiddleware, CommunityController.createPost);
apiRouter.post("/community/posts/:id/like", authMiddleware, CommunityController.likePost);
apiRouter.get("/community/posts/:id/comments", authMiddleware, CommunityController.listComments);
apiRouter.post("/community/posts/:id/comments", authMiddleware, CommunityController.createComment);
apiRouter.delete("/community/posts/:id", authMiddleware, CommunityController.deletePost);
apiRouter.delete("/community/comments/:id", authMiddleware, CommunityController.deleteComment);

// --- WORKSPACE DRIVE & DOCS ---
apiRouter.post("/workspace/drive/upload-certificate", authMiddleware, WorkspaceController.uploadCertificate);
apiRouter.post("/workspace/docs/export-course", authMiddleware, WorkspaceController.exportCourse);

// --- CHALLENGES & LENORMAND WEEKLY ---
apiRouter.post("/challenges/update", authMiddleware, AuthController.updateProfile); // update xp / stats
apiRouter.post("/challenges/lenormand-evaluate", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { spreadIndex, interpretation } = req.body;
  if (!interpretation || interpretation.trim().length < 5) {
    return res.json({ 
      approved: false, 
      feedback: "Seu canal intuitivo parece tímido. Escreva uma interpretação mais rica (pelo menos 5 caracteres) para que a egrégora de Lenormand consiga ressonar." 
    });
  }

  const spreads = [
    { name: "O Cavaleiro + O Trevo", cards: "Carta 1 + Carta 2", desc: "Movimento rápido trazendo sorte passageira, pequenos obstáculos superados por ações velozes." },
    { name: "A Casa + O Navio", cards: "Carta 4 + Carta 3", desc: "Planos ou desejos de mudança de lar, viagens familiares estruturadas de longa distância." },
    { name: "As Nuvens + O Sol", cards: "Carta 6 + Carta 31", desc: "Incertezas que se dissipam sob a luz radiante do progresso, superação absoluta após dúvidas mentais." }
  ];

  const currentSpread = spreads[spreadIndex];
  if (!currentSpread) {
    return res.status(400).json({ error: "Spread inválido para sintonização" });
  }

  try {
    const result = await GeminiService.evaluateLenormandSpread(currentSpread.name, currentSpread.desc, interpretation);
    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: "Erro ao avaliar spread cigano" });
  }
});

apiRouter.post("/challenges/lenormand-submit", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  const { isEarly } = req.body;
  if (!userId) return res.status(401).json({ error: "Não autorizado" });

  try {
    const standardXp = 350;
    const earlyBonusXp = 150;
    let totalXpAwarded = standardXp;
    if (isEarly) totalXpAwarded += earlyBonusXp;

    await query("UPDATE profiles SET xp = xp + $1 WHERE user_id = $2", [totalXpAwarded, userId]);
    await query("UPDATE challenges SET lenormand_completed = TRUE, lenormand_early = $1 WHERE user_id = $2", [!!isEarly, userId]);

    const message = isEarly 
      ? `SENSACIONAL! Você completou o Desafio do Oráculo Lenormand ANTECIPADAMENTE e desbloqueou +${standardXp} XP mais +${earlyBonusXp} XP de Bônus Cósmico!`
      : `Parabéns! Você completou o Desafio Semanal do Oráculo Lenormand e recebeu +${standardXp} XP.`;

    await query("INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'challenge')", [userId, message]);

    return res.json({ success: true, xpAwarded: totalXpAwarded, isEarly: !!isEarly, message });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao selar desafio Lenormand" });
  }
});

// --- NOTIFICATIONS AGGREGATOR ---
apiRouter.get("/notifications", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  try {
    const checkRes = await query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    return res.json(checkRes.rows.map(row => ({
      id: row.id,
      text: row.text,
      isRead: row.is_read,
      createdAt: row.created_at,
      type: row.type
    })));
  } catch (err) {
    return res.status(500).json({ error: "Falha de conexão com os sinais do éter" });
  }
});

apiRouter.post("/notifications/read-all", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  try {
    await query("UPDATE notifications SET is_read = TRUE WHERE user_id = $1", [userId]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao silenciar as transmissões" });
  }
});

apiRouter.post("/notifications/trigger", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  const { text, type } = req.body;
  try {
    await query("INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, $3)", [userId, text, type || "generic"]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao gerar sinal do éter" });
  }
});

// --- ORACLE GEMINI READERS ---
apiRouter.post("/oracle/generate", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { question, oracle, spreadType, learningFocus } = req.body;
  try {
    const ai = GeminiService; // uses fallback automatically
    const planObj = await ai.generateBirthChart("Estudante", "2026-05-24", "12:00", "Santuário"); // standard ask fallback or inline ask
    
    // Simulate Oracle spreads nicely using service or custom return
    const fallbackCards = oracle === "Runas" 
      ? ["Fehu (Riqueza)", "Ansuz (Sinal/Mensagem)", "Uruz (Força)"]
      : oracle === "Lenormand"
      ? ["O Cavaleiro", "A Estrela", "A Chave"]
      : ["O Louco", "A Sacerdotisa", "O Mundo"];

    return res.json({
      cards: fallbackCards,
      meanings: [
        "Representa novos começos, potencial ilimitado e saltos de fé.",
        "Indica intuição primária, sabedoria interior e reflexão silenciosa.",
        "Representa a manifestação completa, celebração e o fim de um ciclo de aprendizado."
      ],
      interpretation: `### A Visão do Portal Místico\n\nSua tiragem de ${oracle || "Tarot"} revela um fluxo contínuo de despertar. No seu foco de estudos (**${learningFocus || "Conexões Gerais"}**), as correntes espirituais mostram que a prática constante trará mais intuição. Confie na sabedoria interior!`,
      studyNote: "**Exercício de Fixação**: Desenhe os símbolos das cartas tiradas em seu grimório físico para fixação.",
      mode: "mock"
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao invocar energias celestiais." });
  }
});

apiRouter.post("/oracle/ask", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { question, spreadType } = req.body;
  try {
    return res.json({
      cards: ["A Imperatriz", "O Eremita"],
      interpretation: `### Resposta das Runas\n\nA Imperatriz aponta exuberância e fertilidade em seus projetos, enquanto O Eremita aconselha recolhimento e silêncio para processar os novos conhecimentos acumulados. Excelente momento para introspecção.`
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro na conexão com as forças astrais." });
  }
});

apiRouter.post("/oracle/free-birth-chart", async (req: AuthenticatedRequest, res: Response) => {
  const { fullName, birthDate, birthTime, birthLocation } = req.body;
  const userId = req.headers["x-user-id"] || req.user?.id;
  if (!fullName || !birthDate || !birthTime || !birthLocation) {
    return res.status(400).json({ error: "Todos os dados sagrados de nascimento são necessários" });
  }

  try {
    const chart = await GeminiService.generateBirthChart(fullName, birthDate, birthTime, birthLocation);
    if (userId) {
      await query(`
        INSERT INTO birth_charts (user_id, full_name, birth_date, birth_time, birth_location, chart_data)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id) DO UPDATE SET 
          full_name = $2, 
          birth_date = $3, 
          birth_time = $4, 
          birth_location = $5, 
          chart_data = $6
      `, [userId, fullName, birthDate, birthTime, birthLocation, JSON.stringify(chart)]);
    }
    return res.json(chart);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao gerar mapa astral" });
  }
});

// --- STUDY PLAN MOUNT ---
apiRouter.get("/study-plan", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  try {
    const match = await query("SELECT plan FROM study_plans WHERE user_id = $1", [userId]);
    if (match.rows.length === 0) return res.json({ plan: null });
    return res.json({ plan: typeof match.rows[0].plan === 'string' ? JSON.parse(match.rows[0].plan) : match.rows[0].plan });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao sintonizar plano de estudos" });
  }
});

apiRouter.post("/study-plan/generate", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  const { tarotProgress, weakness, goal } = req.body;
  if (!userId) return res.status(401).json({ error: "Não autorizado" });

  try {
    // Gather statistics
    let profile = { name: "Buscador", xp: 100, grau: "Grau I" };
    let challenges = {};
    let grimoireCount = 0;

    const pRes = await query("SELECT name, xp, grau FROM profiles WHERE user_id = $1", [userId]);
    if (pRes.rows.length > 0) profile = pRes.rows[0];

    const plan = await GeminiService.generateStudyPlan(profile, challenges, grimoireCount, tarotProgress, weakness, goal);
    
    await query(`
      INSERT INTO study_plans (user_id, plan) VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET plan = $2
    `, [userId, JSON.stringify(plan)]);

    await query(`
      INSERT INTO notifications (user_id, text, type)
      VALUES ($1, 'Seu Plano de Estudos Personalizado por IA foi revelado!', 'challenge')
    `, [userId]);

    return res.json({ success: true, plan });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao registrar o plano de estudos" });
  }
});

apiRouter.post("/study-plan/toggle-notification", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  const { taskId, enabled } = req.body;
  try {
    const spRes = await query("SELECT plan FROM study_plans WHERE user_id = $1", [userId]);
    if (spRes.rows.length === 0) return res.status(404).json({ error: "Plano não localizado" });
    const planObj = typeof spRes.rows[0].plan === 'string' ? JSON.parse(spRes.rows[0].plan) : spRes.rows[0].plan;
    const task = planObj.tasks.find((t: any) => t.id === taskId);
    if (task) {
      task.notificationsEnabled = enabled;
      await query("UPDATE study_plans SET plan = $1 WHERE user_id = $2", [JSON.stringify(planObj), userId]);
    }
    return res.json({ success: true, plan: planObj });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao processar notificações" });
  }
});

apiRouter.post("/study-plan/complete-task", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.headers["x-user-id"] || req.user?.id;
  const { taskId } = req.body;
  try {
    const spRes = await query("SELECT plan FROM study_plans WHERE user_id = $1", [userId]);
    if (spRes.rows.length === 0) return res.status(404).json({ error: "Plano não localizado" });
    const planObj = typeof spRes.rows[0].plan === 'string' ? JSON.parse(spRes.rows[0].plan) : spRes.rows[0].plan;
    const task = planObj.tasks.find((t: any) => t.id === taskId);
    if (task) {
      if (task.completed) return res.status(400).json({ error: "Tarefa já concluída" });
      task.completed = true;
      const awardXp = task.xp || 25;
      await query("UPDATE study_plans SET plan = $1 WHERE user_id = $2", [JSON.stringify(planObj), userId]);
      await query("UPDATE profiles SET xp = xp + $1 WHERE user_id = $2", [awardXp, userId]);
      await query("INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'challenge')", [userId, `Tarefa concluída: +${awardXp} XP`]);
    }
    return res.json({ success: true, plan: planObj });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao completar tarefa" });
  }
});

// --- AI NOTES ANALYSIS DIRECT ---
apiRouter.post("/ai/analyze-notes", authMiddleware, GrimoireController.analyzeNotes);
apiRouter.post("/ai/analyze-revenue", authMiddleware, CommunityController.analyzeRevenue);

// --- AI MODULE EVALUATION CHAT ---
apiRouter.post("/ai/evaluate-module", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { nodeName, message, history = [] } = req.body;
  if (!nodeName) {
    return res.status(400).json({ error: "nodeName é obrigatório" });
  }
  try {
    const reply = await GeminiService.evaluateModuleChat(nodeName, message, history);
    return res.json({ reply });
  } catch (err: any) {
    console.error("[AI Evaluate Module] Error:", err);
    return res.status(500).json({ error: "Erro ao avaliar módulo com IA" });
  }
});

export default apiRouter;
