import { useEffect, useState } from 'react';
import axios from 'axios';

type Movie = { id: number; title: string; poster: string | null; releaseYear: string | null; voteAvg: number | null };

export default function Dashboard() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/login';
    axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setName(r.data.email))
      .catch(() => window.location.href = '/login');

    fetch('http://localhost:5000/movies/trending').then(r=>r.json()).then(d=>setTrending(d.results||[]));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 border-b bg-white flex justify-between">
        <h1 className="font-bold">Bienvenue {name}</h1>
        <nav className="space-x-4">
          <a className="text-blue-600" href="/search">Recherche</a>
          <button className="text-red-600" onClick={()=>{localStorage.clear(); window.location.href='/login'}}>Logout</button>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Trending</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {trending.map(m => (
            <a key={m.id} className="bg-white rounded shadow hover:shadow-lg overflow-hidden">
              {m.poster ? <img src={m.poster} alt={m.title} className="w-full"/> : <div className="h-48 bg-gray-200"/>}
              <div className="p-2">
                <p className="font-medium text-sm">{m.title}</p>
                <p className="text-xs text-gray-500">{m.releaseYear ?? ''}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
