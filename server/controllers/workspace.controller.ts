import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { WorkspaceService } from "../services/workspace.service";
import { query } from "../database/pool";

export class WorkspaceController {
  // 1. POST /api/workspace/drive/upload-certificate
  public static async uploadCertificate(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { courseTitle } = req.body;

    if (!userId || !courseTitle) {
      return res.status(400).json({ error: "Parâmetros incompletos para emissão" });
    }

    try {
      // Fetch profile name
      let name = "Buscador";
      const pRes = await query("SELECT name FROM profiles WHERE user_id = $1", [userId]);
      if (pRes.rows.length > 0) {
        name = pRes.rows[0].name;
      }

      const result = await WorkspaceService.uploadCertificateToDrive(Number(userId), name, courseTitle);
      return res.json(result);
    } catch (err: any) {
      console.error("Upload Certificate Controller Error:", err);
      return res.status(500).json({ error: "Erro ao registrar certificado no Google Drive" });
    }
  }

  // 2. POST /api/workspace/docs/export-course
  public static async exportCourse(req: AuthenticatedRequest, res: Response) {
    const userId = req.headers["x-user-id"] || req.user?.id;
    const { courseTitle, content } = req.body;

    if (!userId || !courseTitle || !content) {
      return res.status(400).json({ error: "Dados insuficientes para exportação Workspace" });
    }

    try {
      const result = await WorkspaceService.exportCourseToDocs(Number(userId), courseTitle, content);
      return res.json(result);
    } catch (err: any) {
      console.error("Export Course Controller Error:", err);
      return res.status(500).json({ error: "Erro ao exportar conteúdo para Google Docs" });
    }
  }
}
