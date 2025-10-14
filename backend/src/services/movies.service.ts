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
let GENRES_CACHE: any[] | null = null;
export async function getGenres() {
  const json = await tmdb("/genre/movie/list", { language: "fr-FR" });
  // Normalise {id,name}
  return json.genres?.map((g: any) => ({ id: g.id, name: g.name })) ?? [];
}




export async function searchMovies({
  q, year, genre, page
}:{ q:string; year?:string; genre?:string; page?:number }) {
  // 1) Appel TMDB search (page incluse)
  const params:any = { query: q, page: page ?? 1 };
  if (year) params.year = year;
  const raw = await tmdb('/search/movie', params);

  // 2) Normalise
  let items = (raw.results || []).map((m:any) => ({
    id: m.id,
    title: m.title,
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
    releaseYear: m.release_date ? String(m.release_date).slice(0,4) : null,
    voteAvg: m.vote_average ?? null,
    _genre_ids: m.genre_ids as number[] | undefined,
  }));

  // 3) Filtre (MVP) : année & genre (TMDB /search ignore with_genres)
  if (year) items = items.filter(it => it.releaseYear === String(year));
  if (genre) {
    const gid = Number(genre);
    items = items.filter(it => Array.isArray(it._genre_ids) && it._genre_ids.includes(gid));
  }

  const results = items.map(({ _genre_ids, ...rest }) => rest);

  // 4) Renvoie aussi page/total_pages (ceux de TMDB)
  return {
    query: q,
    results,
    total: raw.total_results ?? results.length,
    page: raw.page ?? (page ?? 1),
    total_pages: raw.total_pages ?? 1
  };
}

// backend/services/movies.service.ts
export async function getMovieById(id: string) {
  return tmdb(`/movie/${id}`, {
    append_to_response: "credits,videos,recommendations,similar", // +2
    language: "fr-FR",
  });
}


export async function getMoviesBulk(ids: string[]) {
  // lance les appels en parallèle
  const results = await Promise.allSettled(ids.map((id) => tmdb(`/movie/${id}`)));

  // garde uniquement ceux qui ont réussi + normalise comme dans la search
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
