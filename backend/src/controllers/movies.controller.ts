import { Request, Response } from 'express';
import * as svc from '../services/movies.service';

export async function searchMovies(req: Request, res: Response) {
  const { q, year, genre } = req.query as any;
  if (!q || String(q).trim().length < 2) {
    return res.status(400).json({ error: 'Paramètre q requis (min 2 caractères)' });
    }
  const data = await svc.searchMovies({
    q: String(q),
    year: year ? String(year) : undefined,
    genre: genre ? String(genre) : undefined
  });
  res.json(data);
}
