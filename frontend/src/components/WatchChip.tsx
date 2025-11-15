// src/components/WatchChip.tsx
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import api from "../services/api";
import { fetchWatchlistIds } from "../services/watchlist";

export default function WatchChip({ movieId }: { movieId: number }) {
  const queryClient = useQueryClient();

  // ⚡️ Toujours un number[]
  const { data: watchIds = [], isLoading } = useQuery<number[]>({
    queryKey: ["watchlist"],
    queryFn: fetchWatchlistIds,
    staleTime: 60_000,
  });

  const active = useMemo(
    () => watchIds.includes(movieId),
    [watchIds, movieId]
  );

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (active) {
        await api.delete(`/api/watchlist/${movieId}`);
      } else {
        await api.post("/api/watchlist", { movieId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
    onError: (err: any) => {
      Swal.fire({
        icon: "error",
        title: "Oups…",
        text:
          err?.response?.data?.error ||
          err?.message ||
          "Impossible de modifier la watchlist.",
      });
    },
  });

  const busy = toggleMutation.isPending || isLoading;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (!busy) toggleMutation.mutate();
      }}
      disabled={busy}
      className={[
        "rounded-full px-2 py-1 text-xs border transition",
        active
          ? "border-amber-300 bg-amber-50 text-amber-800"
          : "border-black/10 bg-white text-gray-700 hover:bg-gray-50",
        busy ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
      title={active ? "Retirer de 'À voir'" : "Ajouter à 'À voir'"}
      aria-pressed={active}
    >
      {active ? "👁️ À voir" : "➕ À voir"}
    </button>
  );
}
