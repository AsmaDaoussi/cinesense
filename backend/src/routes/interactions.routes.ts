import { Router } from "express";
import {authRequired  } from "../middlewares/auth";
import { createInteraction, getUserInteractions } from "../controllers/interactions.controller";

const router = Router();

router.post("/", authRequired, createInteraction);
router.get("/me", authRequired, getUserInteractions);

export default router;
