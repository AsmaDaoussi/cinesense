import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

type Movie = { id: number; title: string; poster: string | null; releaseYear: string | null; voteAvg: number | null };

export default function Search() {
  const [q, setQ] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [ai, setAi] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!q || q.length < 2) return;
    setLoading(true);
    if (ai) {
      const url = new URL('http://localhost:5000/ai/natural-search');
      url.searchParams.set('q', q);
      const data = await fetch(url.toString()).then(r=>r.json());
      const map = (data.results || []).map((m:any)=>({
        id: m.id,
        title: m.title ?? m.name,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
        releaseYear: m.release_date ? String(m.release_date).slice(0,4) : null,
        voteAvg: m.vote_average ?? null
      }));
      setResults(map);
    } else {
      const url = new URL('http://localhost:5000/movies/search');
      url.searchParams.set('q', q);
      if (year) url.searchParams.set('year', year);
      if (genre) url.searchParams.set('genre', genre);
      const data = await fetch(url.toString()).then(r=>r.json());
      setResults(data.results || []);
    }
    setLoading(false);
  };

  useEffect(()=>{ /* no-op */ },[]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="bg-white p-4 rounded shadow flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm">Titre</label>
            <input className="w-full border p-2 rounded" value={q} onChange={e=>setQ(e.target.value)} placeholder="Inception..." />
          </div>
          <div className="flex items-center gap-2 pb-2">
            <input id="ai" type="checkbox" checked={ai} onChange={e=>setAi(e.target.checked)} />
            <label htmlFor="ai" className="text-sm">Mode IA (langage naturel)</label>
          </div>
          {!ai && (
            <>
              <div>
                <label className="block text-sm">Année</label>
                <input className="w-28 border p-2 rounded" value={year} onChange={e=>setYear(e.target.value)} placeholder="2010" />
              </div>
              <div>
                <label className="block text-sm">Genre (id)</label>
                <input className="w-32 border p-2 rounded" value={genre} onChange={e=>setGenre(e.target.value)} placeholder="28(Action)" />
              </div>
            </>
          )}
          <button onClick={run} className="bg-blue-600 text-white px-4 py-2 rounded">Rechercher</button>
        </div>

        {loading ? <p>Recherche...</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map(m => (
              <MovieCard key={m.id} {...m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
    