import { query } from "../database/pool";
import { coursesQuery, useCoursesFallback, fallbackCoursesDB } from "../database/courses_pool";
import { GeminiService } from "./gemini.service";

export class CourseService {
  // Get all courses from the database
  public static async getAllCourses(): Promise<any[]> {
    const res = await coursesQuery("SELECT * FROM courses ORDER BY created_at DESC");
    return res.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      content: typeof row.content === "string" ? JSON.parse(row.content) : row.content,
      author: row.author,
      status: row.status,
      createdAt: row.created_at
    }));
  }

  // Get course by ID
  public static async getCourseById(id: number): Promise<any> {
    const res = await coursesQuery("SELECT * FROM courses WHERE id = $1", [id]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      content: typeof row.content === "string" ? JSON.parse(row.content) : row.content,
      author: row.author,
      status: row.status,
      createdAt: row.created_at
    };
  }

  // AI Course Generator: Only generate if not exist!
  public static async generateOrGetCourse(topic: string): Promise<any> {
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      throw new Error("Tema de curso inválido");
    }

    // 1. Search for title similarity in Database
    const searchTerm = `%${cleanTopic}%`;
    const checkRes = await coursesQuery(
      "SELECT * FROM courses WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 1",
      [searchTerm]
    );

    if (checkRes.rows.length > 0) {
      const existing = checkRes.rows[0];
      console.log(`[Course AI] Retornando curso existente para o tema "${cleanTopic}": ID ${existing.id}`);
      return {
        id: existing.id,
        title: existing.title,
        description: existing.description,
        content: typeof existing.content === "string" ? JSON.parse(existing.content) : existing.content,
        author: existing.author,
        status: existing.status,
        createdAt: existing.created_at,
        source: "database"
      };
    }

    // Double check fallbackDB for local development
    if (useCoursesFallback) {
      const match = fallbackCoursesDB.courses.find(c => 
        c.title.toLowerCase().includes(cleanTopic.toLowerCase()) || 
        c.description.toLowerCase().includes(cleanTopic.toLowerCase())
      );
      if (match) {
        console.log(`[Course AI Fallback] Retornando curso em memória: ${match.title}`);
        return { ...match, source: "fallbackCoursesDB" };
      }
    }

    // 2. Generate new course via Gemini AI
    console.log(`[Course AI] Gerando novo curso sobre "${cleanTopic}" via Gemini...`);
    const aiCourse = await GeminiService.generateCourse(cleanTopic);

    // Add INNER_PATH standard options to nodes inside Modules for complete educational workflow compliance
    const enrichedContent = aiCourse.content.map((mod: any) => ({
      ...mod,
      nodes: mod.nodes.map((node: any) => ({
        ...node,
        bgGlow: mod.bgGlow || "bg-indigo-500",
        tailwindColor: node.tailwindColor || "bg-indigo-500"
      }))
    }));

    // 3. Save new course in database
    let savedId = 999;
    let savedCreatedAt = new Date().toISOString();

    if (!useCoursesFallback) {
      try {
        const insertRes = await coursesQuery(
          "INSERT INTO courses (title, description, content, author, status) VALUES ($1, $2, $3, 'IA', 'gerado') RETURNING id, created_at",
          [aiCourse.title, aiCourse.description, JSON.stringify(enrichedContent)]
        );
        savedId = insertRes.rows[0].id;
        savedCreatedAt = insertRes.rows[0].created_at;
      } catch (err) {
        console.error("[Course AI] Erro ao persistir novo curso no Postgres:", err);
      }
    } else {
      savedId = fallbackCoursesDB.courses.length + 1;
      const memObj = {
        id: savedId,
        title: aiCourse.title,
        description: aiCourse.description,
        content: enrichedContent,
        author: "IA",
        status: "gerado",
        created_at: savedCreatedAt
      };
      fallbackCoursesDB.courses.push(memObj);
    }

    return {
      id: savedId,
      title: aiCourse.title,
      description: aiCourse.description,
      content: enrichedContent,
      author: "IA",
      status: "gerado",
      createdAt: savedCreatedAt,
      source: "gemini_generation"
    };
  }

  // Complete a course step and award XP (Remains in main DB pool)
  public static async completeStep(userId: number, nodeName: string, lessonTitle: string, isQuiz: boolean, score: number): Promise<number> {
    let awardXp = 30;
    let msg = `Você concluiu a lição "${lessonTitle}" em "${nodeName}"! (+30 XP)`;

    if (isQuiz) {
      awardXp = 50;
      msg = `Você completou a Avaliação de "${nodeName}" com nota de ${score}%! (+50 XP)`;

      await query(
        "INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'certificate')",
        [userId, `Parabéns! Desbloqueou o distintivo por sintonizar o módulo "${nodeName}".`]
      );

      await query(
        "UPDATE challenges SET completed_quiz = TRUE WHERE user_id = $1",
        [userId]
      );
    }

    // Award XP in profiles
    await query("UPDATE profiles SET xp = xp + $1 WHERE user_id = $2", [awardXp, userId]);

    // Save notification
    await query(
      "INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'challenge')",
      [userId, msg]
    );

    return awardXp;
  }

  // Retrieve lesson content by node ID from separate courses DB
  public static async getNodeContent(nodeId: string): Promise<any> {
    const res = await coursesQuery("SELECT * FROM course_node_contents WHERE node_id = $1", [nodeId]);
    if (res.rows.length === 0) return null;
    return res.rows[0];
  }

  // Save or update lesson content by node ID in separate courses DB
  public static async saveNodeContent(nodeId: string, courseId: number, markdownContent: string): Promise<any> {
    const res = await coursesQuery(`
      INSERT INTO course_node_contents (node_id, course_id, markdown_content, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (node_id) DO UPDATE SET 
        markdown_content = $3,
        updated_at = NOW()
      RETURNING *
    `, [nodeId, courseId || 1, markdownContent]);
    return res.rows[0];
  }
}
