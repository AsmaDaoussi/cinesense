import { Router } from 'express';
import * as ctrl from '../controllers/movies.controller';

const r = Router();

// Routes fixes en premier
r.get('/search', ctrl.searchMovies);
r.get('/genres', ctrl.getGenres);
r.post('/bulk', ctrl.bulkByIds);

// Route dynamique EN DERNIER
r.get('/:id', ctrl.getById);

export default r;
