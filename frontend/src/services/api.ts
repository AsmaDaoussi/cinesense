import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  // timeout: 8000, // (optionnel) ajoute un délai max
});

// (optionnel) Intercepteur erreurs pour uniformiser les messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.error || err?.message || "Erreur réseau";
    return Promise.reject(new Error(`HTTP ${status ?? ""} ${msg}`.trim()));
  }
);

export default api;
