import { sequelize } from '../libs/db';
import '../models';

async function main() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ DB sync ok');
  } catch (e) {
    console.error('❌ DB sync error:', e);
  } finally {
    process.exit(0);
  }
}
main();
