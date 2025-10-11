import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = verifyJwt<{ id: string }>(token);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
