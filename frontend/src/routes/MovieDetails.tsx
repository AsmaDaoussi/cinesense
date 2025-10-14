import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // si tu n'as pas react-query, je te donne un fallback plus bas
import { useFaves } from "../contexts/FavesContext";
import api from "../services/api";

type TmdbVideo = { key: string; site: string; type: string };
type TmdbCast = { id: number; name: string; character: string; profile_path: string | null };
type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  runtime: number | null;
  release_date?: string;
  vote_average?: number;
  genres?: { id:number; name:string }[];
  poster_path?: string | null;
  backdrop_path?: string | null;
  videos?: { results: TmdbVideo[] };
  credits?: { cast: TmdbCast[] };
  production_countries?: { iso_3166_1:string; name:string }[];
  recommendations?: { results: Array<{ id:number; title:string; poster_path:string | null; vote_average:number }> };
  similar?: { results: Array<{ id:number; title:string; poster_path:string | null; vote_average:number }> };
};

const img = (path?: string | null, size: "w300"|"w500"|"w780"|"original"="w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const yearOf = (d?: string) => (d ? d.slice(0,4) : "—");
const fmtRuntime = (min?: number | null) => (min ? `${Math.floor(min/60)}h ${min%60}m` : "—");

export default function MovieDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { ids, toggle } = useFaves();

  const { data, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const res = await api.get<TmdbMovie>(`/movies/${id}`); // ton endpoint existant
      return res.data;
    }
  });

  useEffect(() => {
    if (data?.title) document.title = `${data.title} — CinéSense`;
  }, [data?.title]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-[38vh] rounded-2xl bg-gray-200" />
        <div className="h-6 w-1/2 rounded bg-gray-200" />
        <div className="h-20 rounded bg-gray-200" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
        Oups, impossible de charger ce film.
        <button onClick={() => nav(-1)} className="ml-3 underline">Retour</button>
      </div>
    );
  }

  const poster = img(data.poster_path, "w500");
  const backdrop = img(data.backdrop_path, "w780");
  const youtubeKey = data.videos?.results.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"))?.key;
  const cast = (data.credits?.cast ?? []).slice(0, 10);
  const recos = (data.recommendations?.results?.length ? data.recommendations!.results : data.similar?.results) ?? [];

  const isFav = ids.includes(data.id);

  return (
    <div className="space-y-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-black/5">
        {backdrop ? (
          <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        ) : null}
        <div className="relative z-10 flex flex-col gap-4 bg-gradient-to-b from-white/70 to-white p-4 sm:flex-row sm:p-6">
          {/* Poster */}
          {poster ? (
            <img
              src={poster}
              alt={`Affiche de ${data.title}`}
              className="mx-auto aspect-[2/3] w-36 rounded-xl shadow sm:mx-0 sm:w-44"
              loading="lazy"
            />
          ) : <div className="mx-auto h-52 w-36 rounded-xl bg-gray-200 sm:mx-0 sm:h-64 sm:w-44" />}

          {/* Meta */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => nav(-1)} className="rounded-full border px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">← Retour</button>
              <span className="rounded-full bg-yellow-50 px-2 py-1 text-sm text-yellow-700">★ {data.vote_average?.toFixed(1) ?? "—"}</span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-sm">{fmtRuntime(data.runtime)}</span>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-sm">{yearOf(data.release_date)}</span>
              {data.production_countries?.[0]?.iso_3166_1 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-sm">{data.production_countries[0].iso_3166_1}</span>
              )}
            </div>

            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{data.title}</h1>

            <div className="mt-2 flex flex-wrap gap-2">
              {data.genres?.map(g => (
                <span key={g.id} className="rounded-full bg-blue-50 px-2 py-0.5 text-sm text-blue-700">{g.name}</span>
              ))}
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">{data.overview || "Pas de synopsis disponible."}</p>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => toggle(data.id)}
                className={`rounded-full px-3 py-1 text-sm font-medium shadow-sm transition
                ${isFav ? "bg-pink-600 text-white hover:bg-pink-700" : "bg-white text-pink-700 hover:bg-pink-50 border border-pink-200"}`}
                aria-pressed={isFav}
                aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                {isFav ? "♥ Dans mes favoris" : "♡ Ajouter aux favoris"}
              </button>
              {youtubeKey && (
                <a
                  href={`https://www.youtube.com/watch?v=${youtubeKey}`}
                  target="_blank" rel="noreferrer"
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm hover:bg-gray-50"
                >
                  ▶ Bande-annonce
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CASTING */}
      {cast.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Distribution principale</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {cast.map(p => (
              <div key={p.id} className="w-28 shrink-0">
                <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200">
                  {p.profile_path && <img src={img(p.profile_path, "w300")!} alt={p.name} className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <div className="mt-1 line-clamp-1 text-xs font-medium">{p.name}</div>
                <div className="line-clamp-1 text-[11px] text-gray-500">{p.character}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRAILER (embed inline si tu préfères) */}
      {youtubeKey && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Bande-annonce</h2>
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-black/5">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeKey}`}
              title="Bande-annonce"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </section>
      )}

      {/* RECOMMANDATIONS / SIMILAIRES */}
      {recos.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Vous aimerez aussi</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {recos.slice(0, 12).map(r => (
              <Link key={r.id} to={`/title/${r.id}`} className="group rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md">
                <div className="aspect-[2/3] w-full overflow-hidden rounded-t-2xl bg-gray-200">
                  {r.poster_path && (
                    <img src={img(r.poster_path, "w300")!} alt={r.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                  )}
                </div>
                <div className="p-2">
                  <div className="line-clamp-1 text-sm font-medium">{r.title}</div>
                  <div className="mt-0.5 text-[11px] text-gray-600">★ {r.vote_average?.toFixed(1) ?? "—"}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
