import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller';
import { authRequired } from '../middlewares/auth';

const r = Router();
r.post('/signup', ctrl.signup);
r.post('/login', ctrl.login);
r.get('/me', authRequired, ctrl.me);

export default r;