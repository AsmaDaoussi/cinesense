// src/layouts/Layout.tsx
import { useEffect, useState, type ReactNode } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-md px-3 py-2 text-sm font-medium transition
         ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // ⭐ Compteur Favoris depuis le backend
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await api.get("/api/favorites");

      let ids: number[] = [];
      if (Array.isArray(res.data)) {
        if (typeof res.data[0] === "number") {
          ids = res.data as number[];
        } else {
          // ex: [{ movieId: 123 }, ...]
          ids = (res.data as any[]).map((f) => Number(f.movieId));
        }
      }
      return ids.filter((n) => !Number.isNaN(n));
    },
    staleTime: 60_000,
  });

  const favoritesCount = favoritesQuery.data?.length ?? 0;

  // 🎬 Compteur Watchlist depuis le backend
  const watchlistQuery = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await api.get("/api/watchlist");

      let ids: number[] = [];
      if (Array.isArray(res.data)) {
        if (typeof res.data[0] === "number") {
          ids = res.data as number[];
        } else {
          // ex: [{ movieId: 123 }, ...]
          ids = (res.data as any[]).map((w) => Number(w.movieId));
        }
      }
      return ids.filter((n) => !Number.isNaN(n));
    },
    staleTime: 60_000,
  });

  const watchCount = watchlistQuery.data?.length ?? 0;

  // Fermer le drawer après navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloquer le scroll en mobile quand drawer ouvert
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 h-14 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md border border-black/10 bg-white px-2 py-1 text-sm lg:hidden"
              aria-label="Ouvrir le menu"
            >
              ☰
            </button>
            <Link to="/" className="text-xl font-semibold tracking-tight">
              CinéSense
            </Link>
          </div>
          <nav className="hidden gap-2 lg:flex">
            <NavItem to="/">Recherche</NavItem>

            <NavItem to="/favorites">
              <span className="flex items-center gap-2">
                Favoris
                {favoritesCount > 0 && (
                  <span className="rounded-full bg-pink-600 px-2 py-0.5 text-[11px] text-white">
                    {favoritesCount}
                  </span>
                )}
              </span>
            </NavItem>

            <span className="rounded-md px-3 py-2 text-sm text-gray-400">
              Recommandations
            </span>
          </nav>
        </div>
      </header>

      {/* OVERLAY mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* DRAWER mobile */}
      <aside
        className={`fixed left-0 top-14 z-50 h-[calc(100vh-56px)] w-72 transform bg-white p-4 shadow-lg transition-transform lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Sidebar mobile"
      >
        <div className="mb-2 pl-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          Navigation
        </div>
        <div className="space-y-1">
          <NavItem to="/">Recherche</NavItem>

          <NavItem to="/favorites">
            <span className="flex items-center justify-between">
              Favoris
              {favoritesCount > 0 && (
                <span className="rounded-full bg-pink-600 px-2 py-0.5 text-[11px] text-white">
                  {favoritesCount}
                </span>
              )}
            </span>
          </NavItem>

          <NavItem to="/watchlist">
            <span className="flex items-center justify-between">
              À voir
              {watchCount > 0 && (
                <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[11px] text-white">
                  {watchCount}
                </span>
              )}
            </span>
          </NavItem>

          <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-400">
            Recommandations (après login)
          </div>
          <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-400">
            Profil (après login)
          </div>
        </div>
      </aside>

      {/* CONTENU GLOBAL */}
      <div className="flex">
        {/* SIDEBAR desktop */}
        <aside
          className="sticky top-16 hidden h-fit w-60 shrink-0 self-start border-r border-black/5 bg-white p-4 lg:block"
          aria-label="Sidebar desktop"
        >
          <div className="mb-2 pl-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Navigation
          </div>
          <div className="space-y-1">
            <NavItem to="/">Recherche</NavItem>

            <NavItem to="/favorites">
              <span className="flex items-center justify-between">
                Favoris
                {favoritesCount > 0 && (
                  <span className="rounded-full bg-pink-600 px-2 py-0.5 text-[11px] text-white">
                    {favoritesCount}
                  </span>
                )}
              </span>
            </NavItem>

            <NavItem to="/watchlist">
              <span className="flex items-center justify-between">
                À voir
                {watchCount > 0 && (
                  <span className="ml-2 rounded-full bg-amber-600 px-2 py-0.5 text-[11px] text-white">
                    {watchCount}
                  </span>
                )}
              </span>
            </NavItem>

            <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-400">
              Recommandations (après login)
            </div>
            <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-400">
              Profil (après login)
            </div>
          </div>
        </aside>

        {/* CONTENU */}
        <main className="flex-1 px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
