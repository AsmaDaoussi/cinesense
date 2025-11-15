import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRoutes from './routes/health.routes';
import moviesRoutes from './routes/movies.routes';
import { errorHandler } from './middlewares/error';
import authRoutes from './routes/auth.routes';
import favoritesRoutes from "./routes/favorites.routes";
import watchlistRoutes from "./routes/watchlist.routes";
import interactionRoutes from "./routes/interactions.routes";

import interactionsRoutes from "./routes/interactions.routes";

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); // autorise le front Vite
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRoutes);
app.use('/movies', moviesRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/watchlist", watchlistRoutes);  // ← FIX: + /api pour cohérence
app.use("/api/interactions", interactionRoutes);
app.use("/interactions", interactionsRoutes);
app.use(errorHandler);  // Global errors en dernier

export default app; 