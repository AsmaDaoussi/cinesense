// src/components/MovieCard.tsx
import type { Movie } from "../types/movie";
import { Link } from "react-router-dom";
import { useFaves } from "../contexts/FavesContext"; // <-- hook favoris

export default function MovieCard({ id, title, poster, releaseYear, voteAvg }: Movie) {
  const faves = useFaves();

  return (
    <article
      className="group rounded-2xl border border-black/5 bg-white shadow-sm transition
                 hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md"
      tabIndex={0}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="aspect-[2/3] w-full bg-gray-200">
          {poster ? (
            <img
              src={poster}
              alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : null}
        </div>

        {voteAvg != null && (
          <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow">
            ★ {voteAvg.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="line-clamp-1 text-[15px] font-semibold">{title}</h3>
            <p className="mt-0.5 text-xs text-gray-500">{releaseYear ?? "—"}</p>
          </div>

          {/* Bouton favori ♥ */}
          <button
            onClick={(e) => {
              e.preventDefault(); // évite de cliquer sur la card
              faves.toggle(id);
            }}
            className={`rounded-full px-2 py-1 text-xs border transition
              ${faves.has(id)
                ? "border-pink-200 bg-pink-50 text-pink-700"
                : "border-black/10 bg-white text-gray-600 hover:bg-gray-50"}`}
            aria-pressed={faves.has(id)}
            title={faves.has(id) ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {faves.has(id) ? "♥" : "♡"}
          </button>
        </div>

        {/* Lien détails */}
        <Link
          to={`/title/${id}`}
          className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium
                     text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Voir détails pour ${title}`}
        >
          Détails →
        </Link>
      </div>
    </article>
  );
}
