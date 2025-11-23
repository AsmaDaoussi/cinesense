import { Request, Response } from "express";
import * as svc from "../services/watchlist.service";

export async function add(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const { movieId } = req.body as { movieId?: number };  // FIX: Lis body, pas params
  if (!movieId) return res.status(400).json({ error: "movieId requis" });  // Message FR cohérent
  await svc.add(userId, movieId);
  res.status(201).json({ movieId });  // Retourne movieId comme favorites
}

export async function remove(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const movieId = Number(req.params.movieId);
  if (!movieId) return res.status(400).json({ error: "movieId invalide" });
  await svc.remove(userId, movieId);
  res.json({ ok: true });
}

export async function list(req: Request, res: Response) {
  const userId = (req as any).userId as string;
  const ids = await svc.listIds(userId);
  res.json(ids);  // FIX: Direct [ids] comme favorites (pas { ids })
}

export async function bulk(req: Request, res: Response) {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.slice(0, 50).map(Number) : [];
  const data = await svc.bulkDetails(ids);
  res.json(data);
}