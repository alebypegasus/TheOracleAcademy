import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AuthService } from "../services/auth.service";
import { query } from "../database/pool";

export class AuthController {
  // 1. POST /api/auth/register
  public static async register(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error("Register Controller Error:", err);
      return res.status(400).json({ error: err.message || "Erro ao registrar usuário nas estrelas" });
    }
  }

  // 2. POST /api/auth/login
  public static async login(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error("Login Controller Error:", err);
      return res.status(401).json({ error: err.message || "Erro ao consultar as runas de login" });
    }
  }

  // 3. POST /api/auth/firebase-sync
  public static async firebaseSync(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await AuthService.firebaseSync(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error("Firebase Sync Controller Error:", err);
      return res.status(500).json({ error: err.message || "Erro ao sincronizar credencial celestial externa" });
    }
  }

  // 4. GET /api/user/sync
  public static async syncUserState(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    try {
      // Get detailed profile
      const profileRes = await query(`
        SELECT 
          name, avatar, xp, nickname, phone, zip_code AS "zipCode", address, description, 
          portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter, 
          other_net AS "otherNet", show_phone AS "showPhone", show_address AS "showAddress",
          author_title AS "authorTitle", grau, location
        FROM profiles 
        WHERE user_id = $1
      `, [userId]);
      const profile = profileRes.rows[0];

      // Get settings
      const settingsRes = await query(
        "SELECT theme_preference as \"themePreference\", color_theme as \"colorTheme\" FROM settings WHERE user_id = $1",
        [userId]
      );
      const settings = settingsRes.rows[0];

      // Get challenges
      const challengesRes = await query(
        "SELECT completed_quiz as \"completedQuiz\", flashcard_count as \"flashcardCount\", flashcard_completed as \"flashcardCompleted\", completed_journal as \"completedJournal\", lenormand_completed as \"lenormandCompleted\", lenormand_early as \"lenormandEarly\" FROM challenges WHERE user_id = $1",
        [userId]
      );
      const challenges = challengesRes.rows[0];

      // Get grimoire entries
      const grimoireRes = await query(
        "SELECT id, date, question, spread_type as \"spreadType\", cards, interpretation, attachments FROM grimoire_entries WHERE user_id = $1 ORDER BY date DESC",
        [userId]
      );

      // Get saved birth chart
      const birthChartRes = await query(
        "SELECT full_name AS \"fullName\", birth_date AS \"birthDate\", birth_time AS \"birthTime\", birth_location AS \"birthLocation\", chart_data AS \"chartData\" FROM birth_charts WHERE user_id = $1",
        [userId]
      );
      const savedBirthChart = birthChartRes.rows[0] || null;

      // Get user plan info
      const userRes = await query(
        "SELECT id, email, role, plan, plan_expires_at AS \"planExpiresAt\", is_paid AS \"isPaid\" FROM users WHERE id = $1",
        [userId]
      );
      const userInfo = userRes.rows[0];

      return res.json({
        profile: profile || { name: 'Recluso', avatar: '', xp: 100 },
        settings: settings || { themePreference: 'dark', colorTheme: 'oracle' },
        challenges: challenges || { completedQuiz: false, flashcardCount: 0, flashcardCompleted: false, completedJournal: false, lenormandCompleted: false, lenormandEarly: false },
        grimoireEntries: grimoireRes.rows || [],
        savedBirthChart,
        user: userInfo ? {
          id: userInfo.id,
          email: userInfo.email,
          role: userInfo.role,
          plan: userInfo.plan || 'free',
          planExpiresAt: userInfo.planExpiresAt || null,
          isPaid: userInfo.isPaid
        } : null
      });
    } catch (err: any) {
      console.error("Sync Controller Error:", err);
      return res.status(500).json({ error: "Erro ao sincronizar dados cósmicos" });
    }
  }

  // 5. POST /api/profile/update
  public static async updateProfile(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    const { 
      name, avatar, xp, nickname, phone, zipCode, address, description,
      portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter,
      otherNet, showPhone, showAddress, authorTitle, grau, location
    } = req.body;

    try {
      await query(`
        INSERT INTO profiles (
          user_id, name, avatar, xp, nickname, phone, zip_code, address, description,
          portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter,
          other_net, show_phone, show_address, author_title, grau, location
        ) VALUES ($1, $2, $3, COALESCE($4, 100), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        ON CONFLICT (user_id) DO UPDATE SET
          name = COALESCE($2, profiles.name),
          avatar = COALESCE($3, profiles.avatar),
          xp = COALESCE($4, profiles.xp),
          nickname = COALESCE($5, profiles.nickname),
          phone = COALESCE($6, profiles.phone),
          zip_code = COALESCE($7, profiles.zip_code),
          address = COALESCE($8, profiles.address),
          description = COALESCE($9, profiles.description),
          portfolio = COALESCE($10, profiles.portfolio),
          website = COALESCE($11, profiles.website),
          whatsapp = COALESCE($12, profiles.whatsapp),
          telegram = COALESCE($13, profiles.telegram),
          facebook = COALESCE($14, profiles.facebook),
          instagram = COALESCE($15, profiles.instagram),
          x_twitter = COALESCE($16, profiles.x_twitter),
          other_net = COALESCE($17, profiles.other_net),
          show_phone = COALESCE($18, profiles.show_phone),
          show_address = COALESCE($19, profiles.show_address),
          author_title = COALESCE($20, profiles.author_title),
          grau = COALESCE($21, profiles.grau),
          location = COALESCE($22, profiles.location)
      `, [
        userId, name, avatar, xp, nickname, phone, zipCode, address, description,
        portfolio, website, whatsapp, telegram, facebook, instagram, x_twitter,
        otherNet, showPhone, showAddress, authorTitle, grau, location
      ]);
      
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Profile Update Controller Error:", err);
      return res.status(500).json({ error: "Erro ao gravar dados do buscador" });
    }
  }

  // 6. POST /api/settings/update
  public static async updateSettings(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { themePreference, colorTheme } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Acesso não autorizado" });
    }

    try {
      await query(
        `INSERT INTO settings (user_id, theme_preference, color_theme) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (user_id) DO UPDATE SET 
           theme_preference = COALESCE($2, settings.theme_preference), 
           color_theme = COALESCE($3, settings.color_theme)`,
        [userId, themePreference, colorTheme]
      );
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Settings Update Controller Error:", err);
      return res.status(500).json({ error: "Erro ao gravar preferências" });
    }
  }
}
