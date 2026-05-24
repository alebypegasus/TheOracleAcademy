import { Request, Response, NextFunction } from "express";

// Escape HTML tags to prevent XSS injection
function sanitizeString(val: string): string {
  if (typeof val !== "string") return val;
  return val
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => (typeof item === "string" ? sanitizeString(item) : sanitizeObject(item)));
  }

  const sanitized: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === "string") {
      sanitized[key] = sanitizeString(val);
    } else if (typeof val === "object") {
      sanitized[key] = sanitizeObject(val);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

// Global Sanitization Middleware
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  // 1. Sanitização de XSS
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  // 2. Defesa básica contra SQL Injection (heurística para inputs de texto)
  const sqlPatterns = [/select\s+.*\s+from/gi, /union\s+select/gi, /insert\s+into/gi, /drop\s+table/gi, /delete\s+from/gi];
  
  const checkSqlPatterns = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    for (const val of Object.values(obj)) {
      if (typeof val === "string") {
        for (const pattern of sqlPatterns) {
          if (pattern.test(val)) {
            return true;
          }
        }
      } else if (typeof val === "object") {
        if (checkSqlPatterns(val)) return true;
      }
    }
    return false;
  };

  if (checkSqlPatterns(req.body) || checkSqlPatterns(req.query)) {
    return res.status(400).json({ error: "Sua requisição contém termos incompatíveis com a egrégora de segurança." });
  }

  // 3. Security Headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Content-Security-Policy", "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;");

  return next();
}
