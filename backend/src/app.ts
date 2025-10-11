import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRoutes from './routes/health.routes';
import moviesRoutes from './routes/movies.routes';
import authRoutes from './routes/auth.routes';
import interactionsRoutes from './routes/interactions.routes';
import { errorHandler } from './middlewares/error';
import aiRoutes from './routes/ai.routes';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // autorise le front Vite
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRoutes);
app.use('/movies', moviesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/interactions', interactionsRoutes);
app.use('/ai', aiRoutes);

app.use(errorHandler);
export default app;
