// src/routes/Favorites.tsx
import { useEffect, useMemo, useState } from "react";
import { useFaves } from "../contexts/FavesContext";
import { getFavoritesBulk } from "../services/movies";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorState from "../components/ErrorState";
import type { Movie } from "../types/movie";
  import Swal from "sweetalert2";
type SortKey = "added" | "title" | "year";

export default function FavoritesPage() {
  // on accepte plusieurs API possibles du contexte (clear / clearAll)
  const faves = useFaves() as any;
  const ids: number[] = faves?.ids ?? [];
  const clearAll: (() => void) | undefined = faves?.clearAll ?? faves?.clear;

  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("added");

  useEffect(() => {
    let active = true;
    (async () => {
      if (!ids.length) {
        setItems([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getFavoritesBulk(ids);
        if (active) setItems(data);
      } catch (e: any) {
        if (active) setError(e?.message ?? "Erreur inattendue");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [ids]);

  const sorted = useMemo(() => {
    const arr = [...items];
    switch (sortBy) {
      case "title":
        arr.sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" }));
        break;
      case "year":
        arr.sort(
          (a, b) => Number(b.releaseYear ?? 0) - Number(a.releaseYear ?? 0)
        );
        break;
      case "added":
      default:
        // Ajout récent en premier -> on se base sur l’ordre des ids (dernier ajouté = dernier de la liste)
        arr.sort((a, b) => ids.indexOf(b.id) - ids.indexOf(a.id));
        break;
    }
    return arr;
  }, [items, sortBy, ids]);

  // ——— états vides
  if (!ids.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Mes Favoris</h1>
          <span className="rounded-full bg-pink-600 px-2.5 py-0.5 text-xs font-medium text-white shadow">
            0
          </span>
        </div>
        <p className="text-gray-600">Aucun favori pour l’instant.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      {/* Bandeau haut : titre + compteur + actions */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Mes Favoris</h1>
          <span className="rounded-full bg-pink-600 px-2.5 py-0.5 text-xs font-medium text-white shadow">
            {ids.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pills tri */}
          <div className="inline-flex items-center rounded-xl border border-black/10 bg-white/90 p-1 shadow-sm backdrop-blur">
            {([
              { key: "added", label: "Ajout" },
              { key: "title", label: "Titre" },
              { key: "year", label: "Année" },
            ] as const).map((opt) => (
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

          {/* Bouton fantôme “Tout supprimer” */}



{!!clearAll && (
  <button
    onClick={() => {
      Swal.fire({
        title: "Supprimer tous les favoris ?",
        text: "Cette action est irréversible.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        confirmButtonColor: "#dc2626", // rouge Tailwind
        cancelButtonColor: "#6b7280", // gris
      }).then((result) => {
        if (result.isConfirmed) {
          clearAll();
          Swal.fire({
            title: "Supprimé !",
            text: "Tous vos favoris ont été supprimés.",
            icon: "success",
            confirmButtonColor: "#16a34a", // vert
          });
        }
      });
    }}
    className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-white hover:shadow"
    title="Tout supprimer"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-70">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm0 6h2v10H9V9zm4 0h2v10h-2V9z" fill="currentColor"/>
    </svg>
    <span className="hidden sm:inline">Tout supprimer</span>
  </button>
)}

        </div>
      </div>

      {/* États d’erreur / chargement */}
      {error && <ErrorState message={error} />}

      {loading ? (
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
