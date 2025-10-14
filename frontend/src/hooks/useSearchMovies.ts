import { useEffect, useState } from "react";
import { searchMovies } from "../services/movies";
import type { Movie } from "../types/movie";

export function useSearchMovies(q: string, year?: string, genre?: string) {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let active = true;
    async function run() {
      setError(null); setData([]);
      if (q.trim().length < 2) return;
      setLoading(true);
      try {
        const out = await searchMovies(q, { year, genre });
        if (active) setData(out.results || []);
      } catch (e:any) {
        if (active) setError(e?.message ?? "Erreur");
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => { active = false };
  }, [q, year, genre]);

  return { data, loading, error };
}
