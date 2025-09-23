import { Router } from 'express';
import * as ctrl from '../controllers/movies.controller';
const r = Router();
r.get('/search', ctrl.searchMovies);
export default r;
