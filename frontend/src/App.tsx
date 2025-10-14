// src/App.tsx
import { Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-dvh text-gray-900">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">CinéSense</Link>
          {/* <Link to="/favorites" className="text-sm text-gray-600">Favoris</Link> */}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet /> {/* ← affiche SearchPage ou MovieDetails */}
      </main>
    </div>
  );
}
