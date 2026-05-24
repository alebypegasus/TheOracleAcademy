import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "oracle_celestial_secret_key_8899";

export const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  medium: 1,
  master: 2
};

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    plan: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const xUserId = req.headers["x-user-id"];
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        id: Number(decoded.id),
        email: decoded.email,
        role: decoded.role || 'aluno',
        plan: decoded.plan || 'free'
      };
      req.headers["x-user-id"] = decoded.id.toString();
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Sua chave JWT expirou ou é inválida no éter" });
    }
  }

  // Fallback to allow x-user-id in development/local fallback if no JWT is provided yet
  if (xUserId) {
    req.user = {
      id: Number(xUserId),
      email: "local@oracle.academy",
      role: "aluno",
      plan: "free"
    };
    return next();
  }

  return res.status(401).json({ error: "Identidade mística não provida. Acesso não autorizado." });
}

// Plan-based access middleware
// Usage: router.get('/route', authMiddleware, requirePlan(['medium', 'master']), handler)
export function requirePlan(allowedPlans: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    const userPlanLevel = PLAN_HIERARCHY[req.user.plan] ?? 0;
    const requiredLevel = Math.min(...allowedPlans.map(p => PLAN_HIERARCHY[p] ?? 99));
    if (userPlanLevel < requiredLevel) {
      return res.status(403).json({ 
        error: "Seu plano atual não permite acesso a este recurso",
        requiredPlan: allowedPlans[0],
        currentPlan: req.user.plan
      });
    }
    return next();
  };
}

// Role-based access middleware
export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Grau de iniciação espiritual insuficiente para este altar" });
    }
    return next();
  };
}
