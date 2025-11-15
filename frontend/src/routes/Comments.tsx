import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function Comments() {
  const { movieId } = useParams();
  const id = Number(movieId);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  async function load() {
    const res = await api.get(`/movies/${id}/comments`);
    setComments(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit() {
    await api.post(`/movies/${id}/comments`, { text });
    setText("");
    load();
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Commentaires</h1>

      <textarea
        className="w-full rounded border p-2"
        rows={4}
        placeholder="Écrire un commentaire..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={submit}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Publier
      </button>

      <div className="mt-6 space-y-3">
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded border p-3 shadow-sm bg-white"
          >
            <p className="text-sm">{c.text}</p>
            <p className="mt-1 text-xs text-gray-500">
              Sentiment NLP :{" "}
              <span
                className={
                  c.sentiment > 0.1
                    ? "text-green-600"
                    : c.sentiment < -0.1
                    ? "text-red-600"
                    : "text-gray-600"
                }
              >
                {c.sentiment?.toFixed(3)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
