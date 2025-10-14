import { Request, Response } from "express";
import * as svc from "../services/movies.service";

export async function searchMovies(req: Request, res: Response) {
  const { q, year, genre, page } = req.query as any;
  if (!q || String(q).trim().length < 2) {
    return res.status(400).json({ error: "Paramètre q requis (min 2 caractères)" });
  }
  const data = await svc.searchMovies({
    q: String(q),
    year: year ? String(year) : undefined,
    genre: genre ? String(genre) : undefined,
    page: page ? Number(page) : 1,
  });
  res.json(data);
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "id requis" });
  const data = await svc.getMovieById(id);
  res.json(data);
}

// ➕ NOUVEAU: bulk favoris
export async function bulkByIds(req: Request, res: Response) {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  if (!ids.length) return res.json([]); // rien à faire
  // Limite de sécurité pour éviter de surcharger TMDB
  const limited = ids.slice(0, 50).map((x) => String(x));
  const data = await svc.getMoviesBulk(limited);
  res.json(data);
}
export async function getGenres(_req: Request, res: Response) {
  const data = await svc.getGenres(); // voit ci-dessous
  res.json(data);
}