// src/components/SearchBar.tsx
import { useId } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  year?: string;
  onYearChange?: (v: string) => void;
  /** Optionnel: contenu à droite (ex: <GenreSelect/>) */
  right?: React.ReactNode;
};

export default function SearchBar({ value, onChange, year, onYearChange, right }: Props) {
  const inputId = useId();
  return (
    <div className="rounded-2xl border border-black/5 bg-white/80 p-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Recherche */}
        <div className="relative flex-1">
          <label htmlFor={inputId} className="sr-only">Rechercher un film</label>
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">🔎</div>
          <input
            id={inputId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tape un titre (ex: Inception)"
            className="w-full rounded-xl border border-black/10 bg-white px-10 py-3 text-[15px] outline-none ring-0 transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,.15)]"
          />
        </div>

        {/* Année */}
        <input
          value={year || ""}
          onChange={(e) => onYearChange?.(e.target.value)}
          placeholder="Année"
          className="w-full sm:w-32 rounded-xl border border-black/10 bg-white px-3 py-3 text-[15px] outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,.15)]"
        />

        {/* Slot à droite: ex. <GenreSelect /> */}
        {right ? <div className="w-full sm:w-40">{right}</div> : null}
      </div>
    </div>
  );
}
