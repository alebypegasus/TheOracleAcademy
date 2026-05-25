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

import { PaymentService } from "./server/services/payment.service";

async function test() {
  try {
    const result = await PaymentService.createSubscription(1, 'medium', 'mensal', 'mock_token', 'test@test.com');
    console.log("SUCCESS:", result);
  } catch (err: any) {
    console.error("ERROR CAUGHT:", err.message);
  }
}

test();
