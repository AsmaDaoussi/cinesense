import { Watchlist } from "../models/Watchlist";
import { tmdb } from "../libs/tmdb";

export async function add(userId: string, movieId: number) {
  const [row] = await Watchlist.findOrCreate({ where: { userId, movieId }, defaults: { userId, movieId } });
  return row;
}

export async function remove(userId: string, movieId: number) {
  await Watchlist.destroy({ where: { userId, movieId } });
  return { ok: true };
}

export async function listIds(userId: string) {
  const rows = await Watchlist.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
  return rows.map(r => r.movieId);
}

export async function bulkDetails(ids: number[]) {
  const results = await Promise.allSettled(ids.map((id) => tmdb(`/movie/${id}`)));
  return results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
    .map((r) => r.value)
    .map((m: any) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
      releaseYear: m.release_date ? String(m.release_date).slice(0, 4) : null,
      voteAvg: m.vote_average ?? null,
    }));
}
