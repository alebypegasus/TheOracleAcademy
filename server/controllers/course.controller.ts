import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CourseService } from "../services/course.service";
import { GeminiService } from "../services/gemini.service";
import { query } from "../database/pool";

export class CourseController {
  // 1. GET /api/courses
  public static async listCourses(req: AuthenticatedRequest, res: Response) {
    try {
      const courses = await CourseService.getAllCourses();
      return res.json(courses);
    } catch (err: any) {
      console.error("List Courses Controller Error:", err);
      return res.status(500).json({ error: "Erro ao ler catálogo de cursos" });
    }
  }

  // 2. POST /api/courses/generate
  public static async generateCourse(req: AuthenticatedRequest, res: Response) {
    const { topic } = req.body;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "O tema do curso é obrigatório para invocar a IA." });
    }

    try {
      const course = await CourseService.generateOrGetCourse(topic);
      return res.json(course);
    } catch (err: any) {
      console.error("Generate Course Controller Error:", err);
      return res.status(500).json({ error: err.message || "Erro ao decodificar curso com inteligência artificial" });
    }
  }

  // 3. POST /api/courses/complete-step
  public static async completeStep(req: AuthenticatedRequest, res: Response) {
    const userId = (req.headers["x-user-id"] as string) || req.user?.id;
    const { nodeName, lessonTitle, isQuiz, score = 0 } = req.body;
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    try {
      const xpAwarded = await CourseService.completeStep(Number(userId), nodeName, lessonTitle, !!isQuiz, Number(score));
      return res.json({ success: true, xpAwarded });
    } catch (err: any) {
      console.error("Complete Step Controller Error:", err);
      return res.status(500).json({ error: "Falha ao certificar lição" });
    }
  }

  // 4. GET /api/courses/node/:nodeId
  public static async getNodeContent(req: AuthenticatedRequest, res: Response) {
    const nodeId = req.params.nodeId as string;
    try {
      let nodeContent = await CourseService.getNodeContent(nodeId);
      
      const client = (GeminiService as any).getClient();

      // Generate if: (a) not exists OR (b) exists but is a short seed and Gemini is available
      const isSeedContent = nodeContent?.is_seed === true;
      const shouldGenerate = !nodeContent || (isSeedContent && !!client);

      if (shouldGenerate) {
        console.log(`[Node AI] ${isSeedContent ? 'Replacing seed with AI content' : 'Lesson not found'} for "${nodeId}". Generating...`);
        
        let stepNumber = 1;
        let baseNodeId = nodeId;
        if (nodeId.includes("-step-")) {
          const parts = nodeId.split("-step-");
          baseNodeId = parts[0];
          stepNumber = Number(parts[1]);
        }
        
        let topicName = baseNodeId.replace(/-/g, " ");
        
        const sourcesAndLocationsPrompt = `
No final do conteúdo, inclua OBRIGATORIAMENTE uma seção intitulada '### 📚 Fontes e Aprofundamento'.
Nesta seção, forneça exatamente:
1. 'Fontes Autorais (Exatamente 3)': Liste 3 fontes teóricas ou literárias reais (livros, autores clássicos de ocultismo ou tratados históricos) relevantes para este tema específico.
2. 'Locais de Estudo e Pesquisa (Exatamente 10)': Liste exatamente 10 locais físicos ou digitais de aprofundamento (como templos históricos, bibliotecas clássicas, acervos herméticos, museus ou egrégoras tradicionais) onde o estudante possa aprofundar a sabedoria oracular.`;

        let prompt = "";
        if (stepNumber === 1) {
          prompt = `Gere uma monografia/tratado teológico e acadêmico completo sobre o tema de estudos esotéricos: "${topicName}" com o subtema "Teoria e Fundamentos". 
O texto deve ser extremamente detalhado, denso e profundo, simulando um tempo de leitura de no mínimo 1 hora (mínimo de 1800 a 2000 palavras em português do Brasil).
Escreva com cabeçalhos ricos, explorando a egrégora cosmológica, origens antigas e reflexões neoplatônicas ou herméticas sobre a prática.
${sourcesAndLocationsPrompt}`;
        } else if (stepNumber === 2) {
          prompt = `Gere um guia prático guiado completo passo a passo sobre o tema esotérico: "${topicName}" com o subtema "Prática Guiada". 
O conteúdo deve ser extremamente prático, estruturado e sequencial, simulando um tempo de leitura e aplicação ritualística de no mínimo 30 minutos (mínimo de 1000 a 1200 palavras em português do Brasil).
Estruture com preparação física, respiração harmônica, sintonização do éter e passo a passo ordenado.
${sourcesAndLocationsPrompt}`;
        } else if (stepNumber === 3) {
          prompt = `Gere um manual crítico sobre os desvios, erros comuns e armadilhas ritualísticas na prática do tema esotérico: "${topicName}" com o subtema "Erros Comuns". 
O texto deve simular um tempo de leitura de no mínimo 30 minutos (mínimo de 1000 a 1200 palavras em português do Brasil), demonstrando desvios mentais e ritualísticos, contaminações energéticas e formas adequadas de banimento ou calibração.
${sourcesAndLocationsPrompt}`;
        } else if (stepNumber === 4) {
          prompt = `Gere um ensaio reflexivo e analítico profundo sob a perspectiva de "Visão Crítica" contemporânea, científica e cética do tema esotérico: "${topicName}". 
O texto deve ser muito rico e denso em paralelos sociológicos e psicológicos, simulando um tempo de leitura reflexiva de no mínimo 1 hora (mínimo de 1800 a 2000 palavras em português do Brasil).
${sourcesAndLocationsPrompt}`;
        } else if (stepNumber === 5) {
          prompt = `Gere exatamente 10 exercícios práticos e reflexivos altamente sequenciais de fixação de conhecimento sobre o tema esotérico: "${topicName}" com o subtema "Exercícios Práticos".
Cada exercício deve conter um título oracular, objetivo de fixação (mental, energético ou simbólico) e passos práticos de escrita e mentalização a serem anexados ao grimório do buscador.
Estruture em uma lista numerada detalhada de 1 a 10.
${sourcesAndLocationsPrompt}`;
        } else {
          prompt = `Gere um resumo teológico conciso e sintonizador de avaliação sobre o tema: "${topicName}" para preparar o buscador para a sabedoria cósmica final. Mínimo de 500 palavras.
${sourcesAndLocationsPrompt}`;
        }

        let generatedContent = "";
        if (client) {
          try {
            const response = await client.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
            });
            generatedContent = response.text?.trim() || "";
            if (generatedContent) {
              console.log(`[Node AI] ✅ Gemini generated ${generatedContent.length} chars for "${nodeId}"`);
            }
          } catch (aiErr) {
            console.error("[Node AI] Gemini generation failed:", aiErr);
          }
        }

        if (generatedContent) {
          // Save to DB (replaces seed or creates new)
          nodeContent = await CourseService.saveNodeContent(nodeId, 1, generatedContent);
          // Clear seed flag in memory if using fallback
          const { useCoursesFallback, fallbackCoursesDB } = await import("../database/courses_pool");
          if (useCoursesFallback) {
            const entry = fallbackCoursesDB.course_node_contents.find((c: any) => c.node_id === nodeId);
            if (entry) entry.is_seed = false;
          }
        } else if (!nodeContent) {
          // No AI and no content at all — use seed as last resort
          nodeContent = { node_id: nodeId, markdown_content: `# ${topicName}\n\nConteúdo sendo preparado...`, is_seed: true };
        }
      }

      return res.json(nodeContent);
    } catch (err: any) {
      console.error("Get Node Content Error:", err);
      return res.status(500).json({ error: "Erro ao sintonizar conteúdo da lição" });
    }
  }

  // 5. POST /api/courses/node/:nodeId
  public static async saveNodeContent(req: AuthenticatedRequest, res: Response) {
    const userId = (req.headers["x-user-id"] as string) || req.user?.id;
    const nodeId = req.params.nodeId as string;
    const { markdownContent, courseId = 1 } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    try {
      // High-security server check: query user in PostgreSQL to verify if their email is admin@admin.com
      const userRes = await query("SELECT email FROM users WHERE id = $1", [Number(userId)]);
      const email = userRes.rows[0]?.email;
      if (email !== 'admin@admin.com') {
        return res.status(403).json({ error: "Acesso negado. Apenas o Magus Supremo (admin@admin.com) tem permissão de consagração e alteração do saber." });
      }

      if (!markdownContent || !markdownContent.trim()) {
        return res.status(400).json({ error: "Conteúdo em Markdown é obrigatório" });
      }

      const updated = await CourseService.saveNodeContent(nodeId, Number(courseId), markdownContent);
      return res.json(updated);
    } catch (err: any) {
      console.error("Save Node Content Controller Error:", err);
      return res.status(500).json({ error: "Erro ao gravar conteúdo da lição no templo" });
    }
  }
}
