// src/services/sentiment.service.ts
export async function computeSentiment(text: string): Promise<number> {
  const t = text.toLowerCase();

  // mini heuristique (à remplacer plus tard)
  if (t.includes("j'adore") || t.includes("génial") || t.includes("super")) {
    return 0.8;
  }
  if (t.includes("nul") || t.includes("horrible") || t.includes("déteste")) {
    return -0.7;
  }
  return 0.0; // neutre
}
