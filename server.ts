// Load .env manually (dotenv not installed)
import { readFileSync } from "fs";
import { resolve } from "path";
try {
  const envPath = resolve(process.cwd(), ".env");
  const envContent = readFileSync(envPath, "utf-8");
  for (const rawLine of envContent.split("\n")) {
    const trimmed = rawLine.replace(/\r/g, "").trim();  // handle CRLF
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value; // Always override (don't skip if already set)
  }
} catch { /* .env not found, skip */ }
import path from "path";
import { createServer as createViteServer } from "vite";
import express from "express";
import app from "./server/app";
import { initDB } from "./server/database/seed";
import { initCoursesDB } from "./server/database/courses_pool";
import { initPool } from "./server/database/pool";
import { initCoursesPool } from "./server/database/courses_pool";

const PORT = 3000;

function validateMercadoPagoCredentials() {
  console.log("=== \x1b[36mMercado Pago Setup Guide\x1b[0m ===");
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token || token.includes('TEST-1234567890')) {
    console.log("[\x1b[33mAVISO\x1b[0m] Credenciais de sandbox não foram injetadas!");
    console.log("        -> Para validar pagamentos reais, siga os passos:");
    console.log("           1. Acesse o painel de desenvolvedores do Mercado Pago.");
    console.log("           2. Gere suas chaves de Sandbox (Access Token).");
    console.log("           3. Crie ou adicione 'MERCADO_PAGO_ACCESS_TOKEN' no arquivo .env.");
    console.log("           4. Configure o Webhook IPN na URL: https://<seu-app>/api/payments/webhook com eventos 'payment'.");
  } else {
    console.log("[\x1b[32mOK\x1b[0m] Token do Mercado Pago detectado no ambiente.");
  }
  console.log("=====================================");
}

async function startServer() {
  validateMercadoPagoCredentials();

  // Initialize connection pools FIRST (after env vars are loaded at runtime)
  const dbUrl = process.env.DATABASE_URL || "(fallback)";
  console.log(`[PostgreSQL] Connecting to: ${dbUrl.replace(/:([^@]+)@/, ':***@')}`);
  initPool();
  initCoursesPool();

  // 1. Initialize DB tables and seed dynamic defaults
  try {
    await initDB();
  } catch (err) {
    console.error("[PostgreSQL] Failed to initialize Postgres DB schema. Graceful local fallback active.", err);
  }

  try {
    await initCoursesDB();
  } catch (err) {
    console.error("[Courses DB] Failed to initialize Courses Postgres DB schema.", err);
  }

  // 2. Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("[Astral Server] Loading Vite Dev Server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Astral Server] Serving compiled production frontend assets...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Ensure API routes return 404 instead of serving index.html
      if (req.path.startsWith('/api') || req.headers.accept?.includes('application/json')) {
        return res.status(404).json({ error: `Rota não encontrada: ${req.path}` });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 3. Float Astral Server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Astral Server] Servidor flutuando na porta ${PORT} (http://localhost:${PORT})`);
  });
}

startServer();
