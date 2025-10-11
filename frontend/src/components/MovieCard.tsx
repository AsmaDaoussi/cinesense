type Props = { id: number; title: string; poster: string | null; releaseYear: string | null; voteAvg: number | null };

export default function MovieCard({ title, poster, releaseYear, voteAvg }: Props) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {poster ? <img src={poster} className="w-full"/> : <div className="h-48 bg-gray-200"/>}
      <div className="p-2">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-500">{releaseYear ?? ''} • {voteAvg ?? ''}</p>
      </div>
    </div>
  );
}
