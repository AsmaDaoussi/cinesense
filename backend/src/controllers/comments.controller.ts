import { Request, Response } from "express";
import { Comment } from "../models/Comment";
import { User } from "../models/User";            // 👈 à importer
import { computeSentiment } from "../services/sentiment";


export async function createCommentForMovie(req: Request, res: Response) {
  try {
    const movieId = Number(req.params.id);
    if (!movieId) {
      return res.status(400).json({ error: "Invalid movie id" });
    }

    // selon ton middleware authRequired :
    const userId = (req as any).userId; // ou req.userId si déjà typé
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { text } = req.body;
    if (!text || typeof text !== "string" || text.trim().length < 3) {
      return res.status(400).json({ error: "Texte trop court" });
    }

    const cleanText = text.trim();

    // ✅ sentiment calculé ici
    const sentiment = await computeSentiment(cleanText);

    const comment = await Comment.create({
      userId,
      movieId,
      text: cleanText,
      sentiment,
    });

    // on recharge pour avoir le user.name
    const withUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["firstName","lastName"],
        },
      ],
    });

    res.status(201).json({
      id: comment.id,
      text: comment.text,
      sentiment: comment.sentiment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      userId: comment.userId,
      userName: (withUser as any)?.user?.firstName?? null,
    });
  } catch (err) {
    console.error("createCommentForMovie error:", err);
    res.status(500).json({ error: "Server error" });
  }
}



/**
 * GET /movies/:id/comments
 */
export async function listCommentsForMovie(req: Request, res: Response) {
  try {
    const movieId = Number(req.params.id);
    if (!movieId) {
      return res.status(400).json({ error: "Invalid movie id" });
    }

    const comments = await Comment.findAll({
      where: { movieId },
      order: [["createdAt", "DESC"]], // plus récent d'abord
      include: [
        {
          model: User,
          as: "user",
          attributes: ["firstName","lastName"],      // ou "username"
        },
      ],
    });

    // On formate la réponse pour le frontend
    const payload = comments.map((c: any) => ({
      id: c.id,
      text: c.text,
      sentiment: c.sentiment,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      userId: c.userId,
      userName: c.user?.firstName ?? null,
    }));

    res.json(payload);
  } catch (err) {
    console.error("listCommentsForMovie error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
