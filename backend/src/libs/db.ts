import { Sequelize } from 'sequelize';
import { env } from '../config/env';

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
  } catch (e) {
    console.error('❌ PostgreSQL connection failed:', e);
    process.exit(1);
  }
}
