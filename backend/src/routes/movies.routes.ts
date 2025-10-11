import { Router } from 'express';
import * as ctrl from '../controllers/movies.controller';
const r = Router();
r.get('/search', ctrl.searchMovies);
r.get('/trending', ctrl.trending);
r.get('/top-rated', ctrl.topRated);
r.get('/now-playing', ctrl.nowPlaying);
export default r;
