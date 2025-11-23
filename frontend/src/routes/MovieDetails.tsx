import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { trackInteraction } from "../services/track";

type MovieComment = {
  id: string;
  text: string;
  sentiment?: number | null;
  createdAt: string;
  userName?: string | null;
};

export default function MovieDetails() {
  const { id } = useParams();
  const movieId = Number(id);
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const [userRating, setUserRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  /* ===========================
     1) Film
  ============================ */
  const { data, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const res = await api.get(`/movies/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  /* ===========================
     2) Commentaires
  ============================ */
  const commentsQuery = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await api.get<MovieComment[]>(`/movies/${id}/comments`);
      return res.data;
    },
    enabled: !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      return api.post(
        `/movies/${id}/comments`,
        { text },
        { headers: { "Content-Type": "application/json" } }
      );
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  /* ===========================
     3) Favoris backend
  ============================ */
  const [isFavorite, setIsFavorite] = useState(false);

  const favoriteQuery = useQuery({
    queryKey: ["favorites", "current", movieId],
    enabled: !!movieId,
    queryFn: async () => {
      const res = await api.get("/api/favorites");
      let backendIds: number[] = [];

      if (Array.isArray(res.data)) {
        if (typeof res.data[0] === "number") {
          backendIds = res.data as number[];
        } else {
          backendIds = (res.data as any[]).map((f) => Number(f.movieId));
        }
      }

      backendIds = backendIds.filter((n) => !Number.isNaN(n));
      return backendIds.includes(movieId);
    },
  });

  useEffect(() => {
    if (typeof favoriteQuery.data === "boolean") {
      setIsFavorite(favoriteQuery.data);
    }
  }, [favoriteQuery.data]);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!movieId) return;
      if (isFavorite) {
        await api.delete(`/api/favorites/${movieId}`);
      } else {
        await api.post("/api/favorites", { movieId });
      }
    },
    onSuccess: () => {
      setIsFavorite((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites_list"] });
      queryClient.invalidateQueries({
        queryKey: ["favorites", "current", movieId],
      });
    },
  });

  function handleToggleFav() {
    if (!movieId || toggleFavoriteMutation.isPending) return;
    const newState = !isFavorite;
    toggleFavoriteMutation.mutate();
    trackInteraction({
      movieId,
      type: newState ? "like" : "unlike",
    });
  }

  /* ===========================
     4) Tracking
  ============================ */
  useEffect(() => {
    if (movieId) {
      trackInteraction({ movieId, type: "open_movie" });
    }
  }, [movieId]);

  const startTime = useRef(Date.now());
  useEffect(() => {
    return () => {
      if (!movieId) return;
      const duration = (Date.now() - startTime.current) / 1000;
      trackInteraction({
        movieId,
        type: "view",
        value: Math.floor(duration),
      });
    };
  }, [movieId]);

  const maxScroll = useRef(0);
  useEffect(() => {
    function handleScroll() {
      const maxScrollable =
        document.body.scrollHeight - window.innerHeight || 1;
      const scrolled = (window.scrollY / maxScrollable) * 100;
      maxScroll.current = Math.max(maxScroll.current, scrolled);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      if (movieId) {
        trackInteraction({
          movieId,
          type: "scroll",
          value: Math.floor(maxScroll.current),
        });
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [movieId]);

  function trackTrailerClick() {
    if (!movieId) return;
    trackInteraction({ movieId, type: "trailer" });
  }

  function handleRateMovie(stars: number) {
    if (!movieId) return;
    setUserRating(stars);
    trackInteraction({ movieId, type: "rate", value: stars });
  }

  function trackRecoClick(targetId: number) {
    if (!movieId) return;
    trackInteraction({
      movieId,
      type: "click_reco",
      extra: { targetId },
    });
  }

  /* ===========================
     AFFICHAGE (pas de hooks ici)
  ============================ */

  if (isLoading) return <p>Chargement...</p>;
  if (error || !data) return <p>Erreur de chargement</p>;

  const poster = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : null;

  const youtubeKey = data.videos?.results.find(
    (v: any) =>
      v.site === "YouTube" &&
      (v.type === "Trailer" || v.type === "Teaser")
  )?.key;

  // ⭐ rating + durée + année + pays + genres
  const voteLabel =
    typeof data.vote_average === "number"
      ? data.vote_average.toFixed(1)
      : null;

  const runtime = data.runtime ?? 0;
  const runtimeLabel = runtime
    ? `${Math.floor(runtime / 60)}h ${String(runtime % 60).padStart(2, "0")}m`
    : null;

  const year = data.release_date
    ? new Date(data.release_date).getFullYear()
    : null;

  const countryLabel =
    data.production_countries?.[0]?.iso_3166_1 ??
    (Array.isArray(data.origin_country) ? data.origin_country[0] : null) ??
    null;

  const genres: string[] = data.genres?.map((g: any) => g.name) ?? [];

  // Distribution principale (credits.cast doit être renvoyé par ton backend)
  const mainCast = (data.credits?.cast ?? []).slice(0, 10);

  // Commentaires
  const allComments: MovieComment[] = commentsQuery.data ?? [];
  const sortedComments = [...allComments].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const maxVisible = 4;
  const visibleComments = showAllComments
    ? sortedComments
    : sortedComments.slice(0, maxVisible);

  // Recos
  const recommendations = data.recommendations?.results ?? [];
  const top3Reco = recommendations.slice(0, 3);
  const otherReco = recommendations.slice(3, 10);

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        {data.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}

        <div className="relative z-10 flex flex-col gap-6 bg-gradient-to-r from-white/80 to-white/60 p-4 sm:flex-row sm:p-8">
          {poster && (
            <div className="flex-shrink-0">
              <img
                src={poster}
                className="mx-auto aspect-[2/3] w-40 rounded-2xl shadow-xl sm:w-52"
                alt={data.title}
              />
            </div>
          )}

          <div className="flex-1">
            {/* Ligne retour + chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => nav(-1)}
                className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-sm text-gray-700 hover:bg-white"
              >
                ← Retour
              </button>

              {voteLabel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/90 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
                  <span>★</span>
                  <span>{voteLabel}</span>
                </span>
              )}

              {runtimeLabel && (
                <span className="rounded-full bg-gray-900/90 px-3 py-1 text-xs font-medium text-white shadow-sm">
                  {runtimeLabel}
                </span>
              )}

              {year && (
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm">
                  {year}
                </span>
              )}

              {countryLabel && (
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                  {countryLabel}
                </span>
              )}
            </div>

            {/* Titre */}
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {data.title}
            </h1>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {data.overview && (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-700">
                {data.overview}
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleToggleFav}
                disabled={toggleFavoriteMutation.isPending}
                className={`rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition ${
                  isFavorite
                    ? "bg-pink-600 text-white hover:bg-pink-700"
                    : "bg-white border border-pink-200 text-pink-700 hover:bg-pink-50"
                } ${
                  toggleFavoriteMutation.isPending
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                {isFavorite ? "♥ Dans mes favoris" : "♡ Ajouter aux favoris"}
              </button>

              {youtubeKey && (
                <a
                  href={`https://www.youtube.com/watch?v=${youtubeKey}`}
                  onClick={trackTrailerClick}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  ▶ Bande-annonce
                </a>
              )}
            </div>

            {/* Rating ★ cliquable */}
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => handleRateMovie(s)}
                  className={`cursor-pointer text-xl ${
                    userRating && s <= userRating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DISTRIBUTION PRINCIPALE */}
      {mainCast.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Distribution principale</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {mainCast.map((person: any) => (
              <div
                key={person.cast_id ?? person.credit_id ?? person.id}
                className="w-28 flex-shrink-0"
              >
                <div className="overflow-hidden rounded-2xl bg-gray-200">
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                      alt={person.name}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center text-xs text-gray-500">
                      Pas de photo
                    </div>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs font-semibold text-gray-900">
                  {person.name}
                </p>
                {person.character && (
                  <p className="text-[11px] text-gray-500">
                    {person.character}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRAILER + 3 RECO */}
      {youtubeKey && (
        <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="overflow-hidden rounded-2xl border border-black/5 bg-black">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${youtubeKey}`}
                title={`Bande-annonce ${data.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {top3Reco.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Films recommandés
              </h2>
              {top3Reco.map((r: any) => (
                <Link
                  key={r.id}
                  to={`/title/${r.id}`}
                  onClick={() => trackRecoClick(r.id)}
                  className="flex gap-3 rounded-xl border border-black/5 bg-white p-2 shadow-sm hover:shadow-md"
                >
                  {r.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${r.poster_path}`}
                      className="h-20 w-14 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="line-clamp-2 text-sm font-medium">
                      {r.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Voir la fiche →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* COMMENTAIRES */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Commentaires</h2>

        {/* Formulaire */}
        <div className="mb-4 space-y-2 rounded-2xl border border-dashed border-gray-200 bg-white/70 p-3">
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-white/80 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Écris ton avis sur ce film..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {newComment.trim().length > 0 &&
                `${newComment.trim().length} caractères`}
            </span>
            <button
              onClick={() =>
                newComment.trim() && addCommentMutation.mutate(newComment)
              }
              disabled={
                addCommentMutation.isPending || !newComment.trim()
              }
              className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
              {addCommentMutation.isPending ? "Envoi..." : "Publier"}
            </button>
          </div>
        </div>

        {/* Liste des commentaires */}
        {commentsQuery.isLoading ? (
          <p className="text-sm text-gray-500">
            Chargement des commentaires...
          </p>
        ) : sortedComments.length > 0 ? (
          <>
            <div className="space-y-3">
              {visibleComments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                        {(c.userName ?? "Anonyme").charAt(0).toUpperCase()
                        }
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          {c.userName ?? "Utilisateur"}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {new Date(c.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    {typeof c.sentiment === "number" && (
                      <span
                        className={`text-[11px] font-medium ${
                          c.sentiment > 0.1
                            ? "text-green-600"
                            : c.sentiment < -0.1
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Sentiment : {c.sentiment.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>

            {sortedComments.length > maxVisible && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => setShowAllComments((v) => !v)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  {showAllComments
                    ? "Afficher moins"
                    : `Afficher plus de commentaires (${sortedComments.length - maxVisible})`}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Aucun commentaire pour l’instant. Sois le premier à donner ton avis
            !
          </p>
        )}
      </section>

      {/* RECO supplémentaires */}
      {otherReco.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {otherReco.map((r: any) => (
              <Link
                key={r.id}
                to={`/title/${r.id}`}
                onClick={() => trackRecoClick(r.id)}
                className="group rounded-xl border bg-white shadow-sm hover:shadow-md"
              >
                {r.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${r.poster_path}`}
                    className="h-52 w-full rounded-t-xl object-cover"
                  />
                )}
                <p className="p-2 text-sm">{r.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
  