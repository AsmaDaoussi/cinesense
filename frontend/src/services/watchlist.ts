import api from "./api";

// GET /api/watchlist -> renvoie [movieId,...]
export async function getWatchlist(): Promise<number[]> {
  const { data } = await api.get("/api/watchlist");  // + /api + .data (direct array)
  return data ?? [];  // Pas .ids (aligné sur fix backend)
}

// POST /api/watchlist { movieId }
export async function addToWatchlist(movieId: number) {
  await api.post("/api/watchlist", { movieId });  // + /api
}

// DELETE /api/watchlist/:movieId
export async function removeFromWatchlist(movieId: number) {
  await api.delete(`/api/watchlist/${movieId}`);  // + /api
}
export async function fetchWatchlistIds(): Promise<number[]> {
  const res = await api.get("/api/watchlist");

  let ids: number[] = [];

  if (Array.isArray(res.data)) {
    if (typeof res.data[0] === "number") {
      // format : [1, 2, 3]
      ids = res.data as number[];
    } else {
      // format : [{ movieId: 1 }, { movieId: 2 }, ...]
      ids = (res.data as any[]).map((w) => Number(w.movieId));
    }
  }

  return ids.filter((n) => !Number.isNaN(n));
}