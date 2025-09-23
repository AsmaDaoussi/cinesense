import { Router } from 'express';
import { sequelize } from '../libs/db';

const r = Router();
r.get('/', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true, db: 'up', ts: Date.now() });
  } catch (e:any) {
    res.status(500).json({ ok: false, db: 'down', error: e?.message });
  }
});
export default r;
