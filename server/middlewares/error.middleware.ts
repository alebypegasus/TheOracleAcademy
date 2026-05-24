import { Request, Response, NextFunction } from "express";

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("[Backend Error Catch-All]:", err);

  const status = err.status || 500;
  const message = err.message || "Erro Interno no Servidor Astral";

  if (req.path.startsWith("/api/")) {
    return res.status(status).json({
      error: message
    });
  }

  return res.status(status).send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #080510; color: #e2e8f0; min-height: 100vh;">
      <h1 style="color: #6366f1;">O Caminho Entrou em Eclipse</h1>
      <p style="color: #94a3b8;">${message}</p>
      <a href="/" style="color: #818cf8; text-decoration: none; font-weight: bold;">Voltar ao Santuário</a>
    </div>
  `);
}
