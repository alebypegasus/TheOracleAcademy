import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { query, useFallback, fallbackDB } from "../database/pool";

export class EgregorasController {
  // Listar todas as egrégoras
  public static async listGroups(req: AuthenticatedRequest, res: Response) {
    try {
      if (useFallback) {
        return res.json(fallbackDB.community_groups || []);
      }
      const result = await query("SELECT * FROM community_groups ORDER BY created_at DESC");
      return res.json(result.rows);
    } catch (err) {
      console.error("List Groups Error:", err);
      return res.status(500).json({ error: "Erro ao listar egrégoras" });
    }
  }

  // Criar uma nova egrégora
  public static async createGroup(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const { name, description, coverImage, isPrivate } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: "Nome e criador são necessários" });
    }

    try {
      if (useFallback) {
        const newGroup = {
          id: (fallbackDB.community_groups?.length || 0) + 1,
          name,
          description,
          cover_image: coverImage || '',
          owner_id: userId,
          members_count: 1,
          is_private: isPrivate || false,
          created_at: new Date().toISOString()
        };
        fallbackDB.community_groups = fallbackDB.community_groups || [];
        fallbackDB.community_groups.push(newGroup);
        return res.json(newGroup);
      }

      const result = await query(
        `INSERT INTO community_groups (name, description, cover_image, owner_id, is_private)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, description, coverImage || '', userId, isPrivate || false]
      );

      const group = result.rows[0];

      // Insert owner as admin member
      await query(
        `INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, 'owner')`,
        [group.id, userId]
      );

      return res.json(group);
    } catch (err) {
      console.error("Create Group Error:", err);
      return res.status(500).json({ error: "Erro ao criar egrégora" });
    }
  }
}
