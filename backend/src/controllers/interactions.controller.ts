import { Request, Response } from 'express';
import { Interaction } from '../models/Interaction';

export async function addFavorite(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { titleId } = req.body as { titleId?: number };
  if (!titleId) return res.status(400).json({ error: 'titleId required' });
  await Interaction.upsert({ userId, titleId, kind: 'watchlist' } as any);
  res.status(201).json({ ok: true });
}

export async function rate(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { titleId, rating } = req.body as { titleId?: number; rating?: number };
  if (!titleId || typeof rating !== 'number') {
    return res.status(400).json({ error: 'titleId and rating required' });
  }
  await Interaction.upsert({ userId, titleId, kind: 'rate', rating } as any);
  res.status(201).json({ ok: true });
}

export async function listFavorites(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const items = await Interaction.findAll({ where: { userId, kind: 'watchlist' } });
  res.json({ items });
}