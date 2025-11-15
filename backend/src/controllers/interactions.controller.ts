import { Request, Response } from "express";
import { Interaction } from "../models/Interaction";
import { ValidationError } from "sequelize";

export async function createInteraction(req: Request, res: Response) {
  try {
    console.log("*******************************************req",req);
        console.log("re****************************************s",res);

    const userId =  (req as any).userId; // JWT middleware
    const { movieId, type, value, extra } = req.body;

    if (!type) return res.status(400).json({ error: "type is required" });

    // Types autorisés (aligné avec le front)
    const allowed = [
      "open_movie",
      "view",
      "scroll",
      "like",
      "unlike",
      "rate",
      "watchlist_add",
      "watchlist_remove",
      "trailer",
      "search_query",
      "click_reco",
    ];

    if (!allowed.includes(type)) {
      return res.status(400).json({ error: "Invalid interaction type" });
    }

    const interaction = await Interaction.create({
       userId,
  titleId: movieId,
  kind: type,
  rating: type === "rating" ? value : null,
  value: type === "scroll" ? value : null,
  extra: null
    });

    return res.json({ success: true, interaction });

  } catch (err: any) {
    console.error("❌ Interaction error:", err);

    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Server error" });
  }
}

export async function getUserInteractions(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const list = await Interaction.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json(list);
  } catch (err) {
    console.error("❌ List interactions error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
