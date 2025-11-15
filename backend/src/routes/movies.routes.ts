import { Router } from 'express';
import * as ctrl from '../controllers/movies.controller';
import { listCommentsForMovie, createCommentForMovie } from "../controllers/comments.controller";
import {authRequired  }  from "../middlewares/auth";

const r = Router();

// Routes fixes en premier
r.get('/search', ctrl.searchMovies);
r.get('/genres', ctrl.getGenres);
r.post('/bulk', ctrl.bulkByIds);

// Route dynamique EN DERNIER
// ⚠️ Les commentaires AVANT /:id
r.get("/:id/comments", listCommentsForMovie);
r.post("/:id/comments", authRequired, createCommentForMovie);

// Route dynamique EN DERNIER
r.get('/:id', ctrl.getById);
export default r;
