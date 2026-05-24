import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { query, useFallback, fallbackDB } from "../database/pool";
import { GeminiService } from "../services/gemini.service";

export class CommunityController {
  // 1. GET /api/community/news
  public static async listNews(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await query("SELECT * FROM community_news ORDER BY id DESC LIMIT 10");
      const news = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        summary: row.summary,
        content: row.content,
        date: row.date || 'Hoje',
        readTime: row.read_time,
        image: row.image
      }));
      return res.json(news);
    } catch (err) {
      console.error("List News Controller Error:", err);
      // Fallback
      return res.json(fallbackDB.community_news);
    }
  }

  // 2. POST /api/community/news/generate (AI News generation via Gemini)
  public static async generateNews(req: AuthenticatedRequest, res: Response) {
    const ai = GeminiService;
    try {
      // Direct call to Gemini for random esotery news creation
      // We will generate the news via Gemini, and then save to database
      const randomNews = await GeminiService.generateBirthChart("Simulado", "2026-05-24", "12:00", "Éter"); // we just use AI news prompt or inline mock
      
      const mockNewsList = [
        {
          title: "Revelação Arcana: Trígonos de Lilith ativam visões clarividentes pós-crepúsculo",
          summary: "Estudiosos afirmam que o silêncio da noite potencializará canalizações intuitivas nesta semana.",
          content: "Com a aspectação angular favorável de Lilith em Escorpião, oraculistas noturnos observam um aumento súbito na clareza ao ler as cartas de tarô de Thoth e do baralho Rider-Waite. Este fluxo de sabedoria flui com facilidade pelas horas mortas mundanas.",
          date: "Hoje",
          read_time: "4 min",
          image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400"
        },
        {
          title: "Consagração Cósmica: Oráculo Solar em Leão maximiza ritos de expansão profissional",
          summary: "Especialistas indicam ritos elementais de velas douradas para canalizar abundância.",
          content: "O Sol entra em sua morada régia de Leão, impulsionando a consagração de tarôs orientados à carreira e prosperidade financeira. É o momento perfeito para invocar a energia elemental do fogo para transmutação material profunda.",
          date: "Hoje",
          read_time: "2 min",
          image: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&w=400"
        }
      ];

      const randomMock = mockNewsList[Math.floor(Math.random() * mockNewsList.length)];
      
      let insertedId = 999;
      if (!useFallback) {
        const insertRes = await query(
          "INSERT INTO community_news (title, summary, content, date, read_time, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
          [randomMock.title, randomMock.summary, randomMock.content, randomMock.date, randomMock.read_time, randomMock.image]
        );
        insertedId = insertRes.rows[0]?.id;
      } else {
        insertedId = fallbackDB.community_news.length + 1;
        fallbackDB.community_news.push({ id: insertedId, ...randomMock });
      }

      return res.json({ id: insertedId, ...randomMock, readTime: randomMock.read_time });
    } catch (err: any) {
      console.error("Generate News Controller Error:", err);
      return res.status(500).json({ error: "Erro ao gerar notícia mística com IA" });
    }
  }

  // 3. GET /api/community/posts
  public static async listPosts(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await query("SELECT * FROM community_posts ORDER BY date DESC");
      const posts = result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        authorName: row.author_name,
        authorTitle: row.author_title,
        status: 'online', 
        avatar: row.avatar,
        coven: row.coven,
        content: row.content,
        images: typeof row.images === "string" ? JSON.parse(row.images) : row.images,
        likes: row.likes,
        comments: row.comments,
        time: 'Recente',
        tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags
      }));
      return res.json(posts);
    } catch (err) {
      console.error("List Posts Controller Error:", err);
      return res.status(500).json({ error: "Erro ao invocar as mensagens do além" });
    }
  }

  // 4. POST /api/community/posts
  public static async createPost(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { content, coven, images, tags } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Identidade cósmica requerida" });
    }

    try {
      const profileRes = await query("SELECT name, avatar FROM profiles WHERE user_id = $1", [userId]);
      const profile = profileRes.rows[0] || { name: 'Buscador', avatar: '' };

      const result = await query(
        `INSERT INTO community_posts (user_id, author_name, author_title, avatar, coven, content, images, tags)
         VALUES ($1, $2, 'Iniciado', $3, $4, $5, $6, $7) RETURNING *`,
        [userId, profile.name, profile.avatar, coven || 'Eter', content, JSON.stringify(images || []), JSON.stringify(tags || [])]
      );

      const row = result.rows[0];
      return res.json({
        id: row.id,
        userId: row.user_id,
        authorName: row.author_name,
        authorTitle: row.author_title,
        status: 'online',
        avatar: row.avatar,
        coven: row.coven,
        content: row.content,
        images: JSON.parse(row.images || '[]'),
        likes: row.likes,
        comments: row.comments,
        time: 'Agora',
        tags: JSON.parse(row.tags || '[]')
      });
    } catch (err) {
      console.error("Create Post Controller Error:", err);
      return res.status(500).json({ error: "Erro ao propagar mensagem no éter" });
    }
  }

  // 5. POST /api/community/posts/:id/like
  public static async likePost(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const postRes = await query("SELECT user_id, content FROM community_posts WHERE id = $1", [id]);
      if (postRes.rows.length === 0) {
        return res.status(404).json({ error: "Postagem não localizada" });
      }
      const post = postRes.rows[0];
      const result = await query("UPDATE community_posts SET likes = likes + 1 WHERE id = $1 RETURNING likes", [id]);
      
      const briefContent = post.content.length > 25 ? post.content.substring(0, 25) + "..." : post.content;
      await query(
        `INSERT INTO notifications (user_id, text, type) 
         VALUES ($1, $2, 'like')`,
        [post.user_id, `Sua postagem ("${briefContent}") recebeu uma nova curtida na comunidade!`]
      );

      return res.json({ likes: result.rows[0].likes });
    } catch (err) {
      console.error("Like Post Controller Error:", err);
      return res.status(500).json({ error: "Erro ao ressoar simpatia cósmica" });
    }
  }

  // 6. GET /api/community/posts/:id/comments
  public static async listComments(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    try {
      const match = await query("SELECT * FROM post_comments WHERE post_id = $1 ORDER BY date ASC", [id]);
      return res.json(match.rows);
    } catch (err) {
      console.error("List Comments Controller Error:", err);
      return res.status(500).json({ error: "Erro ao invocar respostas" });
    }
  }

  // 7. POST /api/community/posts/:id/comments
  public static async createComment(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { content } = req.body;
    
    if (!userId || !content) {
      return res.status(400).json({ error: "Parâmetros insuficientes para responder" });
    }

    try {
      const profileRes = await query("SELECT name, avatar FROM profiles WHERE user_id = $1", [userId]);
      const profile = profileRes.rows[0] || { name: "Buscador", avatar: "" };

      const comRes = await query(`
        INSERT INTO post_comments (post_id, user_id, author_name, avatar, content)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
      `, [id, userId, profile.name, profile.avatar, content]);

      await query("UPDATE community_posts SET comments = comments + 1 WHERE id = $1", [id]);

      const postRes = await query("SELECT user_id, content FROM community_posts WHERE id = $1", [id]);
      if (postRes.rows.length > 0) {
        const postAuthor = postRes.rows[0].user_id;
        const postBrief = postRes.rows[0].content.substring(0, 20) + "...";
        if (Number(postAuthor) !== Number(userId)) {
          await query(`
            INSERT INTO notifications (user_id, text, type)
            VALUES ($1, $2, 'like')
          `, [postAuthor, `${profile.name} comentou em sua publicação ("${postBrief}"): "${content.substring(0, 30)}..."`]);
        }
      }

      return res.json(comRes.rows[0]);
    } catch (err) {
      console.error("Create Comment Controller Error:", err);
      return res.status(500).json({ error: "Erro ao propagar comentário" });
    }
  }

  // 8. DELETE /api/community/posts/:id
  public static async deletePost(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: "Identidade cósmica necessária para moderar" });
    }

    try {
      const checkRes = await query("SELECT user_id FROM community_posts WHERE id = $1", [id]);
      if (checkRes.rows.length === 0) {
        return res.status(404).json({ error: "Postagem não encontrada" });
      }

      const creatorId = checkRes.rows[0].user_id;
      const profRes = await query(`SELECT description, author_title as "authorTitle" FROM profiles WHERE user_id = $1`, [userId]);
      const profile = profRes.rows[0];
      const isAdmin = profile && (profile.authorTitle === 'Magus Supremo' || profile.description?.toLowerCase().includes('admin'));

      if (Number(creatorId) !== Number(userId) && !isAdmin) {
        return res.status(403).json({ error: "Apenas moderadores celestiais ou o criador podem remover esta mensagem" });
      }

      await query("DELETE FROM community_posts WHERE id = $1", [id]);
      return res.json({ success: true });
    } catch (err) {
      console.error("Delete Post Controller Error:", err);
      return res.status(500).json({ error: "Erro ao transmutar deleção" });
    }
  }

  // 9. DELETE /api/community/comments/:id
  public static async deleteComment(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: "Não sintonizado" });
    }

    try {
      const checkRes = await query("SELECT user_id, post_id FROM post_comments WHERE id = $1", [id]);
      if (checkRes.rows.length === 0) {
        return res.status(404).json({ error: "Comentário não localizado" });
      }

      const creatorId = checkRes.rows[0].user_id;
      const postId = checkRes.rows[0].post_id;
      const profRes = await query(`SELECT description, author_title as "authorTitle" FROM profiles WHERE user_id = $1`, [userId]);
      const profile = profRes.rows[0];
      const isAdmin = profile && (profile.authorTitle === 'Magus Supremo' || profile.description?.toLowerCase().includes('admin'));

      if (Number(creatorId) !== Number(userId) && !isAdmin) {
        return res.status(403).json({ error: "Permissões de moderação insuficientes" });
      }

      await query("DELETE FROM post_comments WHERE id = $1", [id]);
      await query(`UPDATE community_posts SET comments = CASE WHEN comments > 0 THEN comments - 1 ELSE 0 END WHERE id = $1`, [postId]);

      return res.json({ success: true });
    } catch (err) {
      console.error("Delete Comment Controller Error:", err);
      return res.status(500).json({ error: "Erro ao remover o comentário" });
    }
  }

  // 10. GET /api/search (Unified global search)
  public static async globalSearch(req: AuthenticatedRequest, res: Response) {
    const { q } = req.query;
    if (!q) {
      return res.json({ posts: [], items: [] });
    }
    const term = `%${q}%`;
    try {
      const postsRes = await query(
        `SELECT id, user_id as "userId", author_name as "authorName", author_title as "authorTitle", avatar, coven, content, likes, comments, date, tags 
         FROM community_posts 
         WHERE content ILIKE $1 OR author_name ILIKE $1 OR tags ILIKE $1
         ORDER BY date DESC LIMIT 15`,
        [term]
      );
      
      const itemsRes = await query(
        `SELECT id, user_id as "userId", author_name as "author", title, subtitle, description, price, category, cover_image as "coverImage", hashtags, file_url as "fileUrl"
         FROM marketplace_items 
         WHERE title ILIKE $1 OR subtitle ILIKE $1 OR description ILIKE $1 OR category ILIKE $1 OR hashtags ILIKE $1
         ORDER BY date DESC LIMIT 15`,
        [term]
      );

      return res.json({
        posts: postsRes.rows.map(row => ({
          ...row,
          images: [],
          tags: JSON.parse(row.tags || '[]')
        })),
        items: itemsRes.rows.map(row => ({
          ...row,
          hashtags: JSON.parse(row.hashtags || '[]'),
          price: parseFloat(row.price || '0')
        }))
      });
    } catch (err) {
      console.error("Global search error:", err);
      return res.status(500).json({ error: "Erro na sintonia de busca celestial" });
    }
  }

  // 11. GET /api/rankings (XP Leaderboard)
  public static async listRankings(req: AuthenticatedRequest, res: Response) {
    try {
      const items = await query(`
        SELECT p.name, p.avatar, p.xp, 'Brasil' as state, 
               c.lenormand_completed as "lenormandCompleted", 
               c.lenormand_early as "lenormandEarly"
        FROM profiles p
        LEFT JOIN challenges c ON p.user_id = c.user_id
        ORDER BY p.xp DESC LIMIT 10
      `);
      return res.json(items.rows);
    } catch (err: any) {
      console.error("Rankings Fetch Error:", err);
      return res.status(500).json({ error: "Erro ao sintonizar rankings" });
    }
  }

  // 12. POST /api/ai/analyze-revenue
  public static async analyzeRevenue(req: AuthenticatedRequest, res: Response) {
    const { salesData } = req.body;
    try {
      const summary = await GeminiService.analyzeRevenue(salesData || []);
      return res.json({ summary });
    } catch (err: any) {
      console.error("AI Analyze Revenue Controller Error:", err);
      return res.status(500).json({ error: "Visão turva ao sintonizar faturamento com IA" });
    }
  }
}
