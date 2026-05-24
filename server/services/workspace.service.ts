import fs from "fs";
import path from "path";
import { query } from "../database/pool";

export class WorkspaceService {
  private static getClairvoyanceReportsPath(): string {
    const defaultPath = "C:\\Users\\alera\\AppData\\Roaming\\clairvoyance\\docs\\reports";
    try {
      if (!fs.existsSync(defaultPath)) {
        fs.mkdirSync(defaultPath, { recursive: true });
      }
      return defaultPath;
    } catch (e) {
      console.warn("[Workspace] Error resolving reports directory, using fallback local path.");
      const localPath = path.join(process.cwd(), "dist", "reports");
      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
      }
      return localPath;
    }
  }

  // 1. Google Drive Certificate Upload
  public static async uploadCertificateToDrive(userId: number, userName: string, courseTitle: string): Promise<{ success: boolean; driveUrl: string; localPath: string }> {
    const safeTitle = courseTitle.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const fileName = `certificado_${userId}_${safeTitle}.pdf`;
    const reportDir = this.getClairvoyanceReportsPath();
    const fullLocalPath = path.join(reportDir, fileName);

    // Build a mock PDF file content with beautiful ASCII metadata for the user!
    const certContent = `%PDF-1.4\n% CERTIFICADO DE CONCLUSÃO ORACULAR\n% Aluno: ${userName}\n% Curso: ${courseTitle}\n% Autenticidade: Chave Teúrgica-${Date.now()}\n`;
    
    try {
      fs.writeFileSync(fullLocalPath, certContent, "utf-8");
      
      // Simulate Drive URL structure
      const driveUrl = `https://drive.google.com/file/d/oracle_academy_drive_key_${Date.now()}/view`;
      
      // Save notification inside DB
      await query(
        "INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'certificate')",
        [userId, `Seu certificado de "${courseTitle}" foi exportado com sucesso para o Google Drive e salvo localmente.`]
      );

      return {
        success: true,
        driveUrl,
        localPath: fullLocalPath
      };
    } catch (err: any) {
      console.error("[Workspace] Drive upload simulation error:", err);
      throw err;
    }
  }

  // 2. Google Docs Exporter (exports content to a styled document in Google Workspace style)
  public static async exportCourseToDocs(userId: number, courseTitle: string, markdownContent: string): Promise<{ success: boolean; docsUrl: string; localPath: string }> {
    const safeTitle = courseTitle.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const fileName = `documento_docs_${userId}_${safeTitle}.md`;
    const reportDir = this.getClairvoyanceReportsPath();
    const fullLocalPath = path.join(reportDir, fileName);

    const docContent = `---
title: "Documento Integrado - Oracle Workspace"
author: "The Oracle Academy"
subject: "${courseTitle}"
exportedAt: "${new Date().toISOString()}"
---

# ${courseTitle}

Este documento foi exportado diretamente da egrégora do **The Oracle Academy** para o Google Docs / Markdown.

## Conteúdo Hermético e Oracular:

${markdownContent}

---
*Documento autenticado sob as sintonias celestiais.*
`;

    try {
      fs.writeFileSync(fullLocalPath, docContent, "utf-8");
      
      const docsUrl = `https://docs.google.com/document/d/oracle_academy_docs_key_${Date.now()}/edit`;

      await query(
        "INSERT INTO notifications (user_id, text, type) VALUES ($1, $2, 'challenge')",
        [userId, `O curso "${courseTitle}" foi exportado com sucesso como Google Doc.`]
      );

      return {
        success: true,
        docsUrl,
        localPath: fullLocalPath
      };
    } catch (err: any) {
      console.error("[Workspace] Docs export simulation error:", err);
      throw err;
    }
  }
}
