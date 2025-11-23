// src/components/MovieCard.tsx
import type { Movie } from "../types/movie";
import { Link } from "react-router-dom";
import WatchChip from "./WatchChip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export default function MovieCard({
  id,
  title,
  poster,
  releaseYear,
  voteAvg,
}: Movie) {
  const queryClient = useQueryClient();

  // 🔁 Charger tous les favoris du user (cache partagé entre toutes les cartes)
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await api.get("/api/favorites");

      // On accepte plusieurs formats (ids simples ou objets { movieId })
      let ids: number[] = [];
      if (Array.isArray(res.data)) {
        if (typeof res.data[0] === "number") {
          ids = res.data as number[];
        } else {
          ids = (res.data as any[]).map((f) => Number(f.movieId));
        }
      }
      return ids.filter((n) => !Number.isNaN(n));
    },
    staleTime: 60_000, // 1 min
  });

  const favoriteIds = favoritesQuery.data ?? [];
  const isFavorite = favoriteIds.includes(id);

  // 🔁 Mutation pour toggle le favori côté backend
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        // supprimer
        await api.delete(`/api/favorites/${id}`);
      } else {
        // ajouter
        await api.post("/api/favorites", { movieId: id });
      }
    },
    onSuccess: () => {
      // On rafraîchit les favoris (utilisé par FavoritesPage, MovieDetails, etc.)
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites_list"] });
    },
  });

  const handleToggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // pour ne pas déclencher le <Link>
    if (toggleFavoriteMutation.isPending) return;
    toggleFavoriteMutation.mutate();
  };

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
        <h3 className="line-clamp-1 text-[15px] font-semibold">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-500">{releaseYear ?? "—"}</p>

        {/* Actions: Favori + Watchlist */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            disabled={
              favoritesQuery.isLoading || toggleFavoriteMutation.isPending
            }
            className={`rounded-full px-2 py-1 text-xs border transition
              ${
                isFavorite
                  ? "border-pink-200 bg-pink-50 text-pink-700"
                  : "border-black/10 bg-white text-gray-600 hover:bg-gray-50"
              } ${
                toggleFavoriteMutation.isPending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            aria-pressed={isFavorite}
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isFavorite ? "♥ Favori" : "♡ Favori"}
          </button>

          <WatchChip movieId={id} />
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
