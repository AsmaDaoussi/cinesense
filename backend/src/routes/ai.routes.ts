import { Router } from 'express';
import * as ctrl from '../controllers/ai.controller';

const r = Router();
r.get('/natural-search', ctrl.naturalSearch);
r.post('/summarize', ctrl.summarizeSynopsis);

export default r;
