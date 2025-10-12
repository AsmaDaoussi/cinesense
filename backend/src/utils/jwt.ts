import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const signJwt = (payload: object): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  } catch (error) {
    throw new Error('Failed to sign JWT token');
  }
};

export const verifyJwt = <T>(token: string): T => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};