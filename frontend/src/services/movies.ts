// src/services/movies.ts
import api from "./api";
import type { SearchResponse } from "../types/movie";

/**
 * Recherche de films via ton backend.
 * - q : texte
 * - year : année (ex: "2020")
 * - genre : ID de genre TMDB (ex: "28" pour Action) — récupéré via getGenres()
 * - page : pagination (par défaut 1)
 *
 * NB: ton backend filtre par genre/année côté serveur (Option A),
 * donc /movies/search renverra déjà la liste filtrée.
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
 * À utiliser pour alimenter ton <select GenreSelect />.
 */
export async function getGenres(): Promise<Array<{ id: number; name: string }>> {
  const res = await api.get<Array<{ id: number; name: string }>>("/movies/genres");
  return res.data;
}

/**
 * Détails d’un film (pour /title/:id)
 * Si tu l’utilises déjà ailleurs, garde-le — sinon c’est pratique de l’avoir ici.
 */
export async function getMovieById(id: string | number) {
  const res = await api.get(`/movies/${id}`);
  return res.data;
}
// src/services/movies.ts
export async function getFavoritesBulk(ids: number[]) {
  const res = await api.post("/movies/bulk", { ids });
  return res.data; // tableau de Movie normalisés
}
