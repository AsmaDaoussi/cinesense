// Simple AI module using OpenAI-compatible API for two features:
// - summarize(text)
// - semanticSearch(query): maps natural language to TMDB discover params

import { env } from '../config/env';

export async function summarize(text: string): Promise<string> {
  const prompt = `Résume en 3 phrases simples et accessibles:\n\n${text}`;
  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant for movie summaries in French.' },
      { role: 'user', content: prompt }
    ]
  } as any;
  const res = await fetch(env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`AI error ${res.status}`);
  const json: any = await res.json();
  return json.choices?.[0]?.message?.content?.trim() ?? '';
}

// naive mapping for genres and keywords
const GENRE_KEYWORDS: Record<string, string> = {
  action: '28', drama: '18', comedy: '35', horror: '27', animation: '16', romance: '10749', thriller: '53', scifi: '878', science: '878'
};

export function mapNaturalLanguage(query: string): { with_genres?: string; sort_by?: string; year?: string } {
  const q = query.toLowerCase();
  const genres = Object.entries(GENRE_KEYWORDS).filter(([k]) => q.includes(k)).map(([,id])=>id);
  const params: any = {};
  if (genres.length) params.with_genres = genres.join(',');
  if (q.includes('top') || q.includes('best') || q.includes('mieux')) params.sort_by = 'vote_average.desc';
  if (q.includes('nouveauté') || q.includes('recent') || q.includes('new')) params.sort_by = 'release_date.desc';
  const m = q.match(/(19|20)\d{2}/);
  if (m) params.year = m[0];
  return params;
}
