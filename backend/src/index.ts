import http from 'http';
import app from './app';
import { testConnection } from './libs/db';
import { sequelize } from './libs/db'; // Import supplémentaire

async function bootstrap() {
  try {
    // 1. Teste la connexion à la base de données
    await testConnection();
    
    // 2. Synchronise les modèles (crée les tables manquantes)
    await sequelize.sync({ force: false }); // ⬅️ AJOUT IMPORTANT ICI
    console.log('✅ Database tables synchronized');
    
    // 3. Démarre le serveur
    const port = Number(process.env.PORT ?? 5000);
    http.createServer(app).listen(port, () => {
      console.log(`🚀 API running on http://localhost:${port}`);
    });
    
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();