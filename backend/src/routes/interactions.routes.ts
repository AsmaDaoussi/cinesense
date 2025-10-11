import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import * as ctrl from '../controllers/interactions.controller';

const r = Router();
r.use(requireAuth);
r.post('/favorites', ctrl.addFavorite);
r.get('/favorites', ctrl.listFavorites);
r.post('/rate', ctrl.rate);

export default r;
