import { tmdb } from '../libs/tmdb';

const CACHE = new Map<string, { value: any; exp: number }>();
const TTL = 1000 * 60 * 10; // 10 minutes

function keyify(path: string, params: Record<string, any>) {
  const p = Object.entries(params)
    .filter(([,v]) => v !== undefined && v !== '')
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([k,v]) => `${k}=${v}`).join('&');
  return `${path}?${p}`;
}

export async function searchMovies({ q, year, genre }:{
  q: string; year?: string; genre?: string;
}) {
  const key = keyify('/search/movie', { query: q, year, with_genres: genre });
  const hit = CACHE.get(key);
  if (hit && hit.exp > Date.now()) return hit.value;

  const raw = await tmdb('/search/movie', { query: q, year, with_genres: genre });
  const data = {
    query: q,
    total: raw.total_results || 0,
    results: (raw.results || []).map((m:any) => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
      releaseYear: m.release_date ? String(m.release_date).slice(0,4) : null,
      voteAvg: m.vote_average ?? null
    }))
  };
  CACHE.set(key, { value: data, exp: Date.now() + TTL });
  return data;
}

async function listAndMap(path: string, params: Record<string, any> = {}) {
  const key = keyify(path, params);
  const hit = CACHE.get(key);
  if (hit && hit.exp > Date.now()) return hit.value;
  const raw = await tmdb(path, params);
  const data = (raw.results || []).map((m:any) => ({
    id: m.id,
    title: m.title ?? m.name,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
    releaseYear: m.release_date ? String(m.release_date).slice(0,4) : null,
    voteAvg: m.vote_average ?? null
  }));
  CACHE.set(key, { value: data, exp: Date.now() + TTL });
  return data;
}

export function trending() {
  return listAndMap('/trending/movie/week');
}
export function topRated() {
  return listAndMap('/movie/top_rated');
}
export function nowPlaying() {
  return listAndMap('/movie/now_playing');
}
