import { Request, Response } from 'express';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../utils/crypto';
import { signJwt } from '../utils/jwt';

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already in use' });
  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });
  const token = signJwt({ id: user.id });
  res.status(201).json({ user: { id: user.id, email: user.email }, token });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signJwt({ id: user.id });
  res.json({ user: { id: user.id, email: user.email }, token });
}

export async function me(req: Request, res: Response) {
  const id = (req as any).userId as string | undefined;
  if (!id) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email });
}
