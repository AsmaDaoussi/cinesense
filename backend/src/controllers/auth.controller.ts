import { Request, Response } from 'express';
import { User } from '../models/User';
import { hashPassword, comparePassword } from '../utils/crypto';
import { signJwt } from '../utils/jwt';

export async function signup(req: Request, res: Response) {
  const { email, password, firstName, lastName } = req.body as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };

  // Validation
  if (!email || !password || !firstName || !lastName) {
    return res
      .status(400)
      .json({ error: 'Email, password, firstName et lastName sont requis' });
  }

  // Check if user already exists
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  }

  // Validate password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  try {
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      firstName,
      lastName,
      passwordHash
    });

    const token = signJwt({ id: user.id });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Email et mot de passe sont requis' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const ok = await comparePassword(password, user.passwordHash);

    if (!ok) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = signJwt({ id: user.id });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
}

export async function me(req: Request, res: Response) {
  const id = (req as any).userId as string | undefined;

  if (!id) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
}