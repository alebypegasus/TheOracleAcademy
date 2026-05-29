import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { query, useFallback, fallbackDB } from "../database/pool";

export class FriendsController {
  // Listar amigos
  public static async listFriends(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Acesso negado" });

    try {
      if (useFallback) {
        return res.json([]); // Para simplificar o stub
      }

      const result = await query(`
        SELECT u.id, u.email, p.name, p.avatar, p.author_title, 
               f.status as friendship_status
        FROM friendships f
        JOIN users u ON (f.user1_id = u.id OR f.user2_id = u.id)
        LEFT JOIN profiles p ON p.user_id = u.id
        WHERE (f.user1_id = $1 OR f.user2_id = $1)
          AND u.id != $1
          AND f.status = 'accepted'
      `, [userId]);

      return res.json(result.rows);
    } catch (err) {
      console.error("List Friends Error:", err);
      return res.status(500).json({ error: "Erro ao listar amigos" });
    }
  }
}

export class ChatController {
  // Listar mensagens entre dois usuários
  public static async getDirectMessages(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const { friendId } = req.params;

    if (!userId) return res.status(401).json({ error: "Acesso negado" });

    try {
      if (useFallback) {
        return res.json(fallbackDB.direct_messages?.filter(m => 
          (m.sender_id === userId && m.receiver_id === Number(friendId)) ||
          (m.receiver_id === userId && m.sender_id === Number(friendId))
        ).sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()) || []);
      }

      const result = await query(`
        SELECT * FROM direct_messages 
        WHERE (sender_id = $1 AND receiver_id = $2)
           OR (sender_id = $2 AND receiver_id = $1)
        ORDER BY sent_at ASC
      `, [userId, friendId]);

      return res.json(result.rows);
    } catch (err) {
      console.error("Get DMs Error:", err);
      return res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
  }

  // Enviar mensagem
  public static async sendMessage(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const { receiverId, content, format, mediaUrl } = req.body;

    if (!userId || !receiverId || !content) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    try {
      if (useFallback) {
        const msg = {
          id: (fallbackDB.direct_messages?.length || 0) + 1,
          sender_id: userId,
          receiver_id: receiverId,
          content,
          format: format || 'text',
          media_url: mediaUrl || '',
          read: false,
          sent_at: new Date().toISOString()
        };
        fallbackDB.direct_messages = fallbackDB.direct_messages || [];
        fallbackDB.direct_messages.push(msg);
        return res.json(msg);
      }

      const result = await query(`
        INSERT INTO direct_messages (sender_id, receiver_id, content, format, media_url)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `, [userId, receiverId, content, format || 'text', mediaUrl || '']);

      return res.json(result.rows[0]);
    } catch (err) {
      console.error("Send DM Error:", err);
      return res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  }
}
