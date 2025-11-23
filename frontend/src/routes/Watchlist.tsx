// src/routes/Watchlist.tsx
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMoviesBulk } from "../services/movies";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorState from "../components/ErrorState";
import type { Movie } from "../types/movie";
import Swal from "sweetalert2";
import api from "../services/api";
import { fetchWatchlistIds } from "../services/watchlist";

type SortKey = "added" | "title" | "year";

export default function WatchlistPage() {
  const [sortBy, setSortBy] = useState<SortKey>("added");

  // 1) On charge juste les IDs (même que WatchChip)
  const {
    data: ids = [],
    isLoading: loadingIds,
    error: errorIds,
    refetch,
  } = useQuery<number[]>({
    queryKey: ["watchlist"],
    queryFn: fetchWatchlistIds,
    staleTime: 60_000,
  });

  // 2) On charge les films à partir des IDs
  const {
    data: movies = [],
    isLoading: loadingMovies,
    error: errorMovies,
  } = useQuery<Movie[]>({
    queryKey: ["watchlist-movies", ids],
    enabled: ids.length > 0,
    queryFn: () => getMoviesBulk(ids),
  });

  const isLoading = loadingIds || loadingMovies;
  const error = errorIds || errorMovies;
  const items = movies;

  const sorted = useMemo(() => {
    const arr = [...items];
    switch (sortBy) {
      case "title":
        arr.sort((a, b) =>
          a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
        );
        break;
      case "year":
        arr.sort(
          (a, b) => Number(b.releaseYear ?? 0) - Number(a.releaseYear ?? 0)
        );
        break;
      case "added":
      default:
        arr.sort((a, b) => ids.indexOf(b.id) - ids.indexOf(a.id));
        break;
    }
    return arr;
  }, [items, sortBy, ids]);

  // 🧹 Vider toute la watchlist
  const handleClearAll = async () => {
    const result = await Swal.fire({
      title: "Vider la watchlist ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, vider",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete("/api/watchlist");
      await Swal.fire({
        title: "Vidé !",
        text: "Votre watchlist est maintenant vide.",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });
      refetch(); // va remettre ids=[]
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "Erreur",
        text: "Impossible de vider votre watchlist.",
        icon: "error",
      });
    }
  };

  // ——— États vides
  if (!isLoading && ids.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ma Watchlist
          </h1>
          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white shadow">
            0
          </span>
        </div>
        <p className="text-gray-600">
          Aucun film dans votre watchlist pour l’instant.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ma Watchlist
          </h1>
          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white shadow">
            {ids.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pills tri */}
          <div className="inline-flex items-center rounded-xl border border-black/10 bg-white/90 p-1 shadow-sm backdrop-blur">
            {(
              [
                { key: "added", label: "Ajout" },
                { key: "title", label: "Titre" },
                { key: "year", label: "Année" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={[
                  "min-w-[70px] px-3 py-1.5 text-sm rounded-lg transition",
                  sortBy === opt.key
                    ? "bg-gray-900 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
                aria-pressed={sortBy === opt.key}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Bouton vider */}
          {ids.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-white hover:shadow"
              title="Tout vider"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="opacity-70"
              >
                <path
                  d="M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v10H9V9zm4 0h2v10h-2V9z"
                  fill="currentColor"
                />
              </svg>
              <span className="hidden sm:inline">Tout vider</span>
            </button>
          )}
        </div>
      </div>

      {/* Erreur / chargement / liste */}
      {error && (
        <ErrorState
          message={(error as any)?.message ?? "Erreur de chargement"}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {Array.from({ length: Math.min(8, ids.length || 8) }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {sorted.map((m) => (
            <MovieCard key={m.id} {...m} />
          ))}
        </div>
      )}
    </section>
  );
}
