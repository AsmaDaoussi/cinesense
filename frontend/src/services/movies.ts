import api from "./api";
import type { SearchResponse, Movie } from "../types/movie";

/**
 * Recherche de films via ton backend.
 * - q : texte
 * - year : année (ex: "2020")
 * - genre : ID de genre TMDB (ex: "28" pour Action)
 * - page : pagination (par défaut 1)
 */
export async function searchMovies(
  q: string,
  opts?: { year?: string; genre?: string; page?: number }
) {
  const res = await api.get<SearchResponse>("/movies/search", {
    params: {
      q,
      year: opts?.year || undefined,
      genre: opts?.genre || undefined,
      page: opts?.page ?? 1,
    },
  });
  return res.data; // Axios renvoie déjà data JSON
}

/**
 * Liste des genres (id + name) depuis le backend.
 */
export async function getGenres(): Promise<Array<{ id: number; name: string }>> {
  const res = await api.get<Array<{ id: number; name: string }>>("/movies/genres");
  return res.data;
}

/**
 * Détails d’un film (pour /title/:id)
 */
export async function getMovieById(id: string | number) {
  const res = await api.get(`/movies/${id}`);
  return res.data;
}

/**
 * Bulk détails films (générique pour favorites/watchlist).
 * ids: number[] → Appel backend /movies/bulk → TMDB parallel + normalize.
 * Retourne DIRECT Movie[] (pas { data: Movie[] }).
 */
export async function getMoviesBulk(ids: number[]): Promise<Movie[]> {
  if (!ids.length) return [];
  const res = await api.post<{ ids: number[] }, Movie[]>("/movies/bulk", { ids });
  return res.data ?? [];  // ← CRUCIAL : res.data = Movie[], type-safe
}