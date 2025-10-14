import { useCallback, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import GenreSelect from "../components/GenreSelect";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorState from "../components/ErrorState";
import { useDebounce } from "../hooks/useDebounce";
import { searchMovies } from "../services/movies";
import type { Movie } from "../types/movie";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");

  const qDebounced = useDebounce(q, 400);

  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [hasMore, setHasMore] = useState(false);

  // reset à chaque changement de filtres/texte
  useEffect(() => {
    setPage(1);
    setResults([]);
    setHasMore(false);
    setError(null);
  }, [qDebounced, year, genre]);

  // fetch
  useEffect(() => {
    let active = true;
    (async () => {
      if (qDebounced.trim().length < 2) return;
      setLoading(true);
      try {
        const data = await searchMovies(qDebounced, { year: year || undefined, genre: genre || undefined, page });
        if (!active) return;
        setResults(prev => page === 1 ? data.results : [...prev, ...data.results]);
        setHasMore((data.page ?? 1) < (data.total_pages ?? 1));
      } catch (e:any) {
        if (active) setError(e.message ?? "Erreur");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [qDebounced, year, genre, page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage(p => p + 1);
  }, [loading, hasMore]);

  return (
    <section className="space-y-4">
      <SearchBar
        value={q} onChange={setQ}
        year={year} onYearChange={setYear}
        right={<GenreSelect value={genre} onChange={setGenre} />}
      />

      {error && <ErrorState message={error} />}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {results.map(m => <MovieCard key={`${m.id}-${m.poster}`} {...m} />)}
        {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Bouton charger plus */}
      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Charger plus
          </button>
        </div>
      )}

      {!loading && !error && results.length === 0 && qDebounced.trim().length >= 2 && (
        <p className="rounded-2xl border border-black/5 bg-white p-4 text-sm text-gray-600">Aucun résultat.</p>
      )}
    </section>
  );
}
