import { Router } from "express";
import { authRequired } from "../middlewares/auth";
import * as ctrl from "../controllers/watchlist.controller";

const r = Router();
r.use(authRequired); // toutes les routes nécessitent un JWT

r.get("/", ctrl.list);              // -> [movieId, ...]
r.post("/", ctrl.add);              // body { movieId } – FIX: / pas /:id
r.delete("/:movieId", ctrl.remove); // /api/watchlist/123
r.post("/bulk", ctrl.bulk);         // body { ids: [] }

export default r;