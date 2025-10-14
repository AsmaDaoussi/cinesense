// src/components/GenreSelect.tsx
import { useEffect, useState } from "react";
import { getGenres } from "../services/movies";

type Props = { value?: string; onChange: (v: string) => void };

export default function GenreSelect({ value, onChange }: Props) {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const list = await getGenres();
        if (active) setGenres(list);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-40 rounded-xl border border-black/10 bg-white px-3 py-3 text-[15px] outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,.15)]"
    >
      <option value="">{loading ? "Chargement…" : "Genre"}</option>
      {genres.map((g) => (
        <option key={g.id} value={String(g.id)}>
          {g.name}
        </option>
      ))}
    </select>
  );
}
