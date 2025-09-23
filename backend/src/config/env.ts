import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT ?? 5000),
  DATABASE_URL: process.env.DATABASE_URL || '',
  TMDB_API_KEY: process.env.TMDB_API_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret'
};
