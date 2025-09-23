import http from 'http';
import app from './app';
import { testConnection } from './libs/db';

async function bootstrap() {
  await testConnection();
  const port = Number(process.env.PORT ?? 5000);
  http.createServer(app).listen(port, () => {
    console.log(`API on http://localhost:${port}`);
  });
}
bootstrap();
