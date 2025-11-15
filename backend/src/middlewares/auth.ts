  // src/middlewares/authRequired.ts
  import { Request, Response, NextFunction } from "express";
  import jwt from "jsonwebtoken"; // <-- manquait

  declare module "express-serve-static-core" {
    interface Request {
      userId?: string;
    }
  }

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const token = h.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id?: string | number;
      sub?: string | number;
      // ... autres claims
    };

    const userId = payload.id ?? payload.sub; // <-- gère id OU sub
    if (!userId) {
      return res.status(401).json({ error: "Token invalide (pas d'identifiant utilisateur)" });
    }

    req.userId = String(userId);
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}
