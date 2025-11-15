import { Request, Response } from "express";
import { Favorite } from "../models/Favorite";

export async function list(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const rows = await Favorite.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
  res.json(rows.map(r => r.movieId));
}

export async function add(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { movieId } = req.body as { movieId?: number };
  if (!movieId) return res.status(400).json({ error: "movieId requis" });
  const [row] = await Favorite.findOrCreate({ where: { userId, movieId }, defaults: { userId, movieId } });
  res.status(201).json({ movieId: row.movieId });
}
export async function clearMyFavorites(req: Request, res: Response) {
  try {
    await Favorite.destroy({ where: { userId: req.userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function remove(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const movieId = Number(req.params.movieId);
  if (!movieId) return res.status(400).json({ error: "movieId invalide" });
  await Favorite.destroy({ where: { userId, movieId } });
  res.json({ ok: true });
}

export async function clearAll(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  await Favorite.destroy({ where: { userId } });
  res.json({ ok: true });
}
export async function getMyFavorites(req: Request, res: Response) {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.userId },
      attributes: ['movieId'],
      order: [['createdAt', 'DESC']]
    });

    res.json(favorites.map(f => f.movieId));
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
