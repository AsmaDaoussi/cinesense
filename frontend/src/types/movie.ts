export type Movie = {
  id: number;
  title: string;
  poster: string | null;
  releaseYear: string | null;
  voteAvg: number | null;
};

// src/types/movie.ts
export type SearchResponse = {
  query: string;
  total: number;
  results: Movie[];
  page?: number;
  total_pages?: number;
};
