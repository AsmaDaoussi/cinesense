import { Request, Response } from 'express';
import { mapNaturalLanguage, summarize } from '../services/ai.service';
import { tmdb } from '../libs/tmdb';

export async function naturalSearch(req: Request, res: Response) {
  const { q } = req.query as any;
  if (!q) return res.status(400).json({ error: 'q required' });
  const params = mapNaturalLanguage(String(q));
  const raw = await tmdb('/discover/movie', params);
  res.json({ query: q, params, results: (raw.results||[]).slice(0,20) });
}

export async function summarizeSynopsis(req: Request, res: Response) {
  const { synopsis } = req.body as { synopsis?: string };
  if (!synopsis) return res.status(400).json({ error: 'synopsis required' });
  const s = await summarize(synopsis);
  res.json({ summary: s });
}
