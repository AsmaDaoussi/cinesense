import api from "./api";

export async function trackInteraction(payload: {
  movieId?: number;
  type: string;
  value?: number;
  extra?: any;
}) {
  try {
    await api.post("/interactions", payload);
  } catch (err) {
    console.warn("⚠️ tracking failed:", err);
  }
}
