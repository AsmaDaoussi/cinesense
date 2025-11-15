import { Router } from "express";
import { authRequired } from "../middlewares/auth";
import * as ctrl from "../controllers/favorites.controller";

const r = Router();
r.use(authRequired);

r.get("/", ctrl.list);              // -> [movieId, ...]
r.post("/", ctrl.add);              // body { movieId }
r.delete("/:movieId", ctrl.remove); // /api/favorites/123
r.delete("/", ctrl.clearAll);       // purge tous
r.get("/my", authRequired, ctrl.getMyFavorites);
r.get("/favorites", authRequired, ctrl.getMyFavorites);
r.delete("/favorites", authRequired, ctrl.clearMyFavorites);

export default r;
