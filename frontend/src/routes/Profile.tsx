import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, LogOut, ArrowLeft } from "lucide-react";
import api from "../services/api";

type UserMe = {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    let active = true;
    async function fetchMe() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<UserMe>("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!active) return;
        setUser(res.data);
      } catch (e: any) {
        if (!active) return;
        setError(e.message ?? "Erreur lors du chargement du profil");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchMe();
    return () => {
      active = false;
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  if (!token) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-black/5 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
          <Link to="/" className="text-sm text-gray-600 hover:underline">Retour</Link>
        </div>
        <h1 className="text-2xl font-bold mb-2">Profil</h1>
        <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à votre profil.</p>
        <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-purple-100">
            <User className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mon profil</h1>
            <p className="text-gray-600">Informations de votre compte</p>
          </div>
          <div className="ml-auto">
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-black/5 bg-gray-50 p-4">
            <div className="text-xs uppercase text-gray-500 mb-1">Prénom</div>
            <div className="text-gray-900 font-medium">{loading ? "…" : user?.firstName ?? "—"}</div>
          </div>
          <div className="rounded-xl border border-black/5 bg-gray-50 p-4">
            <div className="text-xs uppercase text-gray-500 mb-1">Nom</div>
            <div className="text-gray-900 font-medium">{loading ? "…" : user?.lastName ?? "—"}</div>
          </div>
          <div className="rounded-xl border border-black/5 bg-gray-50 p-4 sm:col-span-2">
            <div className="text-xs uppercase text-gray-500 mb-1">Email</div>
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <Mail className="w-4 h-4 text-gray-500" />
              {loading ? "…" : user?.email ?? "—"}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
