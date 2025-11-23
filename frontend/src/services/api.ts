// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/",
  headers: { "Content-Type": "application/json" },
});

// ---> Ajoute le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---> Uniformise les erreurs + gère 401 globalement
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.error || err?.message || "Erreur réseau";
    if (status === 401) {
      // (optionnel) rediriger vers /login
      // window.location.href = "/login";
    }
    return Promise.reject(new Error(`HTTP ${status ?? ""} ${msg}`.trim()));
  }
);

export default api;
