import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRoutes from './routes/health.routes';
import moviesRoutes from './routes/movies.routes';
import { errorHandler } from './middlewares/error';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // autorise le front Vite
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRoutes);
app.use('/movies', moviesRoutes);

app.use(errorHandler);
export default app;
